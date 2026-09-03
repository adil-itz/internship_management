import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import WorkLogStatusBadge from '../../components/worklogs/WorkLogStatusBadge';
import { getStudentWorkLogs, getWorkLogSummary, deleteWorkLog } from '../../services/worklog.service';
import { getStudentApplications } from '../../services/application.service';
import {
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function StudentWorkLogs({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }
  const studentId = activeUser?.id || activeUser?._id || activeUser?.user?.id || activeUser?.user?._id;

  const [workLogs, setWorkLogs] = useState([]);
  const [summary, setSummary] = useState({
    totalLogs: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    totalHours: 0
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [internshipFilter, setInternshipFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchStudentApplications();
  }, []);

  useEffect(() => {
    fetchLogsAndSummary(pagination.page);
  }, [studentId, statusFilter, internshipFilter, fromDate, toDate, pagination.page]);

  const fetchStudentApplications = async () => {
    try {
      const res = await getStudentApplications();
      if (res && res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogsAndSummary = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (!studentId) {
        setLoading(false);
        return;
      }

      const summaryRes = await getWorkLogSummary(studentId);
      if (summaryRes && summaryRes.success) {
        setSummary(summaryRes.data || {});
      }

      const params = {
        page: currentPage,
        limit: pagination.limit
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (internshipFilter !== 'all') params.internshipId = internshipFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const logsRes = await getStudentWorkLogs(studentId, params);
      if (logsRes && logsRes.success) {
        setWorkLogs(logsRes.data || []);
        if (logsRes.pagination) {
          setPagination(logsRes.pagination);
        }
      } else {
        setError('Unable to load work logs. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load work logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteWorkLog(deleteTarget._id);
      if (res && res.success) {
        showNotification('Work log deleted successfully.');
        setDeleteTarget(null);
        fetchLogsAndSummary(pagination.page);
      } else {
        alert(res.message || 'Failed to delete work log.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete work log.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredLogs = workLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      const matchTask = log.taskId?.title?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTask) return false;
    }
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-worklogs">
      <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Clock size={14} />
              <span>Internship Work Logs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Work Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track daily internship progress, log hours worked, submit draft logs to your mentor, and review feedback.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/student/worklogs/create"
              className="px-5 py-3 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Work Log</span>
            </Link>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Logs</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">{summary.totalLogs || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Draft</span>
            <p className="text-xl font-black text-slate-600 dark:text-slate-400">{summary.draft || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Submitted</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{summary.submitted || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Approved</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{summary.approved || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Rejected</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">{summary.rejected || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">Total Hours</span>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{summary.totalHours || 0}h</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search work title, description or task..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
                {['all', 'draft', 'submitted', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`px-3 py-1 rounded-xl text-[11px] font-extrabold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {applications.length > 0 && (
                <select
                  value={internshipFilter}
                  onChange={(e) => {
                    setInternshipFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-extrabold cursor-pointer max-w-xs truncate"
                >
                  <option value="all">All Internships</option>
                  {applications.map((app) => (
                    <option key={app.internship?._id || app._id} value={app.internship?._id}>
                      {app.internship?.title || 'Internship'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-extrabold text-slate-400 text-[10px] uppercase">Date Filter:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
              />
              {(fromDate || toDate) && (
                <button
                  onClick={() => {
                    setFromDate('');
                    setToDate('');
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 rounded-lg hover:underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading work logs...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Clock size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">You haven't added any work logs yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start documenting your daily internship tasks, challenges, and hours worked.
            </p>
            <Link
              to="/student/worklogs/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition-all mt-2"
            >
              <Plus size={16} />
              <span>Add Work Log</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Work Log Title</th>
                    <th className="py-4 px-5">Task</th>
                    <th className="py-4 px-5">Hours</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatDate(log.date)}
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{log.title}</div>
                        <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5 font-medium">{log.description}</p>
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-600 dark:text-slate-400">
                        {log.taskId?.title ? (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {log.taskId.title}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">General Activity</span>
                        )}
                      </td>

                      <td className="py-4 px-5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                        {log.hoursWorked}h
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <WorkLogStatusBadge status={log.status} />
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => navigate(`/student/worklogs/${log._id}`)}
                          className="px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        {(log.status === 'draft' || log.status === 'rejected') && (
                          <>
                            <button
                              onClick={() => navigate(`/student/worklogs/${log._id}/edit`)}
                              className="px-3 py-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit size={14} />
                              <span>{log.status === 'rejected' ? 'Edit & Resubmit' : 'Edit'}</span>
                            </button>

                            <button
                              onClick={() => setDeleteTarget(log)}
                              className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                              title="Delete Work Log"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-4">
              {filteredLogs.map((log) => (
                <div key={log._id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{formatDate(log.date)}</span>
                    <WorkLogStatusBadge status={log.status} />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{log.title}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">{log.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 pt-1">
                    <span>Task: {log.taskId?.title || 'General'}</span>
                    <span className="font-black text-slate-900 dark:text-white">{log.hoursWorked} hours</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/student/worklogs/${log._id}`)}
                      className="px-4 py-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 rounded-xl"
                    >
                      View
                    </button>
                    {(log.status === 'draft' || log.status === 'rejected') && (
                      <>
                        <button
                          onClick={() => navigate(`/student/worklogs/${log._id}/edit`)}
                          className="px-4 py-2 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 rounded-xl"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(log)}
                          className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Work Log</h3>
                  <p className="text-xs text-slate-400">Are you sure you want to delete this work log?</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl font-semibold">
                "{deleteTarget.title}"
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
