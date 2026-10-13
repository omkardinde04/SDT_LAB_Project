import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4FD] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#7C5CBF] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-[#7A6F8F]">Loading CampusTour experience...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect user strictly to their own dashboard
    const roleDashboards: Record<UserRole, string> = {
      student: '/student/dashboard',
      parent: '/parent/dashboard',
      rep: '/rep/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={roleDashboards[user.role]} replace />;
  }

  return <>{children}</>;
};
