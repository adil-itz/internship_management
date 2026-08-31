import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import { getMentorTasks } from '../../services/internshipTask.service';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User
} from 'lucide-react';

export default function AdminTasks({ darkMode, setDarkMode, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedViewTask, setSelectedViewTask] = useState(null);

  useEffect(() => {
    fetchAdminTasks();
  }, [statusFilter, priorityFilter, searchQuery]);

  const fetchAdminTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await getMentorTasks(params);
      if (res && res.success) {
        setTasks(res.tasks || []);
      } else {
        setError('Failed to load tasks.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="admin-tasks">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={24} className="text-blue-500" /> Admin Task Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global monitoring of all internship tasks, assignments, deadlines, and student progress across the platform
          </p>
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
              className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold cursor-pointer"
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
            <p className="text-xs font-bold text-slate-400">Loading all tasks...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Briefcase size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No tasks found</h3>
            <p className="text-xs text-slate-500">
              No tasks match your selected query or filters.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Task & Internship</th>
                    <th className="py-4 px-5">Student</th>
                    <th className="py-4 px-5">Priority</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Progress</th>
                    <th className="py-4 px-5">Due Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {tasks.map((t) => {
                    const studentName = t.student?.name || 'Student';
                    const studentEmail = t.student?.email || '';
                    const internshipTitle = t.internship?.title || 'N/A';
                    const companyName = t.internship?.company || 'Company';

                    return (
                      <tr key={t._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 max-w-xs">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{t.title}</div>
                          <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                            <Briefcase size={12} className="text-blue-500" /> {internshipTitle} ({companyName})
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 dark:text-white">{studentName}</div>
                          <div className="text-slate-400 text-[11px]">{studentEmail}</div>
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

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedViewTask(t)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all cursor-pointer"
                            title="View Full Task Details"
                          >
                            <Eye size={16} />
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

        <TaskDetailsModal
          isOpen={!!selectedViewTask}
          onClose={() => setSelectedViewTask(null)}
          task={selectedViewTask}
        />
      </div>
    </DashboardLayout>
  );
}
