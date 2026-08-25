import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Activity,
  Database,
  Lock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  X,
  Check,
  MoreVertical,
  ShieldCheck,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  Layers,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import DeleteInternshipModal from '../../components/internship/DeleteInternshipModal';
import InternshipForm from '../../components/internship/InternshipForm';
import {
  getAllInternshipsAdmin,
  updateInternship,
  deleteInternship,
} from '../../services/internship.service';

export default function AdminDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('users');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [newRoleForUser, setNewRoleForUser] = useState('student');

  // Sample Users Database Data
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: 'John Candidate',
      email: 'john@student.edu',
      role: 'student',
      status: 'Active',
      joined: '2026-08-01',
    },
    {
      id: 2,
      name: 'TechCorp Recruiter',
      email: 'hr@techcorp.com',
      role: 'company',
      status: 'Verified',
      joined: '2026-07-15',
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      email: 'sarah@mentors.io',
      role: 'mentor',
      status: 'Verified',
      joined: '2026-06-20',
    },
    {
      id: 4,
      name: 'System SuperAdmin',
      email: 'admin@internflow.com',
      role: 'admin',
      status: 'Active',
      joined: '2026-01-01',
    },
    {
      id: 5,
      name: 'Pending StartUp Inc',
      email: 'founders@startup.co',
      role: 'company',
      status: 'Pending Verification',
      joined: '2026-08-23',
    },
  ]);

  const [verifications, setVerifications] = useState([
    {
      id: 301,
      name: 'Innovate AI Labs',
      type: 'Company Verification',
      submittedDate: '2026-08-23',
      documents: 'Business Registration & Tax ID',
      status: 'Pending',
    },
    {
      id: 302,
      name: 'Dr. Robert Vance',
      type: 'Mentor Verification',
      submittedDate: '2026-08-22',
      documents: 'LinkedIn & Ex-Google Staff Engineer Badge',
      status: 'Pending',
    },
  ]);

  // Admin Manage Internships State
  const [internshipsList, setInternshipsList] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [internshipError, setInternshipError] = useState(null);
  const [internshipStatusFilter, setInternshipStatusFilter] = useState('all');
  const [internshipSearchQuery, setInternshipSearchQuery] = useState('');

  // Internship Action Modals
  const [selectedInternshipToEdit, setSelectedInternshipToEdit] = useState(null);
  const [selectedInternshipToView, setSelectedInternshipToView] = useState(null);
  const [deleteInternshipModalOpen, setDeleteInternshipModalOpen] = useState(false);
  const [selectedDeleteInternship, setSelectedDeleteInternship] = useState(null);
  const [isDeletingInternship, setIsDeletingInternship] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAdminInternships = async () => {
    setLoadingInternships(true);
    setInternshipError(null);
    try {
      const res = await getAllInternshipsAdmin();
      if (res && res.success) {
        setInternshipsList(res.internships || []);
      } else {
        setInternshipsList([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin internships:', err);
      setInternshipError(err.message || 'Failed to load internships');
    } finally {
      setLoadingInternships(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'internships') {
      fetchAdminInternships();
    }
  }, [activeTab]);

  const handleStatusChange = (id, newStatus) => {
    setUsersList(
      usersList.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleApproveVerification = (id) => {
    setVerifications(
      verifications.map((v) => (v.id === id ? { ...v, status: 'Approved' } : v))
    );
  };

  const handleRejectVerification = (id) => {
    setVerifications(
      verifications.map((v) => (v.id === id ? { ...v, status: 'Rejected' } : v))
    );
  };

  const handleSaveUserRole = (e) => {
    e.preventDefault();
    if (!selectedUserToEdit) return;

    setUsersList(
      usersList.map((u) => (u.id === selectedUserToEdit.id ? { ...u, role: newRoleForUser } : u))
    );
    setSelectedUserToEdit(null);
  };

  // Quick Status Toggle for Admin
  const handleQuickStatusChange = async (internshipId, newStatus) => {
    try {
      const res = await updateInternship(internshipId, { status: newStatus });
      if (res && res.success) {
        setInternshipsList((prev) =>
          prev.map((item) => (item._id === internshipId ? { ...item, status: newStatus } : item))
        );
        showToast(`Internship status changed to "${newStatus}".`);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Submit Internship Edit by Admin
  const handleSaveInternshipEdit = async (formData) => {
    if (!selectedInternshipToEdit) return;
    setIsSubmittingEdit(true);
    try {
      const res = await updateInternship(selectedInternshipToEdit._id, formData);
      if (res && res.success) {
        setInternshipsList((prev) =>
          prev.map((item) => (item._id === selectedInternshipToEdit._id ? res.internship : item))
        );
        showToast('Internship updated successfully by Admin.');
        setSelectedInternshipToEdit(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update internship');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Delete Internship Confirmation by Admin
  const handleConfirmDeleteInternship = async () => {
    if (!selectedDeleteInternship) return;
    setIsDeletingInternship(true);
    try {
      await deleteInternship(selectedDeleteInternship._id);
      setInternshipsList((prev) => prev.filter((item) => item._id !== selectedDeleteInternship._id));
      showToast('Internship deleted successfully by Admin.');
      setDeleteInternshipModalOpen(false);
      setSelectedDeleteInternship(null);
    } catch (err) {
      alert(err.message || 'Failed to delete internship');
    } finally {
      setIsDeletingInternship(false);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Filtered Internships
  const filteredInternships = internshipsList.filter((item) => {
    if (internshipStatusFilter !== 'all' && item.status !== internshipStatusFilter) {
      return false;
    }
    if (internshipSearchQuery) {
      const q = internshipSearchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDomain = item.domain?.toLowerCase().includes(q);
      const matchLocation = item.location?.toLowerCase().includes(q);
      const matchCompany = item.company?.name?.toLowerCase().includes(q) || item.company?.email?.toLowerCase().includes(q);
      if (!matchTitle && !matchDomain && !matchLocation && !matchCompany) return false;
    }
    return true;
  });

  const totalInternshipsCount = internshipsList.length;
  const publishedInternshipsCount = internshipsList.filter((i) => i.status === 'published').length;
  const draftInternshipsCount = internshipsList.filter((i) => i.status === 'draft').length;
  const closedInternshipsCount = internshipsList.filter((i) => i.status === 'closed').length;

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>Administrator Governance System</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome, Administrator {user?.name || 'Admin'} 🛡️
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Monitor system performance, manage user directories, oversee verification applications, and govern platform internship listings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1 shrink-0 md:w-64">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-300" />
                  <span>Platform Health</span>
                </span>
                <span className="text-emerald-300 font-black text-xs">99.99% Operational</span>
              </div>
              <p className="text-[10px] text-blue-100">All governance services running smoothly</p>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Users</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">12,480</span>
              <span className="text-xs font-bold text-emerald-500">+140 this week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Students, Companies, Mentors</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Manage Internships</span>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{totalInternshipsCount}</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {publishedInternshipsCount} active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Platform-wide postings</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Verifications</span>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">2</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Pending approval
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Organization credentials</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">System Status</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-500">Healthy</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Governance active</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'users', label: 'User Directory Management' },
              { id: 'internships', label: 'Manage All Internships' },
              { id: 'verifications', label: 'Verification Queue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: User Directory */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search and Role Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email address..."
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={14} className="text-slate-400 shrink-0" />
                {['all', 'student', 'company', 'mentor', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl capitalize shrink-0 cursor-pointer transition-all ${
                      roleFilter === role
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-5">User Details</th>
                      <th className="py-4 px-5">Database Role</th>
                      <th className="py-4 px-5">Joined Date</th>
                      <th className="py-4 px-5">Account Status</th>
                      <th className="py-4 px-5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{u.name}</div>
                          <div className="text-slate-400 text-[11px] font-semibold">{u.email}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-500 font-medium">{u.joined}</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                              u.status === 'Active' || u.status === 'Verified'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                : u.status === 'Suspended'
                                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-200 dark:border-rose-800'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUserToEdit(u);
                              setNewRoleForUser(u.role);
                            }}
                            className="px-3 py-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 rounded-xl transition-all cursor-pointer"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => handleStatusChange(u.id, u.status === 'Suspended' ? 'Active' : 'Suspended')}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                              u.status === 'Suspended'
                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                            }`}
                          >
                            {u.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage All Internships (ADMIN GOVERNANCE) */}
        {activeTab === 'internships' && (
          <div className="space-y-6">

            {/* Sub-Metrics for Internships */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Listings</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalInternshipsCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Published</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{publishedInternshipsCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Drafts</span>
                <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{draftInternshipsCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Closed</span>
                <p className="text-xl sm:text-2xl font-black text-slate-500 mt-0.5">{closedInternshipsCount}</p>
              </div>
            </div>

            {/* Search and Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={internshipSearchQuery}
                  onChange={(e) => setInternshipSearchQuery(e.target.value)}
                  placeholder="Search by title, company, domain, or location..."
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={14} className="text-slate-400 shrink-0" />
                {['all', 'published', 'draft', 'closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInternshipStatusFilter(st)}
                    className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl capitalize shrink-0 cursor-pointer transition-all ${
                      internshipStatusFilter === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
                <button
                  onClick={fetchAdminInternships}
                  className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer ml-1"
                  title="Refresh Internships"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {internshipError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{internshipError}</span>
                </div>
                <button
                  onClick={fetchAdminInternships}
                  className="px-3 py-1 bg-rose-100 dark:bg-rose-900 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {/* Internships Management Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
              {loadingInternships ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-400">Loading platform internships...</p>
                </div>
              ) : filteredInternships.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-5">Internship & Domain</th>
                        <th className="py-4 px-5">Employer / Company</th>
                        <th className="py-4 px-5">Location & Mode</th>
                        <th className="py-4 px-5">Stipend & Openings</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Admin Control Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {filteredInternships.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                          
                          {/* Title & Domain */}
                          <td className="py-4 px-5">
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {item.title}
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-[11px] font-semibold flex items-center gap-1.5 mt-0.5">
                              <Briefcase size={12} />
                              <span>{item.domain}</span>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-slate-400 font-normal">{item.duration}</span>
                            </div>
                          </td>

                          {/* Company info */}
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Building2 size={13} className="text-slate-400 shrink-0" />
                              <span>{item.company?.name || 'Unknown Company'}</span>
                            </div>
                            <div className="text-slate-400 text-[11px] font-medium pl-4">
                              {item.company?.email || 'N/A'}
                            </div>
                          </td>

                          {/* Location & Mode */}
                          <td className="py-4 px-5">
                            <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <MapPin size={13} className="text-slate-400 shrink-0" />
                              <span>{item.location}</span>
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {item.workMode}
                            </span>
                          </td>

                          {/* Stipend & Openings */}
                          <td className="py-4 px-5">
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {item.internshipType === 'Unpaid' || item.stipend === 0
                                ? 'Unpaid'
                                : `₹${item.stipend?.toLocaleString()} / ${item.stipendType || 'mo'}`}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {item.openings} {item.openings === 1 ? 'opening' : 'openings'}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5">
                            <select
                              value={item.status || 'published'}
                              onChange={(e) => handleQuickStatusChange(item._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer focus:outline-none transition-all ${
                                item.status === 'published'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                  : item.status === 'draft'
                                  ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 border-amber-200 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>

                          {/* Admin Control Actions */}
                          <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                            
                            {/* View Details */}
                            <button
                              onClick={() => setSelectedInternshipToView(item)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit Details */}
                            <button
                              onClick={() => setSelectedInternshipToEdit(item)}
                              className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-xl transition-all cursor-pointer"
                              title="Edit Internship"
                            >
                              <Edit size={16} />
                            </button>

                            {/* Delete Internship */}
                            <button
                              onClick={() => {
                                setSelectedDeleteInternship(item);
                                setDeleteInternshipModalOpen(true);
                              }}
                              className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                              title="Delete Internship"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty state */
                <div className="p-12 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Briefcase size={28} />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">No internships found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {internshipSearchQuery || internshipStatusFilter !== 'all'
                      ? 'Try updating your search query or filters.'
                      : 'No internships have been created by partner companies yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Verifications Queue */}
        {activeTab === 'verifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {verifications.map((v) => (
              <div
                key={v.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{v.name}</h4>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800">
                    {v.type}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="font-semibold text-slate-500">Submitted Verification Documents:</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{v.documents}</p>
                  <p className="text-[11px] text-slate-400">Date: {v.submittedDate}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {v.status === 'Approved' ? (
                    <span className="w-full py-2 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center gap-1.5">
                      <Check size={16} /> Approved & Verified
                    </span>
                  ) : v.status === 'Rejected' ? (
                    <span className="w-full py-2 text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950 rounded-2xl flex items-center justify-center gap-1.5">
                      <XCircle size={16} /> Verification Rejected
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproveVerification(v.id)}
                        className="flex-1 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check size={16} /> Approve & Verify
                      </button>
                      <button
                        onClick={() => handleRejectVerification(v.id)}
                        className="py-2 px-4 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-2xl transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Edit User Role */}
        {selectedUserToEdit && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Modify User Role</h3>
                  <p className="text-xs text-slate-400">{selectedUserToEdit.name} ({selectedUserToEdit.email})</p>
                </div>
                <button
                  onClick={() => setSelectedUserToEdit(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveUserRole} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Select New System Role</label>
                  <select
                    value={newRoleForUser}
                    onChange={(e) => setNewRoleForUser(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-extrabold"
                  >
                    <option value="student">Student Candidate</option>
                    <option value="company">Employer Partner</option>
                    <option value="mentor">Industry Mentor</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserToEdit(null)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Admin Edit Internship Details */}
        {selectedInternshipToEdit && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    <ShieldAlert size={16} />
                    <span>Admin Governance Edit</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Edit Internship: {selectedInternshipToEdit.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Company: {selectedInternshipToEdit.company?.name || 'N/A'} ({selectedInternshipToEdit.company?.email || 'N/A'})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInternshipToEdit(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <InternshipForm
                initialData={selectedInternshipToEdit}
                onSubmit={handleSaveInternshipEdit}
                isSubmitting={isSubmittingEdit}
                mode="edit"
              />
            </div>
          </div>
        )}

        {/* Modal: View Internship Details */}
        {selectedInternshipToView && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {selectedInternshipToView.domain}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedInternshipToView.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" />
                    <span>{selectedInternshipToView.company?.name}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>{selectedInternshipToView.company?.email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInternshipToView(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Work Mode</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedInternshipToView.workMode}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedInternshipToView.location}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Duration</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedInternshipToView.duration}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Stipend</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedInternshipToView.internshipType === 'Unpaid' || !selectedInternshipToView.stipend
                      ? 'Unpaid'
                      : `₹${selectedInternshipToView.stipend} / ${selectedInternshipToView.stipendType}`}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Openings</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedInternshipToView.openings}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                  <p className="font-extrabold capitalize text-slate-900 dark:text-white mt-0.5">{selectedInternshipToView.status}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-extrabold text-slate-900 dark:text-white">Description</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedInternshipToView.description}
                </p>
              </div>

              {/* Skills */}
              {selectedInternshipToView.skills?.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInternshipToView.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedInternshipToEdit(selectedInternshipToView);
                    setSelectedInternshipToView(null);
                  }}
                  className="px-4 py-2 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl cursor-pointer hover:bg-amber-100"
                >
                  Edit Internship
                </button>
                <button
                  onClick={() => setSelectedInternshipToView(null)}
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Delete Internship Confirmation */}
        <DeleteInternshipModal
          isOpen={deleteInternshipModalOpen}
          onClose={() => setDeleteInternshipModalOpen(false)}
          onConfirm={handleConfirmDeleteInternship}
          internshipTitle={selectedDeleteInternship?.title || ''}
          isDeleting={isDeletingInternship}
        />

      </div>
    </DashboardLayout>
  );
}
