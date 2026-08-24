import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Users,
  Star,
} from 'lucide-react';

export default function LoginPage({ darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      const userRole = data.user?.role || 'student';
      setSuccess(`Login successful! Redirecting to ${userRole} portal...`);
      setTimeout(() => {
        navigate(`/dashboard/${userRole}`);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-300">
      
      {/* LEFT SIDE BANNER (Visible on Desktop / Large screens) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 xl:p-8 flex-col justify-between relative overflow-hidden border-r border-slate-800/80 shrink-0">
        
        {/* Animated Background Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[90px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[420px] h-[420px] bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-[280px] h-[280px] bg-indigo-500/15 rounded-full blur-[75px] pointer-events-none animate-float-reverse"></div>
        
        {/* Banner Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Top Logo Header */}
        <div className="relative z-10 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Layers size={22} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Intern<span className="text-blue-400">Flow</span>
              </span>
              <span className="block text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                Career Catalyst Platform
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15 text-blue-300">
            <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Next-Gen Internships</span>
          </span>
        </div>

        {/* Hero Middle Content & Banner Elements */}
        <div className="relative z-10 my-auto py-3 space-y-4 max-w-xl">
          
          {/* Main Tagline & Description */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Connecting Top Talent & Industry Leaders</span>
            </div>
            <h1 className="text-2xl xl:text-3xl font-extrabold leading-tight text-white tracking-tight">
              Unlock Your Potential with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">InternFlow</span>
            </h1>
            <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
              Step into a vibrant ecosystem designed to match you with top verified tech internships, industry mentors, and hands-on projects.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Briefcase size={16} />
              </div>
              <h3 className="font-bold text-xs text-white">Verified Companies</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Direct hiring pipelines with top tier firms.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
              <h3 className="font-bold text-xs text-white">1-on-1 Mentorship</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Personalized guidance from tech leaders.</p>
            </div>
          </div>

          {/* Floating Animated Widgets Container */}
          <div className="relative pt-1">
            
            {/* Widget 1: Floating Candidate/Placement Banner Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-xl flex items-center justify-between animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    JD
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">John Doe</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      HIRED
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Software Engineering Intern @ TechCorp</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-xl border border-amber-400/20 text-amber-300 text-[11px] font-bold">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            {/* Widget 2: Floating Small Stat Badge */}
            <div className="absolute -bottom-4 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] shadow-lg flex items-center gap-1.5 animate-float-reverse">
              <ShieldCheck size={14} className="text-cyan-300" />
              <span>100% Verified Opportunities</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner Stats Footer */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-slate-300 text-xs shrink-0">
          <div>
            <span className="block text-base font-black text-white">10K+</span>
            <span className="text-[10px] text-slate-400">Interns Placed</span>
          </div>
          <div className="h-5 w-px bg-white/10"></div>
          <div>
            <span className="block text-base font-black text-white">500+</span>
            <span className="text-[10px] text-slate-400">Partner Companies</span>
          </div>
          <div className="h-5 w-px bg-white/10"></div>
          <div>
            <span className="block text-base font-black text-white">98%</span>
            <span className="text-[10px] text-slate-400">Satisfaction Rate</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Login Form Card Container) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 relative z-10 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="w-full flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2 lg:hidden font-extrabold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers size={18} />
            </div>
            <span>
              Intern<span className="text-blue-600 dark:text-blue-500">Flow</span>
            </span>
          </Link>

          <div className="hidden lg:block"></div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
            </button>
            <Link
              to="/register"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-xl transition-all shadow-sm"
            >
              Create account
            </Link>
          </div>
        </header>

        {/* Centered Perfectly-Sized Login Card */}
        <div className="w-full max-w-[480px] mx-auto my-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/80 transition-all shrink-0">
          
          {/* Card Header */}
          <div className="text-center mb-3.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-1">
              <Sparkles size={12} className="text-blue-500" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Log in to your account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your credentials to access your portal
            </p>
          </div>

          {/* Banners */}
          {error && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer mb-3.5 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-3.5">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            <span className="absolute bg-white dark:bg-slate-900 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/40 bg-slate-50 dark:bg-slate-900 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Remember me on this device
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Container Footer */}
        <footer className="text-center text-[10px] text-slate-400 dark:text-slate-600 shrink-0">
          © {new Date().getFullYear()} InternFlow Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
}


