import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import { Users, Building2, Calendar, Mail, ChevronRight, AlertCircle, Briefcase } from 'lucide-react';

export default function AssignedInterns({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAssignments();
      if (res && res.success) {
        setAssignments(res.assignments || []);
      } else {
        setError('Failed to fetch assigned interns.');
      }
    } catch (err) {
      console.error(err);
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
            <Users size={24} className="text-blue-500" /> Assigned Interns
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervise and guide students assigned to you across internship postings
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
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No interns assigned yet</h3>
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

              return (
                <div
                  key={ass._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5 group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
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

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Internship Role</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{internship.title || 'N/A'}</p>
                      <p className="text-slate-500 font-bold flex items-center gap-1 text-[11px] pt-0.5">
                        <Building2 size={12} className="text-blue-500" /> {companyName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} /> Assigned:
                      </span>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-[11px]">
                        {new Date(ass.assignedAt || ass.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/mentor/interns/${ass._id}`)}
                    className="w-full py-2.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Supervision Details</span>
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
