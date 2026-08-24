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
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function MentorDashboard({ darkMode, setDarkMode, user }) {
  const [activeTab, setActiveTab] = useState('sessions');

  const sessions = [
    {
      id: 101,
      menteeName: 'Daniel Kim',
      topic: 'Fullstack Architecture & Code Review',
      time: 'Today at 3:00 PM EST',
      duration: '45 mins',
      status: 'Upcoming',
      meetingUrl: 'https://meet.google.com',
    },
    {
      id: 102,
      menteeName: 'Sofia Martinez',
      topic: 'System Design Interview Mock & Advice',
      time: 'Tomorrow at 11:00 AM EST',
      duration: '60 mins',
      status: 'Confirmed',
      meetingUrl: 'https://meet.google.com',
    },
  ];

  const mentees = [
    {
      id: 201,
      name: 'Daniel Kim',
      university: 'UC Berkeley',
      targetRole: 'Software Engineer Intern',
      progress: '85%',
      lastLog: 'Submitted Week 4 Work Log (React Context optimization)',
    },
    {
      id: 202,
      name: 'Sofia Martinez',
      university: 'Cornell University',
      targetRole: 'Backend Developer Trainee',
      progress: '92%',
      lastLog: 'Completed PostgreSQL indexing task',
    },
  ];

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/15">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              <span>Mentor Leadership Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Industry Mentor'}! 🌟
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
              Empower student interns through personalized 1-on-1 mentorship, code reviews, and career roadmap evaluations.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Mentees</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">8</span>
              <span className="text-xs font-bold text-purple-500">Active Students</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">From top partner colleges</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Calls</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">2</span>
              <span className="text-xs font-bold text-blue-500">This Week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Next session in 3 hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mentorship Hours</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">42 hrs</span>
              <span className="text-xs font-bold text-emerald-500">+6 hrs this month</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Certified mentor contribution</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rating & Feedback</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">4.9</span>
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
              { id: 'mentees', label: 'Assigned Mentees' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      {s.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{s.duration}</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{s.topic}</h4>
                  <p className="text-xs text-slate-500">Mentee: <span className="font-bold text-slate-900 dark:text-white">{s.menteeName}</span></p>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={13} /> {s.time}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                    Reschedule
                  </button>
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentees.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</h4>
                    <p className="text-xs text-slate-400">{m.university} • {m.targetRole}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    {m.progress} Score
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <p className="font-semibold text-slate-500">Recent Activity:</p>
                  <p className="text-slate-800 dark:text-slate-200 mt-0.5">{m.lastLog}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex-1 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1">
                    <FileCheck size={14} />
                    <span>Evaluate Log</span>
                  </button>
                  <button className="py-1.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer">
                    Message
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
