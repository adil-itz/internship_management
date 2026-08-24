import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  LogOut,
  Sun,
  Moon,
  GraduationCap,
  Building2,
  UserCheck,
  ShieldAlert,
  Bell,
  Search,
  LayoutDashboard,
  Briefcase,
  Users,
  Award,
  Sparkles,
  Video,
  FileCheck,
  Star,
  ShieldCheck,
  Database,
  Lock,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';

export default function DashboardLayout({ children, user, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const role = user?.role || 'student';

  const roleConfigs = {
    student: {
      portalTitle: 'Student Portal',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: GraduationCap,
      color: 'blue',
      navItems: [
        { id: 'applications', label: 'My Applications', icon: Briefcase },
        { id: 'recommended', label: 'Recommended Jobs', icon: Sparkles },
        { id: 'mentorship', label: 'Mentorship Calls', icon: Users },
      ],
    },
    company: {
      portalTitle: 'Employer Portal',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: Building2,
      color: 'emerald',
      navItems: [
        { id: 'postings', label: 'Internship Listings', icon: Briefcase },
        { id: 'applicants', label: 'Applicant Queue', icon: Users },
      ],
    },
    mentor: {
      portalTitle: 'Mentor Studio',
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: UserCheck,
      color: 'purple',
      navItems: [
        { id: 'sessions', label: '1-on-1 Sessions', icon: Video },
        { id: 'mentees', label: 'Assigned Mentees', icon: Users },
      ],
    },
    admin: {
      portalTitle: 'Admin Control Center',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: ShieldAlert,
      color: 'amber',
      navItems: [
        { id: 'users', label: 'User Directory', icon: Users },
        { id: 'verifications', label: 'Verification Queue', icon: ShieldCheck },
      ],
    },
  };

  const currentRole = roleConfigs[role] || roleConfigs.student;
  const PortalIcon = currentRole.icon;

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      {/* LEFT SIDEBAR NAVBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Intern<span className="text-blue-600 dark:text-blue-400">Flow</span>
                </span>
                <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider -mt-1">
                  Career Catalyst
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Current Portal Badge */}
          <div className="px-5 py-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${currentRole.badgeClass}`}>
              <PortalIcon size={16} />
              <span>{currentRole.portalTitle}</span>
            </div>
          </div>

          {/* Role Navigation Items */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Dashboard Navigation
            </div>

            {currentRole.navItems.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ItemIcon size={16} className={isSelected ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* Dark Mode & Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
              <span>{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">{darkMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Authenticated User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
              title="Log Out Account"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 cursor-pointer"
            >
              <Menu size={18} />
            </button>

            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentRole.portalTitle}</span>
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Authenticated session • Connected to MongoDB
              </p>
            </div>
          </div>

          {/* Search & Status Tools */}
          <div className="flex items-center gap-3">
            
            <div className="relative hidden md:block w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer relative shadow-2xs">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>

            {/* DB Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Authenticated</span>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 bg-white/50 dark:bg-slate-950/50 mt-auto text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} InternFlow Platform. All rights reserved.</span>
          <span className="text-[11px]">Role: <strong className="capitalize text-slate-700 dark:text-slate-300">{role}</strong></span>
        </footer>
      </div>
    </div>
  );
}
