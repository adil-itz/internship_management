import React from 'react';
import {
  Compass,
  FileCheck,
  Building,
  UserCheck,
  CheckSquare,
  Award,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: Compass,
      title: 'Internship Discovery',
      description: 'Students discover verified internships matched precisely to their domain interests, technical skills, and career goals.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      hoverBorder: 'hover:border-blue-500',
      badge: 'Smart Matching',
    },
    {
      icon: FileCheck,
      title: 'Smart Applications',
      description: 'Apply with one click and track live status updates — from initial submission and interview scheduling to final selection.',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      hoverBorder: 'hover:border-cyan-500',
      badge: 'Live Status',
    },
    {
      icon: Building,
      title: 'Company Management',
      description: 'Companies publish opportunities, review applicant profiles, conduct candidate selection, and manage intern cohorts effortlessly.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      hoverBorder: 'hover:border-purple-500',
      badge: 'Talent Pipeline',
    },
    {
      icon: UserCheck,
      title: 'Mentor Management',
      description: 'Mentors oversee assigned students, schedule 1-on-1 guidance check-ins, assign project sprints, and provide ongoing feedback.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      hoverBorder: 'hover:border-emerald-500',
      badge: 'Guidance Portal',
    },
    {
      icon: CheckSquare,
      title: 'Task & Progress Tracking',
      description: 'Interactive Kanban boards, deadline tracking, task completion checklists, and real-time milestone percentage meters.',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      hoverBorder: 'hover:border-amber-500',
      badge: 'Real-Time Meters',
    },
    {
      icon: Award,
      title: 'Evaluation & Feedback',
      description: 'Structured mid-term & final performance rubrics, mentor review forms, and automated digital certificate generation.',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/60',
      badgeBg: 'bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      hoverBorder: 'hover:border-pink-500',
      badge: 'Assessment Engine',
    },
    {
      icon: ShieldAlert,
      title: 'Centralized Administration',
      description: 'University & platform administrators control user roles, monitor program-wide compliance, and view real-time placement analytics.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      hoverBorder: 'hover:border-indigo-500',
      badge: 'Global Governance',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Everything You Need to Manage Internships
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            A comprehensive suite of intelligent tools designed specifically for students, enterprise recruiters, mentors, and academic institution leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer ${feature.hoverBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} ${feature.color} flex items-center justify-center`}>
                      <Icon size={28} />
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${feature.badgeBg}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 text-sm font-semibold ${feature.color} pt-4 border-t border-slate-100 dark:border-slate-800`}>
                  <span>Explore Feature</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
