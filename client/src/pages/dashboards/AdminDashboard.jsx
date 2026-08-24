import React, { useState } from 'react';
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
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('users');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const verifications = [
    {
      id: 301,
      name: 'Innovate AI Labs',
      type: 'Company Verification',
      submittedDate: '2026-08-23',
      documents: 'Business Registration & Tax ID',
    },
    {
      id: 302,
      name: 'Dr. Robert Vance',
      type: 'Mentor Verification',
      submittedDate: '2026-08-22',
      documents: 'LinkedIn & Ex-Google Staff Engineer Badge',
    },
  ];

  const handleStatusChange = (id, newStatus) => {
    setUsersList(
      usersList.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 p-6 sm:p-8 text-white shadow-xl shadow-amber-600/15">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles size={14} className="text-amber-200" />
              <span>Administrator Governance System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, Administrator {user?.name || 'Admin'} 🛡️
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              Monitor total system health, manage registered users across all 4 roles, and review organization verification applications.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">12,480</span>
              <span className="text-xs font-bold text-emerald-500">+140 this week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Students, Companies, Mentors</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Companies</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Building2 size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">520</span>
              <span className="text-xs font-bold text-amber-500">2 pending review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Verified partner firms</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mentors</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <UserCheck size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">180</span>
              <span className="text-xs font-bold text-purple-500">Active Mentors</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">100% credential verified</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Status</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Database size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500">Healthy</span>
              <span className="text-xs font-bold text-slate-400">MongoDB Connected</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">99.99% system uptime</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'users', label: 'User Directory Management' },
              { id: 'verifications', label: 'Verification Queue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={14} className="text-slate-400 shrink-0" />
                {['all', 'student', 'company', 'mentor', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg capitalize shrink-0 cursor-pointer ${
                      roleFilter === role
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">User Details</th>
                      <th className="py-3.5 px-4">Database Role</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-slate-400 text-[11px]">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{u.joined}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              u.status === 'Active' || u.status === 'Verified'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleStatusChange(u.id, 'Verified')}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleStatusChange(u.id, 'Suspended')}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            Suspend
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

        {/* Tab 2: Verifications Queue */}
        {activeTab === 'verifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifications.map((v) => (
              <div key={v.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600">
                    {v.type}
                  </span>
                </div>

                <p className="text-xs text-slate-500">Submitted Docs: <span className="font-semibold text-slate-800 dark:text-slate-200">{v.documents}</span></p>
                <p className="text-[11px] text-slate-400">Date: {v.submittedDate}</p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button className="flex-1 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer">
                    Approve & Verify
                  </button>
                  <button className="py-1.5 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 rounded-xl cursor-pointer">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
