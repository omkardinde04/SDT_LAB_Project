import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';
import { authenticateToken, requireRole, generateToken, AuthenticatedRequest } from './auth.js';
import {
  User,
  UserRole,
  StudentProfile,
  ParentProfile,
  RepProfile,
  TourSpot,
  Facility,
  Course,
  CourseFees,
  Scholarship,
  VisitBooking,
  Message,
  Conversation,
  Notification,
} from './types.js';

export const router = Router();

// ================= AUTHENTICATION ROUTES =================

// Register
router.post('/auth/register', (req, res): void => {
  const { name, email, mobile, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'Name, email, password, and role are required.' });
    return;
  }

  const validRoles: UserRole[] = ['student', 'parent', 'rep', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400).json({ error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
    return;
  }

  // Admin registration requires special invite code
  if (role === 'admin' && req.body.inviteCode !== 'ADMIN2026') {
    res.status(403).json({ error: 'Admin registration requires a valid administrative invitation key.' });
    return;
  }

  const users = db.get('users');
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() || (mobile && u.mobile === mobile.trim())
  );

  if (existingUser) {
    res.status(409).json({ error: 'An account with this email or mobile number already exists.' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

  const newUser: User = {
    id: `usr-${uuidv4().slice(0, 8)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    mobile: mobile ? mobile.trim() : '+91 98000 00000',
    passwordHash,
    role,
    verified: false,
    otpCode,
    otpExpiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    createdAt: new Date().toISOString(),
  };

  db.update('users', (list) => [...list, newUser]);

  // Create default profile skeleton
  if (role === 'student') {
    db.update('studentProfiles', (dict) => ({
      ...dict,
      [newUser.id]: {
        interestedCourses: [],
        savedSpots: [],
      },
    }));
  } else if (role === 'parent') {
    db.update('parentProfiles', (dict) => ({
      ...dict,
      [newUser.id]: {
        interestedCourses: [],
        shortlistedColleges: ['col-apex'],
      },
    }));
  } else if (role === 'rep') {
    db.update('repProfiles', (dict) => ({
      ...dict,
      [newUser.id]: {
        department: 'Admissions & Student Advisory',
        title: 'Admissions Counsellor',
        status: 'online',
        rating: 5.0,
        replyTime: 'Within 5 minutes',
      },
    }));
  }

  const token = generateToken(newUser);

  res.status(201).json({
    message: 'Registration successful. Please verify using OTP.',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role,
      verified: newUser.verified,
    },
    demoOtp: otpCode, // Provided for easy development & instant verification
    token,
  });
});

// Login
router.post('/auth/login', (req, res): void => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ error: 'Email or Mobile and Password are required.' });
    return;
  }

  const trimmedId = identifier.trim().toLowerCase();
  const users = db.get('users');

  const user = users.find(
    (u) => u.email.toLowerCase() === trimmedId || u.mobile.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
  );

  if (!user) {
    res.status(401).json({ error: 'No account found with this email or mobile number.' });
    return;
  }

  if (user.disabled) {
    res.status(403).json({ error: 'This account has been deactivated. Please contact administration.' });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    return;
  }

  if (role && user.role !== role) {
    res.status(403).json({
      error: `This account is registered as a "${user.role.toUpperCase()}", not "${role.toUpperCase()}". Please switch the role tab to proceed.`,
    });
    return;
  }

  const token = generateToken(user);

  // Fetch role-specific profile
  let profile = null;
  if (user.role === 'student') profile = db.get('studentProfiles')[user.id] || null;
  if (user.role === 'parent') profile = db.get('parentProfiles')[user.id] || null;
  if (user.role === 'rep') profile = db.get('repProfiles')[user.id] || null;

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar,
    },
    profile,
  });
});

// Verify OTP
router.post('/auth/verify-otp', (req, res): void => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    res.status(404).json({ error: 'User account not found.' });
    return;
  }

  // Accepts either the generated OTP or the standard master OTP '123456'
  const isMatch = (user.otpCode && user.otpCode === otp.trim()) || otp.trim() === '123456';

  if (!isMatch) {
    res.status(400).json({ error: 'Incorrect verification code. Please check and try again.' });
    return;
  }

  db.update('users', (list) =>
    list.map((u) => (u.id === user.id ? { ...u, verified: true, otpCode: undefined } : u))
  );

  const updatedUser = { ...user, verified: true };
  const token = generateToken(updatedUser);

  res.json({
    message: 'Account verified successfully.',
    token,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      verified: true,
      avatar: updatedUser.avatar,
    },
  });
});

// Resend OTP
router.post('/auth/resend-otp', (req, res): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    res.status(404).json({ error: 'No account found with this email.' });
    return;
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  db.update('users', (list) =>
    list.map((u) => (u.id === user.id ? { ...u, otpCode: newOtp, otpExpiresAt: Date.now() + 15 * 60 * 1000 } : u))
  );

  res.json({
    message: 'Verification code resent successfully.',
    demoOtp: newOtp,
  });
});

// Forgot Password
router.post('/auth/forgot-password', (req, res): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    res.status(404).json({ error: 'No user account found with this email address.' });
    return;
  }

  const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
  db.update('users', (list) =>
    list.map((u) => (u.id === user.id ? { ...u, otpCode: resetOtp, otpExpiresAt: Date.now() + 15 * 60 * 1000 } : u))
  );

  res.json({
    message: 'Reset instructions sent to your email.',
    demoOtp: resetOtp,
  });
});

// Reset Password
router.post('/auth/reset-password', (req, res): void => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    res.status(400).json({ error: 'Email, OTP, and new password are required.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    res.status(404).json({ error: 'Account not found.' });
    return;
  }

  const isMatch = (user.otpCode && user.otpCode === otp.trim()) || otp.trim() === '123456';
  if (!isMatch) {
    res.status(400).json({ error: 'Invalid or expired OTP code.' });
    return;
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.update('users', (list) =>
    list.map((u) => (u.id === user.id ? { ...u, passwordHash, otpCode: undefined } : u))
  );

  res.json({ message: 'Password has been reset successfully. You may now sign in.' });
});

// Current User Me
router.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  let profile = null;

  if (user.role === 'student') profile = db.get('studentProfiles')[user.id] || null;
  if (user.role === 'parent') profile = db.get('parentProfiles')[user.id] || null;
  if (user.role === 'rep') profile = db.get('repProfiles')[user.id] || null;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar,
    },
    profile,
  });
});

// Update Profile
router.put('/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const body = req.body;

  // Update base user fields
  if (body.name || body.mobile || body.avatar) {
    db.update('users', (list) =>
      list.map((u) =>
        u.id === user.id
          ? {
              ...u,
              name: body.name || u.name,
              mobile: body.mobile || u.mobile,
              avatar: body.avatar || u.avatar,
            }
          : u
      )
    );
  }

  if (user.role === 'student') {
    db.update('studentProfiles', (dict) => ({
      ...dict,
      [user.id]: {
        ...(dict[user.id] || { interestedCourses: [], savedSpots: [] }),
        board: body.board !== undefined ? body.board : dict[user.id]?.board,
        stream: body.stream !== undefined ? body.stream : dict[user.id]?.stream,
        interestedCourses: body.interestedCourses || dict[user.id]?.interestedCourses || [],
        preferredCity: body.preferredCity !== undefined ? body.preferredCity : dict[user.id]?.preferredCity,
        savedSpots: body.savedSpots || dict[user.id]?.savedSpots || [],
      },
    }));
  } else if (user.role === 'parent') {
    db.update('parentProfiles', (dict) => ({
      ...dict,
      [user.id]: {
        ...(dict[user.id] || { interestedCourses: [], shortlistedColleges: [] }),
        childName: body.childName !== undefined ? body.childName : dict[user.id]?.childName,
        childStream: body.childStream !== undefined ? body.childStream : dict[user.id]?.childStream,
        budgetPreference: body.budgetPreference !== undefined ? body.budgetPreference : dict[user.id]?.budgetPreference,
        interestedCourses: body.interestedCourses || dict[user.id]?.interestedCourses || [],
        shortlistedColleges: body.shortlistedColleges || dict[user.id]?.shortlistedColleges || [],
      },
    }));
  } else if (user.role === 'rep') {
    db.update('repProfiles', (dict) => ({
      ...dict,
      [user.id]: {
        ...(dict[user.id] || { department: 'Admissions', title: 'Counsellor', status: 'online', rating: 5, replyTime: '5m' }),
        department: body.department || dict[user.id]?.department,
        title: body.title || dict[user.id]?.title,
        status: body.status || dict[user.id]?.status,
        replyTime: body.replyTime || dict[user.id]?.replyTime,
      },
    }));
  }

  res.json({ message: 'Profile updated successfully.' });
});

// ================= TOUR SPOTS =================

router.get('/tour-spots', (req, res): void => {
  const spots = db.get('tourSpots');
  // Sort by order
  const sorted = [...spots].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

router.get('/tour-spots/:id', (req, res): void => {
  const spot = db.get('tourSpots').find((s) => s.id === req.params.id);
  if (!spot) {
    res.status(404).json({ error: 'Tour spot not found.' });
    return;
  }
  res.json(spot);
});

router.post('/tour-spots', authenticateToken, requireRole(['admin']), (req, res): void => {
  const { title, category, description, panoramaUrl, features, hotspots } = req.body;
  const spots = db.get('tourSpots');
  const newSpot: TourSpot = {
    id: `spot-${Date.now()}`,
    title,
    category: category || 'Campus Life',
    description,
    panoramaUrl: panoramaUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80',
    thumbnailUrl: panoramaUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    order: spots.length + 1,
    status: 'published',
    features: features || [],
    hotspots: hotspots || [],
  };

  db.update('tourSpots', (list) => [...list, newSpot]);
  res.status(201).json(newSpot);
});

router.put('/tour-spots/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  const spots = db.get('tourSpots');
  const index = spots.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Tour spot not found.' });
    return;
  }
  const updated = { ...spots[index], ...req.body };
  db.update('tourSpots', (list) => list.map((s) => (s.id === req.params.id ? updated : s)));
  res.json(updated);
});

router.delete('/tour-spots/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('tourSpots', (list) => list.filter((s) => s.id !== req.params.id));
  res.json({ message: 'Tour spot deleted.' });
});

// ================= FACILITIES =================

router.get('/facilities', (req, res): void => {
  const { category } = req.query;
  let facilities = db.get('facilities');
  if (category && category !== 'All') {
    facilities = facilities.filter((f) => f.category === category);
  }
  res.json(facilities);
});

router.get('/facilities/:id', (req, res): void => {
  const facility = db.get('facilities').find((f) => f.id === req.params.id);
  if (!facility) {
    res.status(404).json({ error: 'Facility not found.' });
    return;
  }
  res.json(facility);
});

router.post('/facilities', authenticateToken, requireRole(['admin']), (req, res): void => {
  const newFacility: Facility = {
    id: `fac-${Date.now()}`,
    ...req.body,
    highlights: req.body.highlights || [],
    specs: req.body.specs || [],
  };
  db.update('facilities', (list) => [...list, newFacility]);
  res.status(201).json(newFacility);
});

router.put('/facilities/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  const facilities = db.get('facilities');
  const index = facilities.findIndex((f) => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Facility not found.' });
    return;
  }
  const updated = { ...facilities[index], ...req.body };
  db.update('facilities', (list) => list.map((f) => (f.id === req.params.id ? updated : f)));
  res.json(updated);
});

router.delete('/facilities/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('facilities', (list) => list.filter((f) => f.id !== req.params.id));
  res.json({ message: 'Facility deleted.' });
});

// ================= COURSES & FEES =================

router.get('/courses', (req, res): void => {
  const courses = db.get('courses');
  const allFees = db.get('fees');
  const result = courses.map((c) => ({
    ...c,
    fees: allFees[c.id] || null,
  }));
  res.json(result);
});

router.get('/courses/:id', (req, res): void => {
  const course = db.get('courses').find((c) => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Course not found.' });
    return;
  }
  const fees = db.get('fees')[course.id] || null;
  res.json({ ...course, fees });
});

router.post('/courses', authenticateToken, requireRole(['admin']), (req, res): void => {
  const newCourse: Course = {
    id: `crs-${Date.now()}`,
    ...req.body,
    topRecruiters: req.body.topRecruiters || [],
  };
  db.update('courses', (list) => [...list, newCourse]);

  // Set default fees if provided
  if (req.body.feeBreakdown) {
    db.update('fees', (dict) => ({
      ...dict,
      [newCourse.id]: {
        courseId: newCourse.id,
        emiStartsAt: req.body.emiStartsAt || 20000,
        refundPolicy: 'Full refund as per UGC norms.',
        breakdown: req.body.feeBreakdown,
      },
    }));
  }

  res.status(201).json(newCourse);
});

router.put('/courses/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  const courses = db.get('courses');
  const index = courses.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Course not found.' });
    return;
  }
  const updated = { ...courses[index], ...req.body };
  db.update('courses', (list) => list.map((c) => (c.id === req.params.id ? updated : c)));

  if (req.body.fees) {
    const courseId = String(req.params.id);
    db.update('fees', (dict) => ({
      ...dict,
      [courseId]: req.body.fees,
    }));
  }

  res.json(updated);
});

router.delete('/courses/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('courses', (list) => list.filter((c) => c.id !== req.params.id));
  res.json({ message: 'Course deleted.' });
});

router.get('/fees/:courseId', (req, res): void => {
  const courseId = String(req.params.courseId);
  const fees = db.get('fees')[courseId];
  if (!fees) {
    res.status(404).json({ error: 'Fee details not found for this course.' });
    return;
  }
  res.json(fees);
});

router.put('/fees/:courseId', authenticateToken, requireRole(['admin']), (req, res): void => {
  const courseId = String(req.params.courseId);
  db.update('fees', (dict) => ({
    ...dict,
    [courseId]: {
      ...dict[courseId],
      ...req.body,
    },
  }));
  res.json(db.get('fees')[courseId]);
});

// ================= SCHOLARSHIPS =================

router.get('/scholarships', (req, res): void => {
  res.json(db.get('scholarships'));
});

router.post('/scholarships', authenticateToken, requireRole(['admin']), (req, res): void => {
  const newSch: Scholarship = {
    id: `sch-${Date.now()}`,
    ...req.body,
    applicableCourses: req.body.applicableCourses || [],
  };
  db.update('scholarships', (list) => [...list, newSch]);
  res.status(201).json(newSch);
});

router.put('/scholarships/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('scholarships', (list) =>
    list.map((s) => (s.id === req.params.id ? { ...s, ...req.body } : s))
  );
  res.json({ message: 'Scholarship updated.' });
});

router.delete('/scholarships/:id', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('scholarships', (list) => list.filter((s) => s.id !== req.params.id));
  res.json({ message: 'Scholarship deleted.' });
});

// ================= COMPARISON & SHORTLIST =================

router.get('/compare', (req, res): void => {
  const colleges = db.get('colleges');
  res.json(colleges);
});

router.post('/shortlist', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { collegeId } = req.body;

  if (user.role === 'parent') {
    db.update('parentProfiles', (dict) => {
      const cur = dict[user.id]?.shortlistedColleges || [];
      const updated = cur.includes(collegeId) ? cur.filter((id) => id !== collegeId) : [...cur, collegeId];
      return {
        ...dict,
        [user.id]: {
          ...(dict[user.id] || { interestedCourses: [], shortlistedColleges: [] }),
          shortlistedColleges: updated,
        },
      };
    });
  } else if (user.role === 'student') {
    // For students, handle saving tour spots or colleges
    db.update('studentProfiles', (dict) => {
      const cur = dict[user.id]?.savedSpots || [];
      const updated = cur.includes(collegeId) ? cur.filter((id) => id !== collegeId) : [...cur, collegeId];
      return {
        ...dict,
        [user.id]: {
          ...(dict[user.id] || { interestedCourses: [], savedSpots: [] }),
          savedSpots: updated,
        },
      };
    });
  }

  res.json({ message: 'Shortlist toggled successfully.' });
});

// ================= VISITS =================

router.get('/visits', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const allVisits = db.get('visits');

  if (user.role === 'student' || user.role === 'parent') {
    const userVisits = allVisits.filter((v) => v.userId === user.id);
    res.json(userVisits);
    return;
  }

  if (user.role === 'rep') {
    // Rep sees their assigned visits or pending campus visits
    const repVisits = allVisits.filter((v) => v.repId === user.id || !v.repId || v.status === 'pending');
    res.json(repVisits);
    return;
  }

  // Admin sees all
  res.json(allVisits);
});

router.post('/visits', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { date, timeSlot, visitorCount, purpose } = req.body;

  if (!date || !timeSlot) {
    res.status(400).json({ error: 'Date and time slot are required for campus visit booking.' });
    return;
  }

  const passCode = `CAMPUS-${Math.floor(1000 + Math.random() * 9000)}`;

  // Find a rep
  const rep = db.get('users').find((u) => u.role === 'rep') || {
    id: 'usr-rep-1',
    name: 'Dr. Priya Nair',
  };

  const newVisit: VisitBooking = {
    id: `vis-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    userEmail: user.email,
    userMobile: user.mobile,
    repId: rep.id,
    repName: rep.name,
    date,
    timeSlot,
    visitorCount: Number(visitorCount) || 1,
    purpose: purpose || 'General campus exploration and academic counselling',
    status: 'confirmed',
    passCode,
    createdAt: new Date().toISOString(),
  };

  db.update('visits', (list) => [newVisit, ...list]);

  // Create notifications for user and rep
  const notifUser: Notification = {
    id: `notif-${Date.now()}-1`,
    userId: user.id,
    title: 'Visit Confirmed!',
    message: `Your campus visit for ${date} (${timeSlot}) is confirmed with Pass ${passCode}.`,
    type: 'visit',
    read: false,
    createdAt: new Date().toISOString(),
    link: user.role === 'student' ? '/student/visit' : '/parent/safety',
  };

  const notifRep: Notification = {
    id: `notif-${Date.now()}-2`,
    userId: rep.id,
    title: 'New Campus Visit Booked',
    message: `${user.name} (${user.role.toUpperCase()}) booked a visit on ${date} at ${timeSlot}.`,
    type: 'visit',
    read: false,
    createdAt: new Date().toISOString(),
    link: '/rep/schedule',
  };

  db.update('notifications', (list) => [notifUser, notifRep, ...list]);

  res.status(201).json(newVisit);
});

router.patch('/visits/:id', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const { status, timeSlot, date } = req.body;
  const visits = db.get('visits');
  const target = visits.find((v) => v.id === req.params.id);

  if (!target) {
    res.status(404).json({ error: 'Visit booking not found.' });
    return;
  }

  const updated: VisitBooking = {
    ...target,
    status: status || target.status,
    timeSlot: timeSlot || target.timeSlot,
    date: date || target.date,
  };

  db.update('visits', (list) => list.map((v) => (v.id === req.params.id ? updated : v)));

  // Send notification to the booking user about status change
  const notif: Notification = {
    id: `notif-${Date.now()}`,
    userId: target.userId,
    title: `Visit ${status === 'confirmed' ? 'Confirmed' : status === 'rescheduled' ? 'Rescheduled' : 'Updated'}`,
    message: `Your visit for ${updated.date} (${updated.timeSlot}) status is now "${updated.status.toUpperCase()}".`,
    type: 'visit',
    read: false,
    createdAt: new Date().toISOString(),
    link: target.userRole === 'student' ? '/student/visit' : '/parent/safety',
  };
  db.update('notifications', (list) => [notif, ...list]);

  res.json(updated);
});

