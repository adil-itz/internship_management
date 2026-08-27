import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import { getAllAssignmentsAdmin, updateAssignmentStatus } from '../../services/mentorAssignment.service';
import { UserCheck, ShieldAlert, Calendar, Mail, AlertCircle, Building2 } from 'lucide-react';

export default function AdminMentorAssignments({ darkMode, setDarkMode, user }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllAssignmentsAdmin();
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

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await updateAssignmentStatus(id, { status: newStatus });
      if (res && res.success) {
        fetchAssignments();
      } else {
        alert(res.message || 'Failed to update assignment status.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update assignment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="mentor-assignments">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={24} className="text-blue-500" /> Admin Mentor Assignments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global management of all mentor-student supervision assignments
          </p>
        </div>

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
              No mentor assignments exist in the system yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="p-4">Student</th>
                  <th className="p-4">Mentor</th>
                  <th className="p-4">Internship</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignments.map((ass) => {
                  const student = ass.student || {};
                  const mentor = ass.mentor || {};
                  const internship = ass.internship || {};
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
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {internship.title || 'N/A'}
                      </td>
                      <td className="p-4">
                        <AssignmentStatusBadge status={ass.status} />
                      </td>
                      <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                        {new Date(ass.assignedAt || ass.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={ass.status}
                          disabled={updatingId === ass._id}
                          onChange={(e) => handleStatusChange(ass._id, e.target.value)}
                          className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-extrabold focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
