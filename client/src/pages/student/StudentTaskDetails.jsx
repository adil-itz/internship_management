import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import SubmitTaskModal from '../../components/tasks/SubmitTaskModal';
import { getTaskById, updateTaskProgress } from '../../services/internshipTask.service';
import {
  ArrowLeft,
  User,
  Briefcase,
  Calendar,
  Send,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Check,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileCheck
} from 'lucide-react';

export default function StudentTaskDetails({ darkMode, setDarkMode, user }) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [progressVal, setProgressVal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTaskById(taskId);
      if (res && res.success) {
        setTask(res.task);
        setProgressVal(res.task.progress || 0);
      } else {
        setError('Task not found.');
      }
    } catch (err) {
      setError(err.message || 'Task not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    setUpdating(true);
    try {
      const res = await updateTaskProgress(taskId, { progress: progressVal });
      if (res && res.success) {
        setTask(res.task);
        showNotification('Progress updated successfully.');
      } else {
        alert(res.message || 'Unable to update progress.');
      }
    } catch (err) {
      alert(err.message || 'Unable to update progress.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-tasks">
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading task details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-tasks">
        <div className="space-y-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/student/tasks')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to My Tasks
          </button>
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error || 'Task Not Found'}</h3>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const mentorName = task.mentor?.name || 'Mentor';
  const mentorEmail = task.mentor?.email || '';
  const internshipTitle = task.internship?.title || 'Internship';
  const companyName = task.internship?.company || 'Company';
  const isLocked = task.status === 'completed' || task.status === 'cancelled';

  const steps = [
    { key: 'assigned', label: 'Assigned', icon: Clock },
    { key: 'in_progress', label: 'In Progress', icon: PlayCircle },
    { key: 'submitted', label: 'Submitted', icon: Send },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 }
  ];

  const getStepStatus = (stepKey) => {
    const order = ['assigned', 'in_progress', 'submitted', 'completed'];
    const currentIndex = order.indexOf(task.status);
    const stepIndex = order.indexOf(stepKey);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-tasks">
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in-98 duration-300">
        <button
          onClick={() => navigate('/student/tasks')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Tasks
        </button>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {task.title}
              </h1>
            </div>

            {!isLocked && (
              <button
                onClick={() => setSubmitModalOpen(true)}
                disabled={task.status === 'submitted'}
                className={`px-6 py-2.5 text-xs font-extrabold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  task.status === 'submitted'
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 cursor-not-allowed opacity-75'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20'
                }`}
              >
                <Send size={15} />
                <span>{task.status === 'submitted' ? 'Task Submitted' : 'Submit Deliverable'}</span>
              </button>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">Task Lifecycle Stage</h4>
            <div className="grid grid-cols-4 gap-2">
              {steps.map((st) => {
                const statusType = getStepStatus(st.key);
                const StepIcon = st.icon;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                      statusType === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : statusType === 'current'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <StepIcon size={16} className="mx-auto" />
                    <span className="text-[11px] font-extrabold block truncate">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Description</span>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap text-sm">{task.description}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <TaskProgressBar progress={task.progress} size="lg" />

            {!isLocked && (
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-3 text-xs">
                <div className="flex items-center justify-between font-extrabold text-slate-800 dark:text-slate-200">
                  <span>Update Completion Progress: {progressVal}%</span>
                  <button
                    onClick={handleUpdateProgress}
                    disabled={updating}
                    className="px-4 py-1.5 font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md rounded-xl cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                  >
                    {updating ? 'Saving...' : 'Save Progress'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                <User size={16} className="text-blue-500" /> Assigned Mentor
              </h3>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Name</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-sm">{mentorName}</p>
                <p className="text-slate-500 text-[11px] font-medium">{mentorEmail}</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                <Briefcase size={16} className="text-emerald-500" /> Internship & Target Deadline
              </h3>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Internship Program</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-sm">{internshipTitle} ({companyName})</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Due Date</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-sm">{formatDate(task.dueDate)}</p>
              </div>
            </div>
          </div>

          {task.submissionUrl && (
            <div className="p-6 rounded-3xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 text-xs">
              <span className="text-purple-700 dark:text-purple-300 font-extrabold uppercase text-[10px] flex items-center gap-1.5">
                <ExternalLink size={14} /> Submission Link & Deliverables
              </span>
              <a
                href={task.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-black text-purple-600 dark:text-purple-400 hover:underline break-all text-sm"
              >
                <span>{task.submissionUrl}</span>
                <ExternalLink size={14} />
              </a>

              {task.submissionNote && (
                <div className="pt-3 border-t border-purple-200/60 dark:border-purple-900/60">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase">Student Submission Note</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mt-1 leading-relaxed">{task.submissionNote}</p>
                </div>
              )}
            </div>
          )}

          {task.mentorFeedback && (
            <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
              <span className="text-amber-700 dark:text-amber-300 font-extrabold uppercase text-[10px] flex items-center gap-1.5">
                <MessageSquare size={14} /> Mentor Review & Feedback
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-sm">{task.mentorFeedback}</p>
            </div>
          )}
        </div>

        <SubmitTaskModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          task={task}
          onSuccess={() => {
            fetchTaskDetails();
            showNotification('Task submitted successfully.');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
