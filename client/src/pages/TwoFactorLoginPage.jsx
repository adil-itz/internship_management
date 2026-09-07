import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { verify2FALogin } from '../services/auth.service';

export default function TwoFactorLoginPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const challengeToken = location.state?.challengeToken || searchParams.get('challenge');
  const rememberMe = location.state?.rememberMe || false;

  useEffect(() => {
    if (!challengeToken) {
      setError('Invalid or expired 2FA session. Please log in again.');
    }
  }, [challengeToken]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!challengeToken) {
      setError('Missing authentication challenge. Please return to login.');
      return;
    }

    if (!token || token.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      const data = await verify2FALogin(challengeToken, token.trim());

      if (rememberMe) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      const userRole = data.user?.role || 'student';
      setSuccess(`2FA Verified! Redirecting to ${userRole} portal...`);
      setTimeout(() => {
        navigate(`/dashboard/${userRole}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
            <Layers size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            Intern<span className="text-blue-600 dark:text-blue-400">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
          </button>
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-xl transition-all shadow-sm"
          >
            Back to Login
          </Link>
        </div>
      </header>

      <div className="w-full max-w-[440px] mx-auto my-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/80 transition-all relative z-10 shrink-0">
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-2">
            <Sparkles size={12} className="text-blue-500" />
            <span>Two-Factor Authentication</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Security Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We sent a 6-digit OTP verification code to your email.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 text-center">
              Enter 6-Digit Email OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <KeyRound size={18} />
              </div>
              <input
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-center text-xl font-bold tracking-[0.5em] text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !challengeToken}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Verify OTP & Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Didn't receive the email OTP?{' '}
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
              <span>Re-login to resend</span>
              <RefreshCw size={12} />
            </Link>
          </p>
        </div>
      </div>

      <footer className="text-center text-[10px] text-slate-400 dark:text-slate-600 shrink-0 relative z-10">
        © {new Date().getFullYear()} InternFlow Inc. All rights reserved.
      </footer>
    </div>
  );
}