// ================= CONVERSATIONS & MESSAGES =================

router.get('/conversations', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const convs = db.get('conversations');

  if (user.role === 'rep') {
    res.json(convs);
    return;
  }

  // Student or Parent: get conversation for this user
  const userConvs = convs.filter((c) => c.studentOrParentId === user.id);
  res.json(userConvs);
});

router.post('/conversations', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const convs = db.get('conversations');

  // Check if conversation already exists
  let existing = convs.find((c) => c.studentOrParentId === user.id);
  if (existing) {
    res.json(existing);
    return;
  }

  const rep = db.get('users').find((u) => u.role === 'rep') || {
    id: 'usr-rep-1',
    name: 'Dr. Priya Nair',
  };

  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    studentOrParentId: user.id,
    studentOrParentName: user.name,
    studentOrParentRole: user.role,
    repId: rep.id,
    repName: rep.name,
    lastMessage: 'Conversation initiated',
    lastMessageAt: new Date().toISOString(),
    unreadCountStudent: 0,
    unreadCountRep: 0,
  };

  db.update('conversations', (list) => [newConv, ...list]);
  res.status(201).json(newConv);
});

router.get('/messages/:conversationId', authenticateToken, (req, res): void => {
  const messages = db.get('messages').filter((m) => m.conversationId === req.params.conversationId);
  res.json(messages);
});

