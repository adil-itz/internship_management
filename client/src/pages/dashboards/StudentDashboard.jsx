import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Search,
  Filter,
  FileText,
  Building,
  GraduationCap,
  Star,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('applications');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Student Data
  const applications = [
    {
      id: 1,
      role: 'Frontend Developer Intern',
      company: 'TechCorp Solutions',
      location: 'Remote',
      appliedDate: '2026-08-18',
      status: 'Interview Scheduled',
      statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      stipend: '$1,200 / mo',
    },
    {
      id: 2,
      role: 'Full Stack Engineer Intern',
      company: 'Innovate Labs',
      location: 'San Francisco, CA',
      appliedDate: '2026-08-15',
      status: 'Under Review',
      statusColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      stipend: '$1,500 / mo',
    },
    {
      id: 3,
      role: 'UI/UX Design Intern',
      company: 'CreativePulse Studios',
      location: 'Hybrid',
      appliedDate: '2026-08-10',
      status: 'Offer Extended',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      stipend: '$1,800 / mo',
    },
    {
      id: 4,
      role: 'Data Science Trainee',
      company: 'DataMetrics Inc',
      location: 'Remote',
      appliedDate: '2026-08-01',
      status: 'Rejected',
      statusColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      stipend: '$1,100 / mo',
    },
  ];

  const recommendedJobs = [
    {
      id: 101,
      title: 'React & Node.js Developer Intern',
      company: 'NextGen Systems',
      type: 'Full-time Intern',
      stipend: '$1,600 / mo',
      tags: ['React', 'Node.js', 'MongoDB'],
      posted: '2 days ago',
    },
    {
      id: 102,
      title: 'AI / ML Junior Research Intern',
      company: 'Neural Mind AI',
      type: 'Part-time Intern',
      stipend: '$2,000 / mo',
      tags: ['Python', 'PyTorch', 'FastAPI'],
      posted: '1 day ago',
    },
    {
      id: 103,
      title: 'Product Management Fellow',
      company: 'Apex Digital Venture',
      type: 'Remote Intern',
      stipend: '$1,400 / mo',
      tags: ['Agile', 'Figma', 'Analytics'],
      posted: '3 days ago',
    },
  ];

  const upcomingMentorships = [
    {
      id: 201,
      mentor: 'Sarah Jenkins',
      title: 'Senior Frontend Architect @ Google',
      topic: 'Technical Interview Prep & Resume Review',
      time: 'Tomorrow at 4:00 PM EST',
      status: 'Confirmed',
    },
    {
      id: 202,
      mentor: 'David Chen',
      title: 'VP of Engineering @ Stripe',
      topic: 'Building Scalable Fullstack Systems',
      time: 'Friday, Aug 28 at 2:00 PM EST',
      status: 'Scheduled',
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesFilter =
      filterStatus === 'all' || app.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesSearch =
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              <span>Student Career Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student Candidate'}! 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Track your internship applications, connect with tech leaders for 1-on-1 mentorship, and discover AI-tailored career opportunities.
            </p>
          </div>

          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Briefcase size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">4</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp size={12} /> +2 this week
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">2 actively under review</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviews</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Calendar size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">1</span>
              <span className="text-xs font-bold text-amber-500">Scheduled</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">TechCorp Solutions (Tomorrow)</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mentorship</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">2</span>
              <span className="text-xs font-bold text-purple-500">Calls Booked</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Next with Sarah Jenkins</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Offers</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Award size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">1</span>
              <span className="text-xs font-bold text-emerald-500">Received 🎉</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">CreativePulse Studios</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'applications', label: 'My Applications' },
              { id: 'recommended', label: 'Recommended Internships' },
              { id: 'mentorship', label: 'Mentorship Sessions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link to="/dashboard/student/profile" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition-all cursor-pointer">
            <Sparkles size={14} />
            <span>Update Resume</span>
          </Link>
        </div>

        {/* Tab Content: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by role or company..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={14} className="text-slate-400 shrink-0" />
                {['all', 'review', 'interview', 'offer', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg capitalize shrink-0 cursor-pointer ${
                      filterStatus === status
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Role & Company</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Stipend</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{app.role}</div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Building size={12} /> {app.company}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" /> {app.location}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{app.stipend}</td>
                        <td className="py-3.5 px-4 text-slate-500">{app.appliedDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${app.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer">
                            Details
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

        {/* Tab Content: Recommended Internships */}
        {activeTab === 'recommended' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {job.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{job.posted}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2.5">{job.title}</h3>
                  <p className="text-xs text-slate-400">{job.company}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">{job.stipend}</span>
                  <button className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1">
                    <span>Apply Now</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Mentorship */}
        {activeTab === 'mentorship' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMentorships.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {m.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={13} /> {m.time}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{m.topic}</h4>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        {m.mentor.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{m.mentor}</p>
                        <p className="text-[11px] text-slate-400">{m.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button className="px-3 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 rounded-xl hover:bg-purple-100 transition-all cursor-pointer">
                      View Agenda
                    </button>
                    <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5">
                      <span>Join Meeting</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
