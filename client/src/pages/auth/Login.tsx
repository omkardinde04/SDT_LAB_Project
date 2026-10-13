import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, GraduationCap, Users2, Headphones, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickDemoLogin } = useAuth();

  const initialRole = (location.state as any)?.role || 'student';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleChips: { id: UserRole; label: string; icon: any }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'parent', label: 'Parent', icon: Users2 },
    { id: 'rep', label: 'Representative', icon: Headphones },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleDemoFill = (role: UserRole) => {
    setSelectedRole(role);
    const demoEmails: Record<UserRole, string> = {
      student: 'student@campustour.edu',
      parent: 'parent@campustour.edu',
      rep: 'rep@campustour.edu',
      admin: 'admin@campustour.edu',
    };
    setIdentifier(demoEmails[role]);
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email or registered mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(identifier, password, selectedRole);
      // Redirect to user's role dashboard
      const roleDashboards: Record<UserRole, string> = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        rep: '/rep/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleDashboards[user.role]);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-[#2D2442] tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-[#7A6F8F]">
          Sign in to access your customized campus admissions hub
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-lg">
          {/* Role Chips */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#7A6F8F] uppercase tracking-wider mb-2 text-center">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#FAF7FF] rounded-2xl border border-[#DDD2F3]">
              {roleChips.map((chip) => {
                const isSelected = selectedRole === chip.id;
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleRoleChange(chip.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7C5CBF] text-white shadow-sm'
                        : 'text-[#7A6F8F] hover:text-[#2D2442] hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. student@campustour.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#2D2442]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#7C5CBF] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A6F8F] hover:text-[#2D2442] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-[#DDD2F3]/60">
            <span className="block text-[11px] font-semibold text-[#7A6F8F] uppercase tracking-wider text-center mb-2">
              Instant Demo Fill (1-Click)
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {(['student', 'parent', 'rep', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleDemoFill(r)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'bg-[#E9E0FA] border-[#7C5CBF] text-[#5B3FA0] font-medium'
                      : 'bg-white border-[#DDD2F3] text-[#7A6F8F] hover:border-[#B9A6E8]'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <p className="mt-4 text-center text-xs text-[#7A6F8F]">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            state={{ role: selectedRole }}
            className="text-[#7C5CBF] font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
