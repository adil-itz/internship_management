import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Video,
  FileCheck,
  Sparkles,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Award,
  X,
  Send,
  Sliders,
  Check,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function MentorDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedSessionAgenda, setSelectedSessionAgenda] = useState(null);
  const [selectedMenteeToEvaluate, setSelectedMenteeToEvaluate] = useState(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [evaluatedMenteeIds, setEvaluatedMenteeIds] = useState([]);

  const sessions = [
    {
      id: 101,
      menteeName: 'Daniel Kim',
      topic: 'Fullstack Architecture & Code Review',
      time: 'Today at 3:00 PM EST',
      duration: '45 mins',
      status: 'Upcoming',
      meetingUrl: 'https://meet.google.com',
      agenda: [
        'Review React Context vs Redux Toolkit optimization PR',
        'Discuss REST endpoint pagination best practices',
        'Prepare for upcoming tech interview round',
      ],
    },
    {
      id: 102,
      menteeName: 'Sofia Martinez',
      topic: 'System Design Interview Mock & Advice',
      time: 'Tomorrow at 11:00 AM EST',
      duration: '60 mins',
      status: 'Confirmed',
      meetingUrl: 'https://meet.google.com',
      agenda: [
        'Design a distributed URL shortener (TinyURL clone)',
        'Database sharding and replication concepts',
        'Resume bullet point metrics refinement',
      ],
    },
  ];

  const [mentees, setMentees] = useState([
    {
      id: 201,
      name: 'Daniel Kim',
      university: 'UC Berkeley',
      targetRole: 'Software Engineer Intern',
      progress: '85%',
      lastLog: 'Submitted Week 4 Work Log (React Context optimization & custom hooks)',
      submittedDate: '2026-08-22',
    },
    {
      id: 202,
      name: 'Sofia Martinez',
      university: 'Cornell University',
      targetRole: 'Backend Developer Trainee',
      progress: '92%',
      lastLog: 'Completed PostgreSQL indexing task and query optimization benchmark',
      submittedDate: '2026-08-23',
    },
  ]);

  const handleEvaluateLog = (e) => {
    e.preventDefault();
    if (!selectedMenteeToEvaluate) return;

    setEvaluatedMenteeIds([...evaluatedMenteeIds, selectedMenteeToEvaluate.id]);
    setSelectedMenteeToEvaluate(null);
    setEvaluationFeedback('');
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
                <span>Mentor Leadership Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome back, {user?.name || 'Industry Mentor'}! 🌟
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Empower student candidates through personalized 1-on-1 mentorship, code reviews, and career roadmap evaluations.
              </p>
            </div>

            {/* Mentor Rating Badge */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1 shrink-0 md:w-64">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-300 fill-amber-300" />
                  <span>Mentor Score</span>
                </span>
                <span className="text-amber-300 font-black text-sm">4.9 / 5.0</span>
              </div>
              <p className="text-[10px] text-blue-100">Top 5% rated mentor across platform!</p>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assigned Mentees</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{mentees.length + 6}</span>
              <span className="text-xs font-bold text-blue-500">Active Students</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">From top university cohorts</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Upcoming Calls</span>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Calendar size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">2</span>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                This Week
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Next session in 3 hours</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Mentorship Hours</span>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Clock size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">42 hrs</span>
              <span className="text-xs font-bold text-emerald-500">+6 hrs this month</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Certified mentor contribution</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Rating & Feedback</span>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Star size={22} className="fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">4.9</span>
              <span className="text-xs font-bold text-amber-500">out of 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on 28 student reviews</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'sessions', label: '1-on-1 Mentorship Calls' },
              { id: 'mentees', label: 'Assigned Mentees & Work Logs' },
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

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      {s.status}
                    </span>
                    <span className="text-xs font-extrabold text-slate-400">{s.duration}</span>
                  </div>

                  <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{s.topic}</h4>
                  <p className="text-xs text-slate-500 font-semibold">
                    Mentee Candidate: <span className="font-black text-slate-900 dark:text-white">{s.menteeName}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Clock size={14} className="text-purple-500" /> {s.time}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedSessionAgenda(s)}
                    className="px-4 py-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 rounded-2xl hover:bg-purple-100 transition-all cursor-pointer"
                  >
                    View Agenda
                  </button>
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Video size={14} />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mentees Tab */}
        {activeTab === 'mentees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mentees.map((m) => {
              const isEvaluated = evaluatedMenteeIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{m.name}</h4>
                      <p className="text-xs font-semibold text-slate-400">{m.university} • {m.targetRole}</p>
                    </div>
                    <span className="px-3 py-1 rounded-2xl text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                      {m.progress} Score
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-slate-500 uppercase text-[10px]">Submitted Work Log ({m.submittedDate}):</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-0.5">{m.lastLog}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {isEvaluated ? (
                      <span className="flex-1 py-2 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center gap-1.5">
                        <Check size={14} /> Log Evaluated & Feedback Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedMenteeToEvaluate(m)}
                        className="flex-1 py-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileCheck size={15} />
                        <span>Evaluate Log</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal 1: Agenda Modal */}
        {selectedSessionAgenda && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Call Agenda</h3>
                  <p className="text-xs text-slate-400">Mentee: {selectedSessionAgenda.menteeName}</p>
                </div>
                <button
                  onClick={() => setSelectedSessionAgenda(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Planned Discussion Points:</p>
                <div className="space-y-2">
                  {selectedSessionAgenda.agenda.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-semibold">
                      <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedSessionAgenda(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Mentee Log Evaluation Modal */}
        {selectedMenteeToEvaluate && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Evaluate Work Log</h3>
                  <p className="text-xs text-slate-400">Mentee: {selectedMenteeToEvaluate.name}</p>
                </div>
                <button
                  onClick={() => setSelectedMenteeToEvaluate(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEvaluateLog} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">Log Summary</label>
                  <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    {selectedMenteeToEvaluate.lastLog}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Mentor Feedback & Score Notes</label>
                  <textarea
                    rows={3}
                    required
                    value={evaluationFeedback}
                    onChange={(e) => setEvaluationFeedback(e.target.value)}
                    placeholder="Provide constructive feedback on clean code, test coverage, or architecture..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMenteeToEvaluate(null)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Submit Evaluation</span>
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

