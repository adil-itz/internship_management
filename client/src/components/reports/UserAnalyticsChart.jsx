import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function UserAnalyticsChart({ data = [], year }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-slate-400 space-y-2">
        <TrendingUp size={32} className="mx-auto text-slate-400" />
        <p className="text-xs font-bold">No user activity data available for {year || 'the selected period'}.</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.users || 0, d.internships || 0, d.applications || 0]),
    10
  );

  const chartHeight = 220;

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            <span>User & Activity Growth ({year || new Date().getFullYear()})</span>
          </h3>
          <p className="text-[11px] text-slate-400">Monthly trends for registered users, posted internships, and applications</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Internships</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Applications</span>
          </div>
        </div>
      </div>

      <div className="relative pt-4">
        <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-slate-200 dark:border-slate-800">
          {data.map((item, idx) => {
            const userH = Math.round(((item.users || 0) / maxValue) * chartHeight);
            const internH = Math.round(((item.internships || 0) / maxValue) * chartHeight);
            const appH = Math.round(((item.applications || 0) / maxValue) * chartHeight);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
              >
                {isHovered && (
                  <div className="absolute bottom-full mb-2 z-20 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none animate-in fade-in">
                    <p className="font-extrabold border-b border-slate-700 pb-1 mb-1">{item.monthName}</p>
                    <p className="text-blue-400">Users: {item.users || 0}</p>
                    <p className="text-indigo-400">Internships: {item.internships || 0}</p>
                    <p className="text-emerald-400">Applications: {item.applications || 0}</p>
                  </div>
                )}

                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 max-w-[40px]">
                  <div
                    style={{ height: `${userH}px` }}
                    className="w-1.5 sm:w-2 bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-400"
                  ></div>
                  <div
                    style={{ height: `${internH}px` }}
                    className="w-1.5 sm:w-2 bg-indigo-500 rounded-t-sm transition-all group-hover:bg-indigo-400"
                  ></div>
                  <div
                    style={{ height: `${appH}px` }}
                    className="w-1.5 sm:w-2 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400"
                  ></div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                  {item.monthName ? item.monthName.substring(0, 3) : `M${item.month}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
