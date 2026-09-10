import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from './common/PageTransition';
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
  BookOpen,
  MessageSquare,
  Clock,
  Calendar,
  BarChart3,
  CheckCheck
} from 'lucide-react';
import { getConversations } from '../services/chat.service';
import { getSocket } from '../services/socket';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notification.service';

export default function DashboardLayout({ children, user, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const sessionUserStr = sessionStorage.getItem('token') || localStorage.getItem('token');
  const sessionUserDetail = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserDetail && sessionUserDetail !== 'undefined' && sessionUserDetail !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserDetail);
    } catch (e) {}
  }

  const pathFirst = location.pathname.split('/')[1];
  const pathSecond = location.pathname.split('/')[2];
  const role =
    activeUser?.role ||
    (pathFirst === 'company' || pathSecond === 'company'
      ? 'company'
      : pathFirst === 'student' || pathSecond === 'student'
        ? 'student'
        : pathFirst === 'mentor' || pathSecond === 'mentor'
          ? 'mentor'
          : pathFirst === 'admin' || pathSecond === 'admin'
            ? 'admin'
            : 'student');

  useEffect(() => {
    if (!sessionUserStr) return;

    const fetchUserNotifications = async () => {
      try {
        const [notifRes, countRes] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount()
        ]);

        if (notifRes && notifRes.success) {
          setNotifications(notifRes.notifications || []);
        }
        if (countRes && countRes.success) {
          setUnreadNotifCount(countRes.unreadCount || 0);
        }
      } catch (e) {}
    };

    fetchUserNotifications();

    const intervalId = setInterval(fetchUserNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [sessionUserStr, showNotificationDrawer, location.pathname]);

  useEffect(() => {
    if (!activeUser) return;
    const fetchUnread = async () => {
      try {
        const res = await getConversations();
        if (res && res.success && res.conversations) {
          const total = res.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
          setUnreadCount(total);
        }
      } catch (e) {}
    };

    fetchUnread();

    const socket = getSocket();
    if (socket) {
      const handleNewMessage = () => fetchUnread();
      const handleMessagesRead = () => fetchUnread();
      
      const handleNewInternship = (data) => {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('New Internship Alert! 🚀', {
              body: `${data.companyName} just posted: ${data.title} (${data.location})`,
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('New Internship Alert! 🚀', {
                  body: `${data.companyName} just posted: ${data.title} (${data.location})`,
                });
              }
            });
          }
        }
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('newMessageNotification', handleNewMessage);
      socket.on('messagesRead', handleMessagesRead);
      socket.on('new_internship', handleNewInternship);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('newMessageNotification', handleNewMessage);
        socket.off('messagesRead', handleMessagesRead);
        socket.off('new_internship', handleNewInternship);
      };
    }
  }, [activeUser, location.pathname]);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await markNotificationAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadNotifCount((prev) => Math.max(0, prev - 1));
      }

      setShowNotificationDrawer(false);

      if (notif.link) {
        navigate(notif.link);
        return;
      }

      const entityType = notif.relatedEntityType || notif.type;
      const entityId = notif.relatedEntityId;

      if (entityType === 'NEW_INTERNSHIP' || entityType === 'Internship') {
        if (entityId) {
          navigate(`/student/internships/${entityId}`);
        } else {
          navigate('/student/internships');
        }
      } else if (entityType === 'MENTOR_ASSIGNED' || entityType === 'MentorAssignment') {
        navigate('/student/mentor');
      } else if (
        entityType === 'INTERVIEW_SCHEDULED' ||
        entityType === 'INTERVIEW_UPDATED' ||
        entityType === 'APPLICATION_STATUS' ||
        entityType === 'Application'
      ) {
        if (role === 'company') {
          navigate('/company/applications');
        } else if (role === 'admin') {
          navigate('/admin/applications');
        } else {
          navigate('/student/applications');
        }
      } else if (entityType === 'Certificate') {
        navigate('/student/certificates');
      } else if (entityType === 'Task') {
        navigate('/student/tasks');
      } else {
        navigate(`/dashboard/${role}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const roleConfigs = {
    student: {
      portalTitle: 'Student Portal',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: GraduationCap,
      color: 'blue',
      navItems: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/dashboard/student' },
        { id: 'profile', label: 'My Profile', icon: UserCheck, path: '/dashboard/student/profile' },
        { id: 'internships', label: 'Explore Internships', icon: Briefcase, path: '/student/internships' },
        { id: 'my-applications', label: 'My Applications', icon: FileCheck, path: '/student/applications' },
        { id: 'my-mentor', label: 'My Mentor', icon: UserCheck, path: '/student/mentor' },
        { id: 'my-tasks', label: 'My Tasks', icon: CheckCircle2, path: '/student/tasks' },
        { id: 'my-attendance', label: 'Attendance', icon: Calendar, path: '/student/attendance' },
        { id: 'my-worklogs', label: 'Work Logs', icon: Clock, path: '/student/worklogs' },
        { id: 'certificates', label: 'My Certificates', icon: Award, path: '/student/certificates' },
        { id: 'security', label: '2FA & Security', icon: ShieldCheck, path: '/settings/security' },
        { id: 'feedback', label: 'My Feedback', icon: Star, path: '/student/feedback' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/student/messages', badge: unreadCount > 0 ? unreadCount : null },
        {
          id: 'learning-hub',
          label: 'Learning Hub',
          isGroup: true,
          subItems: [
            { id: 'resources', label: 'Resource Exploration', icon: Video, path: '/student/resources' },
            { id: 'courses', label: 'Courses', icon: BookOpen, path: '/student/courses' },
          ],
        },
      ],
    },
    company: {
      portalTitle: 'Employer Portal',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Building2,
      color: 'blue',
      navItems: [
        { id: 'postings', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/dashboard/company' },
        { id: 'manage-internships', label: 'Manage Internships', icon: Briefcase, path: '/company/internships' },
        { id: 'create-internship', label: '+ Post Internship', icon: Sparkles, path: '/company/internships/create' },
        { id: 'company-applications', label: 'Applications', icon: Users, path: '/company/applications' },
        { id: 'company-attendance', label: 'Attendance', icon: Calendar, path: '/company/attendance' },
        { id: 'company-mentor-assignments', label: 'Mentor Assignments', icon: UserCheck, path: '/company/mentor-assignments' },
        { id: 'feedback', label: 'Intern Feedback', icon: Star, path: '/company/feedback' },
        { id: 'security', label: '2FA & Security', icon: ShieldCheck, path: '/settings/security' },
      ],
    },
    mentor: {
      portalTitle: 'Mentor Studio',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: UserCheck,
      color: 'blue',
      navItems: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/dashboard/mentor' },
        { id: 'assigned-interns', label: 'Assigned Students', icon: Users, path: '/mentor/interns' },
        { id: 'mentor-attendance', label: 'Attendance', icon: Calendar, path: '/mentor/attendance' },
        { id: 'mentor-worklogs', label: 'Work Logs', icon: Clock, path: '/mentor/worklogs' },
        { id: 'feedback', label: 'Student Feedback', icon: Star, path: '/mentor/feedback' },
        { id: 'security', label: '2FA & Security', icon: ShieldCheck, path: '/settings/security' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/mentor/messages', badge: unreadCount > 0 ? unreadCount : null },
        {
          id: 'learning-hub',
          label: 'Learning Hub',
          isGroup: true,
          subItems: [
            { id: 'resources', label: 'Resources', icon: Video, path: '/mentor/resources' },
            { id: 'courses', label: 'Courses', icon: BookOpen, path: '/mentor/courses' },
          ],
        },
      ],
    },
    admin: {
      portalTitle: 'Admin Control Center',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: ShieldAlert,
      color: 'blue',
      navItems: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
        { id: 'manage-internships', label: 'Manage All Internships', icon: Briefcase, path: '/admin/internships' },
        { id: 'admin-applications', label: 'Applications', icon: FileCheck, path: '/admin/applications' },
        { id: 'admin-mentor-assignments', label: 'Mentor Assignments', icon: UserCheck, path: '/admin/mentor-assignments' },
        { id: 'admin-tasks', label: 'Task Management', icon: CheckCircle2, path: '/admin/tasks' },
        { id: 'admin-attendance', label: 'Attendance', icon: Calendar, path: '/admin/attendance' },
        { id: 'admin-worklogs', label: 'Work Logs', icon: Clock, path: '/admin/worklogs' },
        { id: 'feedback', label: 'Feedback & Ratings', icon: Star, path: '/admin/feedback' },
        { id: 'security', label: '2FA & Security', icon: ShieldCheck, path: '/settings/security' },
        { id: 'messages', label: 'All Chats', icon: MessageSquare, path: '/admin/messages', badge: unreadCount > 0 ? unreadCount : null },
        {
          id: 'learning-hub',
          label: 'Learning Hub',
          isGroup: true,
          subItems: [
            { id: 'resources', label: 'Resources', icon: Video, path: '/admin/resources' },
            { id: 'courses', label: 'Courses', icon: BookOpen, path: '/admin/courses' },
          ],
        },
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

  const isMessagesPage = location.pathname.includes('/messages');

  return (
    <div className={`bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 ${isMessagesPage ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          } w-72 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 transform lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">

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

          <nav className="flex-1 px-3 py-2 space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Navigation Menu
              </div>
            )}

            {currentRole.navItems.map((item) => {
              if (item.isGroup) {
                return (
                  <div key={item.id} className="space-y-1 pt-2">
                    {!isSidebarCollapsed && (
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <BookOpen size={12} />
                        <span>{item.label}</span>
                      </div>
                    )}
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubSelected = location.pathname.startsWith(sub.path);
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            navigate(sub.path);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center py-2.5' : 'px-3.5 py-2'
                            } rounded-2xl text-xs font-bold transition-all cursor-pointer ${isSubSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          title={sub.label}
                        >
                          <div className="flex items-center gap-3">
                            <SubIcon size={16} className={isSubSelected ? 'text-white' : 'text-slate-400'} />
                            {!isSidebarCollapsed && <span>{sub.label}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              }

              const ItemIcon = item.icon;
              const isSelected = activeTab === item.id || (item.path && location.pathname === item.path);
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
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'
                    } rounded-2xl text-xs font-bold transition-all cursor-pointer group relative ${isSelected
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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSelected
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

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                } rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs`}
              title="Toggle Dark/Light Mode"
            >
              <span className="flex items-center gap-2">
                <motion.div
                  key={darkMode ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
                </motion.div>
                {!isSidebarCollapsed && <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] text-slate-400 uppercase font-black">{darkMode ? 'ON' : 'OFF'}</span>
              )}
            </motion.button>

            <div
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
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

      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} min-w-0 transition-all duration-300 ${isMessagesPage ? 'h-full min-h-0 overflow-hidden' : ''}`}>

        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 h-16 px-4 sm:px-8 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 cursor-pointer"
            >
              <Menu size={18} />
            </button>

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
                  <span>Workspace Overview</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Welcome back to your workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

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

            <div className="relative">
              <button
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer relative shadow-2xs"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadNotifCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
                  </>
                )}
              </button>

              {showNotificationDrawer && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell size={14} className="text-blue-500" />
                      <span>Notifications</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      {unreadNotifCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck size={12} />
                          <span>Mark all read</span>
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        {unreadNotifCount} New
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs max-h-80 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs font-bold">
                        No notifications found.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            !n.isRead
                              ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/60'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </div>

          </div>
        </header>

        {isMessagesPage ? (
          <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto overflow-hidden flex flex-col min-h-0">
            <PageTransition key={location.pathname}>
              {children}
            </PageTransition>
          </main>
        ) : (
          <>
            <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname + (activeTab || '')}>
                  {children}
                </PageTransition>
              </AnimatePresence>
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 bg-white/50 dark:bg-slate-950/50 mt-auto text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>© {new Date().getFullYear()} InternFlow Platform. All rights reserved.</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span>Portal: <strong className="capitalize text-slate-700 dark:text-slate-300 font-bold">{role}</strong></span>
              </div>
            </footer>
          </>
        )}

      </div>
    </div>
  );
}
