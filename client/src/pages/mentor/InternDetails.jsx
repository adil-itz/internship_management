import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import EditTaskModal from '../../components/tasks/EditTaskModal';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import ReviewTaskModal from '../../components/tasks/ReviewTaskModal';
import DeleteTaskModal from '../../components/tasks/DeleteTaskModal';
import { getTasksByIntern } from '../../services/internshipTask.service';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Calendar,
  AlertCircle,
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Check
} from 'lucide-react';

export default function InternDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [assignmentData, setAssignmentData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    overallProgress: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    submittedTasks: 0,
    overdueTasks: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [reviewTaskItem, setReviewTaskItem] = useState(null);
  const [deleteTaskItem, setDeleteTaskItem] = useState(null);

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchInternAndTaskData();
  }, [id]);

  const fetchInternAndTaskData = async () => {
    setLoading(true);
    setError(null);
    try {
      let studentId = id;
      const assignmentsRes = await getMyAssignments();
      if (assignmentsRes && assignmentsRes.success) {
        const foundAss = (assignmentsRes.assignments || []).find(
          (a) => a._id === id || a.student?._id === id
        );
        if (foundAss) {
          setAssignmentData(foundAss);
          studentId = foundAss.student?._id || id;
        }
      }

      const res = await getTasksByIntern(studentId);
      if (res && res.success) {
        setStudentData(res.student);
        setTasks(res.tasks || []);
        setStatistics(res.statistics || {});
      } else {
        setError('Failed to load intern details.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load intern details.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const internship = assignmentData?.internship || {};
  const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="assigned-interns">
      <div className="space-y-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/mentor/interns')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to Internship Supervision
        </button>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading intern details and tasks...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : (
          <>
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  {studentData?.avatar ? (
                    <img
                      src={studentData.avatar}
                      alt={studentData.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                      {studentData?.name ? studentData.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                  <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {studentData?.name || 'Student Name'}
                    </h1>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      <span>{studentData?.email}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Plus size={16} />
                  <span>Create Task</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <Briefcase size={16} className="text-blue-500" /> Internship Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase">Title</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{internship.title || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase">Company</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                        <Building2 size={13} className="text-blue-500" /> {companyName}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase">Start Date</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formatDate(internship.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase">End Date</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formatDate(internship.endDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <User size={16} className="text-emerald-500" /> Progress Summary
                  </h3>
                  <TaskProgressBar progress={statistics.overallProgress} />
                  <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[8px]">Total</span>
                      <strong className="font-black text-slate-900 dark:text-white text-xs">{statistics.totalTasks || 0}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      <span className="font-bold block uppercase text-[8px]">In Progress</span>
                      <strong className="font-black text-xs">{statistics.inProgressTasks || 0}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      <span className="font-bold block uppercase text-[8px]">Submitted</span>
                      <strong className="font-black text-xs">{statistics.submittedTasks || 0}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <span className="font-bold block uppercase text-[8px]">Completed</span>
                      <strong className="font-black text-xs">{statistics.completedTasks || 0}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                      <span className="font-bold block uppercase text-[8px]">Overdue</span>
                      <strong className="font-black text-xs">{statistics.overdueTasks || 0}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-1 text-xs">
                    <Filter size={14} className="text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                    >
                      <option value="all">All Status</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="p-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Briefcase size={32} className="mx-auto text-slate-400" />
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No tasks assigned yet.</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the "Create Task" button above to assign a task to this intern.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          <th className="py-4 px-5">Task Details</th>
                          <th className="py-4 px-5">Priority</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5">Progress</th>
                          <th className="py-4 px-5">Due Date</th>
                          <th className="py-4 px-5">Submission</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {filteredTasks.map((t) => (
                          <tr key={t._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                            <td className="py-4 px-5 max-w-xs">
                              <div className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{t.title}</div>
                              <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5 font-medium">{t.description}</p>
                            </td>

                            <td className="py-4 px-5">
                              <TaskPriorityBadge priority={t.priority} />
                            </td>

                            <td className="py-4 px-5">
                              <TaskStatusBadge status={t.status} />
                            </td>

                            <td className="py-4 px-5 w-36">
                              <TaskProgressBar progress={t.progress} size="sm" />
                            </td>

                            <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">
                              {formatDate(t.dueDate)}
                            </td>

                            <td className="py-4 px-5">
                              {t.submissionUrl ? (
                                <a
                                  href={t.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                  <span>View Link</span>
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-slate-400 font-medium">None</span>
                              )}
                            </td>

                            <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                              {t.status === 'submitted' && (
                                <button
                                  onClick={() => setReviewTaskItem(t)}
                                  className="px-3 py-1.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer transition-all"
                                >
                                  Review
                                </button>
                              )}

                              <button
                                onClick={() => setViewTask(t)}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                onClick={() => setEditTask(t)}
                                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-xl transition-all cursor-pointer"
                                title="Edit Task"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() => setDeleteTaskItem(t)}
                                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <CreateTaskModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          defaultInternshipId={internship._id}
          defaultStudentId={studentData?._id}
          onSuccess={() => {
            fetchInternAndTaskData();
            showNotification('Task created successfully.');
          }}
        />

        <EditTaskModal
          isOpen={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          onSuccess={() => {
            fetchInternAndTaskData();
            showNotification('Task updated successfully.');
          }}
        />

        <TaskDetailsModal
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
          task={viewTask}
        />

        <ReviewTaskModal
          isOpen={!!reviewTaskItem}
          onClose={() => setReviewTaskItem(null)}
          task={reviewTaskItem}
          onSuccess={() => {
            fetchInternAndTaskData();
            showNotification('Task reviewed successfully.');
          }}
        />

        <DeleteTaskModal
          isOpen={!!deleteTaskItem}
          onClose={() => setDeleteTaskItem(null)}
          task={deleteTaskItem}
          onSuccess={() => {
            fetchInternAndTaskData();
            showNotification('Task deleted successfully.');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
