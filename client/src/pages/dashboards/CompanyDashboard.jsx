import React, { useState } from 'react';
import {
  Building2,
  Users,
  PlusCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  UserCheck,
  MoreVertical,
  ChevronRight,
  Send,
  X,
  Award,
  Zap,
  Check,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function CompanyDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('postings');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobStipend, setJobStipend] = useState('');

  // Sample Company Data
  const [postings, setPostings] = useState([
    {
      id: 1,
      title: 'Fullstack Software Engineer Intern',
      department: 'Engineering',
      location: 'Remote',
      applicantsCount: 34,
      status: 'Active',
      postedDate: '2026-08-10',
      stipend: '$1,500 / mo',
    },
    {
      id: 2,
      title: 'UI/UX Product Design Intern',
      department: 'Design',
      location: 'Hybrid (SF)',
      applicantsCount: 19,
      status: 'Active',
      postedDate: '2026-08-14',
      stipend: '$1,400 / mo',
    },
    {
      id: 3,
      title: 'Data Analyst & Machine Learning Trainee',
      department: 'Data Science',
      location: 'Remote',
      applicantsCount: 52,
      status: 'Closed',
      postedDate: '2026-07-20',
      stipend: '$1,800 / mo',
    },
  ]);

  const [applicants, setApplicants] = useState([
    {
      id: 501,
      candidateName: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      roleApplied: 'Fullstack Software Engineer Intern',
      gpa: '3.9 / 4.0',
      experience: '2 projects in React & Node',
      appliedDate: '2026-08-20',
      status: 'Pending',
      university: 'Stanford University',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    },
    {
      id: 502,
      candidateName: 'Jessica Lin',
      email: 'jessica.lin@mit.edu',
      roleApplied: 'UI/UX Product Design Intern',
      gpa: '3.8 / 4.0',
      experience: 'Figma prototype portfolio',
      appliedDate: '2026-08-19',
      status: 'Shortlisted',
      university: 'MIT',
      skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    },
    {
      id: 503,
      candidateName: 'Marcus Vance',
      email: 'marcus.vance@stanford.edu',
      roleApplied: 'Fullstack Software Engineer Intern',
      gpa: '3.7 / 4.0',
      experience: 'Hackathon winner',
      appliedDate: '2026-08-18',
      status: 'Interviewed',
      university: 'UC Berkeley',
      skills: ['Python', 'PostgreSQL', 'Docker', 'React'],
    },
  ]);

  const handleCreatePosting = (e) => {
    e.preventDefault();
    if (!jobTitle || !jobLocation || !jobStipend) return;

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      department: 'Engineering',
      location: jobLocation,
      applicantsCount: 0,
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0],
      stipend: jobStipend,
    };

    setPostings([newJob, ...postings]);
    setJobTitle('');
    setJobLocation('');
    setJobStipend('');
    setShowCreateModal(false);
  };

  const handleUpdateApplicantStatus = (id, newStatus) => {
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>Employer Hiring Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome, {user?.name || 'Partner Company'}! 🏢
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Publish tech internships, review candidate portfolios, and build your company's next generation engineering talent pipeline.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 text-xs font-extrabold text-slate-900 bg-white hover:bg-blue-50 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 group hover:scale-105"
            >
              <PlusCircle size={18} className="text-blue-600 group-hover:rotate-90 transition-transform" />
              <span>Post New Internship</span>
            </button>
          </div>

          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Postings</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {postings.filter((p) => p.status === 'Active').length}
              </span>
              <span className="text-xs font-extrabold text-blue-500 flex items-center gap-0.5 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Accepting candidate resumes</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Applicants</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">105</span>
              <span className="text-xs font-bold text-blue-500">+18 today</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Across {postings.length} internship listings</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Pending Reviews</span>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Clock size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">12</span>
              <span className="text-xs font-bold text-amber-500">Unread</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Requires recruiter action</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Offers Extended</span>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Award size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">4</span>
              <span className="text-xs font-bold text-emerald-500">80% Acceptance</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Top tier intern conversion</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'postings', label: 'Internship Listings' },
              { id: 'applicants', label: 'Applicant Queue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all cursor-pointer ${
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

        {/* Tab 1: Postings Table */}
        {activeTab === 'postings' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={16} className="text-emerald-500" />
                <span>Active & Past Job Listings</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">{postings.length} total listings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Job Title</th>
                    <th className="py-4 px-5">Location</th>
                    <th className="py-4 px-5">Stipend</th>
                    <th className="py-4 px-5">Posted Date</th>
                    <th className="py-4 px-5">Applicants</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {postings.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white text-sm">{p.title}</td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-semibold">{p.location}</td>
                      <td className="py-4 px-5 font-black text-slate-900 dark:text-white">{p.stipend}</td>
                      <td className="py-4 px-5 text-slate-500 font-medium">{p.postedDate}</td>
                      <td className="py-4 px-5 font-black text-emerald-600 dark:text-emerald-400">
                        {p.applicantsCount} candidates
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                            p.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => setActiveTab('applicants')}
                          className="px-3 py-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                        >
                          Review Queue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Applicants Queue */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {applicants.map((a) => (
                <div
                  key={a.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{a.candidateName}</h4>
                        <p className="text-[11px] font-semibold text-slate-400">{a.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {a.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <p className="font-semibold text-slate-600 dark:text-slate-400">
                        Applied for: <span className="text-slate-900 dark:text-white font-extrabold">{a.roleApplied}</span>
                      </p>
                      <p className="text-slate-500">
                        GPA: <span className="font-extrabold text-slate-800 dark:text-slate-200">{a.gpa}</span> ({a.university})
                      </p>
                      <p className="text-slate-500">
                        Highlights: <span className="text-slate-800 dark:text-slate-200 font-medium">{a.experience}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {a.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleUpdateApplicantStatus(a.id, 'Shortlisted')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        a.status === 'Shortlisted'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100'
                      }`}
                    >
                      <Check size={14} /> Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateApplicantStatus(a.id, 'Interviewed')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        a.status === 'Interviewed'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100'
                      }`}
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => handleUpdateApplicantStatus(a.id, 'Rejected')}
                      className="py-2 px-3 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                      title="Reject Candidate"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Post New Internship */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle size={18} className="text-emerald-500" />
                  <span>Publish New Internship</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePosting} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1 text-[10px]">Internship Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer Intern"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1 text-[10px]">Location & Working Model</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Remote / San Francisco, CA"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1 text-[10px]">Monthly Stipend</label>
                  <input
                    type="text"
                    required
                    value={jobStipend}
                    onChange={(e) => setJobStipend(e.target.value)}
                    placeholder="e.g. $1,500 / mo"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div className="pt-3 flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Publish Listing</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

