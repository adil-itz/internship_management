import React from 'react';
import { Clock } from 'lucide-react';

export default function WorklogAnalytics({ worklog }) {
  if (!worklog) return null;

  const totalLogs = worklog.totalLogs || 0;
  const approved = worklog.approved || 0;
  const rejected = worklog.rejected || 0;
  const submitted = worklog.submitted || 0;
  const draft = worklog.draft || 0;
  const totalHours = worklog.totalHours || 0;

  const items = [
    { label: 'Approved', count: approved, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Submitted', count: submitted, color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Draft', count: draft, color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Rejected', count: rejected, color: 'bg-rose-500', text: 'text-rose-500' },
  ];

  if (totalLogs === 0) {
    return (
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          <span>Worklog Analytics</span>
        </h3>
        <p className="text-xs text-slate-400 py-6 text-center">Worklog analytics unavailable for this period.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          <span>Worklog Analytics</span>
        </h3>
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          {totalHours} Total Hours Worked
        </span>
      </div>

      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          {items.map((item, idx) => {
            const pct = totalLogs > 0 ? (item.count / totalLogs) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`h-full ${item.color} transition-all`}
                title={`${item.label}: ${item.count} (${pct.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {items.map((item, idx) => {
            const pct = totalLogs > 0 ? ((item.count / totalLogs) * 100).toFixed(1) : 0;
            return (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">{item.label}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{item.count}</span>
                  <span className={`text-[10px] font-extrabold ${item.text}`}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
