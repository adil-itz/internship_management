import React, { useState } from 'react';
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
  X,
  Send,
  Target,
  Zap,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('applications');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Sample Applications Data
  const [applications, setApplications] = useState([
    {
      id: 1,
      role: 'Frontend Developer Intern',
      company: 'TechCorp Solutions',
      location: 'Remote',
      appliedDate: '2026-08-18',
      status: 'Interview Scheduled',
      statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      stipend: '$1,200 / mo',
      notes: 'Technical Interview round scheduled for tomorrow at 4:00 PM via Google Meet.',
      recruiter: 'Sarah Miller (Lead Recruiter)',
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
      notes: 'Resume and GitHub profile forwarded to Senior Engineering Manager.',
      recruiter: 'Alex Chen (Talent Lead)',
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
      notes: 'Official offer letter issued! Deadline to respond is Friday, Aug 28.',
      recruiter: 'Jessica Taylor (Design Director)',
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
      notes: 'Position filled internally. Invited to apply for Next Term AI cohort.',
      recruiter: 'HR Ops Team',
    },
  ]);

  const recommendedJobs = [
    {
      id: 101,
      title: 'React & Node.js Developer Intern',
      company: 'NextGen Systems',
      type: 'Full-time Intern',
      stipend: '$1,600 / mo',
      tags: ['React', 'Node.js', 'MongoDB'],
      posted: '2 days ago',
      matchScore: '98%',
      description: 'Join our core platform engineering team to build scalable microservices and high-performance React component libraries.',
    },
    {
      id: 102,
      title: 'AI / ML Junior Research Intern',
      company: 'Neural Mind AI',
      type: 'Part-time Intern',
      stipend: '$2,000 / mo',
      tags: ['Python', 'PyTorch', 'FastAPI'],
      posted: '1 day ago',
      matchScore: '94%',
      description: 'Help benchmark LLM fine-tuning pipelines and write API wrappers for multimodal generative models.',
    },
    {
      id: 103,
      title: 'Product Management Fellow',
      company: 'Apex Digital Venture',
      type: 'Remote Intern',
      stipend: '$1,400 / mo',
      tags: ['Agile', 'Figma', 'Analytics'],
      posted: '3 days ago',
      matchScore: '89%',
      description: 'Collaborate directly with VP of Product to conduct user research interviews and draft PRDs.',
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
      agenda: [
        'Review React performance optimization project',
        'Mock algorithmic whiteboarding question',
        'Q&A on landing Big Tech internships',
      ],
    },
    {
      id: 202,
      mentor: 'David Chen',
      title: 'VP of Engineering @ Stripe',
      topic: 'Building Scalable Fullstack Systems',
      time: 'Friday, Aug 28 at 2:00 PM EST',
      status: 'Scheduled',
      agenda: [
        'PostgreSQL database indexing strategies',
        'Building resilient REST & GraphQL APIs',
        'Career progression roadmap',
      ],
    },
  ];

  const handleApplyToJob = (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;

    const newApp = {
      id: Date.now(),
      role: selectedJobToApply.title,
      company: selectedJobToApply.company,
      location: selectedJobToApply.type,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      statusColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      stipend: selectedJobToApply.stipend,
      notes: coverLetter ? `Cover Letter Submitted: "${coverLetter.slice(0, 60)}..."` : 'Application submitted successfully.',
      recruiter: 'Recruitment Team',
    };

    setApplications([newApp, ...applications]);
    setAppliedJobIds([...appliedJobIds, selectedJobToApply.id]);
    setSelectedJobToApply(null);
    setCoverLetter('');
  };

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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>Student Career Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome back, {user?.name || 'Student Candidate'}! 👋
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Track your applications in real-time, connect with industry leaders for 1-on-1 mentorship, and discover AI-matched internship positions.
              </p>
            </div>

            {/* Profile Completion Card Widget */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-2 shrink-0 md:w-64">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Target size={15} className="text-amber-300" />
                  <span>Profile Completion</span>
                </span>
                <span className="text-amber-300 font-black">85%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-300 to-emerald-400 h-full rounded-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-blue-100">Add GitHub link to achieve 100% profile score!</p>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Applications</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{applications.length}</span>
              <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp size={13} /> +2 this week
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">2 actively under review</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Interviews</span>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Calendar size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">1</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Tomorrow
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">TechCorp Solutions • 4:00 PM</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Mentorship</span>
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">2</span>
              <span className="text-xs font-bold text-purple-500">Calls Booked</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Next: Sarah Jenkins (Google)</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Offers</span>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Award size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">1</span>
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Received 🎉
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">CreativePulse Studios</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              { id: 'applications', label: 'My Applications' },
              { id: 'recommended', label: 'Recommended Internships' },
              { id: 'mentorship', label: 'Mentorship Sessions' },
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

          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-100 transition-all cursor-pointer shrink-0">
            <Sparkles size={15} />
            <span>AI Resume Optimizer</span>
          </button>
        </div>

        {/* Tab 1: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search application role or company..."
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={14} className="text-slate-400 shrink-0" />
                {['all', 'review', 'interview', 'offer', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3.5 py-1.5 text-[11px] font-extrabold rounded-xl capitalize shrink-0 cursor-pointer transition-all ${
                      filterStatus === status
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-5">Role & Company</th>
                      <th className="py-4 px-5">Location</th>
                      <th className="py-4 px-5">Stipend</th>
                      <th className="py-4 px-5">Applied Date</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{app.role}</div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5 font-semibold">
                            <Building size={13} className="text-blue-500" /> {app.company}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-400" /> {app.location}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-black text-slate-900 dark:text-white">{app.stipend}</td>
                        <td className="py-4 px-5 text-slate-500 font-medium">{app.appliedDate}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${app.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3.5 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
                          >
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

        {/* Tab 2: Recommended Internships */}
        {activeTab === 'recommended' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {job.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Zap size={11} /> {job.matchScore} Match
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">{job.company}</p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{job.stipend}</span>
                    
                    {isApplied ? (
                      <span className="px-3.5 py-2 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center gap-1">
                        <CheckCircle2 size={14} /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedJobToApply(job)}
                        className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Apply Now</span>
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Mentorship */}
        {activeTab === 'mentorship' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingMentorships.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {m.status}
                      </span>
                      <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1.5">
                        <Clock size={14} className="text-purple-500" /> {m.time}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{m.topic}</h4>
                    
                    <div className="flex items-center gap-3.5 pt-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                        {m.mentor.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{m.mentor}</p>
                        <p className="text-xs text-slate-400 font-semibold">{m.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedAgenda(m)}
                      className="px-4 py-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 rounded-2xl hover:bg-purple-100 transition-all cursor-pointer"
                    >
                      View Agenda
                    </button>
                    <a
                      href="https://meet.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span>Join Meeting</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal 1: Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">{selectedApp.role}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{selectedApp.company}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Stipend</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{selectedApp.stipend}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Applied Date</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{selectedApp.appliedDate}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Current Status</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${selectedApp.statusColor}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Status Timeline & Notes</span>
                  <p className="mt-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedApp.notes}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Recruiter</span>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">{selectedApp.recruiter}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Apply Job Modal */}
        {selectedJobToApply && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Apply for {selectedJobToApply.title}</h3>
                  <p className="text-xs text-slate-400">{selectedJobToApply.company} • {selectedJobToApply.stipend}</p>
                </div>
                <button
                  onClick={() => setSelectedJobToApply(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApplyToJob} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Attached Resume</label>
                  <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <FileText size={16} /> John_Student_Resume_2026.pdf
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">Verified</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Optional Cover Note</label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state why you are excited about this internship..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobToApply(null)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Mentorship Agenda Modal */}
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Session Agenda</h3>
                  <p className="text-xs text-slate-400">Mentor: {selectedAgenda.mentor}</p>
                </div>
                <button
                  onClick={() => setSelectedAgenda(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Topics to cover during this call:</p>
                <div className="space-y-2">
                  {selectedAgenda.agenda.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-semibold">
                      <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedAgenda(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close Agenda
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

