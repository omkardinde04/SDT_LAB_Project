# CampusTour – Interactive Virtual Campus Experience & Admissions Portal

**CampusTour** is a full-stack, high-fidelity web application designed to replace scattered, static admission resources (PDF brochures, unindexed web pages) with an authentic 360° virtual campus walkthrough, itemized year-by-year fee transparency, real-time messaging with college representatives, and parent decision support.

---

## 🎨 Design Theme & Aesthetic System

Designed strictly following the light purple, clean, and accessible theme guidelines:

- **Primary Colors**:
  - Primary: `#7C5CBF`
  - Primary Dark: `#5B3FA0`
  - Primary Light: `#B9A6E8`
  - Soft Lavender: `#E9E0FA`
  - Page Background: `#F7F4FD`
  - Card Surfaces: `#FFFFFF`
- **Text & Contrast**:
  - Primary Text: `#2D2442`
  - Muted Text: `#7A6F8F`
  - Borders: `#DDD2F3`
- **Functional Accents**:
  - Success (Online / Confirmed): `#5BAE8A`
  - Warning (Sparingly): `#E3A94B`
- **Typography & Geometry**:
  - Font: **Poppins** (`400` body, `500` medium, `600` headings)
  - Card Radius: `16px` (`rounded-2xl` / `rounded-[16px]`)
  - Buttons: Pill shape (`rounded-full` / `999px`)
  - Soft Purple Shadows: `0 6px 20px rgba(124, 92, 191, 0.12)`
  - Accessible Tap Targets: Min `44px` on interactive elements

---

## 👥 Roles & Feature Matrix

| Role | Key Capabilities & Screens |
| :--- | :--- |
| **1. Student** | • Campus greeting banner & tiles<br>• Interactive 360° Virtual Tour with canvas projection, compass & audio<br>• 10 Campus Facilities with equipment specs modal<br>• Courses & Fee catalog with career outcomes<br>• Realtime chat with college representative with quick reply pills<br>• In-person Campus Visit booking with printable QR pass<br>• Academic stream profile & visit history |
| **2. Parent** | • Parent decision dashboard & toll-free helpline card<br>• Year-by-year itemized fee transparency (tuition, hostel, mess, exam/lab)<br>• 0% Interest EMI calculator with tenure slider<br>• Safety & Hostel checklist (24x7 biometric security, CCTV, clinic, female wardens)<br>• Side-by-side college comparison matrix & decision checklist<br>• Counsellor directory with instant callback request & faculty meeting scheduling |
| **3. Representative** | • Admissions workspace with counters (new enquiries, visits today, unread chats)<br>• Realtime conversation inbox with Student/Parent filters<br>• Canned expert reply snippets<br>• Guided visit schedule (accept, reschedule, mark completed)<br>• Presence status switcher (Online / Busy / Away) |
| **4. Admin** | • Institutional executive dashboard with sign-up and course distribution charts<br>• Content Management System for 360 tour spots, facilities, courses & scholarships<br>• User directory with role filters, account deactivation, and representative onboarding<br>• Institutional settings & 1-click database sample seed reset |

---

## ⚡ Tech Stack

- **Client**: React 19, Vite, TypeScript, React Router v7, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **360° Panorama Viewer**: High-performance canvas-based equirectangular projection engine with yaw/pitch rotation, field-of-view zoom, compass heading, waypoint hotspots, and Web Audio API synthesized ambient breeze.
- **Backend**: Node.js, Express, TypeScript, Socket.io for realtime chat, JWT authentication, Bcrypt password hashing.
- **Database**: Relational, persistent JSON storage engine (`server/data/campustour.json`) with zero external native compilation friction, ready out of the box.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+

### 2. Installation
Clone the repository and install dependencies in the root, server, and client:

```bash
# Root monorepo dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..

# Frontend dependencies
cd client && npm install && cd ..
```

### 3. Seed Sample Database
Populate the database with 1 college, 8 tour spots, 10 facilities, 4 courses, itemized fees, scholarships, and 5 pre-configured accounts:

```bash
npm run seed
```

### 4. Run Development Servers
Start both backend API (`http://localhost:5001`) and frontend client (`http://localhost:3000`) simultaneously:

```bash
npm run dev
```

Open your browser to:
👉 **`http://localhost:3000`**

---

## 🔑 Demo Login Credentials

You can test any role instantly via the **1-Click Quick Demo** buttons on the welcome page, or manually log in using:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campustour.edu` | `password123` |
| **Parent** | `parent@campustour.edu` | `password123` |
| **College Representative** | `rep@campustour.edu` | `password123` |
| **Campus Admin** | `admin@campustour.edu` | `password123` |
| **Student #2** | `meera@campustour.edu` | `password123` |

*Master OTP for verification and password reset: `123456`.*

---

## 📂 Project Architecture

```
SDT/
├── package.json               # Root scripts (dev, seed, build)
├── .env.example               # Environment variables template
├── client/
│   ├── index.html             # Poppins fonts, meta descriptions, favicon
│   ├── vite.config.ts         # Vite configuration with Tailwind & proxy
│   ├── src/
│   │   ├── types/             # TypeScript data models
│   │   ├── lib/api.ts         # JWT API client
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Auth state & quick role switching
│   │   │   └── SocketContext.tsx  # Socket.io realtime messaging
│   │   ├── components/
│   │   │   ├── ui/                # Button, Card, Badge, Skeleton, Modal
│   │   │   ├── Navbar.tsx         # Responsive header & sandbox role switcher
│   │   │   ├── BottomNav.tsx      # Mobile navigation bar (max 5 items)
│   │   │   ├── Layout.tsx         # Shell wrapper
│   │   │   ├── RoleGuard.tsx      # Strict role-based route guard
│   │   │   ├── VirtualTourViewer.tsx # 360° equirectangular canvas viewer
│   │   │   ├── FeeSheetModal.tsx  # Printable year-wise fee sheet
│   │   │   └── CallbackModal.tsx  # Direct callback request dialog
│   │   ├── pages/
│   │   │   ├── auth/          # Welcome, Login, Register, VerifyOtp, ForgotPassword, ProfileSetup
│   │   │   ├── student/       # Dashboard, VirtualTour, Facilities, CoursesFees, Chat, BookVisit, Profile
│   │   │   ├── parent/        # Dashboard, FeeTransparency, SafetyHostel, CompareDecide, ContactCollege
│   │   │   ├── rep/           # Dashboard, Chats, VisitSchedule, Profile
│   │   │   └── admin/         # Dashboard, ManageContent, ManageUsers, Settings
│   │   └── App.tsx            # Full role-based routing table
└── server/
    ├── src/
    │   ├── types.ts           # Shared backend types
    │   ├── db.ts              # Persistent database manager & rich seed state
    │   ├── auth.ts            # JWT middleware & role guards
    │   ├── routes.ts          # REST API endpoints
    │   ├── seed.ts            # Standalone seed script
    │   └── index.ts           # Express & Socket.io server
    └── data/
        └── campustour.json    # Persistent database storage
```

---

## 🛡️ Role-Based Access Controls

- Users attempting to access a route belonging to another role are automatically redirected to their respective role dashboard.
- Unauthenticated users are redirected to `/login`.
- The top-right navbar includes an instantaneous **Role Switcher Sandbox** dropdown, allowing you to transition between Student, Parent, Representative, and Admin views with one click for evaluation.