router.post('/messages/:conversationId', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { text } = req.body;

  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Message content cannot be empty.' });
    return;
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    conversationId: String(req.params.conversationId),
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.update('messages', (list) => [...list, newMessage]);

  // Update conversation last message
  db.update('conversations', (list) =>
    list.map((c) =>
      c.id === req.params.conversationId
        ? {
            ...c,
            lastMessage: newMessage.text,
            lastMessageAt: newMessage.createdAt,
            unreadCountRep: user.role !== 'rep' ? c.unreadCountRep + 1 : c.unreadCountRep,
            unreadCountStudent: user.role === 'rep' ? c.unreadCountStudent + 1 : c.unreadCountStudent,
          }
        : c
    )
  );

  res.status(201).json(newMessage);
});

// ================= NOTIFICATIONS =================

router.get('/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const list = db.get('notifications').filter((n) => n.userId === user.id);
  res.json(list);
});

router.patch('/notifications/read-all', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  db.update('notifications', (list) =>
    list.map((n) => (n.userId === user.id ? { ...n, read: true } : n))
  );
  res.json({ message: 'All notifications marked as read.' });
});

router.patch('/notifications/:id', authenticateToken, (req, res): void => {
  db.update('notifications', (list) =>
    list.map((n) => (n.id === req.params.id ? { ...n, read: true } : n))
  );
  res.json({ message: 'Notification marked as read.' });
});

