import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import MentorOngoingFeedbackForm from '../../components/feedback/MentorOngoingFeedbackForm';
import MentorMidtermEvaluation from '../../components/feedback/MentorMidtermEvaluation';
import MentorFinalEvaluation from '../../components/feedback/MentorFinalEvaluation';
import { getMyAssignments } from '../../services/mentorAssignment.service';
import { Users, Building2, Mail, Award, MessageSquare, Plus, AlertCircle } from 'lucide-react';

export default function MentorFeedback({ darkMode, setDarkMode, user }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ongoingModal, setOngoingModal] = useState(null);
  const [midtermModal, setMidtermModal] = useState(null);
  const [finalModal, setFinalModal] = useState(null);

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
        setError('Failed to fetch assigned students.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned students.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="feedback">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={24} className="text-blue-500" />
            <span>Student Feedback Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provide ongoing feedback, midterm evaluations, and final evaluations for your assigned students
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading assigned students...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Users size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No assigned students</h3>
            <p className="text-xs text-slate-500">Students assigned to you for supervision will appear here for evaluation.</p>
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
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                      {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        {student.name || 'Student Name'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Mail size={12} className="text-blue-500" /> {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Internship</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{internship.title || 'N/A'}</p>
                    <p className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
                      <Building2 size={12} className="text-blue-500" /> {companyName}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => setOngoingModal({ studentId: student._id, studentName: student.name, internshipTitle: internship.title })}
                      className="px-3 py-2 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare size={12} />
                      <span>Feedback</span>
                    </button>

                    <button
                      onClick={() => setMidtermModal({ studentId: student._id, studentName: student.name, internshipTitle: internship.title })}
                      className="px-3 py-2 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Award size={12} />
                      <span>Midterm</span>
                    </button>

                    <button
                      onClick={() => setFinalModal({ studentId: student._id, studentName: student.name, internshipTitle: internship.title })}
                      className="px-3 py-2 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Award size={12} />
                      <span>Final</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {ongoingModal && (
          <MentorOngoingFeedbackForm
            isOpen={true}
            onClose={() => setOngoingModal(null)}
            studentId={ongoingModal.studentId}
            studentName={ongoingModal.studentName}
            internshipTitle={ongoingModal.internshipTitle}
            onSuccess={() => fetchAssignments()}
          />
        )}

        {midtermModal && (
          <MentorMidtermEvaluation
            isOpen={true}
            onClose={() => setMidtermModal(null)}
            studentId={midtermModal.studentId}
            studentName={midtermModal.studentName}
            internshipTitle={midtermModal.internshipTitle}
            onSuccess={() => fetchAssignments()}
          />
        )}

        {finalModal && (
          <MentorFinalEvaluation
            isOpen={true}
            onClose={() => setFinalModal(null)}
            studentId={finalModal.studentId}
            studentName={finalModal.studentName}
            internshipTitle={finalModal.internshipTitle}
            onSuccess={() => fetchAssignments()}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
