import React, { useState } from 'react';
import { uploadResume, deleteResume } from '../services/student.service';
import { FileText, Upload, Trash2, Download, Eye, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResumeSection({ resume, onResumeUpdate }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError(null);
    if (!selected) return;
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(selected.type) && !selected.name.endsWith('.pdf') && !selected.name.endsWith('.docx')) {
      setError('Please select a valid PDF or DOCX file.');
      return;
    }
    
    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.');
      return;
    }
    
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await uploadResume(file);
      setSuccess('Resume uploaded successfully.');
      onResumeUpdate(result.resume || result.data?.resume || result.file);
      setFile(null);
      setIsReplacing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteResume();
      setSuccess('Resume deleted successfully.');
      onResumeUpdate(null);
      setShowConfirm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    if (resume) {
      // Assuming resume contains a path or url
      let url = typeof resume === 'string' ? resume : resume.url || resume.path;
      if (url && !url.startsWith('http')) {
        url = `/${url}`;
      }
      window.open(url, '_blank');
    }
  };

  const handleDownload = () => {
    if (resume) {
      let url = typeof resume === 'string' ? resume : resume.url || resume.path;
      if (url && !url.startsWith('http')) {
        url = `/${url}`;
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Resume';
      link.click();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={20} className="text-blue-500" />
        Resume
      </h3>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {!resume || isReplacing ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Upload size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isReplacing ? 'Replace your Resume' : 'Upload your Resume'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            PDF or DOCX • Max 5 MB
          </p>
          
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <div className="flex gap-2">
              <label
                htmlFor="resume-upload"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Choose File
              </label>
              {isReplacing && (
                <button
                  onClick={() => { setIsReplacing(false); setFile(null); }}
                  className="px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg w-full mb-4">
                <FileText size={16} className="text-blue-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate flex-1">{file.name}</span>
                <span className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                  {isReplacing ? 'Replace Resume' : 'Upload Resume'}
                </button>
                <button
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {typeof resume === 'string' ? resume.split('/').pop() : resume.name || 'Resume.pdf'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Uploaded Resume
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleView}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Eye size={14} /> View
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => setIsReplacing(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={14} /> Replace
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Resume?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
