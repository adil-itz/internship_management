import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import { getMyApplications } from '../../services/application.service';
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Search,
  FileText,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function StudentApplications({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyApplications();
      if (res && res.success) {
        setApplications(res.applications || []);
      } else {
        setError('Failed to load applications.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const title = app.internship?.title?.toLowerCase() || '';
    const company = app.internship?.company?.name?.toLowerCase() || '';
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || company.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="applications">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={24} className="text-blue-500" /> My Applications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track and manage all your internship applications and interview schedules
            </p>
          </div>

          <Link
            to="/student/internships"
            className="px-4 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto transition-all"
          >
            <Sparkles size={14} /> Explore Internships
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search application or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'applied', 'shortlisted', 'selected', 'rejected', 'withdrawn'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Briefcase size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No applications found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {statusFilter !== 'all' || searchQuery ? 'No applications match your filter criteria.' : 'Start exploring internships to apply.'}
              </p>
            </div>
            <Link
              to="/student/internships"
              className="inline-block px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
            >
              Explore Internships
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app) => {
              const internship = app.internship || {};
              const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';

              return (
                <div
                  key={app._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                        {companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {internship.title || 'Internship Position'}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Building2 size={13} className="text-blue-500" />
                          <span>{companyName}</span>
                          {internship.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {internship.location}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {internship.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Duration: {internship.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <ApplicationStatusBadge status={app.status} />

                    <button
                      onClick={() => navigate(`/student/applications/${app._id}`)}
                      className="px-4 py-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
