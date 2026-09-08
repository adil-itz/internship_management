import React from 'react';
import { Users, GraduationCap, UserCheck, Building2, Briefcase, FileCheck, Calendar, ShieldCheck } from 'lucide-react';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      title: 'Total Users',
      value: summary.totalUsers ?? 0,
      subtext: 'Platform Registrations',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      title: 'Students',
      value: summary.totalStudents ?? 0,
      subtext: 'Registered Candidates',
      icon: GraduationCap,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    },
    {
      title: 'Mentors',
      value: summary.totalMentors ?? 0,
      subtext: 'Industry Mentors',
      icon: UserCheck,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    {
      title: 'Companies',
      value: summary.totalCompanies ?? 0,
      subtext: 'Partner Employers',
      icon: Building2,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    },
    {
      title: 'Internships',
      value: summary.internships?.total ?? 0,
      subtext: `${summary.internships?.active ?? 0} Active Postings`,
      icon: Briefcase,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      title: 'Applications',
      value: summary.applications?.total ?? 0,
      subtext: `${summary.applications?.pending ?? 0} Pending • ${summary.applications?.selected ?? 0} Selected`,
      icon: FileCheck,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      title: 'Interviews',
      value: summary.totalInterviews ?? 0,
      subtext: 'Scheduled Meetings',
      icon: Calendar,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    {
      title: 'Mentor Assignments',
      value: summary.totalMentorAssignments ?? 0,
      subtext: 'Active Mentorships',
      icon: ShieldCheck,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{c.title}</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {c.value.toLocaleString()}
              </h4>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{c.subtext}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${c.color}`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
