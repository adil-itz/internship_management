import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, LogOut, Sun, Moon, User, Mail, Shield, CheckCircle, Sparkles, LayoutDashboard, Briefcase, Award, Users } from 'lucide-react';

export default function DashboardPage({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token and user exist in URL search parameters (from Google OAuth Callback)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const userFromUrl = params.get('user');

    if (tokenFromUrl && userFromUrl) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userFromUrl));
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setUser(parsedUser);
        // Clean up URL parameters seamlessly
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse URL user data', e);
      }
    }

    // Read user from localStorage or sessionStorage
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session');
      }
    } else {
      // Default fallback candidate
      setUser({
        name: 'Demo Candidate',
        email: 'user@example.com',
        role: 'student',
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers size={22} />
            </div>
            <span>
              Intern<span className="text-blue-600 dark:text-blue-500">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-10 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 mb-4">
              <Sparkles size={14} className="text-amber-300" />
              <span>Authentication Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="mt-3 text-blue-100 text-base">
              You are successfully authenticated. Explore internships, mentorship sessions, and track your applications.
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">User Name</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'Candidate'}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Email Address</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Account Role</p>
              <span className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {user?.role || 'student'}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Placeholder Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={20} className="text-blue-500" />
                <span>Internships Applied</span>
              </h3>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven't submitted any applications yet. Browse recommended roles on the platform.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={20} className="text-cyan-500" />
                <span>Mentorship Calls</span>
              </h3>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect with industry experts to get 1-on-1 guidance for your career track.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={20} className="text-indigo-500" />
                <span>Skill Assessment</span>
              </h3>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Ready</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Take AI-driven skill tests to verify your proficiency to recruiters.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
