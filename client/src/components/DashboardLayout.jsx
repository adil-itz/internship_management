import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDown,
  Activity,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export default function DashboardLayout({ children, user, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Derive stored user if prop is missing
  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  // Determine current active role from route path or activeUser state
  const pathFirst = location.pathname.split('/')[1];
  const pathSecond = location.pathname.split('/')[2];
  const role =
    pathFirst === 'company' || pathSecond === 'company'
      ? 'company'
      : pathFirst === 'student' || pathSecond === 'student'
      ? 'student'
      : activeUser?.role || 'student';

  const roleConfigs = {
    student: {
      portalTitle: 'Student Portal',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: GraduationCap,
      color: 'blue',
      navItems: [
        { id: 'internships', label: 'Explore Internships', icon: Briefcase, path: '/student/internships' },
        { id: 'applications', label: 'My Applications', icon: Sparkles, path: '/dashboard/student' },
        { id: 'mentorship', label: 'Mentorship Calls', icon: Users, path: '/dashboard/student' },
        { id: 'profile', label: 'My Profile', icon: UserCheck, path: '/dashboard/student/profile' },
      ],
    },
    company: {
      portalTitle: 'Employer Portal',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Building2,
      color: 'blue',
      navItems: [
        { id: 'manage-internships', label: 'Manage Internships', icon: Briefcase, path: '/company/internships' },
        { id: 'create-internship', label: '+ Post Internship', icon: Sparkles, path: '/company/internships/create' },
        { id: 'postings', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/dashboard/company' },
      ],
    },
    mentor: {
      portalTitle: 'Mentor Studio',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: UserCheck,
      color: 'blue',
      navItems: [
        { id: 'sessions', label: '1-on-1 Sessions', icon: Video, badge: '2' },
        { id: 'mentees', label: 'Assigned Mentees', icon: Users, badge: '8' },
      ],
    },
    admin: {
      portalTitle: 'Admin Control Center',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: ShieldAlert,
      color: 'blue',
      navItems: [
        { id: 'users', label: 'User Directory', icon: Users, badge: '12.4k' },
        { id: 'internships', label: 'Manage Internships', icon: Briefcase },
        { id: 'verifications', label: 'Verification Queue', icon: ShieldCheck, badge: '2' },
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      {/* LEFT SIDEBAR NAVBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-72 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 transform lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          
          {/* Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
                <Layers size={22} />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                    Intern<span className="text-blue-600 dark:text-blue-400">Flow</span>
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Role Portal Header Badge */}
          <div className="p-3">
            <div className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
            } rounded-2xl border transition-all ${
              currentRole.badgeClass
            } shadow-2xs`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <PortalIcon size={18} className="shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="font-extrabold text-xs truncate">{currentRole.portalTitle}</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Dashboard Modules
              </div>
            )}

            {currentRole.navItems.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setActiveTab && (!item.path || window.location.pathname.endsWith('/student') || window.location.pathname.endsWith('/dashboard'))) setActiveTab(item.id);
                    if (item.path && window.location.pathname !== item.path) {
                      navigate(item.path);
                    }
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-2xl text-xs font-bold transition-all cursor-pointer group relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon
                      size={18}
                      className={isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}
                    />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

          </nav>

          {/* Bottom Sidebar User Section */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer`}
              title="Toggle Dark/Light Mode"
            >
              <span className="flex items-center gap-2">
                {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
                {!isSidebarCollapsed && <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] text-slate-400 uppercase font-black">{darkMode ? 'ON' : 'OFF'}</span>
              )}
            </button>

            {/* User Profile Card */}
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
              } rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                  {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {activeUser?.name || 'Authenticated User'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate capitalize font-medium">{role} Account</p>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

          </div>

        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} min-w-0 transition-all duration-300`}>
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 cursor-pointer"
            >
              <Menu size={18} />
            </button>

            {/* Desktop Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 cursor-pointer transition-colors"
              title="Toggle Sidebar Width"
            >
              <Sliders size={16} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Dashboard</span>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentRole.portalTitle}</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Welcome back to your workspace
              </p>
            </div>
          </div>

          {/* Header Search & Tools */}
          <div className="flex items-center gap-3">

            {/* Global Search Input */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates, jobs, sessions..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                ⌘K
              </span>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer relative shadow-2xs"
                title="Notifications"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
              </button>

              {/* Notification Popover Drawer */}
              {showNotificationDrawer && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell size={14} className="text-blue-500" />
                      <span>Notifications</span>
                    </h4>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                      <p className="font-bold text-slate-900 dark:text-white">TechCorp Interview Invitation</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Frontend Intern position • Tomorrow 4:00 PM</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">Resume AI Score Updated</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Score increased to 92% based on your recent projects</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">Mentorship Call Scheduled</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">With Sarah Jenkins (Senior Frontend Architect)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </div>

          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto animate-in fade-in zoom-in-98 duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 bg-white/50 dark:bg-slate-950/50 mt-auto text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} InternFlow Platform. All rights reserved.</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Portal: <strong className="capitalize text-slate-700 dark:text-slate-300 font-bold">{role}</strong></span>
          </div>
        </footer>

      </div>
    </div>
  );
}

