import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  const email = (location.state as any)?.email || 'student@campustour.edu';
  const role = (location.state as any)?.role || 'student';
  const defaultDemoOtp = (location.state as any)?.demoOtp || '123456';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [activeDemoOtp, setActiveDemoOtp] = useState<string>(defaultDemoOtp);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const split = pasted.split('');
      setOtp(split);
      inputRefs.current[5]?.focus();
    }
  };

  const handleAutofillDemo = () => {
    const code = activeDemoOtp || '123456';
    setOtp(code.split('').slice(0, 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const verifiedUser = await verifyOtp(email, fullOtp);
      // Navigate to profile setup onboarding
      navigate('/profile-setup', { state: { role: verifiedUser.role } });
    } catch (err: any) {
      setError(err.message || 'Verification failed. Use demo code 123456.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const newOtp = await resendOtp(email);
      if (newOtp) setActiveDemoOtp(newOtp);
      setTimer(45);
      setCanResend(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center mx-auto mb-3 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-[#7C5CBF]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D2442] tracking-tight">
          Verify Your Account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7A6F8F]">
          We have sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-xs sm:text-sm text-[#5B3FA0] mt-0.5">{email}</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-lg text-center">
          {error && (
            <div className="mb-4 p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Demo OTP Helper Pill */}
          <div className="mb-5 inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#FAF7FF] border border-[#DDD2F3]">
            <Badge variant="lavender" size="sm">
              Demo Sandbox
            </Badge>
            <span className="text-xs text-[#7A6F8F]">
              Your Code: <strong className="font-mono text-[#5B3FA0]">{activeDemoOtp}</strong>
            </span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-[11px] text-[#7C5CBF] font-semibold hover:underline ml-1 cursor-pointer"
            >
              Autofill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-xl sm:text-2xl rounded-xl border border-[#DDD2F3] bg-[#FAF7FF]/50 text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/20"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Verify & Complete Setup
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Resend Timer */}
          <div className="mt-5 text-xs text-[#7A6F8F] flex items-center justify-center gap-1.5">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1 text-[#7C5CBF] font-semibold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resend Code
              </button>
            ) : (
              <span>Resend code in {timer}s</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
