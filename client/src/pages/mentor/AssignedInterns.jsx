import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import { getTasksByIntern } from '../../services/internshipTask.service';
import { Users, Building2, Mail, ChevronRight, AlertCircle, CheckCircle2, PlayCircle, Clock, AlertTriangle, Send } from 'lucide-react';

export default function AssignedInterns({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [internStatsMap, setInternStatsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignmentsAndStats();
  }, []);

  const fetchAssignmentsAndStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAssignments();
      if (res && res.success) {
        const fetchedAssignments = res.assignments || [];
        setAssignments(fetchedAssignments);

        const statsPromises = fetchedAssignments.map(async (ass) => {
          if (ass.student?._id) {
            try {
              const taskRes = await getTasksByIntern(ass.student._id);
              if (taskRes && taskRes.success) {
                return { studentId: ass.student._id, stats: taskRes.statistics };
              }
            } catch (e) {}
          }
          return {
            studentId: ass.student?._id,
            stats: { overallProgress: 0, totalTasks: 0, completedTasks: 0, inProgressTasks: 0, submittedTasks: 0, overdueTasks: 0 }
          };
        });

        const statsResults = await Promise.all(statsPromises);
        const map = {};
        statsResults.forEach((item) => {
          if (item.studentId) {
            map[item.studentId] = item.stats;
          }
        });
        setInternStatsMap(map);
      } else {
        setError('Failed to fetch assigned interns.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned interns.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="assigned-interns">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={24} className="text-blue-500" /> Internship Supervision
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervise assigned interns, assign tasks, evaluate submissions, and track student progress
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading assigned interns...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Users size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No interns assigned yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When companies or administrators assign students to you for supervision, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((ass) => {
              const student = ass.student || {};
              const internship = ass.internship || {};
              const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';
              const stats = internStatsMap[student._id] || {
                overallProgress: 0,
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                submittedTasks: 0,
                overdueTasks: 0
              };

              return (
                <div
                  key={ass._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5 group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover shadow-md shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {student.name || 'Student'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Mail size={12} className="text-blue-500" /> {student.email}
                        </p>
                      </div>
                    </div>

                    <AssignmentStatusBadge status={ass.status} />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Internship Details</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{internship.title || 'N/A'}</p>
                      <p className="text-slate-500 font-bold flex items-center gap-1 text-[11px] pt-0.5">
                        <Building2 size={12} className="text-blue-500" /> {companyName}
                      </p>
                    </div>

                    <TaskProgressBar progress={stats.overallProgress} />

                    <div className="grid grid-cols-5 gap-2 pt-1 text-center text-[10px]">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">Total</span>
                        <strong className="font-black text-slate-900 dark:text-white text-xs">{stats.totalTasks}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        <span className="font-bold block uppercase text-[8px]">Active</span>
                        <strong className="font-black text-xs">{stats.inProgressTasks}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                        <span className="font-bold block uppercase text-[8px]">Submitted</span>
                        <strong className="font-black text-xs">{stats.submittedTasks}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold block uppercase text-[8px]">Done</span>
                        <strong className="font-black text-xs">{stats.completedTasks}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        <span className="font-bold block uppercase text-[8px]">Overdue</span>
                        <strong className="font-black text-xs">{stats.overdueTasks}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/mentor/interns/${student._id}`)}
                    className="w-full py-2.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
