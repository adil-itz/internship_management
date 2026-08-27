import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, MapPin, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { scheduleInterview } from '../../services/application.service';

export default function InterviewModal({ isOpen, onClose, applicationId, candidateName, initialInterview = null, onSuccess }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('online');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialInterview) {
        if (initialInterview.date) {
          const d = new Date(initialInterview.date);
          setDate(d.toISOString().split('T')[0]);
        } else {
          setDate('');
        }
        setTime(initialInterview.time || '');
        setMode(initialInterview.mode || 'online');
        setMeetingLink(initialInterview.meetingLink || '');
        setLocation(initialInterview.location || '');
        setNotes(initialInterview.notes || '');
        setStatus(initialInterview.status || 'scheduled');
      } else {
        setDate('');
        setTime('');
        setMode('online');
        setMeetingLink('');
        setLocation('');
        setNotes('');
        setStatus('scheduled');
      }
    }
  }, [isOpen, initialInterview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!time) {
      setError('Time is required.');
      return;
    }
    if (!mode) {
      setError('Mode is required.');
      return;
    }
    if (mode === 'online' && !meetingLink.trim()) {
      setError('Meeting link is required for online interviews.');
      return;
    }
    if (mode === 'offline' && !location.trim()) {
      setError('Location is required for offline interviews.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date,
        time,
        mode,
        meetingLink: mode === 'online' ? meetingLink.trim() : '',
        location: mode === 'offline' ? location.trim() : '',
        notes: notes.trim(),
        status
      };

      const res = await scheduleInterview(applicationId, payload);
      if (res && res.success) {
        if (onSuccess) onSuccess(res.application);
        onClose();
      } else {
        setError(res.message || 'Failed to schedule interview.');
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule interview.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <span>{initialInterview ? 'Manage Interview' : 'Schedule Interview'}</span>
            </h3>
            {candidateName && (
              <p className="text-xs text-slate-500">Candidate: <strong className="text-slate-700 dark:text-slate-300">{candidateName}</strong></p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Interview Mode <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('online')}
                className={`py-2 px-3 text-xs font-extrabold rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  mode === 'online'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Video size={14} /> Online
              </button>
              <button
                type="button"
                onClick={() => setMode('offline')}
                className={`py-2 px-3 text-xs font-extrabold rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  mode === 'offline'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <MapPin size={14} /> Offline
              </button>
            </div>
          </div>

          {mode === 'online' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Meeting Link <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/xyz-abc-def"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Location / Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Office Address, Room 302..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}

          {initialInterview && (
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Interview Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Notes / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Bring ID card, review resume..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all"
            >
              {submitting ? (
                <span>Saving...</span>
              ) : (
                <span>{initialInterview ? 'Update Interview' : 'Schedule Interview'}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
