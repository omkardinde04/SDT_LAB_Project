import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  StudentProfile,
  ParentProfile,
  RepProfile,
  College,
  TourSpot,
  Facility,
  Course,
  CourseFees,
  Scholarship,
  VisitBooking,
  Message,
  Conversation,
  Notification,
  CallbackRequest,
} from './types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'campustour.json');

export interface DatabaseState {
  users: User[];
  studentProfiles: Record<string, StudentProfile>;
  parentProfiles: Record<string, ParentProfile>;
  repProfiles: Record<string, RepProfile>;
  colleges: College[];
  tourSpots: TourSpot[];
  facilities: Facility[];
  courses: Course[];
  fees: Record<string, CourseFees>;
  scholarships: Scholarship[];
  visits: VisitBooking[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  callbacks: CallbackRequest[];
  collegeSettings: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    accreditation: string;
  };
}

const defaultPasswordHash = bcrypt.hashSync('password123', 10);

export function getInitialSeedData(): DatabaseState {
  const users: User[] = [
    {
      id: 'usr-student-1',
      name: 'Aarav Sharma',
      email: 'student@campustour.edu',
      mobile: '+91 98765 43210',
      passwordHash: defaultPasswordHash,
      role: 'student',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'usr-parent-1',
      name: 'Sunita Sharma',
      email: 'parent@campustour.edu',
      mobile: '+91 98765 43211',
      passwordHash: defaultPasswordHash,
      role: 'parent',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'usr-rep-1',
      name: 'Dr. Priya Nair',
      email: 'rep@campustour.edu',
      mobile: '+91 98765 43212',
      passwordHash: defaultPasswordHash,
      role: 'rep',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'usr-admin-1',
      name: 'Vikramaditya Rao',
      email: 'admin@campustour.edu',
      mobile: '+91 98765 43213',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'usr-student-2',
      name: 'Meera Krishnan',
      email: 'meera@campustour.edu',
      mobile: '+91 98765 43214',
      passwordHash: defaultPasswordHash,
      role: 'student',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];

  const studentProfiles: Record<string, StudentProfile> = {
    'usr-student-1': {
      board: 'CBSE - 12th Standard',
      stream: 'Physics, Chemistry, Math & CS',
      interestedCourses: ['crs-1', 'crs-2'],
      preferredCity: 'Bengaluru',
      savedSpots: ['spot-1', 'spot-2', 'spot-3', 'spot-7'],
    },
    'usr-student-2': {
      board: 'ISC Board',
      stream: 'Design & Visual Arts',
      interestedCourses: ['crs-3'],
      preferredCity: 'Bengaluru',
      savedSpots: ['spot-4', 'spot-8'],
    },
  };

  const parentProfiles: Record<string, ParentProfile> = {
    'usr-parent-1': {
      childName: 'Aarav Sharma',
      childStream: '12th PCM (Targeting 2026 Batch)',
      interestedCourses: ['crs-1', 'crs-2'],
      budgetPreference: '₹14L - ₹20L All Inclusive',
      shortlistedColleges: ['col-apex', 'col-nexus'],
    },
  };

  const repProfiles: Record<string, RepProfile> = {
    'usr-rep-1': {
      department: 'Admissions & Academic Advisory',
      title: 'Senior Admissions Counsellor & Assistant Dean',
      status: 'online',
      rating: 4.9,
      replyTime: 'Usually under 3 minutes',
    },
  };

  const colleges: College[] = [
    {
      id: 'col-apex',
      name: 'Apex Institute of Technology & Sciences (AITS)',
      tagline: 'Empowering Next-Gen Innovators, Engineers & Designers',
      location: 'Bengaluru Tech Corridor, Electronic City, Karnataka',
      nirfRank: 18,
      naacGrade: 'A++ (CGPA 3.78)',
      placementRate: 94.2,
      avgPackageLpa: 14.8,
      highestPackageLpa: 54.0,
      studentFacultyRatio: '14:1',
      distanceKm: 12.5,
      totalFeesLakhs: 15.6,
      hostelAvailable: true,
      campusSizeAcres: 48,
      rating: 4.8,
      reviewsCount: 1420,
      coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
      description: 'Ranked in top 20 nationally, AITS features world-class AI research centers, high placement records with FAANG and Fortune 500 firms, and an active campus community.',
      phone: '+91 80 2845 7000',
      email: 'admissions@apextech.edu',
    },
    {
      id: 'col-nexus',
      name: 'Nexus Global University',
      tagline: 'Global curriculum with cross-disciplinary electives',
      location: 'Whitefield Science Park, Bengaluru',
      nirfRank: 32,
      naacGrade: 'A+ (CGPA 3.42)',
      placementRate: 88.0,
      avgPackageLpa: 10.5,
      highestPackageLpa: 42.0,
      studentFacultyRatio: '18:1',
      distanceKm: 34.0,
      totalFeesLakhs: 18.5,
      hostelAvailable: true,
      campusSizeAcres: 35,
      rating: 4.3,
      reviewsCount: 890,
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
      description: 'A private university known for liberal design arts, emerging technology, and international exchange opportunities.',
      phone: '+91 80 4123 9900',
      email: 'info@nexusuniv.edu',
    },
    {
      id: 'col-zenith',
      name: 'Zenith State Technical Campus',
      tagline: 'Affordable engineering and core disciplines',
      location: 'Tumkur Road, Outskirts, Bengaluru',
      nirfRank: 45,
      naacGrade: 'A (CGPA 3.15)',
      placementRate: 82.5,
      avgPackageLpa: 8.2,
      highestPackageLpa: 28.0,
      studentFacultyRatio: '22:1',
      distanceKm: 28.0,
      totalFeesLakhs: 11.8,
      hostelAvailable: true,
      campusSizeAcres: 60,
      rating: 4.1,
      reviewsCount: 650,
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
      description: 'Strong focus on mechanical, civil, and electrical domains with subsidized fee structure and large recreational grounds.',
      phone: '+91 80 2211 4455',
      email: 'enquiry@zenithtech.ac.in',
    },
  ];

  const tourSpots: TourSpot[] = [
    {
      id: 'spot-1',
      title: 'Grand Entrance & Welcome Plaza',
      category: 'Entrance',
      description: 'The monumental gateway welcoming students into our 48-acre smart campus. Equipped with 24x7 security surveillance, RFID visitor check-in, and lush landscape walkways.',
      panoramaUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      order: 1,
      status: 'published',
      features: ['24/7 Security Boom Barrier', 'Visitor Welcome Desk', 'Campus Shuttle Departure Bay', 'EV Charging Kiosks'],
      hotspots: [
        { title: 'Proceed to Central Library', targetSpotId: 'spot-2', yaw: 25, pitch: -5, description: 'Direct walking avenue leading to the academic library' },
        { title: 'Administration & Admissions Wing', yaw: 110, pitch: 0, description: 'Office of the Dean, Admissions, and Financial Aid' },
      ],
    },
    {
      id: 'spot-2',
      title: 'Central Digital Library & Research Wing',
      category: 'Academics',
      description: 'A five-story, fully air-conditioned academic haven holding over 120,000 physical volumes, 24/7 high-speed IEEE and ScienceDirect digital terminals, and soundproof group research pods.',
      panoramaUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      order: 2,
      status: 'published',
      features: ['120,000+ Physical Books & Journals', 'IEEE, ACM & Scopus Digital Access', 'Quiet Study Pods with Power Outlets', '24/7 Reading Hall during Exam Weeks'],
      hotspots: [
        { title: 'Visit Robotics & AI Labs', targetSpotId: 'spot-3', yaw: -45, pitch: -2, description: 'Connected walkway to Engineering Quad' },
        { title: 'Digital Media Archive', yaw: 180, pitch: 10, description: 'Archived thesis and patent filings repository' },
      ],
    },
    {
      id: 'spot-3',
      title: 'Advanced Robotics & AI Innovation Lab',
      category: 'Labs',
      description: 'Co-sponsored by NVIDIA and ABB, this cutting-edge research center hosts 6-axis robotic arms, DGX GPU compute clusters, computer vision testbenches, and drone testing cages.',
      panoramaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      order: 3,
      status: 'published',
      features: ['NVIDIA DGX Station A100 Workstations', 'ABB 6-Axis Industrial Manipulators', 'Indoor Drone Flight Test Cage', 'High-accuracy 3D Prototyping Bay'],
      hotspots: [
        { title: 'Step out to Green Courtyard', targetSpotId: 'spot-4', yaw: 70, pitch: -8, description: 'Direct lawn access to central amphitheatre' },
        { title: 'Autonomous Car Sensor Rig', yaw: -130, pitch: -10, description: 'LiDAR and SLAM real-time mapping demonstration' },
      ],
    },
    {
      id: 'spot-4',
      title: 'Green Courtyard & Student Quad',
      category: 'Campus Life',
      description: 'The vibrant heart of campus life. Features a sunken amphitheatre for open-mic evenings, shaded Wi-Fi study benches, solar canopy seating, and landscaped pergolas.',
      panoramaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
      order: 4,
      status: 'published',
      features: ['Acoustic Amphitheatre (Seats 800)', 'Solar-powered USB charging benches', 'High-speed 1Gbps Campus Wi-Fi 6', 'Festival & Exhibition Lawn'],
      hotspots: [
        { title: 'Walk to Nelson Mandela Hostel', targetSpotId: 'spot-5', yaw: -60, pitch: 0, description: 'Residential avenue with tree-lined pathway' },
        { title: 'Global Dining Complex', targetSpotId: 'spot-6', yaw: 120, pitch: -4, description: 'Main dining hall just 1 minute away' },
      ],
    },
    {
      id: 'spot-5',
      title: 'Nelson Mandela Resident Halls (Hostel)',
      category: 'Hostel',
      description: 'State-of-the-art residential building with biometric entry, twin-sharing air-conditioned suites, ergonomic study desks, high-speed Wi-Fi, resident wardens, and 24x7 security.',
      panoramaUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      order: 5,
      status: 'published',
      features: ['Biometric Smart Card Access', 'Attached Bathrooms with Solar Geysers', 'Common Floor TV Lounge & Table Tennis', 'Laundry Bay with Automated Dryers'],
      hotspots: [
        { title: 'Cafeteria & Dining', targetSpotId: 'spot-6', yaw: 45, pitch: -5, description: 'Mess building adjacent to residential wings' },
        { title: 'Resident Medical Center', yaw: -140, pitch: 0, description: '24/7 Clinic and on-duty ambulance bay' },
      ],
    },
    {
      id: 'spot-6',
      title: 'Global Cuisine Dining Complex & Cafeteria',
      category: 'Cafeteria',
      description: 'Spacious 1,500-seat multi-cuisine dining hall certified ISO 22000 for hygiene. Offers North Indian, South Indian, Continental, healthy salad bar, live juice counters, and barista coffee.',
      panoramaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      order: 6,
      status: 'published',
      features: ['Four Nutritionist-approved Meal Slots', 'Pure Veg and Non-Veg Separate Kitchens', 'Special Diet & Exam Midnight Snacks', 'Outdoor Garden Patio Seating'],
      hotspots: [
        { title: 'Indoor Sports Arena', targetSpotId: 'spot-7', yaw: 90, pitch: 0, description: 'Sports complex and athletic grounds' },
      ],
    },
    {
      id: 'spot-7',
      title: 'Olympic-Standard Sports Arena & Aquatic Complex',
      category: 'Sports',
      description: 'World-class sports infrastructure featuring a heated 50-meter Olympic swimming pool, maple wood indoor basketball court, 6 synthetic badminton courts, squash courts, and yoga studio.',
      panoramaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      order: 7,
      status: 'published',
      features: ['50m Heated Olympic Swimming Pool', 'Maplewood FIBA Basketball Court', '6 BWF Badminton Courts', 'Certified Strength & Conditioning Coaches'],
      hotspots: [
        { title: 'Startup & Incubation Hub', targetSpotId: 'spot-8', yaw: -75, pitch: -2, description: 'Innovation sandbox next to sports quad' },
      ],
    },
    {
      id: 'spot-8',
      title: 'Innovation Incubation Hub & Startup Sandbox',
      category: 'Innovation',
      description: 'Government DST-supported technology incubator. Has funded 34 student-led ventures with seed grants up to ₹25 Lakhs, venture mentor network, prototyping lab, and patent office.',
      panoramaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      order: 8,
      status: 'published',
      features: ['Up to ₹25 Lakhs Pre-seed Funding', 'Patent Filing & Legal Assistance', 'Co-working Hot Desks & Conference Rooms', 'Venture Capital Demo Day Twice a Year'],
      hotspots: [
        { title: 'Return to Main Gate', targetSpotId: 'spot-1', yaw: 180, pitch: -5, description: 'Loop back to campus entrance' },
      ],
    },
  ];

  const facilities: Facility[] = [
    {
      id: 'fac-1',
      name: 'Advanced Robotics & AI Innovation Lab',
      category: 'Labs',
      timings: '08:00 AM – 10:00 PM (Mon-Sat)',
      location: 'Block C, Ground Floor, Engineering Wing',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      shortDesc: '6-axis robotic arms, NVIDIA DGX A100 AI supercomputer, and autonomous robot testing bay.',
      fullDesc: 'Equipped with industrial-grade robotic arms from ABB and KUKA, this lab offers hands-on experience in machine learning, kinematics, computer vision, and ROS2. Students publish research in IEEE and participate in international RoboCup competitions.',
      highlights: ['NVIDIA DGX A100 Workstation', '6-Axis Industrial Manipulators', 'Computer Vision & LIDAR Kits', '3D Prototyping SLS Printers'],
      specs: [
        { label: 'Workstations', value: '45 High-Spec GPU Systems' },
        { label: 'Software Stack', value: 'ROS2, PyTorch, MATLAB, Gazebo' },
        { label: 'Lab Head', value: 'Dr. Anand Ramanujan, Ph.D. IIT-M' },
        { label: 'Capacity', value: '60 Students per session' },
      ],
    },
    {
      id: 'fac-2',
      name: 'Central Digital Library & Academic Repository',
      category: 'Academics',
      timings: '07:00 AM – 11:00 PM (24x7 during Exam periods)',
      location: 'Academic Square, Central Building',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      shortDesc: '120,000+ volumes, IEEE/Scopus digital terminal access, and quiet soundproof group discussion pods.',
      fullDesc: 'A multi-level architectural landmark. Includes RFID self-checkout kiosks, an automated book return chute, private research carrels, and access to the world’s leading research databases without paywalls.',
      highlights: ['RFID Automated Book Tracking', 'IEEE & Springer Full Subscriptions', 'Soundproof Discussion Pods', 'Terrace Reading Cafe'],
      specs: [
        { label: 'Total Books', value: '120,000+ Volumes' },
        { label: 'Digital Journals', value: '45,000+ Online Subscriptions' },
        { label: 'Seating Capacity', value: '850 Seats' },
        { label: 'Wi-Fi Speed', value: '1 Gbps dedicated link' },
      ],
    },
    {
      id: 'fac-3',
      name: 'Olympic-Standard Indoor Sports Complex',
      category: 'Sports',
      timings: '06:00 AM – 09:30 PM (All 7 Days)',
      location: 'West Campus Athletic Zone',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Maple wood basketball court, 6 BWF badminton courts, table tennis hall, and heated Olympic swimming pool.',
      fullDesc: 'Designed to host national collegiate championships. Certified fitness trainers, Olympic lifting platforms, physiotherapy support, and floodlit evening courts.',
      highlights: ['50m 8-Lane Olympic Pool', '6 Synthetic Badminton Courts', 'Wooden Basketball Arena', 'Locker & Shower Suites'],
      specs: [
        { label: 'Area', value: '45,000 sq.ft' },
        { label: 'Pool Temperature', value: '26°C - 28°C Climate Controlled' },
        { label: 'Head Coach', value: 'National Gold Medalist Staff' },
        { label: 'Flooring', value: 'Imported Canadian Maple Wood' },
      ],
    },
    {
      id: 'fac-4',
      name: 'Nelson Mandela Student Resident Halls',
      category: 'Hostel',
      timings: 'Biometric Access 24x7 (Curfew 10:30 PM for freshmen)',
      location: 'Residential Enclave, East Campus',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Twin AC & Non-AC rooms with attached baths, ergonomic furniture, high-speed Wi-Fi, and resident wardens.',
      fullDesc: 'Safe, comfortable, and hygienic student living. Features round-the-clock security, fingerprint access at all entry points, common room with Sony PlayStation, laundromat, and hot water via solar thermal arrays.',
      highlights: ['Twin Sharing AC Rooms', 'Attached Modern Bathrooms', 'Biometric Turnstiles', 'Resident Doctors On Call'],
      specs: [
        { label: 'Total Capacity', value: '1,800 Students' },
        { label: 'Security', value: '84 CCTV Cameras + 24/7 Guards' },
        { label: 'Laundry', value: 'Free Weekly Automated Laundry' },
        { label: 'Power Backup', value: '100% Dual Generator Redundancy' },
      ],
    },
    {
      id: 'fac-5',
      name: 'Global Dining Complex & Food Court',
      category: 'Campus Life',
      timings: '07:30 AM – 10:30 PM (All 7 Days)',
      location: 'Central Plaza, Building 2',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Multi-cuisine dining certified ISO 22000, live food stations, healthy bowls, and specialty espresso bar.',
      fullDesc: 'Provides nutritious, balanced meals designed in partnership with certified dieticians. Separate vegetarian and non-vegetarian kitchens, steam cooking systems, RO water plant, and live counter options.',
      highlights: ['ISO 22000 Certified Hygiene', 'Four Wholesome Meals Daily', 'Midnight Snack Counter in Exams', 'Multi-cuisine Live Kitchen'],
      specs: [
        { label: 'Seating Capacity', value: '1,500 Seats' },
        { label: 'Water Quality', value: 'RO Purified + UV Treated' },
        { label: 'Cuisine Options', value: 'North, South, Oriental, Continental' },
        { label: 'Waste Management', value: '100% Biogas Organic Digester' },
      ],
    },
    {
      id: 'fac-6',
      name: '24/7 Campus Health Clinic & Emergency Care',
      category: 'Campus Life',
      timings: '24 Hours, 365 Days',
      location: 'Ground Floor, Medical Annex, Beside Hostel A',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Full-time resident medical officer, nurses, ICU basic bed, pharmacy, and dedicated campus ambulance.',
      fullDesc: 'Comprehensive healthcare support on campus. Tied up with Apollo Hospitals & Manipal Hospital for emergency trauma transfers within 10 minutes.',
      highlights: ['Resident Doctor & 2 Nursing Staff', 'Dedicated ICU-equipped Ambulance', 'Basic Diagnostics & Blood Work', 'Free Student Medical Insurance (₹5L)'],
      specs: [
        { label: 'Doctor Availability', value: '24x7 Resident Doctor' },
        { label: 'Hospital Tie-up', value: 'Apollo Hospitals (3.2 km away)' },
        { label: 'Beds', value: '8 In-patient observation beds' },
        { label: 'Pharmacy', value: '100% essential medicines stocked' },
      ],
    },
    {
      id: 'fac-7',
      name: 'Apple Mac Multimedia & Design Studio',
      category: 'Labs',
      timings: '08:00 AM – 09:00 PM (Mon-Sat)',
      location: 'Design & Humanities Wing, 3rd Floor',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      shortDesc: '60 Apple Mac Studio workstations with Pro Display XDR, Cintiq drawing tablets, and VR headsets.',
      fullDesc: 'Tailored for interactive design, game development, VFX, and UI/UX research. Includes eye-tracking labs, sound recording booth, and full Adobe Creative Cloud & Figma Enterprise licenses.',
      highlights: ['60x Apple Mac Studio M2 Max', 'Wacom Cintiq Pro Pen Displays', 'Oculus Quest Pro & Vive VR rigs', 'Acoustically Treated Audio Booth'],
      specs: [
        { label: 'Workstations', value: '60 Mac Studio 64GB RAM' },
        { label: 'Displays', value: 'Apple Studio Displays 5K' },
        { label: 'VR Headsets', value: '12 Sets Meta Quest Pro' },
        { label: 'Audio Recording', value: 'Focusrite & Shure SM7B Setup' },
      ],
    },
    {
      id: 'fac-8',
      name: 'High-Performance Gymnasium & Fitness Hub',
      category: 'Sports',
      timings: '05:30 AM – 10:00 PM',
      location: 'Sports Complex Level 2',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Hammer Strength equipment, Olympic barbells, spin studio, and certified personal trainers.',
      fullDesc: 'Equipped with top-of-the-line cardio and resistance machines, dedicated deadlift platforms, kettlebells, battle ropes, and daily Zumba/Yoga classes.',
      highlights: ['Hammer Strength & LifeFitness', 'Dedicated Squat & Deadlift Racks', 'Zumba and Pilates Studio', 'Locker and Steam Rooms'],
      specs: [
        { label: 'Area', value: '8,000 sq.ft' },
        { label: 'Trainers', value: '4 Certified Coaches' },
        { label: 'Cardio Units', value: '30 Treadmills & Ellipticals' },
        { label: 'Access', value: 'Free for All Enrolled Students' },
      ],
    },
    {
      id: 'fac-9',
      name: '1,200-Seater Grand Auditorium & Convention Center',
      category: 'Campus Life',
      timings: '08:00 AM – 10:00 PM (Event basis)',
      location: 'Main Administrative Quad',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Acoustically tuned venue with 4K laser projection, Meyer Sound system, and green rooms.',
      fullDesc: 'Hosts convocation ceremonies, global tech conferences, TEDx talks, and university drama and music festivals.',
      highlights: ['Barco 4K Laser Projection', 'Meyer Sound Array Audio', 'Motorized Stage Fly Bar Rigging', 'Live 4K Streaming Control Room'],
      specs: [
        { label: 'Seating Capacity', value: '1,200 Plush Push-back Seats' },
        { label: 'Acoustics', value: 'RT60 1.2s Tuned Architectural Foam' },
        { label: 'Stage Dimensions', value: '55ft x 35ft Proscenium' },
        { label: 'Green Rooms', value: '4 Fully Furnished Dressing Rooms' },
      ],
    },
    {
      id: 'fac-10',
      name: 'EV Transit Fleet & Campus Shuttle Network',
      category: 'Campus Life',
      timings: '06:00 AM – 10:30 PM (Continuous shuttles)',
      location: 'Transport Terminal, North Gate',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      shortDesc: '50+ AC buses covering all metropolitan hubs, plus zero-emission golf carts within campus boundaries.',
      fullDesc: 'Equipped with GPS live tracking in the mobile app, emergency SOS buttons, seatbelts, and speed governors for safe student commuting.',
      highlights: ['Live GPS Tracking in App', 'Covers 50+ City Routes', 'Zero-Emission Internal EV Shuttles', 'Experienced Verified Drivers'],
      specs: [
        { label: 'City Bus Fleet', value: '52 Air-conditioned 40-seaters' },
        { label: 'Internal Shuttles', value: '12 Electric 8-seater Carts' },
        { label: 'Safety', value: 'Dual Dashcams + GPS Speed Governor' },
        { label: 'Coverage', value: 'All Metro Stations within 30km' },
      ],
    },
  ];

  const courses: Course[] = [
    {
      id: 'crs-1',
      code: 'BTECH-CS-AI',
      title: 'B.Tech Computer Science & Artificial Intelligence',
      department: 'School of Computing & AI',
      durationYears: 4,
      totalSeats: 180,
      eligibility: '10+2 with 75% in PCM (JEE Main / College Entrance Examination)',
      highestPackage: '₹54.0 LPA',
      avgPackage: '₹16.2 LPA',
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'NVIDIA', 'Atlassian', 'Adobe'],
      description: 'Comprehensive 4-year undergraduate degree covering deep learning, autonomous systems, distributed cloud computing, and real-world industrial capstone projects.',
    },
    {
      id: 'crs-2',
      code: 'BTECH-ROBOTICS',
      title: 'B.Tech Robotics & Autonomous Systems',
      department: 'School of Mechanical & Mechatronics',
      durationYears: 4,
      totalSeats: 120,
      eligibility: '10+2 with 70% in PCM (JEE Main / State CET / Direct Aptitude)',
      highestPackage: '₹38.5 LPA',
      avgPackage: '₹13.5 LPA',
      topRecruiters: ['Tesla India', 'ABB Robotics', 'Qualcomm', 'Bosch', 'Siemens', 'Tata Motors'],
      description: 'Cutting-edge program blending mechanical engineering, embedded systems, computer vision, kinematics, and ROS industrial automation.',
    },
    {
      id: 'crs-3',
      code: 'BDES-INTERACTION',
      title: 'B.Des Interactive Design & Human-Computer Interaction',
      department: 'School of Design & Creative Arts',
      durationYears: 4,
      totalSeats: 60,
      eligibility: '10+2 in any stream with 60% + Design Aptitude Test & Portfolio',
      highestPackage: '₹28.0 LPA',
      avgPackage: '₹11.2 LPA',
      topRecruiters: ['Apple', 'Microsoft UX', 'Swiggy', 'Zomato', 'Cred', 'IBM Interactive'],
      description: 'Focused on UI/UX, product design, spatial computing, accessibility, and AR/VR interfaces with portfolio mentorship from global design directors.',
    },
    {
      id: 'crs-4',
      code: 'MBA-TECH-ANALYTICS',
      title: 'MBA in Tech Management & Business Analytics',
      department: 'School of Management & Business Strategy',
      durationYears: 2,
      totalSeats: 90,
      eligibility: 'Graduation in any stream with 55% + CAT / XAT / GMAT / MAT score',
      highestPackage: '₹34.0 LPA',
      avgPackage: '₹14.0 LPA',
      topRecruiters: ['McKinsey & Co', 'BCG', 'Deloitte', 'Amazon Operations', 'EY Parthenon'],
      description: 'Designed for future tech leaders, product managers, and data-driven strategists with hands-on AI consulting simulations and international immersion.',
    },
  ];

  const fees: Record<string, CourseFees> = {
    'crs-1': {
      courseId: 'crs-1',
      emiStartsAt: 24500,
      refundPolicy: '100% refund up to 15 days before orientation date, as per UGC guidelines.',
      breakdown: [
        { year: 1, tuition: 275000, hostel: 75000, mess: 45000, examLab: 25000, total: 420000 },
        { year: 2, tuition: 275000, hostel: 75000, mess: 45000, examLab: 25000, total: 420000 },
        { year: 3, tuition: 275000, hostel: 75000, mess: 45000, examLab: 25000, total: 420000 },
        { year: 4, tuition: 275000, hostel: 75000, mess: 45000, examLab: 25000, total: 420000 },
      ],
    },
    'crs-2': {
      courseId: 'crs-2',
      emiStartsAt: 21500,
      refundPolicy: '100% refund up to 15 days before orientation date, as per UGC guidelines.',
      breakdown: [
        { year: 1, tuition: 240000, hostel: 75000, mess: 45000, examLab: 20000, total: 380000 },
        { year: 2, tuition: 240000, hostel: 75000, mess: 45000, examLab: 20000, total: 380000 },
        { year: 3, tuition: 240000, hostel: 75000, mess: 45000, examLab: 20000, total: 380000 },
        { year: 4, tuition: 240000, hostel: 75000, mess: 45000, examLab: 20000, total: 380000 },
      ],
    },
    'crs-3': {
      courseId: 'crs-3',
      emiStartsAt: 19500,
      refundPolicy: '100% refund up to 15 days before orientation date, as per UGC guidelines.',
      breakdown: [
        { year: 1, tuition: 220000, hostel: 75000, mess: 45000, examLab: 20000, total: 360000 },
        { year: 2, tuition: 220000, hostel: 75000, mess: 45000, examLab: 20000, total: 360000 },
        { year: 3, tuition: 220000, hostel: 75000, mess: 45000, examLab: 20000, total: 360000 },
        { year: 4, tuition: 220000, hostel: 75000, mess: 45000, examLab: 20000, total: 360000 },
      ],
    },
    'crs-4': {
      courseId: 'crs-4',
      emiStartsAt: 29000,
      refundPolicy: '100% refund up to 15 days before orientation date, as per AICTE guidelines.',
      breakdown: [
        { year: 1, tuition: 360000, hostel: 80000, mess: 50000, examLab: 30000, total: 520000 },
        { year: 2, tuition: 360000, hostel: 80000, mess: 50000, examLab: 30000, total: 520000 },
      ],
    },
  };

  const scholarships: Scholarship[] = [
    {
      id: 'sch-1',
      title: 'Presidential Academic Merit Scholarship',
      coverage: '50% Tuition Fee Waiver for All 4 Years',
      eligibility: 'Score >= 95% in 12th Board or JEE Main Rank under 15,000',
      deadline: 'July 15, 2026',
      applicableCourses: ['crs-1', 'crs-2', 'crs-3', 'crs-4'],
      badge: 'High Impact',
    },
    {
      id: 'sch-2',
      title: 'Women in Technology & STEM Fellowship',
      coverage: '25% Tuition Fee Waiver + Research Grant',
      eligibility: 'All female candidates enrolled in CS, AI, or Robotics engineering',
      deadline: 'July 25, 2026',
      applicableCourses: ['crs-1', 'crs-2'],
      badge: 'Diversity Award',
    },
    {
      id: 'sch-3',
      title: 'Sports & Cultural Excellence Award',
      coverage: 'Up to 40% Waiver on Tuition + Hostel Subsidy',
      eligibility: 'National or State level medal winners in recognised tournaments',
      deadline: 'August 05, 2026',
      applicableCourses: ['crs-1', 'crs-2', 'crs-3', 'crs-4'],
      badge: 'Sports Hero',
    },
    {
      id: 'sch-4',
      title: 'Need-based Financial Assistance Grant',
      coverage: '30% Tuition Waiver + Subsidized Living',
      eligibility: 'Family annual income under ₹6.0 Lakhs with verified ITR documentation',
      deadline: 'July 30, 2026',
      applicableCourses: ['crs-1', 'crs-2', 'crs-3', 'crs-4'],
      badge: 'Financial Aid',
    },
  ];

  const visits: VisitBooking[] = [
    {
      id: 'vis-101',
      userId: 'usr-student-1',
      userName: 'Aarav Sharma',
      userRole: 'student',
      userEmail: 'student@campustour.edu',
      userMobile: '+91 98765 43210',
      repId: 'usr-rep-1',
      repName: 'Dr. Priya Nair',
      date: '2026-10-18',
      timeSlot: '10:30 AM – 12:30 PM',
      visitorCount: 3,
      purpose: 'Lab facilities inspection and B.Tech CSE faculty interaction',
      status: 'confirmed',
      passCode: 'CAMPUS-8842',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'vis-102',
      userId: 'usr-parent-1',
      userName: 'Sunita Sharma',
      userRole: 'parent',
      userEmail: 'parent@campustour.edu',
      userMobile: '+91 98765 43211',
      repId: 'usr-rep-1',
      repName: 'Dr. Priya Nair',
      date: '2026-10-18',
      timeSlot: '10:30 AM – 12:30 PM',
      visitorCount: 3,
      purpose: 'Parent hostel inspection, food quality check, and fee counsellor consultation',
      status: 'confirmed',
      passCode: 'PARENT-4109',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'vis-103',
      userId: 'usr-student-2',
      userName: 'Meera Krishnan',
      userRole: 'student',
      userEmail: 'meera@campustour.edu',
      userMobile: '+91 98765 43214',
      repId: 'usr-rep-1',
      repName: 'Dr. Priya Nair',
      date: '2026-10-22',
      timeSlot: '02:00 PM – 04:00 PM',
      visitorCount: 2,
      purpose: 'Design studio visit and portfolio evaluation',
      status: 'pending',
      passCode: 'VISIT-9921',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  const convId1 = 'conv-student-1';
  const conversations: Conversation[] = [
    {
      id: convId1,
      studentOrParentId: 'usr-student-1',
      studentOrParentName: 'Aarav Sharma',
      studentOrParentRole: 'student',
      repId: 'usr-rep-1',
      repName: 'Dr. Priya Nair',
      lastMessage: 'Looking forward to meeting you on campus this Saturday for the lab tour!',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      unreadCountStudent: 0,
      unreadCountRep: 0,
    },
    {
      id: 'conv-parent-1',
      studentOrParentId: 'usr-parent-1',
      studentOrParentName: 'Sunita Sharma',
      studentOrParentRole: 'parent',
      repId: 'usr-rep-1',
      repName: 'Dr. Priya Nair',
      lastMessage: 'Yes, Mrs. Sharma. Twin-sharing rooms are strictly limited to two students with biometric access on every floor.',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      unreadCountStudent: 0,
      unreadCountRep: 1,
    },
  ];

  const messages: Message[] = [
    {
      id: 'msg-1',
      conversationId: convId1,
      senderId: 'usr-student-1',
      senderName: 'Aarav Sharma',
      senderRole: 'student',
      text: 'Hello Dr. Priya! I explored the 360° tour of the Advanced Robotics Lab. Are undergraduate students allowed to work on the NVIDIA DGX workstations in their first year?',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: convId1,
      senderId: 'usr-rep-1',
      senderName: 'Dr. Priya Nair',
      senderRole: 'rep',
      text: 'Hi Aarav! Yes, absolutely. We have an Open Lab culture. Every student enrolled in AI & Robotics gets lab access cards after their foundational safety workshop in Semester 1.',
      createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: convId1,
      senderId: 'usr-student-1',
      senderName: 'Aarav Sharma',
      senderRole: 'student',
      text: 'That sounds amazing! I have also booked an in-person visit with my parents for this Saturday.',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      read: true,
    },
    {
      id: 'msg-4',
      conversationId: convId1,
      senderId: 'usr-rep-1',
      senderName: 'Dr. Priya Nair',
      senderRole: 'rep',
      text: 'Looking forward to meeting you on campus this Saturday for the lab tour!',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: true,
    },
    {
      id: 'msg-5',
      conversationId: 'conv-parent-1',
      senderId: 'usr-parent-1',
      senderName: 'Sunita Sharma',
      senderRole: 'parent',
      text: 'Good afternoon Dr. Nair. As a mother, safety is my prime concern. Are resident wardens present on student floors 24/7?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
    },
    {
      id: 'msg-6',
      conversationId: 'conv-parent-1',
      senderId: 'usr-rep-1',
      senderName: 'Dr. Priya Nair',
      senderRole: 'rep',
      text: 'Yes, Mrs. Sharma. Twin-sharing rooms are strictly limited to two students with biometric access on every floor. We have full-time resident wardens, female security marshals on all girls floors, and an on-campus doctor at all times.',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: false,
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'usr-student-1',
      title: 'Campus Visit Confirmed',
      message: 'Your in-person visit for Oct 18 has been confirmed with Dr. Priya Nair. Pass: CAMPUS-8842.',
      type: 'visit',
      read: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      link: '/student/visit',
    },
    {
      id: 'notif-2',
      userId: 'usr-student-1',
      title: 'Scholarship Application Closes Soon',
      message: 'The Presidential Academic Merit Scholarship application window closes on July 15.',
      type: 'scholarship',
      read: true,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      link: '/student/courses',
    },
    {
      id: 'notif-3',
      userId: 'usr-parent-1',
      title: 'Visit Pass Generated',
      message: 'Your visit pass PARENT-4109 is ready. Parking is reserved at Welcome Plaza Gate 1.',
      type: 'visit',
      read: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      link: '/parent/safety',
    },
    {
      id: 'notif-4',
      userId: 'usr-parent-1',
      title: 'Fee Transparency Sheet Updated',
      message: 'Academic Year 2026-27 fee breakdown is published with 0% interest EMI options.',
      type: 'fee',
      read: true,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      link: '/parent/fees',
    },
    {
      id: 'notif-5',
      userId: 'usr-rep-1',
      title: 'New Visit Request Pending',
      message: 'Meera Krishnan requested a campus visit for Oct 22 at 02:00 PM.',
      type: 'visit',
      read: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      link: '/rep/schedule',
    },
  ];

  const callbacks: CallbackRequest[] = [
    {
      id: 'cb-1',
      parentName: 'Sunita Sharma',
      mobile: '+91 98765 43211',
      childName: 'Aarav Sharma',
      preferredTime: 'Tomorrow, 11:00 AM – 1:00 PM',
      counsellorType: 'Fee & Education Loan Specialist',
      notes: 'Wants to discuss nationalized bank 0% interest loan process and scholarship cutoffs.',
      status: 'pending',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
  ];

  return {
    users,
    studentProfiles,
    parentProfiles,
    repProfiles,
    colleges,
    tourSpots,
    facilities,
    courses,
    fees,
    scholarships,
    visits,
    conversations,
    messages,
    notifications,
    callbacks,
    collegeSettings: {
      name: 'Apex Institute of Technology & Sciences (AITS)',
      tagline: 'Empowering Next-Gen Innovators, Engineers & Designers',
      address: 'Bengaluru Tech Corridor, Electronic City Phase 2, Karnataka 560100',
      phone: '+91 80 2845 7000',
      email: 'admissions@apextech.edu',
      website: 'https://campustour.edu',
      accreditation: 'NAAC A++ Grade, AICTE Approved, NBA Accredited, NIRF Rank #18',
    },
  };
}

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.ensureDataDirectory();
    this.state = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading data file, falling back to initial seed:', e);
    }
    const initial = getInitialSeedData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseState) {
    try {
      this.ensureDataDirectory();
      const tempPath = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DATA_FILE);
    } catch (err) {
      console.error('Error persisting database state:', err);
    }
  }

  public get<K extends keyof DatabaseState>(key: K): DatabaseState[K] {
    return this.state[key];
  }

  public update<K extends keyof DatabaseState>(
    key: K,
    updater: (current: DatabaseState[K]) => DatabaseState[K]
  ): DatabaseState[K] {
    this.state[key] = updater(this.state[key]);
    this.saveData(this.state);
    return this.state[key];
  }

  public resetToSeed(): DatabaseState {
    this.state = getInitialSeedData();
    this.saveData(this.state);
    return this.state;
  }
}

export const db = new DatabaseManager();
