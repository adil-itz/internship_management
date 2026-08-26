import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, RefreshCw, BookOpen, Sparkles, Video, ChevronLeft, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceCard from '../../components/resources/ResourceCard';
import { getResources } from '../../services/resource.service';

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Backend Development',
  'Frontend Development',
  'AI / Machine Learning',
  'Data Science',
  'Data Analytics',
  'Cyber Security',
  'Cloud Computing',
  'DevOps',
  'Mobile Development',
  'Database',
  'Programming',
  'DSA',
  'Interview Preparation',
  'Resume & Career',
  'Git & GitHub',
  'Other',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function ResourceExploration({ darkMode, setDarkMode, user }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [level, setLevel] = useState('All Levels');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchResourcesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (category !== 'All Categories') params.category = category;
      if (level !== 'All Levels') params.level = level;

      const res = await getResources(params);
      if (res && res.success) {
        setResources(res.resources || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalResources(res.pagination.total || 0);
        }
      } else {
        setResources([]);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcesData();
  }, [debouncedSearch, category, level, sort, page]);

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('All Categories');
    setLevel('All Levels');
    setSort('newest');
    setPage(1);
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Resource Exploration</h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Explore curated learning resources to improve your skills and prepare for internships.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources by title, skills, or tags..."
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title A-Z</option>
              </select>

              <button
                onClick={handleClearFilters}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 animate-pulse"
              >
                <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Video size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No resources found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try adjusting your search query, selecting different filters, or clearing your search.
              </p>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resources.map((res) => (
                <ResourceCard key={res._id} resource={res} detailRoutePrefix="/student/resources" />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Showing page {page} of {totalPages} ({totalResources} resources)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 text-xs font-extrabold text-slate-900 dark:text-white">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
