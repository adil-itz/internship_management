import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, ChevronRight, BarChart3, RefreshCw, X, 
  Zap, ArrowRight, ShieldCheck, FileCheck2, Cpu
} from 'lucide-react';

export default function ResumeAnalyzer({ darkMode, setDarkMode, embedded = false, profileResume = null }) {
  const [activeInputTab, setActiveInputTab] = useState(profileResume ? 'profile' : 'upload'); // 'upload' | 'paste' | 'profile'
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        setError('Please upload a valid PDF document.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be 5MB or smaller.');
        return;
      }
      setFile(selectedFile);
      setText('');
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (activeInputTab === 'upload' && !file) {
      setError('Please select a PDF resume file to analyze.');
      return;
    }
    if (activeInputTab === 'paste' && !text.trim()) {
      setError('Please paste your resume text to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisProgress('Scanning resume structure...');

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const formData = new FormData();

      if (activeInputTab === 'profile' && profileResume) {
        // If analyzing profile resume, check if profileResume is string URL or object
        const resumeUrl = typeof profileResume === 'string' ? profileResume : profileResume.url || profileResume.path;
        if (resumeUrl) {
          setAnalysisProgress('Downloading your profile resume...');
          const response = await fetch(resumeUrl.startsWith('http') ? resumeUrl : `/${resumeUrl}`);
          const blob = await response.blob();
          const pdfFile = new File([blob], 'profile_resume.pdf', { type: 'application/pdf' });
          formData.append('resume', pdfFile);
        } else {
          throw new Error('Profile resume URL not found.');
        }
      } else if (file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', text);
      }

      setAnalysisProgress('AI running ATS compliance & keyword match analysis...');

      const res = await axios.post('/api/resume-analyzer', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setResult(res.data.analysis);
      } else {
        setError(res.data.message || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('Backend API not found. Please verify the backend server is running.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to analyze resume. Please try again.');
      }
    } finally {
      setLoading(false);
      setAnalysisProgress('');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { ring: '#10B981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Strong ATS Match', icon: ShieldCheck };
    if (score >= 60) return { ring: '#F59E0B', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Moderate Match', icon: Zap };
    return { ring: '#EF4444', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Needs Optimization', icon: AlertTriangle };
  };

  const content = (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>AI Career Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ATS Resume Compatibility Analyzer
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Upload or paste your resume to get instant AI-powered applicant tracking system (ATS) scores, key strengths, weakness diagnostics, and tailored career recommendations.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <Cpu size={24} className="text-cyan-200" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-blue-200">Engine</p>
                <p className="text-xs font-black">AI Natural Language Parser</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 size={18} className="text-blue-500" />
                Select Resume Input Source
              </h3>
            </div>

            {/* Input Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => { setActiveInputTab('upload'); setError(null); }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeInputTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UploadCloud size={15} />
                <span>PDF Upload</span>
              </button>

              <button
                onClick={() => { setActiveInputTab('paste'); setError(null); }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeInputTab === 'paste'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText size={15} />
                <span>Paste Text</span>
              </button>

              {profileResume && (
                <button
                  onClick={() => { setActiveInputTab('profile'); setError(null); }}
                  className={`py-2 px-3 rounded-xl transition-all col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeInputTab === 'profile'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck size={15} />
                  <span>My Profile</span>
                </button>
              )}
            </div>

            {/* Input Tab Contents */}
            {activeInputTab === 'upload' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-950/40 relative group cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-12 h-12 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {file ? file.name : 'Click to select or drag PDF resume here'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    Supports standard PDF format (Up to 5MB)
                  </p>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeInputTab === 'paste' && (
              <div className="space-y-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your full resume text here (Work Experience, Skills, Education, Projects)..."
                  rows={8}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
                  <span>{text.trim().length} characters</span>
                  {text && (
                    <button onClick={() => setText('')} className="text-rose-500 hover:underline font-bold cursor-pointer">
                      Clear text
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeInputTab === 'profile' && profileResume && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">
                      {typeof profileResume === 'string' ? profileResume.split('/').pop() : profileResume.name || 'Profile Resume.pdf'}
                    </p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                      Saved in Profile Resume section
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                  Ready to analyze directly without re-uploading.
                </p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2"
              >
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={
                loading ||
                (activeInputTab === 'upload' && !file) ||
                (activeInputTab === 'paste' && !text.trim()) ||
                (activeInputTab === 'profile' && !profileResume)
              }
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-amber-300" />
                  <span>Run AI ATS Analysis</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {loading && analysisProgress && (
              <div className="text-center pt-2">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                  {analysisProgress}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-6 p-6"
              >
                {/* Score Header Card */}
                {(() => {
                  const scoreConfig = getScoreColor(result.score);
                  const ScoreIcon = scoreConfig.icon;
                  const circleRadius = 36;
                  const circumference = 2 * Math.PI * circleRadius;
                  const strokeDashoffset = circumference - (result.score / 100) * circumference;

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 gap-6">
                      <div className="flex items-center gap-5">
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                            <circle
                              cx="45"
                              cy="45"
                              r={circleRadius}
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-slate-200 dark:text-slate-800 fill-none"
                            />
                            <circle
                              cx="45"
                              cy="45"
                              r={circleRadius}
                              stroke={scoreConfig.ring}
                              strokeWidth="8"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="fill-none transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                              {result.score}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5">/ 100</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-center sm:text-left">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${scoreConfig.bg} ${scoreConfig.text}`}>
                            <ScoreIcon size={14} />
                            <span>{scoreConfig.label}</span>
                          </div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white pt-1">
                            ATS Compliance Rating
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Based on parsing standards, keyword density, and formatting rules.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setResult(null)}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                      >
                        <RefreshCw size={14} />
                        <span>Re-Analyze</span>
                      </button>
                    </div>
                  );
                })()}

                {/* Executive Summary */}
                {result.summary && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-500" />
                      <span>Executive Overview</span>
                    </h4>
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {result.summary}
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>Key Strengths</span>
                    </h4>
                    <ul className="space-y-2">
                      {result.advantages?.map((adv, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={16} />
                      <span>Areas to Improve</span>
                    </h4>
                    <ul className="space-y-2">
                      {result.disadvantages?.map((dis, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Plan */}
                {result.improvements && result.improvements.length > 0 && (
                  <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 space-y-3">
                    <h4 className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRight size={16} />
                      <span>Actionable Optimization Plan</span>
                    </h4>
                    <div className="space-y-2">
                      {result.improvements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="flex-1 pt-0.5">{imp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full bg-slate-50/60 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]"
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shadow-xs">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                    No Resume Analyzed Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Select a PDF file or paste your resume content on the left panel to generate a full ATS score and tailored feedback report.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} activeTab="resume-analyzer">
      {content}
    </DashboardLayout>
  );
}
