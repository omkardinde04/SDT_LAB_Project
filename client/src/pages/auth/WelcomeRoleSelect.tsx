import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Users2,
  Headphones,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../../types';

export const WelcomeRoleSelect: React.FC = () => {
  const navigate = useNavigate();
  const { quickDemoLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Prospective Student',
      tagline: 'Explore in 360°, inspect labs, and discover your career path.',
      icon: GraduationCap,
      highlights: ['360° Virtual Campus Tour', 'Robotics & AI Labs Review', 'Realtime Representative Chat'],
      badge: 'Most Popular',
    },
    {
      id: 'parent' as UserRole,
      title: 'Parent / Guardian',
      tagline: 'Year-by-year transparent fee breakdown, hostel safety & comparison.',
      icon: Users2,
      highlights: ['100% Itemized Fee Sheets', '24x7 Safety & Biometrics', 'Side-by-Side College Matrix'],
      badge: 'Decision Support',
    },
    {
      id: 'rep' as UserRole,
      title: 'College Representative',
      tagline: 'Engage prospective families, manage visit schedules & reply live.',
      icon: Headphones,
      highlights: ['Instant Student/Parent Inbox', 'Campus Visit Approvals', 'Canned Expert Responses'],
      badge: 'Admissions Portal',
    },
    {
      id: 'admin' as UserRole,
      title: 'Campus Administrator',
      tagline: 'Manage 360 tour spots, curriculum fees, counsellors & stats.',
      icon: ShieldCheck,
      highlights: ['360 Tour Spot CMS', 'Fee & Course CRUD', 'User & Representative Audit'],
      badge: 'Full Governance',
    },
  ];

  const handleDemoAccess = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await quickDemoLogin(role);
      const roleDashboards: Record<UserRole, string> = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        rep: '/rep/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleDashboards[role]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="max-w-4xl mx-auto w-full text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DDD2F3] shadow-purple-sm">
          <Sparkles className="w-4 h-4 text-[#7C5CBF]" />
          <span className="text-xs font-semibold text-[#5B3FA0]">
            The Next-Generation Virtual Campus Experience
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold text-[#2D2442] tracking-tight">
          Welcome to <span className="text-[#7C5CBF]">CampusTour</span>
        </h1>

        <p className="text-sm sm:text-base text-[#7A6F8F] max-w-2xl mx-auto leading-relaxed">
          Replace scattered PDFs and brochures with immersive 360° panoramas, transparent fee sheets, direct representative chat, and seamless decision-making.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`p-6 rounded-[20px] transition-all cursor-pointer border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#7C5CBF] ring-2 ring-[#7C5CBF]/30 shadow-purple-lg -translate-y-0.5'
                  : 'bg-white/80 hover:bg-white border-[#DDD2F3] shadow-purple-sm hover:border-[#B9A6E8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#7C5CBF] text-white' : 'bg-[#E9E0FA] text-[#5B3FA0]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={isSelected ? 'primary' : 'lavender'}>{r.badge}</Badge>
                </div>

                <h3 className="text-lg font-semibold text-[#2D2442] mb-1">{r.title}</h3>
                <p className="text-xs text-[#7A6F8F] leading-relaxed mb-4">{r.tagline}</p>

                <div className="space-y-1.5 border-t border-[#DDD2F3]/60 pt-3 mb-4">
                  {r.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#2D2442]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5BAE8A] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#DDD2F3]/60">
                <span className="text-xs font-medium text-[#7C5CBF]">
                  {isSelected ? 'Selected Role' : 'Click to select'}
                </span>
                <Button
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  isLoading={isLoading && selectedRole === r.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoAccess(r.id);
                  }}
                >
                  Quick Demo
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="max-w-md mx-auto w-full text-center space-y-3">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => navigate('/login', { state: { role: selectedRole } })}
        >
          Sign In as {roles.find((r) => r.id === selectedRole)?.title}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-[#7A6F8F]">
          <span>New prospective user?</span>
          <button
            onClick={() => navigate('/register', { state: { role: selectedRole } })}
            className="text-[#7C5CBF] font-semibold hover:underline cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};
