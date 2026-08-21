import React from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Layers,
      title: 'Centralized Internship Management',
      desc: 'Consolidate every application, contract, mentor log, and evaluation into one single source of truth.',
    },
    {
      icon: HeartHandshake,
      title: 'Better Student Experience',
      desc: 'Provide students with clear milestone roadmaps, instant task clarity, and constructive mentor feedback.',
    },
    {
      icon: Zap,
      title: 'Faster Company Recruitment',
      desc: 'Accelerate intern hiring timelines with pre-structured application pipelines and verified candidate credentials.',
    },
    {
      icon: ShieldCheck,
      title: 'Efficient Mentor Collaboration',
      desc: 'Eliminate friction for mentors with automated 1-on-1 meeting reminders and digital task submission rubrics.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Progress Visibility',
      desc: 'Track student completion rates week-by-week to identify and support struggling interns early.',
    },
    {
      icon: Clock,
      title: 'Reduced Administrative Workload',
      desc: 'Automate up to 80% of routine institutional follow-ups, grade submissions, and reporting workflows.',
    },
    {
      icon: CheckCircle2,
      title: 'Structured Evaluations',
      desc: 'Ensure fair, multi-dimensional assessment with standardized evaluation forms and rubric criteria.',
    },
    {
      icon: Lock,
      title: 'Complete Internship Transparency',
      desc: 'Maintain full audit trails, privacy compliance, and verified institutional certification records.',
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Value & Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Why Choose Smart Internship Management?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Transforming complex multi-stakeholder workflows into a smooth, efficient, and measurable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="flex gap-5 p-7 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
