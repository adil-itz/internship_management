import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { createWorkLog, getWorkLogById, updateWorkLog, submitWorkLog } from '../../services/worklog.service';
import { getStudentApplications } from '../../services/application.service';
import { getStudentTasks } from '../../services/internshipTask.service';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  FileText,
  GitBranch,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function CreateWorkLog({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    internshipId: '',
    taskId: '',
    title: '',
    description: '',
    hoursWorked: 8,
    challenges: '',
    learning: '',
    githubLink: ''
  });

  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentWorkLog, setCurrentWorkLog] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (formData.internshipId && tasks.length > 0) {
      const match = tasks.filter((t) => {
        const tInternId = typeof t.internship === 'object' ? t.internship?._id : t.internship;
        return tInternId === formData.internshipId;
      });
      setFilteredTasks(match);
    } else {
      setFilteredTasks([]);
    }
  }, [formData.internshipId, tasks]);

  const loadInitialData = async () => {
    setFetchingData(true);
    setError(null);
    try {
      const appsRes = await getStudentApplications();
      if (appsRes && appsRes.success) {
        setApplications(appsRes.applications || []);
      }

      const tasksRes = await getStudentTasks();
      if (tasksRes && tasksRes.success) {
        setTasks(tasksRes.tasks || []);
      }

      if (isEditMode) {
        const logRes = await getWorkLogById(id);
        if (logRes && logRes.success) {
          const log = logRes.data;
          setCurrentWorkLog(log);
          
          if (log.status === 'approved') {
            setError('Approved work logs cannot be edited.');
          }

          setFormData({
            date: log.date ? new Date(log.date).toISOString().split('T')[0] : '',
            internshipId: typeof log.internshipId === 'object' ? log.internshipId._id : log.internshipId || '',
            taskId: typeof log.taskId === 'object' ? log.taskId._id : log.taskId || '',
            title: log.title || '',
            description: log.description || '',
            hoursWorked: log.hoursWorked !== undefined ? log.hoursWorked : 8,
            challenges: log.challenges || '',
            learning: log.learning || '',
            githubLink: log.githubLink || ''
          });
        }
      } else {
        if (appsRes && appsRes.applications && appsRes.applications.length > 0) {
          const firstSelected = appsRes.applications.find((a) => a.status === 'selected') || appsRes.applications[0];
          const internId = firstSelected.internship?._id || firstSelected.internship;
          if (internId) {
            setFormData((prev) => ({ ...prev, internshipId: internId }));
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load initial form data.');
    } finally {
      setFetchingData(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = 'Date is required.';
    }
    if (!formData.internshipId) {
      errs.internshipId = 'Please select an internship.';
    }
    if (!formData.title || !formData.title.trim()) {
      errs.title = 'Title is required.';
    }
    if (!formData.description || !formData.description.trim()) {
      errs.description = 'Description is required.';
    }
    if (formData.hoursWorked === '' || formData.hoursWorked === undefined || formData.hoursWorked < 0 || formData.hoursWorked > 24) {
      errs.hoursWorked = 'Hours worked must be between 0 and 24.';
    }
    if (formData.githubLink && !formData.githubLink.startsWith('http://') && !formData.githubLink.startsWith('https://')) {
      errs.githubLink = 'GitHub link must start with http:// or https://';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (shouldSubmit = false) => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    try {
      const payload = {
        internshipId: formData.internshipId,
        taskId: formData.taskId || undefined,
        date: formData.date,
        title: formData.title.trim(),
        description: formData.description.trim(),
        hoursWorked: Number(formData.hoursWorked),
        challenges: formData.challenges ? formData.challenges.trim() : '',
        learning: formData.learning ? formData.learning.trim() : '',
        githubLink: formData.githubLink ? formData.githubLink.trim() : ''
      };

      let savedLogId = id;

      if (isEditMode) {
        const updateRes = await updateWorkLog(id, payload);
        if (!updateRes.success) {
          throw new Error(updateRes.message || 'Failed to update work log.');
        }
      } else {
        const createRes = await createWorkLog(payload);
        if (!createRes.success || !createRes.workLog) {
          throw new Error(createRes.message || 'Failed to create work log.');
        }
        savedLogId = createRes.workLog._id;
      }

      if (shouldSubmit) {
        const submitRes = await submitWorkLog(savedLogId);
        if (!submitRes.success) {
          throw new Error(submitRes.message || 'Saved draft but failed to submit.');
        }
      }

      navigate('/student/worklogs');
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } fontFinally: {
      setLoading(false);
    }
  };

  const isFormDisabled = isEditMode && currentWorkLog && (currentWorkLog.status === 'approved' || currentWorkLog.status === 'submitted');

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-worklogs">
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-98 duration-300">
        
        <button
          onClick={() => navigate('/student/worklogs')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to Work Logs
        </button>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={22} className="text-blue-600 dark:text-blue-400" />
              <span>{isEditMode ? 'Edit Work Log' : 'Add New Work Log'}</span>
            </h1>
            <p className="text-xs text-slate-400">
              {isEditMode
                ? 'Update your draft or resubmit a rejected work log to your mentor.'
                : 'Document your daily accomplishments, hours worked, and learning outcomes.'}
            </p>
          </div>

          {currentWorkLog?.status === 'rejected' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs space-y-1">
              <span className="font-extrabold text-rose-700 dark:text-rose-300 text-[10px] uppercase tracking-wider block">
                Mentor Rejection Feedback
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                "{currentWorkLog.mentorFeedback || 'Please revise your details and resubmit.'}"
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {fetchingData ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-400">Loading form information...</p>
            </div>
          ) : (
            <form className="space-y-5 text-xs" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={isFormDisabled}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      validationErrors.date ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {validationErrors.date && <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.date}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hours Worked <span className="text-rose-500">*</span> (0 - 24)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    disabled={isFormDisabled}
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                    className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      validationErrors.hoursWorked ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {validationErrors.hoursWorked && (
                    <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.hoursWorked}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Internship <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled={isFormDisabled || isEditMode}
                  value={formData.internshipId}
                  onChange={(e) => setFormData({ ...formData, internshipId: e.target.value, taskId: '' })}
                  className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    validationErrors.internshipId ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <option value="">-- Select Internship --</option>
                  {applications.map((app) => {
                    const intern = app.internship;
                    const internId = intern?._id || intern;
                    const title = intern?.title || 'Internship';
                    const companyName = intern?.company?.name || intern?.company || '';
                    return (
                      <option key={app._id} value={internId}>
                        {title} {companyName ? `(${companyName})` : ''}
                      </option>
                    );
                  })}
                </select>
                {validationErrors.internshipId && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.internshipId}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Associated Task <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  disabled={isFormDisabled || !formData.internshipId}
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="">No specific task</option>
                  {filteredTasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isFormDisabled}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implemented Authentication & JWT middleware"
                  className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    validationErrors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {validationErrors.title && <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.title}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  disabled={isFormDisabled}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the tasks completed, APIs developed, or components built today..."
                  className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    validationErrors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                ></textarea>
                {validationErrors.description && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Challenges Faced <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  disabled={isFormDisabled}
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder="Any technical blockers or bugs encountered..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Outcomes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  disabled={isFormDisabled}
                  value={formData.learning}
                  onChange={(e) => setFormData({ ...formData, learning: e.target.value })}
                  placeholder="Key concepts or tools learned today..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub / PR Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  disabled={isFormDisabled}
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  placeholder="https://github.com/username/repository/pull/12"
                  className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    validationErrors.githubLink ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {validationErrors.githubLink && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1">{validationErrors.githubLink}</p>
                )}
              </div>

              {!isFormDisabled && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSave(false)}
                    className="px-5 py-2.5 font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-2xl cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <Save size={15} />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSave(true)}
                    className="px-6 py-2.5 font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-md shadow-blue-500/30 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <Send size={15} />
                    <span>{loading ? 'Submitting...' : isEditMode && currentWorkLog?.status === 'rejected' ? 'Resubmit Work Log' : 'Submit Work Log'}</span>
                  </button>
                </div>
              )}

            </form>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}
