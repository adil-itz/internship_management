import React from 'react';
import { Calendar } from 'lucide-react';

export default function AttendanceAnalytics({ attendance }) {
  if (!attendance) return null;

  const total = attendance.total || 0;
  const present = attendance.present || 0;
  const absent = attendance.absent || 0;
  const late = attendance.late || 0;
  const halfDay = attendance.halfDay || 0;
  const leave = attendance.leave || 0;
  const percentage = attendance.percentage || 0;

  const items = [
    { label: 'Present', count: present, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Absent', count: absent, color: 'bg-rose-500', text: 'text-rose-500' },
    { label: 'Late', count: late, color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Half-Day', count: halfDay, color: 'bg-indigo-500', text: 'text-indigo-500' },
    { label: 'Leave', count: leave, color: 'bg-purple-500', text: 'text-purple-500' },
  ];

  if (total === 0) {
    return (
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-blue-500" />
          <span>Attendance Analytics</span>
        </h3>
        <p className="text-xs text-slate-400 py-6 text-center">Attendance analytics unavailable for this period.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-blue-500" />
          <span>Attendance Analytics</span>
        </h3>
        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {percentage}% Attendance Rate
        </span>
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

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {items.map((item, idx) => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
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
