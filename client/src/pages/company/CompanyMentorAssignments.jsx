import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import { getCompanyInternships } from '../../services/internship.service';
import { getInternshipAssignments } from '../../services/mentorAssignment.service';
import { UserCheck, Building2, Calendar, Mail, AlertCircle, Briefcase } from 'lucide-react';

export default function CompanyMentorAssignments({ darkMode, setDarkMode, user }) {
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyInternships();
  }, []);

  useEffect(() => {
    if (selectedInternshipId) {
      fetchAssignments(selectedInternshipId);
    }
  }, [selectedInternshipId]);

  const fetchCompanyInternships = async () => {
    setLoading(true);
    try {
      const res = await getCompanyInternships();
      if (res && res.success && res.internships) {
        setInternships(res.internships);
        if (res.internships.length > 0) {
          setSelectedInternshipId(res.internships[0]._id);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load company internships.');
      setLoading(false);
    }
  };

  const fetchAssignments = async (internshipId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInternshipAssignments(internshipId);
      if (res && res.success) {
        setAssignments(res.assignments || []);
      } else {
        setError('Failed to load mentor assignments.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load mentor assignments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="mentor-assignments">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck size={24} className="text-blue-500" /> Company Mentor Assignments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View active and completed mentor supervision assignments for your company's interns
          </p>
        </div>

        {internships.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Select Internship Posting:
            </label>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="w-full sm:w-96 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {internships.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading mentor assignments...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <UserCheck size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No mentor assignments found</h3>
            <p className="text-xs text-slate-500">
              Assign mentors to selected candidates from the applications management page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="p-4">Student</th>
                  <th className="p-4">Mentor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignments.map((ass) => {
                  const student = ass.student || {};
                  const mentor = ass.mentor || {};
                  return (
                    <tr key={ass._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-slate-900 dark:text-white">{student.name || 'Student'}</p>
                        <p className="text-slate-400 text-[11px]">{student.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-slate-900 dark:text-white">{mentor.name || 'Mentor'}</p>
                        <p className="text-slate-400 text-[11px]">{mentor.email}</p>
                      </td>
                      <td className="p-4">
                        <AssignmentStatusBadge status={ass.status} />
                      </td>
                      <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                        {new Date(ass.assignedAt || ass.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
