import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge';
import {
  createAttendance,
  updateAttendance,
  getStudentAttendance,
  getInternshipAttendance,
  getAttendanceSummary
} from '../../services/attendance.service';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import {
  Calendar as CalendarIcon,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  User,
  Briefcase,
  AlertTriangle,
  CalendarOff,
  Check,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function MentorAttendance({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  const [assignments, setAssignments] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInternshipId, setSelectedInternshipId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [markForm, setMarkForm] = useState({
    studentId: '',
    internshipId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    remarks: ''
  });
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState(null);

  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    status: 'present',
    checkIn: '',
    checkOut: '',
    remarks: ''
  });
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState(null);

  const [viewStudent, setViewStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [studentSummaryData, setStudentSummaryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    loadMentorData();
  }, []);

  useEffect(() => {
    if (internships.length > 0) {
      fetchTodayAttendance();
    }
  }, [internships, selectedDate, selectedInternshipId, statusFilter]);

  const loadMentorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAssignments();
      if (res && res.success) {
        setAssignments(res.assignments || []);

        const studentsMap = new Map();
        const internMap = new Map();

        (res.assignments || []).forEach((a) => {
          if (a.student) {
            studentsMap.set(a.student._id, {
              ...a.student,
              internship: a.internship
            });
          }
          if (a.internship) {
            internMap.set(a.internship._id, a.internship);
          }
        });

        const sList = Array.from(studentsMap.values());
        const iList = Array.from(internMap.values());

        setAssignedStudents(sList);
        setInternships(iList);

        if (sList.length > 0) {
          setMarkForm((prev) => ({
            ...prev,
            studentId: sList[0]._id,
            internshipId: sList[0].internship?._id || sList[0].internship || ''
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load assigned students.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      let aggregated = [];
      const targetInternships = selectedInternshipId !== 'all'
        ? internships.filter((i) => i._id === selectedInternshipId)
        : internships;

      for (const intern of targetInternships) {
        try {
          const res = await getInternshipAttendance(intern._id, { date: selectedDate });
          if (res && res.success && res.data) {
            aggregated = [...aggregated, ...res.data];
          }
        } catch (e) {}
      }

      setTodayRecords(aggregated);
    } catch (err) {
      console.error(err);
    }
  };

  const openStudentHistory = async (student) => {
    setViewStudent(student);
    setLoadingHistory(true);
    try {
      const sumRes = await getAttendanceSummary(student._id);
      if (sumRes && sumRes.success) {
        setStudentSummaryData(sumRes.data || {});
      }

      const recRes = await getStudentAttendance(student._id);
      if (recRes && recRes.success) {
        setStudentHistory(recRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStudentSelectInMarkForm = (studId) => {
    const found = assignedStudents.find((s) => s._id === studId);
    const internId = found?.internship?._id || found?.internship || '';
    setMarkForm((prev) => ({
      ...prev,
      studentId: studId,
      internshipId: internId
    }));
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    setMarkError(null);

    if (!markForm.studentId || !markForm.internshipId || !markForm.date || !markForm.status) {
      setMarkError('Please fill in all required fields.');
      return;
    }

    setMarking(true);
    try {
      const res = await createAttendance({
        studentId: markForm.studentId,
        internshipId: markForm.internshipId,
        date: markForm.date,
        status: markForm.status,
        checkIn: markForm.checkIn || undefined,
        checkOut: markForm.checkOut || undefined,
        remarks: markForm.remarks || undefined
      });

      if (res && res.success) {
        showNotification('Attendance marked successfully.');
        setMarkModalOpen(false);
        setMarkForm((prev) => ({ ...prev, remarks: '' }));
        fetchTodayAttendance();
      } else {
        setMarkError(res.message || 'Failed to mark attendance.');
      }
    } catch (err) {
      if (err.message?.includes('already exists') || err.message?.includes('409')) {
        setMarkError('Attendance has already been marked for this student on this date.');
      } else {
        setMarkError(err.message || 'Failed to mark attendance.');
      }
    } finally {
      setMarking(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (!editRecord) return;

    setUpdating(true);
    try {
      const res = await updateAttendance(editRecord._id, {
        status: editForm.status,
        checkIn: editForm.checkIn || undefined,
        checkOut: editForm.checkOut || undefined,
        remarks: editForm.remarks || undefined
      });

      if (res && res.success) {
        showNotification('Attendance updated successfully.');
        setEditRecord(null);
        fetchTodayAttendance();
        if (viewStudent && viewStudent._id === editRecord.studentId?._id) {
          openStudentHistory(viewStudent);
        }
      } else {
        setEditError(res.message || 'Failed to update attendance.');
      }
    } catch (err) {
      setEditError(err.message || 'Failed to update attendance.');
    } finally {
      setUpdating(false);
    }
  };

  const getRecordForStudentAndDate = (studId) => {
    return todayRecords.find((r) => {
      const sId = typeof r.studentId === 'object' ? r.studentId?._id : r.studentId;
      return sId === studId;
    });
  };

  const filteredStudentList = assignedStudents.filter((stud) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = stud.name?.toLowerCase().includes(q);
      const matchEmail = stud.email?.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }

    if (selectedInternshipId !== 'all') {
      const internId = stud.internship?._id || stud.internship;
      if (internId !== selectedInternshipId) return false;
    }

    if (statusFilter !== 'all') {
      const rec = getRecordForStudentAndDate(stud._id);
      if (!rec || rec.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }

    return true;
  });

  const totalStudentsCount = assignedStudents.length;
  const presentTodayCount = todayRecords.filter((r) => r.status === 'present').length;
  const absentTodayCount = todayRecords.filter((r) => r.status === 'absent').length;
  const lateTodayCount = todayRecords.filter((r) => r.status === 'late').length;
  const leaveTodayCount = todayRecords.filter((r) => r.status === 'leave').length;

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
              <span>Mentor Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Attendance Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Mark and edit daily attendance for your assigned student interns, track presence rates, and inspect histories.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => setMarkModalOpen(true)}
              className="px-5 py-3 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Students</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalStudentsCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Present</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{presentTodayCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Absent</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">{absentTodayCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Late</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{lateTodayCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">Leave</span>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{leaveTodayCount}</p>
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
                placeholder="Search assigned student by name or email..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-extrabold text-slate-400 text-[10px] uppercase">Attendance Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
            />

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
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading assigned students and attendance...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : filteredStudentList.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <UserCheck size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No assigned students found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No assigned students match your selected search or filter options.
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
                    <th className="py-4 px-5">Status ({formatDate(selectedDate)})</th>
                    <th className="py-4 px-5">Check In / Out</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudentList.map((stud) => {
                    const rec = getRecordForStudentAndDate(stud._id);
                    const internTitle = stud.internship?.title || 'Internship';

                    return (
                      <tr key={stud._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                              {stud.name ? stud.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                              <div>{stud.name}</div>
                              <div className="text-[10px] text-slate-400 font-semibold">{stud.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">
                          {internTitle}
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          {rec ? (
                            <AttendanceStatusBadge status={rec.status} />
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                              Not Marked
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {rec ? `${rec.checkIn || '--:--'} - ${rec.checkOut || '--:--'}` : '-'}
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                          {rec ? (
                            <button
                              onClick={() => {
                                setEditRecord(rec);
                                setEditForm({
                                  status: rec.status || 'present',
                                  checkIn: rec.checkIn || '09:00 AM',
                                  checkOut: rec.checkOut || '05:00 PM',
                                  remarks: rec.remarks || ''
                                });
                              }}
                              className="px-3 py-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const internId = stud.internship?._id || stud.internship || '';
                                setMarkForm({
                                  studentId: stud._id,
                                  internshipId: internId,
                                  date: selectedDate,
                                  status: 'present',
                                  checkIn: '09:00 AM',
                                  checkOut: '05:00 PM',
                                  remarks: ''
                                });
                                setMarkModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-1"
                            >
                              <Plus size={14} />
                              <span>Mark</span>
                            </button>
                          )}

                          <button
                            onClick={() => openStudentHistory(stud)}
                            className="px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye size={14} />
                            <span>History</span>
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

        {markModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Mark Student Attendance</h3>
                  <p className="text-xs text-slate-400">Record attendance status and hours</p>
                </div>
                <button
                  onClick={() => setMarkModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {markError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{markError}</span>
                </div>
              )}

              <form onSubmit={handleMarkSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student</label>
                  <select
                    value={markForm.studentId}
                    onChange={(e) => handleStudentSelectInMarkForm(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  >
                    {assignedStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={markForm.date}
                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attendance Status</label>
                  <select
                    value={markForm.status}
                    onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check In Time</label>
                    <input
                      type="text"
                      value={markForm.checkIn}
                      onChange={(e) => setMarkForm({ ...markForm, checkIn: e.target.value })}
                      placeholder="09:00 AM"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check Out Time</label>
                    <input
                      type="text"
                      value={markForm.checkOut}
                      onChange={(e) => setMarkForm({ ...markForm, checkOut: e.target.value })}
                      placeholder="05:00 PM"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    value={markForm.remarks}
                    onChange={(e) => setMarkForm({ ...markForm, remarks: e.target.value })}
                    placeholder="Add optional notes..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMarkModalOpen(false)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={marking}
                    className="px-5 py-2 font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {marking ? 'Saving...' : 'Mark Attendance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editRecord && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Edit Attendance</h3>
                  <p className="text-xs text-slate-400">Date: {formatDate(editRecord.date)}</p>
                </div>
                <button
                  onClick={() => setEditRecord(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check In Time</label>
                    <input
                      type="text"
                      value={editForm.checkIn}
                      onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                      placeholder="09:00 AM"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check Out Time</label>
                    <input
                      type="text"
                      value={editForm.checkOut}
                      onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                      placeholder="05:00 PM"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                  <textarea
                    rows={2}
                    value={editForm.remarks}
                    onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                    placeholder="Update remarks..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRecord(null)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Student Attendance History</h3>
                  <p className="text-xs text-slate-400">{viewStudent.name} ({viewStudent.email})</p>
                </div>
                <button
                  onClick={() => setViewStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {studentSummaryData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-bold block uppercase text-[9px]">Total Days</span>
                    <strong className="font-black text-slate-900 dark:text-white text-sm">{studentSummaryData.totalDays || 0}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <span className="font-bold block uppercase text-[9px]">Present</span>
                    <strong className="font-black text-sm">{studentSummaryData.presentDays || 0}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    <span className="font-bold block uppercase text-[9px]">Absent</span>
                    <strong className="font-black text-sm">{studentSummaryData.absentDays || 0}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-600 text-white font-extrabold">
                    <span className="font-bold block uppercase text-[9px]">Rate</span>
                    <strong className="font-black text-sm">{studentSummaryData.attendancePercentage || 0}%</strong>
                  </div>
                </div>
              )}

              {loadingHistory ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400">Loading student attendance history...</div>
              ) : (
                <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Check In/Out</th>
                        <th className="p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {studentHistory.map((h) => (
                        <tr key={h._id}>
                          <td className="p-3 font-bold">{formatDate(h.date)}</td>
                          <td className="p-3"><AttendanceStatusBadge status={h.status} /></td>
                          <td className="p-3 font-medium">{h.checkIn || '--'} - {h.checkOut || '--'}</td>
                          <td className="p-3 text-slate-500 font-medium">{h.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
