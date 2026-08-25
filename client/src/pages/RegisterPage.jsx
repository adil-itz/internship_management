import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Building2,
  UserCheck,
  Sparkles,
  Award,
  Zap,
  Check,
  Star,
} from 'lucide-react';

export default function RegisterPage({ darkMode, setDarkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const headlinePhrases = [
    "Fast-Track Career Growth",
    "Verified Student Profiles",
    "Direct Employer Pipelines",
    "Certified Mentor Guidance"
  ];

  const slides = [
    {
      quote: "Creating an account took less than 2 minutes and I received 3 interview calls in my first week!",
      author: "Marcus Vance",
      role: "Stanford University • CS Major",
      avatar: "MV",
      rating: "5.0 ★★★★★",
    },
    {
      quote: "InternFlow provides 100% verified employer profiles so candidates apply with complete confidence.",
      author: "Dr. Sarah Jenkins",
      role: "Senior Mentor & Ex-Google Engineer",
      avatar: "SJ",
      rating: "5.0 ★★★★★",
    },
    {
      quote: "Our hiring team shortlisted top 5% university candidates in half the usual recruiting cycle.",
      author: "Apex AI Labs",
      role: "Partner Enterprise Employer",
      avatar: "AI",
      rating: "5.0 ★★★★★",
    },
  ];

  // Rotating Taglines & Carousel Timers
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const phraseTimer = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % headlinePhrases.length);
    }, 2800);
    return () => clearInterval(phraseTimer);
  }, []);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      setSuccess(data.message || 'Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Find Internships' },
    { id: 'company', label: 'Company', icon: Building2, desc: 'Hire Talent' },
    { id: 'mentor', label: 'Mentor', icon: UserCheck, desc: 'Guide Talent' },
  ];

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-300">
      
      {/* LEFT SIDE BANNER (Visible on Desktop / Large screens) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 xl:p-10 flex-col justify-between relative overflow-hidden border-r border-slate-800/80 shrink-0">
        
        {/* Animated Background Glow Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[480px] h-[480px] bg-cyan-500/30 rounded-full blur-[110px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[480px] h-[480px] bg-blue-600/30 rounded-full blur-[110px] pointer-events-none animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-[320px] h-[320px] bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none animate-float-reverse"></div>
        
        {/* Banner Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Top Logo Header */}
        <div className="relative z-10 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-all">
              <Layers size={24} />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Intern<span className="text-blue-400">Flow</span>
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300 shadow-md animate-pulse">
            <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Join 50,000+ Members</span>
          </span>
        </div>

        {/* Hero Middle Content & Animated Showcase */}
        <div className="relative z-10 my-auto py-3 space-y-5 max-w-xl">
          
          {/* Main Tagline & Dynamic Rotating Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Join Today • 100% Free Candidate Access</span>
            </div>
            
            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white tracking-tight min-h-[72px]">
              Start Your Journey with{' '}
              <span key={activePhraseIndex} className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-400">
                {headlinePhrases[activePhraseIndex]}
              </span>
            </h1>
            
            <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
              Create your account to unlock personalized internship recommendations, direct employer connections, and expert mentorship.
            </p>
          </div>

          {/* Floating Animated Live Status Cards */}
          <div className="space-y-2.5">
            
            {/* Live Card 1 */}
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-xl flex items-center justify-between animate-float-slow hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-md shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Students & Graduates</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      FREE PORTAL
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Apply to top internships with 1-click profiles</p>
                </div>
              </div>
              <span className="text-emerald-400 text-xs font-bold shrink-0">0% Fees</span>
            </div>

            {/* Live Card 2 */}
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-between animate-float-reverse">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                <span>Rated 4.9/5 by 12,000+ Verified Students</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Community
              </span>
            </div>

          </div>

          {/* Dynamic Animated Testimonial Carousel Widget */}
          <div className="relative pt-1">
            <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 shadow-2xl space-y-3 relative overflow-hidden">
              
              {/* Top Shimmer Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                <div key={activeSlide} className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-in slide-in-from-left duration-4500 ease-linear w-full"></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Community Impact
                </span>
                <span className="text-amber-400 text-xs font-black">{slides[activeSlide].rating}</span>
              </div>

              {/* Animated Text Block */}
              <div key={activeSlide} className="animate-in fade-in zoom-in-95 duration-400">
                <p className="text-xs xl:text-sm font-semibold text-slate-200 italic leading-relaxed">
                  "{slides[activeSlide].quote}"
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs ring-2 ring-cyan-500/40">
                      {slides[activeSlide].avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{slides[activeSlide].author}</h4>
                      <p className="text-[10px] font-medium text-slate-400">{slides[activeSlide].role}</p>
                    </div>
                  </div>

                  {/* Carousel Dots */}
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner Stats Footer */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-slate-300 text-xs shrink-0">
          <div>
            <span className="block text-lg font-black text-white">50,000+</span>
            <span className="text-[10px] font-medium text-slate-400">Active Members</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <span className="block text-lg font-black text-white">1,240+</span>
            <span className="text-[10px] font-medium text-slate-400">Live Internships</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <span className="block text-lg font-black text-white">4.9/5</span>
            <span className="text-[10px] font-medium text-slate-400">Community Rating</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Register Form Card Container) */}
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
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-xl transition-all shadow-sm"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Centered Perfectly-Sized Register Card */}
        <div className="w-full max-w-[480px] mx-auto my-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/80 transition-all shrink-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-500">
          
          {/* Card Header */}
          <div className="text-center mb-3.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-1">
              <Sparkles size={12} className="text-blue-500" />
              <span>Join InternFlow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access top internship opportunities & 1-on-1 mentorship
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

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-2.5">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* 2. Email Address */}
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

            {/* 3. Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Password
              </label>
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

            {/* 4. Role Selection Buttons */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const IconComponent = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-sm ring-1 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <IconComponent size={15} className={isSelected ? 'text-blue-600 dark:text-blue-400' : ''} />
                      <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                      <span className="text-[9px] opacity-75 font-medium">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 6. Google Auth Option */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="relative flex items-center justify-center mb-2.5">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              <span className="absolute bg-white dark:bg-slate-900 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Or register with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer group"
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
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* 7. Footer Link */}
          <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Log in instead
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

