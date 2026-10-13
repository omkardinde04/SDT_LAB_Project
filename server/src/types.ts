export type UserRole = 'student' | 'parent' | 'rep' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  role: UserRole;
  verified: boolean;
  otpCode?: string;
  otpExpiresAt?: number;
  avatar?: string;
  createdAt: string;
  disabled?: boolean;
}

export interface StudentProfile {
  board?: string;
  stream?: string;
  interestedCourses: string[];
  preferredCity?: string;
  savedSpots: string[];
}

export interface ParentProfile {
  childName?: string;
  childStream?: string;
  interestedCourses: string[];
  budgetPreference?: string;
  shortlistedColleges: string[];
}

export interface RepProfile {
  department: string;
  title: string;
  status: 'online' | 'busy' | 'offline';
  rating: number;
  replyTime: string;
}

export interface College {
  id: string;
  name: string;
  tagline: string;
  location: string;
  nirfRank: number;
  naacGrade: string;
  placementRate: number;
  avgPackageLpa: number;
  highestPackageLpa: number;
  studentFacultyRatio: string;
  distanceKm: number;
  totalFeesLakhs: number;
  hostelAvailable: boolean;
  campusSizeAcres: number;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  description: string;
  phone: string;
  email: string;
}

export interface TourSpot {
  id: string;
  title: string;
  category: 'Entrance' | 'Academics' | 'Labs' | 'Campus Life' | 'Hostel' | 'Cafeteria' | 'Sports' | 'Innovation';
  description: string;
  panoramaUrl: string;
  thumbnailUrl: string;
  order: number;
  status: 'published' | 'draft';
  features: string[];
  hotspots: {
    title: string;
    targetSpotId?: string;
    yaw: number;
    pitch: number;
    description: string;
  }[];
}

export interface Facility {
  id: string;
  name: string;
  category: 'Labs' | 'Sports' | 'Hostel' | 'Campus Life' | 'Academics';
  timings: string;
  location: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  specs: { label: string; value: string }[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  durationYears: number;
  totalSeats: number;
  eligibility: string;
  highestPackage: string;
  avgPackage: string;
  topRecruiters: string[];
  description: string;
}

export interface FeeItem {
  year: number;
  tuition: number;
  hostel: number;
  mess: number;
  examLab: number;
  total: number;
}

export interface CourseFees {
  courseId: string;
  breakdown: FeeItem[];
  emiStartsAt: number;
  refundPolicy: string;
}

export interface Scholarship {
  id: string;
  title: string;
  coverage: string;
  eligibility: string;
  deadline: string;
  applicableCourses: string[];
  badge: string;
}

export interface VisitBooking {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  userMobile: string;
  repId?: string;
  repName?: string;
  date: string;
  timeSlot: string;
  visitorCount: number;
  purpose: string;
  status: 'confirmed' | 'pending' | 'rescheduled' | 'completed' | 'cancelled';
  passCode: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  studentOrParentId: string;
  studentOrParentName: string;
  studentOrParentRole: UserRole;
  repId: string;
  repName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCountStudent: number;
  unreadCountRep: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'visit' | 'fee' | 'chat' | 'scholarship' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CallbackRequest {
  id: string;
  parentName: string;
  mobile: string;
  childName: string;
  preferredTime: string;
  counsellorType: string;
  notes?: string;
  status: 'pending' | 'called';
  createdAt: string;
}
