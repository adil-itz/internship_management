import React, { useState } from 'react';
import { Building2, Search } from 'lucide-react';

export default function CompanyReportTable({ companies = [], loading }) {
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) => {
    const name = c.companyName?.toLowerCase() || '';
    const email = c.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-cyan-500" />
            <span>Company Performance Report</span>
          </h3>
          <p className="text-[11px] text-slate-400">Employer activity and application metrics</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold">Loading company performance data...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold">No company performance record found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-black text-[10px] tracking-wider">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Internships</th>
                <th className="py-3 px-4 text-center">Applications</th>
                <th className="py-3 px-4 text-center">Selected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{item.companyName}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{item.email}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-blue-600 dark:text-blue-400">{item.totalInternships ?? 0}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">{item.totalApplications ?? 0}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400">{item.selectedApplications ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
