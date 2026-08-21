import React from 'react';
import { GraduationCap, Building2, UserCheck, Briefcase } from 'lucide-react';

export default function Stats() {
  const statItems = [
    {
      icon: GraduationCap,
      value: '500+',
      label: 'Students Enrolled',
      description: 'Active students discovering and securing top internships.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'hover:border-blue-500',
    },
    {
      icon: Building2,
      value: '100+',
      label: 'Partner Companies',
      description: 'Vetted tech startups & enterprises posting roles.',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60',
      borderColor: 'hover:border-cyan-500',
    },
    {
      icon: UserCheck,
      value: '50+',
      label: 'Expert Mentors',
      description: 'Dedicated industry professionals guiding student growth.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      borderColor: 'hover:border-purple-500',
    },
    {
      icon: Briefcase,
      value: '1,000+',
      label: 'Internships Managed',
      description: 'Full lifecycle tracking from application to final assessment.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'hover:border-emerald-500',
    },
  ];

  return (
    <section id="stats" className="py-16 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Platform Scale
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            One Platform. Complete Internship Lifecycle.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Powering seamless collaboration across universities, students, enterprises, and mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left ${stat.borderColor}`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-5`}>
                  <Icon size={24} />
                </div>

                <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {stat.value}
                </div>

                <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {stat.label}
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
