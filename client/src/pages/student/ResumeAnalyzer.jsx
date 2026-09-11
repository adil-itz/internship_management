import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, XCircle, ChevronRight, BarChart } from 'lucide-react';

const ResumeAnalyzer = ({ darkMode }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setText('');
    }
  };

  const handleAnalyze = async () => {
    if (!file && !text.trim()) {
      setError('Please upload a PDF resume or paste your resume text.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', text);
      }

      const res = await axios.post('/api/resume-analyzer', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        setResult(res.data.analysis);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('Backend API not found. Did you restart the backend server after the recent update?');
      } else {
        setError(err.response?.data?.message || 'Failed to analyze resume. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart className="text-blue-600 dark:text-blue-400" size={24} />
            AI Resume ATS Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Get an instant AI-powered ATS compatibility score and professional feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">1. Upload PDF Resume</h2>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer relative group">
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-10 h-10 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Click or drag PDF to upload'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Max size 5MB</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>

          {/* Paste Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">2. Paste Resume Text</h2>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setFile(null); }}
              placeholder="Paste your resume text here..."
              className="w-full flex-1 min-h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-800 dark:text-slate-200 resize-none font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (!file && !text.trim())}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 shrink-0"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Analyze My Resume <ChevronRight size={16} />
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs flex items-start gap-2 font-medium shrink-0">
              <XCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8 overflow-y-auto pr-2 no-scrollbar">
          {result ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
              <div className="bg-blue-600 p-5 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xl font-bold mb-1">ATS Score</h3>
                  <p className="text-blue-100 text-xs font-medium">Industry-standard parsing analysis</p>
                </div>
                <div className="w-16 h-16 rounded-full border-[4px] flex items-center justify-center text-2xl font-black shadow-lg bg-white/10" 
                  style={{
                    borderColor: result.score >= 80 ? '#4ade80' : result.score >= 60 ? '#facc15' : '#f87171',
                  }}>
                  {result.score}
                </div>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professional Summary</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">{result.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="text-sm font-bold text-green-700 dark:text-green-500 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.advantages?.map((adv, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                          <span className="text-green-500">•</span>
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-500 mb-3 flex items-center gap-2">
                      <XCircle size={16} /> Weaknesses
                    </h4>
                    <ul className="space-y-2">
                      {result.disadvantages?.map((dis, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                          <span className="text-red-500">•</span>
                          {dis}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 mt-auto">
                  <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <FileText size={16} /> Actionable Improvements
                  </h4>
                  <ul className="space-y-2">
                    {result.improvements?.map((imp, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                        <span className="text-blue-500 font-black">→</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[400px]">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <BarChart size={32} className="text-blue-500/50" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-700 dark:text-slate-300">Awaiting Resume</h3>
              <p className="text-xs max-w-sm font-medium text-slate-500">
                Upload your resume on the left to receive a comprehensive ATS score, strengths, weaknesses, and a personalized improvement plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
