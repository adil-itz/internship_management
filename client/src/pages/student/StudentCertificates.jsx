import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  Award,
  Download,
  Mail,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  User,
  ExternalLink,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  getStudentCertificates,
  generateCertificate,
  getCertificateDetails,
  downloadCertificate,
  resendCertificateEmail,
} from '../../services/certificate.service';
import { getStudentAssignments } from '../../services/mentorAssignment.service';

export default function StudentCertificates({ darkMode, setDarkMode }) {
  const [certificates, setCertificates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [emailingId, setEmailingId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCert, setSelectedCert] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [certRes, assignRes] = await Promise.all([
        getStudentCertificates(),
        getStudentAssignments(),
      ]);

      if (certRes.success) {
        setCertificates(certRes.certificates || []);
      }
      if (assignRes.success) {
        setAssignments(assignRes.assignments || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch certificates data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completedAssignments = assignments.filter(
    (a) => a.status === 'completed'
  );

  const generatedInternshipIds = new Set(
    certificates.map((c) => (c.internshipId?._id || c.internshipId || '').toString())
  );

  const handleGenerate = async (internshipId) => {
    try {
      setGeneratingId(internshipId);
      setError('');
      setSuccess('');
      const res = await generateCertificate(internshipId);
      if (res.success) {
        setSuccess('Certificate generated successfully! A PDF copy has been emailed to you.');
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate certificate');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      setDownloadingId(certificateId);
      setError('');
      await downloadCertificate(certificateId);
      setSuccess(`Certificate ${certificateId} downloaded successfully.`);
    } catch (err) {
      setError(err.message || 'Failed to download certificate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResendEmail = async (certificateId) => {
    try {
      setEmailingId(certificateId);
      setError('');
      setSuccess('');
      const res = await resendCertificateEmail(certificateId);
      if (res.success) {
        setSuccess(`Certificate PDF sent to your registered email!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send certificate email');
    } finally {
      setEmailingId(null);
    }
  };

  const handleViewDetails = async (certificateId) => {
    try {
      setDetailsLoading(true);
      setDetailsModalOpen(true);
      const res = await getCertificateDetails(certificateId);
      if (res.success) {
        setSelectedCert(res.certificate);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch details');
      setDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      (c.certificateId || '').toLowerCase().includes(query) ||
      (c.internshipTitle || '').toLowerCase().includes(query) ||
      (c.companyName || '').toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-900/90 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles size={14} className="text-amber-400" />
              <span>Verified Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Student Certificates & Badges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate, download, and verify official InterFlow Internship Completion Certificates.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-xl">
              <Award size={36} />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 shadow-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1">{success}</div>
            <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-700">
              <X size={16} />
            </button>
          </div>
        )}

        {completedAssignments.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Completed Internships Eligible for Certificate
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedAssignments.map((assignment) => {
                const internshipId = assignment.internship?._id || assignment.internship;
                const isGenerated = generatedInternshipIds.has(internshipId?.toString());
                const isGenerating = generatingId === internshipId;

                return (
                  <div
                    key={assignment._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {assignment.internship?.title || 'Completed Internship'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Building2 size={14} />
                        <span>{assignment.internship?.company?.name || assignment.company?.name || 'Partner Company'}</span>
                      </p>
                    </div>

                    {isGenerated ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0 flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        <span>Certificate Generated</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleGenerate(internshipId)}
                        disabled={isGenerating}
                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Generating PDF...</span>
                          </>
                        ) : (
                          <>
                            <Award size={16} />
                            <span>Generate Certificate</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Earned Certificates ({certificates.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View details, download official PDFs, or trigger email copies.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificates..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading earned certificates...</p>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Award size={32} />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No Certificates Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Once you complete your internship, your official completion certificate will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCertificates.map((cert) => {
                const isDownloading = downloadingId === cert.certificateId;
                const isEmailing = emailingId === cert.certificateId;

                return (
                  <div
                    key={cert._id || cert.certificateId}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                          {cert.certificateId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {cert.internshipTitle}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <Building2 size={14} className="text-blue-500 shrink-0" />
                          <span>{cert.companyName}</span>
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Student:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{cert.studentName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Mentor:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{cert.mentorName || 'Mentor'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(cert.certificateId)}
                        className="flex-1 py-2 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View JSON details"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleDownload(cert.certificateId)}
                        disabled={isDownloading}
                        className="flex-1 py-2 px-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        title="Download PDF Certificate"
                      >
                        {isDownloading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Download size={14} />
                            <span>PDF</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleResendEmail(cert.certificateId)}
                        disabled={isEmailing}
                        className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-60"
                        title="Resend PDF Email"
                      >
                        {isEmailing ? (
                          <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                          <Mail size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {detailsModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedCert(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Certificate Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JSON verification metadata & parameters
                  </p>
                </div>
              </div>

              {detailsLoading ? (
                <div className="py-12 text-center">
                  <div className="w-7 h-7 mx-auto border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : selectedCert ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Certificate ID:</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">{selectedCert.certificateId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Student Name:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedCert.studentName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Internship:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedCert.internshipTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Company:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedCert.companyName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Mentor:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedCert.mentorName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-400">Issue Date:</span>
                      <span>{new Date(selectedCert.issueDate || selectedCert.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-400">Verification URL:</span>
                      <a
                        href={`/verify-certificate/${selectedCert.certificateId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold truncate max-w-[200px]"
                      >
                        <span>Verify Certificate</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDownload(selectedCert.certificateId)}
                      className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => handleResendEmail(selectedCert.certificateId)}
                      className="py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Mail size={14} />
                      <span>Resend Email</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
