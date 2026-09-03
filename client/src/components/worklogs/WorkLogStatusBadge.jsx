import React from 'react';
import { Clock, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function WorkLogStatusBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle2,
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        };
      case 'submitted':
        return {
          label: 'Submitted',
          icon: Clock,
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
        };
      case 'draft':
      default:
        return {
          label: 'Draft',
          icon: FileText,
          className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
        };
    }
  };

  const { label, icon: Icon, className } = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${className}`}>
      <Icon size={13} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
