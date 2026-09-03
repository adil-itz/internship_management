import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import WorkLogStatusBadge from '../../components/worklogs/WorkLogStatusBadge';
import { getInternshipWorkLogs, getStudentWorkLogs } from '../../services/worklog.service';
import { getInternships } from '../../services/internship.service';
import { getAllAssignmentsAdmin } from '../../services/mentorAssignment.service';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Clock,
  Briefcase,
  UserCheck,
  Users,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export default function AdminWorkLogs({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedInternshipId, setSelectedInternshipId] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchAdminWorkLogs(pagination.page);
  }, [selectedInternshipId, selectedStudentId, statusFilter, fromDate, toDate, pagination.page]);

  const fetchMetadata = async () => {
    try {
      const internRes = await getInternships();
      if (internRes && internRes.success) {
        setInternships(internRes.internships || []);
      }

      const assRes = await getAllAssignmentsAdmin();
      if (assRes && assRes.success) {
        setAssignments(assRes.assignments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminWorkLogs = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: pagination.limit };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      let logsData = [];
      let totalCount = 0;
      let totalPgs = 1;

      if (selectedStudentId !== 'all') {
        const res = await getStudentWorkLogs(selectedStudentId, params);
        if (res && res.success) {
          logsData = res.data || [];
          if (res.pagination) {
            totalCount = res.pagination.total;
            totalPgs = res.pagination.totalPages;
          }
        }
      } else if (selectedInternshipId !== 'all') {
        const res = await getInternshipWorkLogs(selectedInternshipId, params);
        if (res && res.success) {
          logsData = res.data || [];
          if (res.pagination) {
            totalCount = res.pagination.total;
            totalPgs = res.pagination.totalPages;
          }
        }
      } else {
        let aggregated = [];
        if (internships.length > 0) {
          for (const intern of internships) {
            try {
              const res = await getInternshipWorkLogs(intern._id, params);
              if (res && res.success && res.data) {
                aggregated = [...aggregated, ...res.data];
              }
            } catch (e) {}
          }
        }
        logsData = aggregated;
        totalCount = aggregated.length;
        totalPgs = Math.ceil(totalCount / pagination.limit) || 1;
      }

      setWorkLogs(logsData);
      setPagination((prev) => ({
        ...prev,
        page: currentPage,
        total: totalCount,
        totalPages: totalPgs
      }));
    } catch (err) {
      setError(err.message || 'Unable to load admin work logs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = workLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const studentName = typeof log.studentId === 'object' ? log.studentId?.name?.toLowerCase() : '';
      const internTitle = typeof log.internshipId === 'object' ? log.internshipId?.title?.toLowerCase() : '';
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      if (!studentName?.includes(q) && !internTitle?.includes(q) && !matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const getMentorForStudent = (studentId) => {
    const sId = typeof studentId === 'object' ? studentId?._id : studentId;
    const match = assignments.find((a) => a.student?._id === sId || a.student === sId);
    return match?.mentor?.name || 'Unassigned';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="admin-worklogs">
      <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <ShieldAlert size={14} />
              <span>Admin Monitoring Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              System Work Logs Monitor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Global overview of all student work logs across all company internships and mentor assignments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Work Logs</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{workLogs.length}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Submitted / Pending</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {workLogs.filter((l) => l.status === 'submitted').length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Approved</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {workLogs.filter((l) => l.status === 'approved').length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">Total Hours Logged</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {workLogs.reduce((acc, l) => acc + (l.hoursWorked || 0), 0)}h
            </p>
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
                placeholder="Search by student, internship, or work title..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
              {['all', 'draft', 'submitted', 'approved', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
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
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {internships.length > 0 && (
              <select
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(e.target.value)}
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
            <p className="text-xs font-bold text-slate-400">Loading system work logs...</p>
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
              No work logs match your filter selection.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Student</th>
                    <th className="py-4 px-5">Internship</th>
                    <th className="py-4 px-5">Assigned Mentor</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Title</th>
                    <th className="py-4 px-5">Hours</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLogs.map((log) => {
                    const studentName = typeof log.studentId === 'object' ? log.studentId?.name : 'Student';
                    const internTitle = typeof log.internshipId === 'object' ? log.internshipId?.title : 'Internship';
                    const mentorName = getMentorForStudent(log.studentId);

                    return (
                      <tr key={log._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          {studentName}
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">
                          {internTitle}
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-500 dark:text-slate-400">
                          {mentorName}
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {formatDate(log.date)}
                        </td>

                        <td className="py-4 px-5 max-w-xs">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{log.title}</div>
                        </td>

                        <td className="py-4 px-5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {log.hoursWorked}h
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          <WorkLogStatusBadge status={log.status} />
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/student/worklogs/${log._id}`)}
                            className="px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