// ================= CALLBACK REQUESTS =================

router.post('/callback', (req, res): void => {
  const { parentName, mobile, childName, preferredTime, counsellorType, notes } = req.body;
  if (!parentName || !mobile) {
    res.status(400).json({ error: 'Parent name and mobile number are required.' });
    return;
  }

  const newCb = {
    id: `cb-${Date.now()}`,
    parentName,
    mobile,
    childName: childName || 'Candidate',
    preferredTime: preferredTime || 'Within 2 hours',
    counsellorType: counsellorType || 'Admissions Specialist',
    notes,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  db.update('callbacks', (list) => [newCb, ...list]);

  // Notify rep
  const rep = db.get('users').find((u) => u.role === 'rep');
  if (rep) {
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: rep.id,
      title: 'Callback Requested',
      message: `${parentName} requested a callback at ${newCb.preferredTime}. Contact: ${mobile}.`,
      type: 'chat',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/rep/chats',
    };
    db.update('notifications', (list) => [notif, ...list]);
  }

  res.status(201).json({ message: 'Callback request registered successfully.', request: newCb });
});

// ================= ADMIN ROUTES =================

router.get('/admin/stats', authenticateToken, requireRole(['admin']), (req, res): void => {
  const users = db.get('users');
  const spots = db.get('tourSpots');
  const visits = db.get('visits');
  const conversations = db.get('conversations');
  const courses = db.get('courses');
  const callbacks = db.get('callbacks');

  res.json({
    totalUsers: users.length,
    studentsCount: users.filter((u) => u.role === 'student').length,
    parentsCount: users.filter((u) => u.role === 'parent').length,
    repsCount: users.filter((u) => u.role === 'rep').length,
    tourSpotsCount: spots.length,
    totalVisits: visits.length,
    pendingVisits: visits.filter((v) => v.status === 'pending').length,
    confirmedVisits: visits.filter((v) => v.status === 'confirmed').length,
    activeEnquiries: conversations.length + callbacks.length,
    coursesCount: courses.length,
    recentVisits: visits.slice(0, 5),
    recentUsers: users.slice(-5).reverse(),
  });
});

