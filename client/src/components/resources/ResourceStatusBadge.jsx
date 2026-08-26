import React from 'react';

export default function ResourceStatusBadge({ status }) {
  let badgeStyle = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  let label = status || 'draft';

  if (status === 'published') {
    badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    label = 'Published';
  } else if (status === 'draft') {
    badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    label = 'Draft';
  } else if (status === 'archived') {
    badgeStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    label = 'Archived';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badgeStyle} capitalize shrink-0`}>
      {label}
    </span>
  );
}
