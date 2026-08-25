import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

export default function InternshipFilters({
  searchQuery,
  setSearchQuery,
  domain,
  setDomain,
  workMode,
  setWorkMode,
  internshipType,
  setInternshipType,
  locationFilter,
  setLocationFilter,
  stipendFilter,
  setStipendFilter,
  onReset,
}) {
  const DOMAINS = [
    'All',
    'Software Development',
    'AI / ML',
    'Data Science',
    'Web Development',
    'Cyber Security',
    'Cloud',
    'Other',
  ];

  const WORK_MODES = ['All', 'Remote', 'On-site', 'Hybrid'];
  const TYPES = ['All', 'Paid', 'Unpaid'];
  const STIPEND_RANGES = [
    { label: 'Any', value: 'all' },
    { label: '₹0 - ₹5,000', value: '0-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: '₹10,000 - ₹20,000', value: '10000-20000' },
    { label: '₹20,000+', value: '20000+' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, domain, skills, location..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Domain
          </label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Work Mode
          </label>
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Type
          </label>
          <select
            value={internshipType}
            onChange={(e) => setInternshipType(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Location
          </label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="e.g. Bhubaneswar"
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Stipend Range
          </label>
          <select
            value={stipendFilter}
            onChange={(e) => setStipendFilter(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {STIPEND_RANGES.map((sr) => (
              <option key={sr.value} value={sr.value}>
                {sr.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