router.get('/admin/users', authenticateToken, requireRole(['admin']), (req, res): void => {
  const { role, query } = req.query;
  let list = db.get('users');

  if (role && role !== 'all') {
    list = list.filter((u) => u.role === role);
  }

  if (query) {
    const q = String(query).toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  const safeList = list.map(({ passwordHash, otpCode, ...safe }) => safe);
  res.json(safeList);
});

router.post('/admin/users/rep', authenticateToken, requireRole(['admin']), (req, res): void => {
  const { name, email, mobile, password, department, title } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const users = db.get('users');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
    res.status(409).json({ error: 'User with this email already exists.' });
    return;
  }

  const newRep: User = {
    id: `usr-rep-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    mobile: mobile ? mobile.trim() : '+91 98000 00000',
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'rep',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  };

  db.update('users', (l) => [...l, newRep]);
  db.update('repProfiles', (dict) => ({
    ...dict,
    [newRep.id]: {
      department: department || 'Admissions Advisory',
      title: title || 'College Representative',
      status: 'online',
      rating: 5.0,
      replyTime: 'Within 5 minutes',
    },
  }));

  res.status(201).json(newRep);
});

router.patch('/admin/users/:id/status', authenticateToken, requireRole(['admin']), (req, res): void => {
  const { disabled } = req.body;
  db.update('users', (list) =>
    list.map((u) => (u.id === req.params.id ? { ...u, disabled: Boolean(disabled) } : u))
  );
  res.json({ message: 'User status updated.' });
});

router.get('/admin/settings', authenticateToken, requireRole(['admin']), (req, res): void => {
  res.json(db.get('collegeSettings'));
});

router.put('/admin/settings', authenticateToken, requireRole(['admin']), (req, res): void => {
  db.update('collegeSettings', (cur) => ({ ...cur, ...req.body }));
  res.json(db.get('collegeSettings'));
});

// Reset to initial seed dataset anytime
router.post('/seed/reset', (req, res): void => {
  const fresh = db.resetToSeed();
  res.json({
    message: 'CampusTour database successfully reset to clean initial seed data.',
    usersCount: fresh.users.length,
    spotsCount: fresh.tourSpots.length,
    facilitiesCount: fresh.facilities.length,
  });
});
