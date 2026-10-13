import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Building,
  GraduationCap,
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  Scale,
  CalendarCheck,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { label: 'Home', path: '/student/dashboard', icon: LayoutDashboard },
          { label: '360° Tour', path: '/student/tour', icon: Compass },
          { label: 'Facilities', path: '/student/facilities', icon: Building },
          { label: 'Courses', path: '/student/courses', icon: GraduationCap },
          { label: 'Chat', path: '/student/chat', icon: MessageSquare },
        ];
      case 'parent':
        return [
          { label: 'Home', path: '/parent/dashboard', icon: LayoutDashboard },
          { label: 'Fees', path: '/parent/fees', icon: GraduationCap },
          { label: 'Safety', path: '/parent/safety', icon: ShieldCheck },
          { label: 'Compare', path: '/parent/compare', icon: Scale },
          { label: 'Contact', path: '/parent/contact', icon: MessageSquare },
        ];
      case 'rep':
        return [
          { label: 'Dashboard', path: '/rep/dashboard', icon: LayoutDashboard },
          { label: 'Chats', path: '/rep/chats', icon: MessageSquare },
          { label: 'Visits', path: '/rep/schedule', icon: CalendarCheck },
          { label: 'Profile', path: '/rep/profile', icon: Settings },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Content', path: '/admin/content', icon: Building },
          { label: 'Users', path: '/admin/users', icon: Users },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDD2F3] shadow-purple-lg"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#7C5CBF] font-semibold scale-105'
                    : 'text-[#7A6F8F] hover:text-[#2D2442]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-colors ${
                      isActive ? 'bg-[#E9E0FA]' : 'bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
