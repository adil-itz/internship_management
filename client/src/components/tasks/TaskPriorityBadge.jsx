import React from 'react';

export default function TaskPriorityBadge({ priority }) {
  const normalized = (priority || 'medium').toLowerCase();

  const configs = {
    low: {
      label: 'Low Priority',
      className: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    },
    medium: {
      label: 'Medium Priority',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    high: {
      label: 'High Priority',
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    }
  };

  const config = configs[normalized] || configs.medium;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${config.className}`}>
      {config.label}
    </span>
  );
}
