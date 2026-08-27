import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import { getStudentAssignments } from '../../services/mentorAssignment.service';
import { UserCheck, Building2, Calendar, Mail, AlertCircle, BookOpen } from 'lucide-react';

export default function StudentMentorAssignment({ darkMode, setDarkMode, user }) {
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
      const res = await getStudentAssignments();
      if (res && res.success) {
        setAssignments(res.assignments || []);
      } else {
        setError('Failed to fetch mentor assignments.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch mentor assignments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="mentor">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck size={24} className="text-blue-500" /> My Assigned Mentor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View guidance and supervision details for your active selected internships
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading mentor information...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <UserCheck size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No mentor assigned yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mentors are assigned by companies or administrators once your application status becomes selected.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((ass) => {
              const mentor = ass.mentor || {};
              const internship = ass.internship || {};
              const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';

              return (
                <div
                  key={ass._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                        {mentor.name ? mentor.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white">
                          {mentor.name || 'Mentor'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Mail size={12} className="text-blue-500" /> {mentor.email}
                        </p>
                      </div>
                    </div>

                    <AssignmentStatusBadge status={ass.status} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Internship Title</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{internship.title || 'N/A'}</p>
                      <p className="text-slate-500 font-bold flex items-center gap-1 text-[11px] pt-0.5">
                        <Building2 size={12} className="text-blue-500" /> {companyName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} /> Assigned Date:
                      </span>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-[11px]">
                        {new Date(ass.assignedAt || ass.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
