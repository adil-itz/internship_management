import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Edit3,
} from 'lucide-react';

export default function ForgotPasswordPage({ darkMode, setDarkMode }) {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [email, setEmail] = useState('');
  
  // 6-digit OTP array state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Resend OTP Cooldown Timer
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const combinedOtp = otpDigits.join('');

  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (cleanValue.length > 1) {
      const pastedChars = cleanValue.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedChars.forEach((char, i) => {
        if (index + i < 6) {
          newDigits[index + i] = char;
        }
      });
      setOtpDigits(newDigits);
      const nextFocusIndex = Math.min(index + pastedChars.length, 5);
      otpInputRefs[nextFocusIndex]?.current?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue;
    setOtpDigits(newDigits);

    if (index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = ['', '', '', '', '', ''];
    pastedData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    const lastIndex = Math.min(pastedData.length - 1, 5);
    otpInputRefs[lastIndex]?.current?.focus();
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP. Please check your email.');
      }

      setSuccess(data.message || 'OTP sent successfully! Check your email inbox.');
      setStep(2);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (combinedOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: combinedOtp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired OTP code.');
      }

      setSuccess(data.message || 'Password reset successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative transition-colors duration-300">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between relative z-10 shrink-0">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers size={22} />
          </div>
          <span>
            Intern<span className="text-blue-600 dark:text-blue-500">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
          </button>
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all shadow-sm"
          >
            Back to Login
          </Link>
        </div>
      </header>

      {/* Main Spacious Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 relative z-10 overflow-hidden">
        <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/80">
          
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3 shadow-inner">
                  <KeyRound size={26} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Enter your email address to receive a 6-digit verification OTP.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle size={17} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Professional 6-Digit OTP & New Password */}
          {step === 2 && (
            <>
              <div className="text-center mb-4">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Enter Verification Code
                </h1>
              </div>

              {/* Email Badge Card */}
              <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="truncate">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Code Sent To
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
                      <span>{email}</span>
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); setSuccess(''); }}
                  className="px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-3.5">
                {/* 6-Digit OTP Box Grid */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    6-Digit OTP Code
                  </label>
                  <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-full h-12 text-center text-lg font-bold rounded-xl border transition-all focus:outline-none ${
                          digit
                            ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || combinedOtp.length < 6}
                  className="w-full mt-1 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify OTP & Change Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Didn't receive code?</span>
                {resendCooldown > 0 ? (
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <RotateCcw size={12} className="animate-spin text-slate-400" />
                    <span>Resend in {resendCooldown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* Footer Navigation */}
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="h-2 shrink-0"></footer>
    </div>
  );
}
