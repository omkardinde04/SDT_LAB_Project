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
      id: 'col-kjsce',
      name: 'K. J. Somaiya College of Engineering (KJSCE)',
      tagline: 'Premier Engineering & Technological Research in Mumbai (Established 1983)',
      location: 'Somaiya Vidyavihar Campus, Vidyavihar (East), Mumbai 400077',
      nirfRank: 22,
      naacGrade: 'A+ Grade (Autonomous / SVU)',
      placementRate: 95.8,
      avgPackageLpa: 11.2,
      highestPackageLpa: 58.0,
      studentFacultyRatio: '13:1',
      distanceKm: 0.2,
      totalFeesLakhs: 16.8,
      hostelAvailable: true,
      campusSizeAcres: 60,
      rating: 4.8,
      reviewsCount: 2340,
      coverImage: '/somaiya/kjsce_aryabhat.jpg',
      description: 'Constituent college of Somaiya Vidyavihar University. Known for world-class Maker Labs (riidl), top robotics teams (Orion, Robocon), high placements with Microsoft, Morgan Stanley & JP Morgan, and vibrant campus life.',
      phone: '+91 22 6644 9191',
      email: 'admissions@somaiya.edu',
    },
    {
      id: 'col-simsr',
      name: 'K. J. Somaiya Institute of Management (SIMSR)',
      tagline: 'Leading Business & Management School in India',
      location: 'Somaiya Vidyavihar Campus, Vidyavihar (East), Mumbai 400077',
      nirfRank: 25,
      naacGrade: 'A+ Grade (AACSB Accredited)',
      placementRate: 98.2,
      avgPackageLpa: 13.5,
      highestPackageLpa: 45.0,
      studentFacultyRatio: '14:1',
      distanceKm: 0.3,
      totalFeesLakhs: 19.5,
      hostelAvailable: true,
      campusSizeAcres: 60,
      rating: 4.7,
      reviewsCount: 1850,
      coverImage: '/somaiya/somaiya_auditorium_simsr.jpg',
      description: 'AACSB accredited business institute with modern auditoriums, financial analytics trading labs, and international corporate immersion programs.',
      phone: '+91 22 6728 3000',
      email: 'simsr@somaiya.edu',
    },
    {
      id: 'col-kjssc',
      name: 'K. J. Somaiya College of Arts and Commerce',
      tagline: 'Heritage academic institution for humanities, finance & commerce',
      location: 'Somaiya Vidyavihar Campus, Vidyavihar (East), Mumbai 400077',
      nirfRank: 38,
      naacGrade: 'A Grade (Autonomous)',
      placementRate: 86.4,
      avgPackageLpa: 7.8,
      highestPackageLpa: 24.0,
      studentFacultyRatio: '20:1',
      distanceKm: 0.4,
      totalFeesLakhs: 4.2,
      hostelAvailable: true,
      campusSizeAcres: 60,
      rating: 4.5,
      reviewsCount: 1120,
      coverImage: '/somaiya/somaiya_academic_building.jpg',
      description: 'Historic institution offering undergraduate and postgraduate education in commerce, economics, literature, and media studies.',
      phone: '+91 22 6159 5400',
      email: 'artsandcommerce@somaiya.edu',
    },
  ];

  const tourSpots: TourSpot[] = [
    {
      id: 'spot-entrance',
      title: 'Main Campus Entrance & Welcome Arch',
      category: 'Entrance',
      description: 'The monumental gateway to the 60-acre Somaiya Vidyavihar campus in Vidyavihar (East), Mumbai. Features the iconic Somaiya Trust portal, 24x7 security monitoring, visitor registration, and lush tree-lined walkways welcoming over 39,000 students.',
      panoramaUrl: '/somaiya/somaiya_main_gate.jpg',
      thumbnailUrl: '/somaiya/somaiya_main_gate.jpg',
      order: 1,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Somaiya Vidyavihar Campus Entrance Photograph',
      locationDetails: 'Somaiya Vidyavihar Gate 1, Vidyavihar East, Mumbai',
      features: ['Authentic Somaiya Trust Portal', '24/7 RFID Security Checkpoint', 'Tree-Lined Campus Pedestrian Boulevards', 'Direct Access to KJSCE & Sports Stadium'],
      hotspots: [
        { title: 'K. J. Somaiya College of Engineering (Aryabhat)', targetSpotId: 'spot-kjsce', yaw: 10, pitch: -2, description: 'Direct avenue leading to KJSCE Aryabhat Building' },
        { title: 'Central Campus Gardens & Lawns', targetSpotId: 'spot-gardens', yaw: 70, pitch: -4, description: 'Lush 60-acre green botanical campus' },
        { title: 'Chanakya Student Plaza', targetSpotId: 'spot-chanakya', yaw: -65, pitch: -3, description: 'Active student square and recreation zone' },
      ],
    },
    {
      id: 'spot-kjsce',
      title: 'K. J. Somaiya College of Engineering – Aryabhat Building',
      category: 'Engineering',
      description: 'The celebrated Aryabhat Building of K. J. Somaiya College of Engineering (KJSCE / KJSSE, est. 1983). Showcases the iconic stone amphitheatre stairs, tree-shaded academic plaza, premier engineering departments, maker studios, and tech labs.',
      panoramaUrl: '/somaiya/kjsce_aryabhat.jpg',
      thumbnailUrl: '/somaiya/kjsce_aryabhat.jpg',
      order: 2,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – K. J. Somaiya College of Engineering (Aryabhat Building)',
      locationDetails: 'Aryabhat Building, KJSCE, Somaiya Vidyavihar',
      features: ['Autonomous / SVU Flagship Engineering Campus', 'Iconic Aryabhat Amphitheatre Stairs', 'NBA & NAAC A+ Accredited Center of Excellence', 'State-of-the-Art Prototyping Facilities'],
      hotspots: [
        { title: 'riidl Research & Prototyping Lab', targetSpotId: 'spot-lab', yaw: 45, pitch: -3, description: 'DST & BIRAC supported incubator and maker lab' },
        { title: 'Central Knowledge Library', targetSpotId: 'spot-library', yaw: -45, pitch: -2, description: 'Bhaskaracharya Building Library & study hall' },
        { title: 'Grand University Auditorium', targetSpotId: 'spot-auditorium', yaw: 105, pitch: 0, description: 'Convocation and national symposium hall' },
        { title: 'Return to Main Entrance', targetSpotId: 'spot-entrance', yaw: 180, pitch: -4, description: 'Walk back to Somaiya Vidyavihar main gate' },
      ],
    },
    {
      id: 'spot-academic',
      title: 'Somaiya Academic Quadrangle',
      category: 'Academics',
      description: 'The stately academic quadrangle at Somaiya Vidyavihar, housing premier constituent colleges with sprawling landscaped driveways, royal palm trees, and multi-storey academic wings.',
      panoramaUrl: '/somaiya/somaiya_academic_building.jpg',
      thumbnailUrl: '/somaiya/somaiya_academic_building.jpg',
      order: 3,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – K. J. Somaiya Academic Complex',
      locationDetails: 'Academic Block, Somaiya Vidyavihar, Mumbai',
      features: ['Sprawling Multi-Faculty Academic Wing', 'Heritage Landscaped Forecourt', 'Over 60 Technology-Enabled Smart Classrooms', 'Student Affairs & Deanery'],
      hotspots: [
        { title: 'Smart Tiered Lecture Hall', targetSpotId: 'spot-classroom', yaw: 15, pitch: -2, description: 'High-tech interactive amphitheatre classroom' },
        { title: 'Founder Statue Courtyard', targetSpotId: 'spot-founder', yaw: -75, pitch: -4, description: 'Shri K. J. Somaiya Memorial Garden' },
        { title: 'KJSCE Engineering Complex', targetSpotId: 'spot-kjsce', yaw: 135, pitch: -2, description: 'Connecting engineering quad' },
      ],
    },
    {
      id: 'spot-classroom',
      title: 'Modern Smart Tiered Lecture Hall',
      category: 'Academics',
      description: 'High-tech tiered lecture amphitheatre equipped with ergonomic tiered seating, dual high-lumen projection systems, surround audio acoustics, and Wi-Fi enabled student power desks.',
      panoramaUrl: '/somaiya/somaiya_classroom.jpg',
      thumbnailUrl: '/somaiya/somaiya_classroom.jpg',
      order: 4,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic High-Resolution Photograph – Somaiya Vidyavihar Classrooms',
      locationDetails: 'Academic Wing Lecture Block, Somaiya Vidyavihar',
      features: ['Tiered Amphitheatre Seating for 120+', 'Interactive Projectors & Mic Array', 'Ergonomic Powered Laptop Desks', 'Hybrid Lecture Recording Infrastructure'],
      hotspots: [
        { title: 'Executive MDP Seminar Suite', targetSpotId: 'spot-seminar', yaw: 55, pitch: -2, description: 'Executive board and symposium hall' },
        { title: 'Academic Quadrangle', targetSpotId: 'spot-academic', yaw: -160, pitch: -4, description: 'Step back to the central academic plaza' },
      ],
    },
    {
      id: 'spot-library',
      title: 'Somaiya Central Library & Knowledge Resource Center',
      category: 'Library',
      description: 'The central academic library network spanning the Bhaskaracharya building and Somaiya Vidyavihar University. Houses over 150,000 printed volumes, rare manuscripts, Web OPAC terminals, IEEE/Springer databases, and quiet research carrels.',
      panoramaUrl: '/somaiya/somaiya_library_portal.png',
      thumbnailUrl: '/somaiya/somaiya_library_portal.png',
      order: 5,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Somaiya Vidyavihar University Library System',
      locationDetails: 'Bhaskaracharya Building & Central Library Portal',
      features: ['150,000+ Printed & E-Books', 'IEEE Xplore, ScienceDirect & Scopus Access', 'Quiet Research & Group Study Pods', 'Dedicated Book Bank Scheme'],
      hotspots: [
        { title: 'KJSCE Engineering Aryabhat Wing', targetSpotId: 'spot-kjsce', yaw: -30, pitch: -2, description: 'Walk to KJSCE Engineering quad' },
        { title: 'Founder Statue Garden', targetSpotId: 'spot-founder', yaw: 80, pitch: -3, description: 'Peaceful garden study promenade' },
      ],
    },
    {
      id: 'spot-auditorium',
      title: 'Grand University Auditorium & Convocation Hall',
      category: 'Auditorium',
      description: 'The premier university auditorium packed with students, faculty, and national delegates. Features tiered auditorium seating, world-class stage lighting, acoustic wall panelling, and audio-visual engineering for international symposiums and youth festivals.',
      panoramaUrl: '/somaiya/somaiya_grand_auditorium.jpg',
      thumbnailUrl: '/somaiya/somaiya_grand_auditorium.jpg',
      order: 6,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – Somaiya Vidyavihar Grand Auditorium in Session',
      locationDetails: 'Auditorium Complex, Somaiya Vidyavihar',
      features: ['Seating Capacity of 1,200+', 'Bose Professional Acoustic Sound Shell', 'Broadcast Quality Stage Lighting & LED Screens', 'Host to Symphony, Riidl Makers & Convocations'],
      hotspots: [
        { title: 'Auditorium Stage & Interior View', targetSpotId: 'spot-auditorium-stage', yaw: 10, pitch: 0, description: 'View stage from orchestra seating' },
        { title: 'Executive Seminar Hall', targetSpotId: 'spot-seminar', yaw: 85, pitch: -2, description: 'Walk over to the executive seminar rooms' },
        { title: 'Exit to KJSCE Quad', targetSpotId: 'spot-kjsce', yaw: -140, pitch: -4, description: 'Return to Engineering courtyard' },
      ],
    },
    {
      id: 'spot-auditorium-stage',
      title: 'Somaiya Institute Main Auditorium I (Stage View)',
      category: 'Auditorium',
      description: 'Inside perspective of Somaiya Institute Auditorium I, showcasing the expansive wooden stage, acoustic wall baffles, executive VIP seating, and cinematic projection facilities.',
      panoramaUrl: '/somaiya/somaiya_auditorium_simsr.jpg',
      thumbnailUrl: '/somaiya/somaiya_auditorium_simsr.jpg',
      order: 7,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic High-Resolution Photograph – Somaiya Institute Auditorium I',
      locationDetails: 'Auditorium I, Somaiya Vidyavihar Campus',
      features: ['High-Performance Acoustic Baffles', 'Full-Width Performance Stage', 'Integrated Translation & AV Console', 'Green Rooms & Backstage Wings'],
      hotspots: [
        { title: 'Assembly Hall View', targetSpotId: 'spot-auditorium', yaw: -170, pitch: -4, description: 'Look out at the full seating gallery' },
        { title: 'Chanakya Student Plaza', targetSpotId: 'spot-chanakya', yaw: 45, pitch: -3, description: 'Exit to outdoor student commons' },
      ],
    },
    {
      id: 'spot-seminar',
      title: 'Executive MDP Seminar & Conference Hall',
      category: 'Auditorium',
      description: 'Modern executive Management Development Programme (MDP) seminar hall designed for corporate leadership roundtables, international research symposiums, and thesis defenses.',
      panoramaUrl: '/somaiya/somaiya_seminar_hall.jpg',
      thumbnailUrl: '/somaiya/somaiya_seminar_hall.jpg',
      order: 8,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic High-Resolution Photograph – Somaiya MDP Hall',
      locationDetails: 'Management & Research Complex, Somaiya Vidyavihar',
      features: ['U-Shaped Executive Roundtable Layout', 'Dual Laser Presentation Displays', 'Individual Gooseneck Microphones', 'Video Conferencing for Global Guest Faculty'],
      hotspots: [
        { title: 'riidl Innovation Lab', targetSpotId: 'spot-lab', yaw: -45, pitch: -3, description: 'Venture & startup incubator lab' },
        { title: 'Main Grand Auditorium', targetSpotId: 'spot-auditorium', yaw: 120, pitch: -2, description: 'Connecting corridor to main auditorium' },
      ],
    },
    {
      id: 'spot-gardens',
      title: 'Central Campus Gardens & Palm Groves',
      category: 'Gardens & Outdoors',
      description: 'Somaiya Vidyavihar is renowned for its lush green 60-acre biodiversity campus in the heart of Mumbai. Shaded stone walking trails, flowering gardens, mature royal palms, and open-air study lawns create an inspiring academic oasis.',
      panoramaUrl: '/somaiya/somaiya_gardens_lawn.jpg',
      thumbnailUrl: '/somaiya/somaiya_gardens_lawn.jpg',
      order: 9,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic High-Resolution Photograph – Somaiya Vidyavihar Gardens',
      locationDetails: 'Central Campus Park, Somaiya Vidyavihar',
      features: ['60+ Acres Lush Green Urban Oasis', 'Botanical Flora & Shaded Reading Lawns', 'Zero-Noise Pedestrian Zones', 'Solar-Lit Walking Trails'],
      hotspots: [
        { title: 'Founder Shri K. J. Somaiya Statue', targetSpotId: 'spot-founder', yaw: 30, pitch: -3, description: 'Memorial courtyard with founder statue' },
        { title: 'Athletic Sports Stadium', targetSpotId: 'spot-sports', yaw: -75, pitch: -4, description: 'Synthetic running track & sports ground' },
        { title: 'Student Dining Pavilion', targetSpotId: 'spot-canteen', yaw: 110, pitch: -5, description: 'Award-winning campus cafeteria' },
      ],
    },
    {
      id: 'spot-founder',
      title: 'Founder Shri K. J. Somaiya Statue & Memorial Plaza',
      category: 'Gardens & Outdoors',
      description: 'The central memorial courtyard honoring the visionary founder, Padma Bhushan Karamshi Jethabhai Somaiya, who established Somaiya Vidyavihar in 1959. Surrounded by garden pergolas and stone benches.',
      panoramaUrl: '/somaiya/somaiya_founder_plaza.jpg',
      thumbnailUrl: '/somaiya/somaiya_founder_plaza.jpg',
      order: 10,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – Karamshi Somaiya Memorial Courtyard',
      locationDetails: 'Vidyanagar Central Promenade, Somaiya Vidyavihar',
      features: ['Historic 1959 Foundation Tribute', 'Landscaped Floral Garden & Walkways', 'Open-Air Discussion Seating', 'Hub Between KJSCE & Library'],
      hotspots: [
        { title: 'K. J. Somaiya College of Engineering', targetSpotId: 'spot-kjsce', yaw: -60, pitch: -2, description: 'Direct walking path to Aryabhat' },
        { title: 'Central Knowledge Library', targetSpotId: 'spot-library', yaw: 40, pitch: -3, description: 'Path to Bhaskaracharya library' },
        { title: 'Central Campus Gardens', targetSpotId: 'spot-gardens', yaw: 170, pitch: -4, description: 'Wander the botanical green lawns' },
      ],
    },
    {
      id: 'spot-sports',
      title: 'Somaiya Athletic Stadium & Olympic Sports Ground',
      category: 'Sports',
      description: 'World-class athletic stadium featuring an Olympic-grade 400m synthetic red running track, full-size natural grass football pitch, cricket ground, floodlights, and viewing grandstands.',
      panoramaUrl: '/somaiya/somaiya_sports_ground.jpg',
      thumbnailUrl: '/somaiya/somaiya_sports_ground.jpg',
      order: 11,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – Somaiya Vidyavihar Sports Stadium',
      locationDetails: 'Somaiya Sports Complex, Vidyavihar East, Mumbai',
      features: ['Olympic 400m All-Weather Synthetic Track', 'Full-Size Grass Football Turf', 'Floodlit Arena for Evening Competitions', 'Cricket Nets, Basketball & Tennis Courts'],
      hotspots: [
        { title: 'Student Dining Pavilion & Canteen', targetSpotId: 'spot-canteen', yaw: 65, pitch: -5, description: 'Refreshments and dining pavilion' },
        { title: 'Student Hostel Complex', targetSpotId: 'spot-hostel', yaw: -80, pitch: -4, description: 'On-campus residential halls' },
        { title: 'Central Campus Gardens', targetSpotId: 'spot-gardens', yaw: 160, pitch: -3, description: 'Return to landscaped lawns' },
      ],
    },
    {
      id: 'spot-canteen',
      title: 'Student Dining Pavilion & Campus Cafeteria (sP+a)',
      category: 'Canteen',
      description: 'The acclaimed architectural Student Dining Pavilion designed by Sameep Padora & Associates (sP+a). An open, light-filled dining complex serving hygienic multi-cuisine meals, fresh juice, South Indian delicacies, and barista drinks.',
      panoramaUrl: '/somaiya/somaiya_canteen_pavilion.jpg',
      thumbnailUrl: '/somaiya/somaiya_canteen_pavilion.jpg',
      order: 12,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – K. J. Somaiya Dining Pavilion (ArchitectureLive)',
      locationDetails: 'Student Dining Pavilion, Somaiya Vidyavihar Campus',
      features: ['Award-Winning Architectural Open Pavilion', 'Multi-Cuisine Hygiene-Certified Food Counters', 'Shaded Indoor & Al Fresco Patio Dining', 'Dedicated Fast-Food & Juice Bars'],
      hotspots: [
        { title: 'Chanakya Student Activity Hub', targetSpotId: 'spot-chanakya', yaw: 20, pitch: -4, description: 'Outdoor student plaza and clubs' },
        { title: 'Athletic Sports Ground', targetSpotId: 'spot-sports', yaw: -110, pitch: -5, description: 'Synthetic running track and sports pavilion' },
        { title: 'Student Hostel Complex', targetSpotId: 'spot-hostel', yaw: 125, pitch: -3, description: 'Walk over to residential halls' },
      ],
    },
    {
      id: 'spot-chanakya',
      title: 'Chanakya Building & Student Activity Plaza',
      category: 'Student Activity',
      description: 'The bustling student common area outside the Chanakya Building. A lively outdoor social center where student clubs, robotics teams, cultural committees, and hackathons convene.',
      panoramaUrl: '/somaiya/somaiya_chanakya_plaza.jpg',
      thumbnailUrl: '/somaiya/somaiya_chanakya_plaza.jpg',
      order: 13,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – Chanakya Building, Somaiya Vidyavihar',
      locationDetails: 'Chanakya Plaza, Somaiya Vidyavihar',
      features: ['Vibrant Student Activity Courtyard', 'Cultural Festival & Flashmob Stage', 'Club Stalls & Hackathon Hangouts', 'Tree-Shaded Outdoor Discussion Tables'],
      hotspots: [
        { title: 'riidl Research & Maker Lab', targetSpotId: 'spot-lab', yaw: -40, pitch: -3, description: 'Innovation incubation and rapid prototyping' },
        { title: 'Student Dining Pavilion', targetSpotId: 'spot-canteen', yaw: 90, pitch: -4, description: 'Cafeteria and refreshments' },
        { title: 'Somaiya Main Entrance Gate', targetSpotId: 'spot-entrance', yaw: -150, pitch: -5, description: 'Loop back to campus gate' },
      ],
    },
    {
      id: 'spot-lab',
      title: 'riidl Innovation & Engineering Prototyping Lab',
      category: 'Innovation',
      description: 'Research Innovation Incubation Design Labs (riidl), supported by BIRAC-DBT and partnered with MIT Media Lab. Features prototyping equipment, 3D printers, laser cutters, electronics testing stations, and startup incubation bays for KJSCE engineers.',
      panoramaUrl: '/somaiya/somaiya_project_lab.jpg',
      thumbnailUrl: '/somaiya/somaiya_project_lab.jpg',
      order: 14,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic High-Resolution Photograph – Somaiya Innovation & Project Lab',
      locationDetails: 'riidl Innovation Center, Somaiya Vidyavihar',
      features: ['DST & BIRAC Supported Incubator', 'Rapid 3D Prototyping & Laser Workstations', 'Startup Seed Funding up to ₹25 Lakhs', 'Active Student Maker Community'],
      hotspots: [
        { title: 'KJSCE Aryabhat Building', targetSpotId: 'spot-kjsce', yaw: -80, pitch: -3, description: 'Return to engineering main building' },
        { title: 'Chanakya Student Plaza', targetSpotId: 'spot-chanakya', yaw: 110, pitch: -4, description: 'Step out to student activity hub' },
      ],
    },
    {
      id: 'spot-hostel',
      title: 'Somaiya Student Residential Hostel Complex',
      category: 'Hostel',
      description: 'Comfortable on-campus student residential accommodations set amidst quiet tree-lined avenues. Features 24x7 security, biometric access, furnished twin/triple sharing rooms with high-speed internet, recreational common rooms, and dedicated wardens.',
      panoramaUrl: '/somaiya/somaiya_hostel.jpg',
      thumbnailUrl: '/somaiya/somaiya_hostel.jpg',
      order: 15,
      status: 'published',
      isAuthenticCapture: true,
      captureType: 'wide_panorama',
      photoSource: 'Authentic Photograph – Somaiya Vidyavihar Student Hostel Complex',
      locationDetails: 'Hostel Enclave, Somaiya Vidyavihar, Mumbai',
      features: ['24x7 Biometric Turnstile Security & CCTV', 'Air-Conditioned & Non-AC Room Options', 'High-Speed Wi-Fi & Dedicated Study Lounges', 'Resident Medical Clinic on Campus'],
      hotspots: [
        { title: 'Athletic Sports Stadium', targetSpotId: 'spot-sports', yaw: 45, pitch: -4, description: 'Just 2 minutes walk to running track' },
        { title: 'Student Dining Pavilion', targetSpotId: 'spot-canteen', yaw: -90, pitch: -5, description: 'Mess and cafeteria complex' },
      ],
    },
  ];

  const facilities: Facility[] = [
    {
      id: 'fac-1',
      name: 'riidl Research, Innovation & Incubation Labs',
      category: 'Labs',
      timings: '08:00 AM – 10:00 PM (Mon-Sat)',
      location: 'KJSCE Building & Central Innovation Hub',
      imageUrl: '/somaiya/somaiya_project_lab.jpg',
      shortDesc: 'Supported by BIRAC-DBT and MIT Media Lab with 3D prototyping, PCB fabrication, and startup incubators.',
      fullDesc: 'riidl is Somaiya Vidyavihar University’s flagship innovation incubator. Features rapid prototyping, DIY bio labs, laser cutters, electronics testing stations, and seed grants up to ₹25 Lakhs for student-founded deep-tech ventures.',
      highlights: ['BIRAC-DBT & DST Supported Incubator', 'Rapid 3D Prototyping & CNC Machines', 'MIT Media Lab Bio-Initiative Partner', 'Over 120+ Startups Incubated'],
      specs: [
        { label: 'Prototyping Tools', value: '3D Printers, Laser Cutters, SMD Rework' },
        { label: 'Funding Access', value: 'Seed grants up to ₹25 Lakhs' },
        { label: 'Incubation Space', value: '15,000+ sq.ft dedicated facility' },
        { label: 'Student Access', value: 'Open to all KJSCE engineering innovators' },
      ],
    },
    {
      id: 'fac-2',
      name: 'Somaiya Central Library & Knowledge Resource Center',
      category: 'Academics',
      timings: '08:00 AM – 11:00 PM (Extended hours during exams)',
      location: 'Bhaskaracharya Building & Central Library Portal',
      imageUrl: '/somaiya/somaiya_library_portal.png',
      shortDesc: '150,000+ volumes, IEEE/ScienceDirect digital access, and quiet soundproof group research suites.',
      fullDesc: 'Spread across two extensive floors in the Bhaskaracharya building. Provides Web OPAC access, digital thesis repositories, Book Bank scheme for undergraduates, and access to international scholarly databases.',
      highlights: ['150,000+ Physical & Digital Volumes', 'IEEE Xplore, ScienceDirect, ACM Access', 'Web OPAC & Mobile E-Library App', 'Dedicated Student Book Bank Scheme'],
      specs: [
        { label: 'Collection Size', value: '150,000+ Books & Bound Journals' },
        { label: 'Digital Terminals', value: '75 High-Speed Research Terminals' },
        { label: 'Floor Area', value: '570+ sq. meters across 2 floors' },
        { label: 'Global Circulation', value: 'Unified SVU Net ID library network' },
      ],
    },
    {
      id: 'fac-3',
      name: 'Somaiya Athletic Stadium & Olympic Sports Ground',
      category: 'Sports',
      timings: '06:00 AM – 09:30 PM (All 7 Days)',
      location: 'Somaiya Sports Complex, Vidyavihar East',
      imageUrl: '/somaiya/somaiya_sports_ground.jpg',
      shortDesc: 'Olympic-grade 400m synthetic red running track, full-size football ground, and cricket pitch.',
      fullDesc: 'One of Mumbai’s finest collegiate athletic arenas. Features an all-weather red synthetic running track, natural grass football field, cricket practice nets, floodlights for night tournaments, and coaching staff.',
      highlights: ['400m All-Weather Synthetic Track', 'Full-size FIFA Football Field', 'High-Mast Floodlit Evening Arena', 'Inter-Collegiate Athletics Host'],
      specs: [
        { label: 'Track Standard', value: 'Olympic Specification 400m 8-Lane' },
        { label: 'Field Type', value: 'Natural grass sports turf with drainage' },
        { label: 'Facilities', value: 'Cricket nets, basketball courts & tennis' },
        { label: 'Spectator Seating', value: 'Grandstand viewing pavilion' },
      ],
    },
    {
      id: 'fac-4',
      name: 'Somaiya Student Residential Hostel Complex',
      category: 'Hostel',
      timings: 'Biometric Access 24x7 (Curfew 10:30 PM for freshmen)',
      location: 'Hostel Enclave, Somaiya Vidyavihar',
      imageUrl: '/somaiya/somaiya_hostel.jpg',
      shortDesc: 'Comfortable air-conditioned & non-AC twin sharing rooms with biometric turnstiles and 24x7 security.',
      fullDesc: 'Safe, green, and vibrant on-campus student residences. Features round-the-clock biometric security, high-speed Wi-Fi, laundry facilities, study lounges, recreational rooms, and on-campus medical doctors.',
      highlights: ['Twin & Triple Sharing Options', 'Attached Modern Bathrooms with Solar Geysers', 'Biometric Security & 24/7 Wardens', 'On-Campus Health Center on Call'],
      specs: [
        { label: 'Accommodation', value: 'Furnished with ergonomic study desks' },
        { label: 'Surveillance', value: 'Comprehensive CCTV coverage & guards' },
        { label: 'Connectivity', value: 'High-speed campus Wi-Fi network' },
        { label: 'Mess Facility', value: 'Nutritious vegetarian meals served' },
      ],
    },
    {
      id: 'fac-5',
      name: 'Student Dining Pavilion & Cafeteria (sP+a)',
      category: 'Campus Life',
      timings: '07:30 AM – 10:30 PM (All 7 Days)',
      location: 'Central Plaza, Near Sports Complex',
      imageUrl: '/somaiya/somaiya_canteen_pavilion.jpg',
      shortDesc: 'Award-winning architectural open dining pavilion designed by Sameep Padora & Associates.',
      fullDesc: 'A celebrated architectural masterpiece providing a light-filled dining hall. Features multiple hygiene-certified food counters offering South Indian, North Indian, fresh fruit juices, sandwiches, and hot beverages.',
      highlights: ['Award-Winning Architectural Pavilion', 'Hygienic Multi-Cuisine Food Stations', 'Open-Air Shaded Patio Dining', 'Popular Campus Gathering Hotspot'],
      specs: [
        { label: 'Design Architect', value: 'Sameep Padora & Associates (sP+a)' },
        { label: 'Cuisines', value: 'South Indian, Thali, Snacks & Fresh Juice' },
        { label: 'Seating', value: 'Indoor & covered outdoor patio tables' },
        { label: 'Hygiene Standard', value: 'Strict university quality inspections' },
      ],
    },
    {
      id: 'fac-6',
      name: 'K. J. Somaiya College of Engineering (Aryabhat)',
      category: 'Labs',
      timings: '08:00 AM – 08:00 PM (Mon-Sat)',
      location: 'Aryabhat Building, KJSCE, Vidyavihar',
      imageUrl: '/somaiya/kjsce_aryabhat.jpg',
      shortDesc: 'Flagship engineering building housing computing laboratories, seminar halls, and project labs.',
      fullDesc: 'Established in 1983, KJSCE is renowned for excellence in engineering and technological research. The Aryabhat building features state-of-the-art computer centers, mechatronics facilities, and departmental project studios.',
      highlights: ['Autonomous & NBA Accredited Flagship', 'Iconic Aryabhat Amphitheatre Stairs', 'NVIDIA & CISCO Technology Labs', 'Active Robocon & Formula Student Teams'],
      specs: [
        { label: 'Departments', value: 'Computer, AI-DS, EXTC, Mechanical, IT' },
        { label: 'Laboratories', value: 'Over 45 departmental technical labs' },
        { label: 'Faculty Ratio', value: '1:13 student-faculty mentorship' },
        { label: 'Accreditation', value: 'NAAC A+ Grade (Autonomous / SVU)' },
      ],
    },
    {
      id: 'fac-7',
      name: 'Technology-Enabled Smart Tiered Classrooms',
      category: 'Academics',
      timings: '08:00 AM – 06:00 PM',
      location: 'Academic Wings, Somaiya Vidyavihar',
      imageUrl: '/somaiya/somaiya_classroom.jpg',
      shortDesc: 'Air-conditioned tiered lecture halls with interactive multimedia displays and acoustic tuning.',
      fullDesc: 'Ergonomically designed amphitheatre lecture rooms equipped with dual HD laser projectors, wireless mic systems, high-speed Wi-Fi, and laptop charging ports at every seat for interactive learning.',
      highlights: ['Tiered Amphitheatre Seating for 120+', 'Interactive Projectors & Mic Array', 'Ergonomic Powered Desks', 'Lecture Capture Infrastructure'],
      specs: [
        { label: 'Capacity', value: '120-150 Students per lecture hall' },
        { label: 'Audio-Visual', value: 'Dual Laser Displays & Wireless Audio' },
        { label: 'Climate Control', value: 'Centralized energy-efficient AC' },
        { label: 'Acoustics', value: 'Echo-damped acoustic panelling' },
      ],
    },
    {
      id: 'fac-8',
      name: 'Somaiya Grand University Auditorium',
      category: 'Campus Life',
      timings: '08:00 AM – 10:00 PM (Event basis)',
      location: 'Auditorium Complex, Somaiya Vidyavihar',
      imageUrl: '/somaiya/somaiya_grand_auditorium.jpg',
      shortDesc: '1,200-seat theatrical auditorium for annual convocations, cultural festivals, and global symposiums.',
      fullDesc: 'The centerpiece of major university assemblies. Features tiered theatrical seating, professional stage lighting, Bose acoustics, digital green rooms, and live broadcasting capability.',
      highlights: ['1,200+ Tiered Theatre Seating', 'Professional Stage Lighting & LED Wall', 'Broadcast Studio & Sound Console', 'Home to University Symphony & TEDx'],
      specs: [
        { label: 'Seating', value: '1,200 Push-back acoustic seats' },
        { label: 'Stage Dimensions', value: 'Proscenium stage with wooden flooring' },
        { label: 'Sound', value: 'Professional line-array acoustic setup' },
        { label: 'Green Rooms', value: 'Air-conditioned backstage dressing suites' },
      ],
    },
    {
      id: 'fac-9',
      name: 'Somaiya Institute Auditorium I & Stage',
      category: 'Campus Life',
      timings: '08:30 AM – 09:30 PM (Event basis)',
      location: 'Management & Research Complex',
      imageUrl: '/somaiya/somaiya_auditorium_simsr.jpg',
      shortDesc: 'Premier executive auditorium with wood acoustic wall panelling and corporate conference amenities.',
      fullDesc: 'Dedicated auditorium for corporate leadership conclaves, management summits, research paper presentations, and international academic partnerships.',
      highlights: ['Acoustic Wall Baffles', 'Integrated Translation & AV Console', 'Executive Push-Back Seating', 'High-Definition Screen'],
      specs: [
        { label: 'Capacity', value: '450 Executive seats' },
        { label: 'Acoustics', value: 'Timber acoustic wall panelling' },
        { label: 'Usage', value: 'Conferences, Dean lectures, guest seminars' },
        { label: 'Connectivity', value: 'HD Video conferencing enabled' },
      ],
    },
    {
      id: 'fac-10',
      name: 'Central Botanical Lawns & Campus Promenade',
      category: 'Campus Life',
      timings: '06:00 AM – 10:00 PM (All 7 Days)',
      location: 'Central Campus Park, Somaiya Vidyavihar',
      imageUrl: '/somaiya/somaiya_gardens_lawn.jpg',
      shortDesc: '60 acres of biodiversity, mature royal palms, flowering gardens, and shaded student study lawns.',
      fullDesc: 'A rare natural oasis in the center of Mumbai. Provides tree-shaded stone benches, solar-lit walking pathways, zero-noise zones, and open spaces for outdoor group discussions and creative relaxation.',
      highlights: ['60+ Acres Biodiversity Haven in Mumbai', 'Shaded Tree Promenades & Palm Groves', 'Zero-Noise Peaceful Learning Zones', 'Solar-Powered Night Walkways'],
      specs: [
        { label: 'Campus Area', value: '60 Lush green acres' },
        { label: 'Flora', value: 'Over 1,000+ mature trees and flowering plants' },
        { label: 'Pathways', value: 'Pedestrian-first paved stone trails' },
        { label: 'Environmental', value: 'Rainwater harvesting and compost parks' },
      ],
    },
  ];

  const courses: Course[] = [
    {
      id: 'crs-1',
      code: 'BTECH-CE',
      title: 'B.Tech in Computer Engineering',
      department: 'K. J. Somaiya College of Engineering (KJSCE)',
      durationYears: 4,
      totalSeats: 180,
      eligibility: '10+2 with 75% in PCM (MHT-CET / JEE Main / PERA-CET)',
      highestPackage: '₹58.0 LPA',
      avgPackage: '₹14.8 LPA',
      topRecruiters: ['Microsoft', 'JP Morgan Chase', 'Morgan Stanley', 'Amazon', 'Cisco', 'Barclays'],
      description: 'Comprehensive 4-year engineering program covering algorithms, cloud distributed systems, cybersecurity, full-stack architecture, and real-world industrial capstone projects.',
    },
    {
      id: 'crs-2',
      code: 'BTECH-AIDS',
      title: 'B.Tech in Artificial Intelligence & Data Science',
      department: 'K. J. Somaiya College of Engineering (KJSCE)',
      durationYears: 4,
      totalSeats: 120,
      eligibility: '10+2 with 70% in PCM (MHT-CET / JEE Main / PERA-CET)',
      highestPackage: '₹48.0 LPA',
      avgPackage: '₹13.6 LPA',
      topRecruiters: ['NVIDIA', 'Accenture AI', 'Fractal Analytics', 'Oracle', 'Deloitte', 'ZS Associates'],
      description: 'Specialized degree in machine learning, neural networks, natural language processing, computer vision, and big data infrastructure in collaboration with industry partners.',
    },
    {
      id: 'crs-3',
      code: 'BTECH-EXTC',
      title: 'B.Tech in Electronics & Telecommunication Engineering',
      department: 'K. J. Somaiya College of Engineering (KJSCE)',
      durationYears: 4,
      totalSeats: 120,
      eligibility: '10+2 with 65% in PCM (MHT-CET / JEE Main / PERA-CET)',
      highestPackage: '₹36.0 LPA',
      avgPackage: '₹10.5 LPA',
      topRecruiters: ['Texas Instruments', 'Qualcomm', 'Tata Communications', 'L&T Infotech', 'Siemens'],
      description: 'Program covering embedded systems, IoT architecture, 5G wireless communication, signal processing, and robotics control systems.',
    },
    {
      id: 'crs-4',
      code: 'BTECH-MECH',
      title: 'B.Tech in Mechanical Engineering',
      department: 'K. J. Somaiya College of Engineering (KJSCE)',
      durationYears: 4,
      totalSeats: 90,
      eligibility: '10+2 with 65% in PCM (MHT-CET / JEE Main / PERA-CET)',
      highestPackage: '₹32.0 LPA',
      avgPackage: '₹9.8 LPA',
      topRecruiters: ['Tata Motors', 'Mahindra & Mahindra', 'Thermax', 'Godrej & Boyce', 'Mercedes-Benz'],
      description: 'Hands-on curriculum in CAD/CAM, finite element analysis, additive manufacturing, robotics, and electric vehicle dynamics with active Formula Student racing teams (Orion Racing).',
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
      name: 'K. J. Somaiya College of Engineering & Somaiya Vidyavihar',
      tagline: 'Vidyaniketan of Excellence, Innovation & Character – Mumbai',
      address: 'Somaiya Vidyavihar Campus, Vidyavihar (East), Mumbai 400077, Maharashtra, India',
      phone: '+91 22 6644 9191 / +91 22 6728 3000',
      email: 'admissions@somaiya.edu',
      website: 'https://kjsce.somaiya.edu',
      accreditation: "NAAC 'A+' Grade | Autonomous / SVU | NBA Accredited",
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
