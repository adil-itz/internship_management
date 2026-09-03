import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import WorkLogStatusBadge from '../../components/worklogs/WorkLogStatusBadge';
import { getInternshipWorkLogs, getStudentWorkLogs, reviewWorkLog, getWorkLogSummary } from '../../services/worklog.service';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import {
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  X,
  Send,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  ExternalLink
} from 'lucide-react';

export default function MentorWorkLogs({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('submitted');
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [selectedInternshipId, setSelectedInternshipId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [studentSummary, setStudentSummary] = useState(null);

  const [reviewModalLog, setReviewModalLog] = useState(null);
  const [mentorFeedback, setMentorFeedback] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    fetchMentorLogs(pagination.page);
  }, [statusFilter, selectedStudentId, selectedInternshipId, fromDate, toDate, pagination.page]);

  useEffect(() => {
    if (selectedStudentId !== 'all') {
      fetchSelectedStudentSummary(selectedStudentId);
    } else {
      setStudentSummary(null);
    }
  }, [selectedStudentId]);

  const fetchAssignments = async () => {
    try {
      const res = await getMyAssignments();
      if (res && res.success) {
        setAssignments(res.assignments || []);
        
        const studentsMap = new Map();
        const internMap = new Map();

        (res.assignments || []).forEach((a) => {
          if (a.student) {
            studentsMap.set(a.student._id, a.student);
          }
          if (a.internship) {
            internMap.set(a.internship._id, a.internship);
          }
        });

        setAssignedStudents(Array.from(studentsMap.values()));
        setInternships(Array.from(internMap.values()));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMentorLogs = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      let logsData = [];
      let totalLogs = 0;
      let totalPgs = 1;

      const params = { page: currentPage, limit: pagination.limit };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      if (selectedStudentId !== 'all') {
        if (selectedInternshipId !== 'all') params.internshipId = selectedInternshipId;
        const res = await getStudentWorkLogs(selectedStudentId, params);
        if (res && res.success) {
          logsData = res.data || [];
          if (res.pagination) {
            totalLogs = res.pagination.total;
            totalPgs = res.pagination.totalPages;
          }
        }
      } else {
        const targetInternshipId = selectedInternshipId !== 'all' ? selectedInternshipId : (internships[0]?._id || 'all');
        
        if (targetInternshipId !== 'all') {
          const res = await getInternshipWorkLogs(targetInternshipId, params);
          if (res && res.success) {
            logsData = res.data || [];
            if (res.pagination) {
              totalLogs = res.pagination.total;
              totalPgs = res.pagination.totalPages;
            }
          }
        } else {
          let aggregated = [];
          for (const intern of internships) {
            try {
              const res = await getInternshipWorkLogs(intern._id, params);
              if (res && res.success && res.data) {
                aggregated = [...aggregated, ...res.data];
              }
            } catch (e) {}
          }
          logsData = aggregated;
          totalLogs = aggregated.length;
          totalPgs = Math.ceil(totalLogs / pagination.limit) || 1;
        }
      }

      setWorkLogs(logsData);
      setPagination((prev) => ({
        ...prev,
        page: currentPage,
        total: totalLogs,
        totalPages: totalPgs
      }));
    } catch (err) {
      setError(err.message || 'Unable to load work logs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedStudentSummary = async (studentId) => {
    try {
      const res = await getWorkLogSummary(studentId);
      if (res && res.success) {
        setStudentSummary(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewAction = async (newStatus) => {
    setReviewError(null);
    if (!reviewModalLog) return;

    if (newStatus === 'rejected' && (!mentorFeedback || !mentorFeedback.trim())) {
      setReviewError('Feedback is required when rejecting a work log.');
      return;
    }

    setReviewing(true);
    try {
      const res = await reviewWorkLog(reviewModalLog._id, {
        status: newStatus,
        mentorFeedback: mentorFeedback ? mentorFeedback.trim() : 'Approved'
      });

      if (res && res.success) {
        showNotification(`Work log ${newStatus} successfully.`);
        setReviewModalLog(null);
        setMentorFeedback('');
        fetchMentorLogs(pagination.page);
      } else {
        setReviewError(res.message || 'Failed to review work log.');
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to review work log.');
    } finally {
      setReviewing(false);
    }
  };

  const filteredLogs = workLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const studentName = typeof log.studentId === 'object' ? log.studentId?.name?.toLowerCase() : '';
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      const matchTask = log.taskId?.title?.toLowerCase().includes(q);
      if (!studentName?.includes(q) && !matchTitle && !matchDesc && !matchTask) return false;
    }
    return true;
  });

  const totalLogsCount = workLogs.length;
  const pendingReviewCount = workLogs.filter((l) => l.status === 'submitted').length;
  const approvedCount = workLogs.filter((l) => l.status === 'approved').length;
  const rejectedCount = workLogs.filter((l) => l.status === 'rejected').length;
  const totalHoursCount = workLogs.reduce((acc, l) => acc + (l.hoursWorked || 0), 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="assigned-interns">
      <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <UserCheck size={14} />
              <span>Mentor Review Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Work Log Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Supervise work logs submitted by your assigned student interns, approve deliverables, and provide feedback.
            </p>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        {studentSummary && selectedStudentId !== 'all' && (
          <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-800 pb-2">
              <span className="font-extrabold text-blue-900 dark:text-blue-200 uppercase text-[11px]">
                Student Activity Summary: {assignedStudents.find((s) => s._id === selectedStudentId)?.name || 'Student'}
              </span>
              <button
                onClick={() => setSelectedStudentId('all')}
                className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear Student Filter
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] font-bold block uppercase">Total Logs</span>
                <strong className="text-base font-black text-slate-900 dark:text-white">{studentSummary.totalLogs || 0}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <span className="text-[10px] font-bold block uppercase">Approved</span>
                <strong className="text-base font-black">{studentSummary.approved || 0}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                <span className="text-[10px] font-bold block uppercase">Pending Review</span>
                <strong className="text-base font-black">{studentSummary.submitted || 0}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                <span className="text-[10px] font-bold block uppercase">Rejected</span>
                <strong className="text-base font-black">{studentSummary.rejected || 0}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                <span className="text-[10px] font-bold block uppercase">Total Hours</span>
                <strong className="text-base font-black">{studentSummary.totalHours || 0}h</strong>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Logs</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalLogsCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Pending Review</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{pendingReviewCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Approved</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Rejected</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">{rejectedCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">Total Hours</span>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{totalHoursCount}h</p>
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
                placeholder="Search by student name, work title or task..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
                {[
                  { id: 'submitted', label: 'Pending Review' },
                  { id: 'all', label: 'All Status' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setStatusFilter(st.id);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      statusFilter === st.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-extrabold cursor-pointer max-w-xs truncate"
            >
              <option value="all">All Assigned Students ({assignedStudents.length})</option>
              {assignedStudents.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>

            {internships.length > 0 && (
              <select
                value={selectedInternshipId}
                onChange={(e) => {
                  setSelectedInternshipId(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-extrabold cursor-pointer max-w-xs truncate"
              >
                <option value="all">All Internships</option>
                {internships.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title}
                  </option>
                ))}
              </select>
            )}

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
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading student work logs...</p>
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
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No work logs found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no work logs matching your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Student</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Work Log Title</th>
                    <th className="py-4 px-5">Task</th>
                    <th className="py-4 px-5">Hours</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLogs.map((log) => {
                    const studentName = typeof log.studentId === 'object' ? log.studentId?.name : 'Student';
                    const studentEmail = typeof log.studentId === 'object' ? log.studentId?.email : '';
                    return (
                      <tr key={log._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          <div>{studentName}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{studentEmail}</div>
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {formatDate(log.date)}
                        </td>

                        <td className="py-4 px-5 max-w-xs">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{log.title}</div>
                          <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5 font-medium">{log.description}</p>
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-600 dark:text-slate-400">
                          {log.taskId?.title || 'General Activity'}
                        </td>

                        <td className="py-4 px-5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {log.hoursWorked}h
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          <WorkLogStatusBadge status={log.status} />
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                          {log.status === 'submitted' ? (
                            <button
                              onClick={() => {
                                setReviewModalLog(log);
                                setMentorFeedback('');
                              }}
                              className="px-4 py-1.5 text-xs font-black text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-1"
                            >
                              <MessageSquare size={14} />
                              <span>Review</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/student/worklogs/${log._id}`)}
                              className="px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reviewModalLog && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Review Work Log</h3>
                  <p className="text-xs text-slate-400">
                    Student: {typeof reviewModalLog.studentId === 'object' ? reviewModalLog.studentId?.name : 'Student'}
                  </p>
                </div>
                <button
                  onClick={() => setReviewModalLog(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">{formatDate(reviewModalLog.date)}</span>
                    <span className="font-black text-blue-600 dark:text-blue-400">{reviewModalLog.hoursWorked} Hours Worked</span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{reviewModalLog.title}</h4>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{reviewModalLog.description}</p>
                </div>

                {reviewModalLog.challenges && (
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase">Challenges Faced</span>
                    <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-slate-800 dark:text-slate-200 mt-0.5">{reviewModalLog.challenges}</p>
                  </div>
                )}

                {reviewModalLog.learning && (
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase">Learning Outcomes</span>
                    <p className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 mt-0.5">{reviewModalLog.learning}</p>
                  </div>
                )}

                {reviewModalLog.githubLink && (
                  <div>
                    <a
                      href={reviewModalLog.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      <span>Open GitHub Code Link</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {reviewError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 font-bold">
                    {reviewError}
                  </div>
                )}

                <div className="pt-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mentor Feedback <span className="text-rose-500">* (Required for Rejection)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={mentorFeedback}
                    onChange={(e) => setMentorFeedback(e.target.value)}
                    placeholder="Enter review notes or detailed rejection feedback..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium"
                  ></textarea>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
                <button
                  disabled={reviewing}
                  onClick={() => handleReviewAction('rejected')}
                  className="px-4 py-2 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Reject Work Log
                </button>
                <button
                  disabled={reviewing}
                  onClick={() => handleReviewAction('approved')}
                  className="px-5 py-2 font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {reviewing ? 'Processing...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
