import React from 'react';
import {
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileSpreadsheet,
  MessageSquareOff,
  EyeOff,
  ClockAlert
} from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    {
      icon: MessageSquareOff,
      title: 'Scattered Communication',
      desc: 'Lost emails, messy chat groups, and fragmented files lead to constant confusion.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Manual Application Tracking',
      desc: 'Static Excel sheets with zero real-time status updates or feedback loops.',
    },
    {
      icon: ClockAlert,
      title: 'Difficult Mentor Coordination',
      desc: 'Mentors struggle to track assigned students, set clear tasks, or schedule 1-on-1s.',
    },
    {
      icon: EyeOff,
      title: 'No Centralized Progress Visibility',
      desc: 'Zero transparency on whether students are hitting their weekly milestones.',
    },
  ];

  const solutions = [
    {
      title: 'Unified Communication Hub',
      desc: 'Integrated messaging, task notifications, and shared files in one secure dashboard.',
    },
    {
      title: 'Automated Live Tracking',
      desc: 'Instant real-time application status updates from submission to offer letter.',
    },
    {
      title: 'Structured Mentorship Portal',
      desc: 'Streamlined task assignment, milestone reviews, and automated check-ins.',
    },
    {
      title: 'Real-Time Progress Analytics',
      desc: 'Live completion meters, automated reporting, and comprehensive student scorecards.',
    },
  ];

  return (
    <section id="problem-solution" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle size={14} />
            <span>The Management Challenge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Internships Shouldn't Be Complicated
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Traditional internship programs suffer from fragmented tools, zero visibility, and heavy manual admin workloads. Here is how InternFlow transforms the experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 sm:p-10 border border-rose-200 dark:border-rose-900/50 shadow-sm text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 font-bold text-xs mb-6 border border-rose-200 dark:border-rose-800">
              <XCircle size={18} />
              <span>Traditional Management</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
              Manual, Fragmented & Slow
            </h3>

            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base">
              Without a centralized system, internship coordination turns into an administrative bottleneck for everyone involved.
            </p>

            <div className="space-y-4">
              {problems.map((prob, i) => {
                const Icon = prob.icon;
                return (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-500 dark:text-rose-400 shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {prob.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {prob.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-b from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-blue-200 dark:border-blue-800 shadow-xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 font-bold text-xs mb-6 border border-blue-200 dark:border-blue-800">
              <Zap size={18} />
              <span>With InternFlow</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
              One Smart Platform. Every Step Connected.
            </h3>

            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base">
              A single intelligent platform orchestrating student discovery, company selection, mentorship, and automated evaluation.
            </p>

            <div className="space-y-4">
              {solutions.map((sol, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {sol.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {sol.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
