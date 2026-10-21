import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  LogOut,
  Compass,
  User as UserIcon,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Building,
  Check,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { api } from '../lib/api';
import { Notification, UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      api
        .get<Notification[]>('/notifications')
        .then((data) => setNotifications(data))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const handleRoleSwitch = async (targetRole: UserRole) => {
    setShowRoleSwitcher(false);
    try {
      await quickDemoLogin(targetRole);
      const roleDashboards: Record<UserRole, string> = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        rep: '/rep/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleDashboards[targetRole]);
    } catch (err) {
      console.error(err);
    }
  };

  // Role nav links for desktop
  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'student') {
      return [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: '360° Tour', path: '/student/tour' },
        { label: 'Facilities', path: '/student/facilities' },
        { label: 'Courses & Fees', path: '/student/courses' },
        { label: 'Chat with Rep', path: '/student/chat' },
        { label: 'Book Visit', path: '/student/visit' },
      ];
    }
    if (user.role === 'parent') {
      return [
        { label: 'Dashboard', path: '/parent/dashboard' },
        { label: 'Fee Transparency', path: '/parent/fees' },
        { label: 'Safety & Hostel', path: '/parent/safety' },
        { label: 'Compare Colleges', path: '/parent/compare' },
        { label: 'Contact Counsellor', path: '/parent/contact' },
      ];
    }
    if (user.role === 'rep') {
      return [
        { label: 'Dashboard', path: '/rep/dashboard' },
        { label: 'Live Chats', path: '/rep/chats' },
        { label: 'Visit Schedule', path: '/rep/schedule' },
        { label: 'Profile & Hours', path: '/rep/profile' },
      ];
    }
    if (user.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Manage Content', path: '/admin/content' },
        { label: 'Manage Users', path: '/admin/users' },
        { label: 'Settings', path: '/admin/settings' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDD2F3] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B3FA0] to-[#7C5CBF] text-white flex items-center justify-center shadow-purple-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-semibold text-lg text-[#2D2442] tracking-tight flex items-center gap-1.5">
                Somaiya 360°
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#E9E0FA] text-[#5B3FA0]">
                  KJSCE
                </span>
              </span>
              <p className="text-[11px] text-[#7A6F8F] hidden sm:block leading-none">
                Somaiya Vidyavihar Campus Tour
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user ? (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#E9E0FA] text-[#5B3FA0] font-semibold'
                        : 'text-[#2D2442] hover:text-[#5B3FA0] hover:bg-[#FAF7FF]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden sm:flex items-center gap-3">
              <Link
                to="/tour"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#E9E0FA] text-[#5B3FA0] hover:bg-[#DDD2F3] transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>360° Virtual Tour</span>
              </Link>
            </nav>
          )}

          {/* Right Controls: Role Badge / Switcher + Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Instant Role Switcher Dropdown (for paired test evaluation) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowRoleSwitcher(!showRoleSwitcher);
                      setShowNotifDropdown(false);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF7FF] border border-[#DDD2F3] text-[#5B3FA0] hover:border-[#B9A6E8] transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#7C5CBF]" />
                    <span className="capitalize">{user.role} View</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A6F8F]" />
                  </button>

                  {showRoleSwitcher && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-purple-lg border border-[#DDD2F3] p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 text-[11px] font-semibold text-[#7A6F8F] uppercase tracking-wider border-b border-[#DDD2F3]/60 mb-1">
                        Switch Role Sandbox
                      </div>
                      {(['student', 'parent', 'rep', 'admin'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                            user.role === role
                              ? 'bg-[#E9E0FA] text-[#5B3FA0] font-semibold'
                              : 'text-[#2D2442] hover:bg-[#FAF7FF]'
                          }`}
                        >
                          <span className="capitalize font-medium">
                            {role === 'rep' ? 'College Representative' : role}
                          </span>
                          {user.role === role && <Check className="w-4 h-4 text-[#7C5CBF]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      setShowRoleSwitcher(false);
                      setShowProfileMenu(false);
                    }}
                    className="p-2.5 rounded-full text-[#7A6F8F] hover:text-[#5B3FA0] hover:bg-[#E9E0FA]/50 transition-colors relative cursor-pointer"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7C5CBF] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-purple-lg border border-[#DDD2F3] p-4 z-50 animate-in fade-in max-h-[420px] flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-[#DDD2F3]/60">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#2D2442]">Notifications</h4>
                          {unreadCount > 0 && (
                            <Badge variant="primary" size="sm">
                              {unreadCount} New
                            </Badge>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#7C5CBF] hover:underline font-medium cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="py-2 overflow-y-auto space-y-2 flex-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-xs text-[#7A6F8F]">
                            No notifications right now
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-xl border text-xs transition-colors ${
                                notif.read
                                  ? 'bg-[#FAF7FF]/50 border-transparent text-[#7A6F8F]'
                                  : 'bg-[#E9E0FA]/30 border-[#DDD2F3] text-[#2D2442]'
                              }`}
                            >
                              <div className="font-semibold text-xs text-[#5B3FA0] mb-0.5">
                                {notif.title}
                              </div>
                              <p className="line-clamp-2">{notif.message}</p>
                              <div className="text-[10px] text-[#7A6F8F] mt-1.5">
                                {new Date(notif.createdAt).toLocaleDateString()} •{' '}
                                {new Date(notif.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowRoleSwitcher(false);
                      setShowNotifDropdown(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#FAF7FF] transition-colors border border-transparent hover:border-[#DDD2F3] cursor-pointer"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#DDD2F3]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center font-semibold text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#2D2442] hidden sm:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-purple-lg border border-[#DDD2F3] p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-[#DDD2F3]/60 mb-1">
                        <div className="font-semibold text-xs text-[#2D2442] truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-[#7A6F8F] truncate">{user.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (user.role === 'student') navigate('/student/profile');
                          else if (user.role === 'rep') navigate('/rep/profile');
                          else if (user.role === 'parent') navigate('/parent/dashboard');
                          else navigate('/admin/settings');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#2D2442] hover:bg-[#FAF7FF] rounded-xl transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#7C5CBF]" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
