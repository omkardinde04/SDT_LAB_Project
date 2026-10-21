import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Layout } from './components/Layout';
import { RoleGuard } from './components/RoleGuard';

// Auth Pages
import { WelcomeRoleSelect } from './pages/auth/WelcomeRoleSelect';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyOtp } from './pages/auth/VerifyOtp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ProfileSetup } from './pages/auth/ProfileSetup';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentVirtualTour } from './pages/student/StudentVirtualTour';
import { StudentFacilities } from './pages/student/StudentFacilities';
import { StudentCoursesFees } from './pages/student/StudentCoursesFees';
import { StudentChat } from './pages/student/StudentChat';
import { StudentBookVisit } from './pages/student/StudentBookVisit';
import { StudentProfile } from './pages/student/StudentProfile';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentFeeTransparency } from './pages/parent/ParentFeeTransparency';
import { ParentSafetyHostel } from './pages/parent/ParentSafetyHostel';
import { ParentCompareDecide } from './pages/parent/ParentCompareDecide';
import { ParentContactCollege } from './pages/parent/ParentContactCollege';

// Representative Pages
import { RepDashboard } from './pages/rep/RepDashboard';
import { RepChats } from './pages/rep/RepChats';
import { RepVisitSchedule } from './pages/rep/RepVisitSchedule';
import { RepProfile } from './pages/rep/RepProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminManageContent } from './pages/admin/AdminManageContent';
import { AdminManageUsers } from './pages/admin/AdminManageUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<WelcomeRoleSelect />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-otp" element={<VerifyOtp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="profile-setup" element={<ProfileSetup />} />
              <Route path="tour" element={<StudentVirtualTour />} />
              <Route path="virtual-tour" element={<StudentVirtualTour />} />

              {/* Student Routes (Role Guarded) */}
              <Route
                path="student/dashboard"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="student/tour"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentVirtualTour />
                  </RoleGuard>
                }
              />
              <Route
                path="student/facilities"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentFacilities />
                  </RoleGuard>
                }
              />
              <Route
                path="student/courses"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentCoursesFees />
                  </RoleGuard>
                }
              />
              <Route
                path="student/chat"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentChat />
                  </RoleGuard>
                }
              />
              <Route
                path="student/visit"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentBookVisit />
                  </RoleGuard>
                }
              />
              <Route
                path="student/profile"
                element={
                  <RoleGuard allowedRoles={['student']}>
                    <StudentProfile />
                  </RoleGuard>
                }
              />

              {/* Parent Routes (Role Guarded) */}
              <Route
                path="parent/dashboard"
                element={
                  <RoleGuard allowedRoles={['parent']}>
                    <ParentDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="parent/fees"
                element={
                  <RoleGuard allowedRoles={['parent']}>
                    <ParentFeeTransparency />
                  </RoleGuard>
                }
              />
              <Route
                path="parent/safety"
                element={
                  <RoleGuard allowedRoles={['parent']}>
                    <ParentSafetyHostel />
                  </RoleGuard>
                }
              />
              <Route
                path="parent/compare"
                element={
                  <RoleGuard allowedRoles={['parent']}>
                    <ParentCompareDecide />
                  </RoleGuard>
                }
              />
              <Route
                path="parent/contact"
                element={
                  <RoleGuard allowedRoles={['parent']}>
                    <ParentContactCollege />
                  </RoleGuard>
                }
              />

              {/* College Representative Routes (Role Guarded) */}
              <Route
                path="rep/dashboard"
                element={
                  <RoleGuard allowedRoles={['rep']}>
                    <RepDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="rep/chats"
                element={
                  <RoleGuard allowedRoles={['rep']}>
                    <RepChats />
                  </RoleGuard>
                }
              />
              <Route
                path="rep/schedule"
                element={
                  <RoleGuard allowedRoles={['rep']}>
                    <RepVisitSchedule />
                  </RoleGuard>
                }
              />
              <Route
                path="rep/profile"
                element={
                  <RoleGuard allowedRoles={['rep']}>
                    <RepProfile />
                  </RoleGuard>
                }
              />

              {/* Admin Routes (Role Guarded) */}
              <Route
                path="admin/dashboard"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/content"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminManageContent />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/users"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminManageUsers />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/settings"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminSettings />
                  </RoleGuard>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
