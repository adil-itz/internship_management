import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, CalendarOff } from 'lucide-react';

export default function AttendanceStatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'present':
        return {
          label: 'Present',
          icon: CheckCircle2,
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      case 'absent':
        return {
          label: 'Absent',
          icon: XCircle,
          className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        };
      case 'late':
        return {
          label: 'Late',
          icon: Clock,
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
        };
      case 'half-day':
        return {
          label: 'Half Day',
          icon: AlertTriangle,
          className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
        };
      case 'leave':
        return {
          label: 'Leave',
          icon: CalendarOff,
          className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        };
      default:
        return {
          label: status || 'Unknown',
          icon: CheckCircle2,
          className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
        };
    }
  };

  const { label, icon: Icon, className } = getBadgeConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${className}`}>
      <Icon size={13} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
