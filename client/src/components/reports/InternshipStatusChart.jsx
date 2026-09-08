import React from 'react';
import { Briefcase } from 'lucide-react';

export default function InternshipStatusChart({ internshipStats }) {
  if (!internshipStats) return null;

  const total = internshipStats.total || 0;
  const active = internshipStats.active || 0;
  const inactive = Math.max(0, total - active);

  const items = [
    { label: 'Active / Published', count: active, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Draft / Closed', count: inactive, color: 'bg-slate-400', text: 'text-slate-400' },
  ];

  if (total === 0) {
    return (
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase size={18} className="text-emerald-500" />
          <span>Internship Status Breakdown</span>
        </h3>
        <p className="text-xs text-slate-400 py-6 text-center">No internship statistics available for this period.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase size={18} className="text-emerald-500" />
          <span>Internship Status Breakdown</span>
        </h3>
        <span className="text-xs font-black text-slate-400">{total} Total</span>
      </div>

      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          {items.map((item, idx) => {
            const pct = total > 0 ? (item.count / total) * 100 : 0;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {items.map((item, idx) => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            return (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">{item.label}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-base font-black text-slate-900 dark:text-white">{item.count}</span>
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
