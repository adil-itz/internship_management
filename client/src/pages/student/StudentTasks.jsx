import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import SubmitTaskModal from '../../components/tasks/SubmitTaskModal';
import { getStudentTasks, updateTaskProgress } from '../../services/internshipTask.service';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  Send,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Sliders,
  ExternalLink,
  AlertCircle,
  Briefcase,
  User,
  Check
} from 'lucide-react';

export default function StudentTasks({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [summaryStats, setSummaryStats] = useState({
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

  const [viewTask, setViewTask] = useState(null);
  const [submitTaskItem, setSubmitTaskItem] = useState(null);

  const [progressSliders, setProgressSliders] = useState({});
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchStudentTasks();
  }, [statusFilter, priorityFilter]);

  const fetchStudentTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;

      const res = await getStudentTasks(params);
      if (res && res.success) {
        setTasks(res.tasks || []);
        setOverallProgress(res.overallProgress || 0);
        setSummaryStats({
          totalTasks: res.totalTasks || 0,
          completedTasks: res.completedTasks || 0,
          inProgressTasks: res.inProgressTasks || 0,
          submittedTasks: res.submittedTasks || 0,
          overdueTasks: res.overdueTasks || 0
        });

        const initialSliders = {};
        (res.tasks || []).forEach((t) => {
          initialSliders[t._id] = t.progress || 0;
        });
        setProgressSliders(initialSliders);
      } else {
        setError('Failed to fetch tasks.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = (taskId, value) => {
    const val = Math.min(100, Math.max(0, Number(value) || 0));
    setProgressSliders((prev) => ({ ...prev, [taskId]: val }));
  };

  const handleSaveProgress = async (taskId) => {
    const progressVal = progressSliders[taskId];
    setUpdatingTaskId(taskId);
    try {
      const res = await updateTaskProgress(taskId, { progress: progressVal });
      if (res && res.success) {
        showNotification('Task progress updated successfully.');
        fetchStudentTasks();
      } else {
        alert(res.message || 'Unable to update progress.');
      }
    } catch (err) {
      alert(err.message || 'Unable to update progress.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-tasks">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 size={24} className="text-blue-500" /> My Internship Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track assigned tasks, update completion progress, and submit work deliverables to your mentor
          </p>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 p-6 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-100">Overall Progress</span>
              <span className="text-2xl font-black text-white">{overallProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-blue-100 font-medium">
              Average progress across all your active internship tasks
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Tasks</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summaryStats.totalTasks}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">In Progress</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{summaryStats.inProgressTasks}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500">Submitted</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{summaryStats.submittedTasks}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Completed</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{summaryStats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by task title or description..."
              className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No tasks assigned to you yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When your mentor assigns tasks to you, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((t) => {
              const mentorName = t.mentor?.name || 'Mentor';
              const internshipTitle = t.internship?.title || 'Internship';
              const companyName = t.internship?.company || 'Company';
              const isLocked = t.status === 'completed' || t.status === 'cancelled';
              const sliderVal = progressSliders[t._id] !== undefined ? progressSliders[t._id] : t.progress || 0;

              return (
                <div
                  key={t._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5 flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <TaskPriorityBadge priority={t.priority} />
                      <TaskStatusBadge status={t.status} />
                    </div>

                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 font-bold">
                          <User size={13} className="text-blue-500" /> Mentor: {mentorName}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[11px] text-slate-400">
                          <Clock size={12} /> Due: {formatDate(t.dueDate)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <Briefcase size={12} className="text-emerald-500" /> {internshipTitle} ({companyName})
                      </div>
                    </div>

                    <TaskProgressBar progress={t.progress} />

                    {!isLocked && (
                      <div className="p-3.5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-extrabold text-slate-700 dark:text-slate-300">
                          <span>Update Progress: {sliderVal}%</span>
                          <button
                            onClick={() => handleSaveProgress(t._id)}
                            disabled={updatingTaskId === t._id}
                            className="px-3 py-1 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            {updatingTaskId === t._id ? 'Saving...' : 'Update'}
                          </button>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderVal}
                          onChange={(e) => handleProgressChange(t._id, e.target.value)}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                      </div>
                    )}

                    {t.mentorFeedback && (
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                        <span className="font-extrabold text-amber-700 dark:text-amber-300 text-[10px] uppercase">Mentor Feedback</span>
                        <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{t.mentorFeedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/student/tasks/${t._id}`)}
                      className="px-4 py-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>

                    {!isLocked && (
                      <button
                        onClick={() => setSubmitTaskItem(t)}
                        disabled={t.status === 'submitted'}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                          t.status === 'submitted'
                            ? 'bg-purple-100 text-purple-600 cursor-not-allowed opacity-75'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                        }`}
                      >
                        <Send size={14} />
                        <span>{t.status === 'submitted' ? 'Submitted' : 'Submit Task'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <TaskDetailsModal
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
          task={viewTask}
        />

        <SubmitTaskModal
          isOpen={!!submitTaskItem}
          onClose={() => setSubmitTaskItem(null)}
          task={submitTaskItem}
          onSuccess={() => {
            fetchStudentTasks();
            showNotification('Task submitted successfully.');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
