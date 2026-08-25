import React from 'react';

export default function InternshipStatusBadge({ status }) {
  const normalizedStatus = (status || 'published').toLowerCase();

  const statusStyles = {
    published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    closed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const labels = {
    published: 'Published',
    draft: 'Draft',
    closed: 'Closed',
  };

  const currentStyle = statusStyles[normalizedStatus] || statusStyles.published;
  const currentLabel = labels[normalizedStatus] || 'Published';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {currentLabel}
    </span>
  );
}
