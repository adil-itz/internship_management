import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge';
import { getInternshipAttendance, getCompanyAllAttendance } from '../../services/attendance.service';
import { getCompanyInternships } from '../../services/internship.service';
import {
  Building2,
  Search,
  Filter,
  Eye,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  User,
  AlertCircle,
  X,
  TrendingUp
} from 'lucide-react';

export default function CompanyAttendance({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [companyInternships, setCompanyInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('all');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchCompanyInternships();
  }, []);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedInternshipId, selectedDate]);

  const fetchCompanyInternships = async () => {
    try {
      const res = await getCompanyInternships();
      if (res && res.success) {
        setCompanyInternships(res.internships || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedDate) params.date = selectedDate;
      if (selectedInternshipId !== 'all') params.internshipId = selectedInternshipId;

      const res = await getCompanyAllAttendance(params);
      if (res && res.success) {
        const docs = (res.data || []).map((r) => ({
          ...r,
          internshipRef: typeof r.internshipId === 'object' ? r.internshipId : null
        }));
        setAttendanceRecords(docs);
      } else {
        setError('Unable to load company attendance records.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter((rec) => {
    if (statusFilter !== 'all' && rec.status?.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const sName = typeof rec.studentId === 'object' ? rec.studentId?.name?.toLowerCase() : '';
      const sEmail = typeof rec.studentId === 'object' ? rec.studentId?.email?.toLowerCase() : '';
      const iTitle = rec.internshipRef?.title?.toLowerCase() || '';

      if (!sName?.includes(q) && !sEmail?.includes(q) && !iTitle.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return timeStr;
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="company-attendance">
      <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Building2 size={14} />
              <span>Employer Attendance Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Student Intern Attendance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Review real-time presence records, check-in timestamps, and shift completion for your company's interns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Records</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{attendanceRecords.length}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Present</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {attendanceRecords.filter((r) => r.status === 'present').length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Absent</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {attendanceRecords.filter((r) => r.status === 'absent').length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Late / Half Day</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {attendanceRecords.filter((r) => r.status === 'late' || r.status === 'half-day').length}
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
                placeholder="Search intern name or email..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
              {[
                { id: 'all', label: 'All Status' },
                { id: 'present', label: 'Present' },
                { id: 'absent', label: 'Absent' },
                { id: 'late', label: 'Late' },
                { id: 'half-day', label: 'Half Day' },
                { id: 'leave', label: 'Leave' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
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

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {companyInternships.length > 0 && (
              <select
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(e.target.value)}
                className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-extrabold cursor-pointer max-w-xs truncate"
              >
                <option value="all">All Internships</option>
                {companyInternships.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-extrabold text-[10px] uppercase">Filter Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
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
            <p className="text-xs font-bold text-slate-400">Loading student attendance records...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <CalendarIcon size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No attendance records found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No attendance records found for your company's selected student interns.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Student Intern</th>
                    <th className="py-4 px-5">Internship</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Check In / Out</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredRecords.map((r) => {
                    const studentName = typeof r.studentId === 'object' ? r.studentId?.name : 'Student';
                    const studentEmail = typeof r.studentId === 'object' ? r.studentId?.email : '';
                    const internTitle = r.internshipRef?.title || 'Internship Program';

                    return (
                      <tr key={r._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          <div>{studentName}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{studentEmail}</div>
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">
                          {internTitle}
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {formatDate(r.date)}
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          <AttendanceStatusBadge status={r.status} />
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatTime(r.checkIn)} - {formatTime(r.checkOut)}
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="px-3.5 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
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

        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Intern Attendance Record</h3>
                  <p className="text-xs text-slate-400">{formatDate(selectedRecord.date)}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Status</span>
                  <AttendanceStatusBadge status={selectedRecord.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Check In</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formatTime(selectedRecord.checkIn)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Check Out</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formatTime(selectedRecord.checkOut)}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Student Intern</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {typeof selectedRecord.studentId === 'object' ? selectedRecord.studentId?.name : 'Student'}
                  </p>
                </div>

                {selectedRecord.remarks && (
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Remarks</span>
                    <p className="mt-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {selectedRecord.remarks}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
