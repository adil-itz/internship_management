import React from 'react';
import {
  GraduationCap,
  Building2,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function UserRoles() {
  const roles = [
    {
      id: 'students',
      title: 'Students',
      subtitle: 'Build Your Career Journey',
      icon: GraduationCap,
      badge: 'Talent Seekers',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-500',
      btnBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900',
      features: [
        'Discover verified internships matching your stack',
        'One-click digital profile applications',
        'Real-time live application tracking dashboard',
        'Manage sprint tasks and submit deliverables',
        'Monitor completion progress percentage',
        'Receive continuous 1-on-1 mentor feedback',
      ],
      cta: 'For Students',
    },
    {
      id: 'companies',
      title: 'Companies',
      subtitle: 'Hire & Manage Top Interns',
      icon: Building2,
      badge: 'Recruiters & Enterprises',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60',
      borderColor: 'border-cyan-200 dark:border-cyan-900/50 hover:border-cyan-500',
      btnBg: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900',
      features: [
        'Post and manage internship job opportunities',
        'Filter & review top student candidates',
        'Select candidates & issue digital offers',
        'Organize interns into collaborative cohorts',
        'Monitor intern performance in real-time',
        'Conduct mid-term & final evaluations',
      ],
      cta: 'For Companies',
    },
    {
      id: 'mentors',
      title: 'Mentors',
      subtitle: 'Guide & Empower Mentees',
      icon: UserCheck,
      badge: 'Industry & Academic Advisors',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      borderColor: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-500',
      btnBg: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900',
      features: [
        'Dashboard for all assigned student mentees',
        'Assign project tasks & set milestone deadlines',
        'Track daily task execution & submission status',
        'Schedule 1-on-1 guidance & check-in sessions',
        'Provide structured weekly written feedback',
        'Complete final student performance rubrics',
      ],
      cta: 'For Mentors',
    },
    {
      id: 'administrators',
      title: 'Administrators',
      subtitle: 'Govern & Analyze Platform Activity',
      icon: ShieldCheck,
      badge: 'Institutions & Overseers',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500',
      btnBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900',
      features: [
        'Centralized management of all platform users',
        'Audit & approve partner companies & listings',
        'Oversee university placement compliance',
        'Track all active applications & internships',
        'Real-time institutional analytics & placement rates',
        'Export placement data and official reports',
      ],
      cta: 'For Administrators',
    },
  ];

  return (
    <section id="roles" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Role-Tailored Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Built for Everyone Involved in Internships
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Tailored interfaces and dedicated capabilities for every key stakeholder in the internship ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-7 border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col justify-between ${role.borderColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${role.bgColor} ${role.color} flex items-center justify-center`}>
                      <Icon size={28} />
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${role.bgColor} ${role.color} border border-current/20`}>
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                    {role.title}
                  </h3>

                  <p className={`text-xs font-bold ${role.color} mb-6`}>
                    {role.subtitle}
                  </p>

                  <div className="space-y-3 mb-8">
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        <CheckCircle2 size={15} className={`${role.color} shrink-0 mt-0.5`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${role.btnBg}`}
                >
                  <span>{role.cta}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
