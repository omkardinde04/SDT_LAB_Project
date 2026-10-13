import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setDemoOtp(res.demoOtp);
      setStep('reset');
      if (res.demoOtp) setOtp(res.demoOtp);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMsg('Your password has been reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D2442] tracking-tight">
          Reset Password
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7A6F8F]">
          {step === 'request'
            ? 'Enter your registered email address to receive reset instructions'
            : 'Enter the reset code and choose a new secure password'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-lg">
          {error && (
            <div className="mb-4 p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {successMsg ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#5BAE8A] mx-auto" />
              <p className="text-sm font-semibold text-[#2D2442]">{successMsg}</p>
              <p className="text-xs text-[#7A6F8F]">Redirecting you to sign in...</p>
            </div>
          ) : step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Email Address
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
                    placeholder="student@campustour.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Send Reset Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {demoOtp && (
                <div className="p-2.5 bg-[#FAF7FF] rounded-xl text-xs text-[#5B3FA0] border border-[#DDD2F3]">
                  Demo Code: <strong className="font-mono">{demoOtp}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Reset OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6F8F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#7C5CBF] font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
