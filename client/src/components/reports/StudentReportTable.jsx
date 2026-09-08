import React, { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';

export default function StudentReportTable({ students = [], loading }) {
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    const name = s.studentName?.toLowerCase() || '';
    const email = s.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-500" />
            <span>Student Performance Report</span>
          </h3>
          <p className="text-[11px] text-slate-400">Student applications and placement statistics</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold">Loading student performance data...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold">No student performance record found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-black text-[10px] tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Applications</th>
                <th className="py-3 px-4 text-center">Accepted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{item.studentName}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{item.email}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">{item.applicationsCount ?? 0}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400">{item.acceptedCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
