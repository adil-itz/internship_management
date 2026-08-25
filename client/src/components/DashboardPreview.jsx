import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  Bell,
  Plus,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Database,
  Search,
  Sliders,
  Layers,
} from 'lucide-react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <section id="dashboard-preview" className="py-24 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles size={14} className="text-amber-400" />
            <span>Interactive Product Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            One Platform. 4 Specialized Dashboards.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-medium">
            Explore our role-tailored left-sidebar layout built with high-density metrics, candidate queues, and intuitive navigation.
          </p>
        </div>

        {/* Role View Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <GraduationCap size={18} />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'company'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <Building2 size={18} />
            <span>Employer Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'mentor'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <UserCheck size={18} />
            <span>Mentor Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Admin Control Center</span>
          </button>
        </div>

        {/* Dashboard Mock Browser Container */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
          
          {/* Mock Browser Header */}
          <div className="bg-slate-100 dark:bg-slate-900 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>

            <div className="bg-white dark:bg-slate-950 px-6 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              https://app.internflow.io/dashboard/{activeTab}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active Portal</span>
              </div>
            </div>
          </div>

          {/* Inner Dashboard Layout Shell (Left Sidebar + Content) */}
          <div className="flex min-h-[460px]">
            
            {/* Left Sidebar Mock */}
            <div className="w-56 bg-slate-50 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                    <Layers size={18} />
                  </div>
                  <span className="font-black text-sm text-slate-900 dark:text-white">InternFlow</span>
                </div>

                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center gap-2 border border-blue-200 dark:border-blue-800 capitalize">
                  {activeTab === 'student' && <GraduationCap size={16} />}
                  {activeTab === 'company' && <Building2 size={16} />}
                  {activeTab === 'mentor' && <UserCheck size={16} />}
                  {activeTab === 'admin' && <LayoutDashboard size={16} />}
                  <span>{activeTab} Portal</span>
                </div>

                <div className="space-y-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2">
                    <Briefcase size={15} /> Overview Module
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Sparkles size={15} /> Recommendations
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Clock size={15} /> Activity Log
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Connected Session
              </div>
            </div>

            {/* Content Area Mock */}
            <div className="flex-1 p-6 bg-slate-50/40 dark:bg-slate-900/40 overflow-hidden">
              {activeTab === 'student' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <h3 className="text-xl font-black">Student Career Command Center</h3>
                    <p className="text-xs text-blue-100 mt-1">4 Active Applications • 1 Scheduled Technical Interview</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Applications</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4 Active</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Scheduled Call</span>
                      <p className="text-2xl font-black text-amber-500 mt-1">Tomorrow</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Offers</span>
                      <p className="text-2xl font-black text-emerald-500 mt-1">1 Received</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
                    <h3 className="text-xl font-black">Employer Hiring Studio</h3>
                    <p className="text-xs text-blue-100 mt-1">105 Applicants Received across 3 Active Internship Posts</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Live Postings</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">3 Posts</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Applicants</span>
                      <p className="text-2xl font-black text-blue-500 mt-1">105 Candidates</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Unread Queue</span>
                      <p className="text-2xl font-black text-amber-500 mt-1">12 Pending</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mentor' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
                    <h3 className="text-xl font-black">Mentor Leadership Studio</h3>
                    <p className="text-xs text-blue-100 mt-1">8 Assigned Mentees • 4.9/5.0 Rated Instructor</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Mentees</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">8 Active</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Hours Logged</span>
                      <p className="text-2xl font-black text-blue-500 mt-1">42 Hours</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Rating</span>
                      <p className="text-2xl font-black text-amber-500 mt-1">4.9 ★</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
                    <h3 className="text-xl font-black">Institutional Governance Console</h3>
                    <p className="text-xs text-blue-100 mt-1">12,480 Platform Users • All Services Operational</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Total Accounts</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">12.4k</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Firms</span>
                      <p className="text-2xl font-black text-emerald-500 mt-1">520 Verified</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold">Verification Queue</span>
                      <p className="text-2xl font-black text-amber-500 mt-1">2 Pending</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

