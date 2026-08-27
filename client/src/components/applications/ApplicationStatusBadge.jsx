import React from 'react';
import {
  FileText,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';

export default function ApplicationStatusBadge({ status }) {
  const configs = {
    applied: {
      label: 'Applied',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      icon: FileText
    },
    shortlisted: {
      label: 'Shortlisted',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: UserCheck
    },
    interview_scheduled: {
      label: 'Interview Scheduled',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      icon: CalendarCheck
    },
    selected: {
      label: 'Selected',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    rejected: {
      label: 'Rejected',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      icon: XCircle
    },
    withdrawn: {
      label: 'Withdrawn',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      icon: RotateCcw
    }
  };

  const config = configs[status] || configs.applied;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${config.badgeClass}`}>
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
}
