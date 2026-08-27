import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function InterviewStatusBadge({ status }) {
  const configs = {
    scheduled: {
      label: 'Scheduled',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      icon: Calendar
    },
    completed: {
      label: 'Completed',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    cancelled: {
      label: 'Cancelled',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      icon: XCircle
    },
    rescheduled: {
      label: 'Rescheduled',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: Clock
    }
  };

  const config = configs[status] || configs.scheduled;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${config.badgeClass}`}>
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
}
