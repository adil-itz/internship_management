import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge';
import { createAttendance, updateAttendance, getStudentAttendance, getAttendanceSummary } from '../../services/attendance.service';
import { getStudentApplications } from '../../services/application.service';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CalendarOff,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Briefcase,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  Layers,
  Sparkles,
  LogIn,
  LogOut,
  Check
} from 'lucide-react';

export default function StudentAttendance({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }
  const studentId = activeUser?.id || activeUser?._id || activeUser?.user?.id || activeUser?.user?._id;

  const [applications, setApplications] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');

  const [summary, setSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    halfDayDays: 0,
    leaveDays: 0,
    attendancePercentage: 0
  });

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentView, setCurrentView] = useState('table');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [notification, setNotification] = useState(null);
  const [checkError, setCheckError] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const getTodayRecord = () => {
    const todayStr = getTodayISO();
    return attendanceRecords.find((r) => {
      if (!r.date) return false;
      const dStr = new Date(r.date).toISOString().split('T')[0];
      return dStr === todayStr;
    });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchSummaryAndRecords(pagination.page);
  }, [studentId, statusFilter, fromDate, toDate, pagination.page]);

  const fetchApplications = async () => {
    try {
      const res = await getStudentApplications();
      if (res && res.success) {
        const selectedApps = (res.applications || []).filter((a) => a.status === 'selected');
        setApplications(selectedApps);
        if (selectedApps.length > 0) {
          const internId = typeof selectedApps[0].internship === 'object' ? selectedApps[0].internship._id : selectedApps[0].internship;
          setSelectedInternshipId(internId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummaryAndRecords = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (!studentId) {
        setLoading(false);
        return;
      }

      const summaryRes = await getAttendanceSummary(studentId);
      if (summaryRes && summaryRes.success) {
        setSummary(summaryRes.data || {});
      }

      const params = {
        page: currentPage,
        limit: pagination.limit
      };
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const recordsRes = await getStudentAttendance(studentId, params);
      if (recordsRes && recordsRes.success) {
        let docs = recordsRes.data || [];
        if (statusFilter !== 'all') {
          docs = docs.filter((r) => r.status?.toLowerCase() === statusFilter.toLowerCase());
        }
        setAttendanceRecords(docs);
        if (recordsRes.pagination) {
          setPagination(recordsRes.pagination);
        }
      } else {
        setError('Unable to load attendance history.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load attendance history.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCheckInStatusAndRemark = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours > 14 || (hours === 14 && minutes > 0)) {
      return { status: 'half-day', remark: 'Half-day Check-in (after 2:00 PM)', label: 'Half Day' };
    }
    if (hours > 9 || (hours === 9 && minutes > 10)) {
      return { status: 'late', remark: 'Late Check-in (after 9:10 AM)', label: 'Late Arrival' };
    }
    return { status: 'present', remark: 'On-time Check-in', label: 'Present' };
  };

  const handleCheckIn = async () => {
    setCheckError(null);
    if (!selectedInternshipId) {
      setCheckError('No active selected internship found for attendance check-in.');
      return;
    }

    setCheckingIn(true);
    try {
      const nowTimeStr = getCurrentFormattedTime();
      const { status, remark, label } = getCheckInStatusAndRemark();

      const res = await createAttendance({
        studentId,
        internshipId: selectedInternshipId,
        date: getTodayISO(),
        status,
        checkIn: nowTimeStr,
        remarks: remark
      });

      if (res && res.success) {
        showNotification(`Checked in successfully at ${nowTimeStr} (${label})`);
        fetchSummaryAndRecords(1);
      } else {
        setCheckError(res.message || 'Failed to check in.');
      }
    } catch (err) {
      if (err.message?.includes('already exists') || err.message?.includes('409')) {
        setCheckError('You have already checked in for today.');
      } else {
        setCheckError(err.message || 'Failed to check in.');
      }
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckError(null);
    const todayRec = getTodayRecord();
    if (!todayRec) {
      setCheckError('You must check in first before checking out.');
      return;
    }

    setCheckingOut(true);
    try {
      const nowTimeStr = getCurrentFormattedTime();
      const res = await updateAttendance(todayRec._id, {
        checkOut: nowTimeStr
      });

      if (res && res.success) {
        showNotification(`Checked out successfully at ${nowTimeStr}`);
        fetchSummaryAndRecords(1);
      } else {
        setCheckError(res.message || 'Failed to check out.');
      }
    } catch (err) {
      setCheckError(err.message || 'Failed to check out.');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return timeStr;
  };

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const recordsMap = new Map();
    attendanceRecords.forEach((r) => {
      if (r.date) {
        const dKey = new Date(r.date).toISOString().split('T')[0];
        recordsMap.set(dKey, r);
      }
    });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={18} className="text-blue-500" />
            <span>{monthNames[month]} {year}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="h-16 rounded-2xl bg-slate-50/40 dark:bg-slate-950/40"></div>;
            }

            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const rec = recordsMap.get(dateStr);

            let bgClass = 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300';
            let badgeText = '';

            if (rec) {
              switch (rec.status?.toLowerCase()) {
                case 'present':
                  bgClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold';
                  badgeText = 'Present (P)';
                  break;
                case 'absent':
                  bgClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-extrabold';
                  badgeText = 'Absent (A)';
                  break;
                case 'late':
                  bgClass = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-extrabold';
                  badgeText = 'Late (L)';
                  break;
                case 'half-day':
                  bgClass = 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-extrabold';
                  badgeText = 'Half Day (H)';
                  break;
                case 'leave':
                  bgClass = 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-extrabold';
                  badgeText = 'Leave (V)';
                  break;
              }
            }

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => rec && setSelectedRecord(rec)}
                className={`h-16 p-2 rounded-2xl border flex flex-col justify-between text-xs transition-all cursor-pointer ${bgClass} ${rec ? 'hover:scale-105 shadow-xs' : ''}`}
                title={rec ? `${dateStr}: ${badgeText}` : `${dateStr}`}
              >
                <span className="font-bold text-[11px]">{dayNum}</span>
                {rec && (
                  <span className="text-[10px] font-black uppercase truncate text-center block">
                    {rec.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          <span className="text-slate-400 text-[10px] uppercase">Legend:</span>
          <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present</span>
          <span className="flex items-center gap-1.5 text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Absent</span>
          <span className="flex items-center gap-1.5 text-amber-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Late</span>
          <span className="flex items-center gap-1.5 text-purple-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Half Day</span>
          <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Leave</span>
        </div>
      </div>
    );
  };

  const todayRecord = getTodayRecord();

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-attendance">
      <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <CalendarIcon size={14} />
              <span>Attendance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Daily Attendance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Standard shift time is 9:00 AM to 5:00 PM. Check-in after 9:10 AM is automatically marked as Late Arrival.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 relative z-10">
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 block">Attendance Rate</span>
              <span className="text-2xl font-black text-white">{summary.attendancePercentage || 0}%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400/30 flex items-center justify-center relative">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        {checkError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{checkError}</span>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Today's Attendance Action</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </h3>
            </div>

            {applications.length > 1 && (
              <div>
                <select
                  value={selectedInternshipId}
                  onChange={(e) => setSelectedInternshipId(e.target.value)}
                  className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white"
                >
                  {applications.map((app) => {
                    const intern = typeof app.internship === 'object' ? app.internship : null;
                    return (
                      <option key={app._id} value={intern?._id || app.internship}>
                        {intern?.title || 'Internship Program'}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="space-y-1">
              {!todayRecord ? (
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                  <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"></span>
                  <span>Not checked in today yet. Expected arrival before 09:10 AM.</span>
                </div>
              ) : !todayRecord.checkOut ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Checked In at {formatTime(todayRecord.checkIn)}</span>
                    <AttendanceStatusBadge status={todayRecord.status} />
                  </div>
                  <p className="text-xs text-slate-400">Remember to click Check Out at 05:00 PM when wrapping up work.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Today's Shift Completed</span>
                    <AttendanceStatusBadge status={todayRecord.status} />
                  </div>
                  <p className="text-xs text-slate-400">Check In: {formatTime(todayRecord.checkIn)} • Check Out: {formatTime(todayRecord.checkOut)}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!todayRecord ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn size={16} />
                  <span>{checkingIn ? 'Checking In...' : 'Check In Now'}</span>
                </button>
              ) : !todayRecord.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogOut size={16} />
                  <span>{checkingOut ? 'Checking Out...' : 'Check Out Now'}</span>
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-2">
                  <Check size={16} />
                  <span>Shift Logged</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Days</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">{summary.totalDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Present</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{summary.presentDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Absent</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">{summary.absentDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Late</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{summary.lateDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500">Half Days</span>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">{summary.halfDayDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">Leave</span>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{summary.leaveDays || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">Attendance</span>
            <p className="text-xl font-black text-white">{summary.attendancePercentage || 0}%</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('table')}
                className={`px-4 py-2 text-xs font-extrabold rounded-2xl transition-all cursor-pointer ${
                  currentView === 'table'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 text-xs font-extrabold rounded-2xl transition-all cursor-pointer ${
                  currentView === 'calendar'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Monthly Calendar View
              </button>
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
            <span className="font-extrabold text-slate-400 text-[10px] uppercase">Date Range Filter:</span>
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
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {currentView === 'calendar' ? (
          renderCalendar()
        ) : loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading attendance history...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <CalendarIcon size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No attendance records found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the Check In button above to log your shift attendance today.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Check In</th>
                    <th className="py-4 px-5">Check Out</th>
                    <th className="py-4 px-5">Remarks</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {attendanceRecords.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatDate(r.date)}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <AttendanceStatusBadge status={r.status} />
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatTime(r.checkIn)}
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatTime(r.checkOut)}
                      </td>

                      <td className="py-4 px-5 text-slate-500 font-medium max-w-xs truncate">
                        {r.remarks || '-'}
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
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
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

        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Attendance Details</h3>
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

                {selectedRecord.internshipId && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Internship</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-blue-500" />
                      <span>{selectedRecord.internshipId.title || 'Internship Program'}</span>
                    </p>
                  </div>
                )}

                {selectedRecord.markedBy && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Marked By</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                      <User size={14} className="text-emerald-500" />
                      <span>{selectedRecord.markedBy.name || 'System / Mentor'}</span>
                    </p>
                  </div>
                )}

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
