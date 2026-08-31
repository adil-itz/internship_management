import React from 'react';
import {
  Clock,
  PlayCircle,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default function TaskStatusBadge({ status }) {
  const normalized = (status || 'assigned').toLowerCase();

  const configs = {
    assigned: {
      label: 'Assigned',
      icon: Clock,
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    in_progress: {
      label: 'In Progress',
      icon: PlayCircle,
      className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    },
    submitted: {
      label: 'Submitted',
      icon: Send,
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    overdue: {
      label: 'Overdue',
      icon: AlertTriangle,
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    }
  };

  const config = configs[normalized] || configs.assigned;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${config.className}`}>
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
}
