import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserRole } from '../../types';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Users2,
  Headphones,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const initialRole = (location.state as any)?.role || 'student';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleChips: { id: UserRole; label: string; icon: any }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'parent', label: 'Parent', icon: Users2 },
    { id: 'rep', label: 'Representative', icon: Headphones },
    { id: 'admin', label: 'Admin (Invite)', icon: ShieldCheck },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (role === 'admin' && inviteCode.trim() !== 'ADMIN2026') {
      setError('Invalid admin invite code. Please enter "ADMIN2026".');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name,
        email,
        mobile,
        password,
        role,
        inviteCode: role === 'admin' ? inviteCode.trim() : undefined,
      });

      // Navigate to OTP verification screen with demo OTP in state
      navigate('/verify-otp', {
        state: {
          email,
          role,
          demoOtp: res.demoOtp,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-[#2D2442] tracking-tight">
          Create Account
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-[#7A6F8F]">
          Get instant access to campus tours, transparent fees & counselling
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-lg">
          {/* Role Chips */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#7A6F8F] uppercase tracking-wider mb-2 text-center">
              Register As
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#FAF7FF] rounded-2xl border border-[#DDD2F3]">
              {roleChips.map((chip) => {
                const isSelected = role === chip.id;
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setRole(chip.id)}
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>
            </div>

            {role === 'admin' && (
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Admin Invite Code * (Demo: ADMIN2026)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter ADMIN2026"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A6F8F] pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded text-[#7C5CBF] focus:ring-[#7C5CBF]"
                />
                Show passwords
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-3"
            >
              Continue to OTP Verification
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-[#7A6F8F]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7C5CBF] font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
