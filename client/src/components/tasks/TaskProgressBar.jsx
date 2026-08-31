import React from 'react';

export default function TaskProgressBar({ progress = 0, showLabel = true, size = 'md' }) {
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  let heightClass = 'h-2';
  if (size === 'sm') heightClass = 'h-1.5';
  if (size === 'lg') heightClass = 'h-3';

  let colorClass = 'from-blue-600 to-indigo-600';
  if (safeProgress >= 100) colorClass = 'from-emerald-500 to-teal-500';
  else if (safeProgress >= 50) colorClass = 'from-blue-500 to-indigo-500';
  else if (safeProgress > 0) colorClass = 'from-amber-500 to-orange-500';

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-black text-slate-900 dark:text-white">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`bg-gradient-to-r ${colorClass} ${heightClass} rounded-full transition-all duration-300`}
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
