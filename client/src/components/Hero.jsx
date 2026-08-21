import React from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  UserCheck,
  TrendingUp,
  Star,
  Bell
} from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/15 via-cyan-400/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <Star size={14} className="fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" />
              <span>Next-Gen Smart Internship Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              Manage Internships.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Connect Talent.
              </span>{' '}
              Build Careers.
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
              A smart internship management platform connecting <strong className="text-slate-900 dark:text-white font-semibold">students</strong>, <strong className="text-slate-900 dark:text-white font-semibold">companies</strong>, <strong className="text-slate-900 dark:text-white font-semibold">mentors</strong>, and <strong className="text-slate-900 dark:text-white font-semibold">administrators</strong> — from application to successful completion.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#contact"
                className="px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </a>

              <a
                href="#features"
                className="px-7 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Play size={16} className="fill-slate-900 dark:fill-slate-200 text-slate-900 dark:text-slate-200" />
                <span>Explore Platform</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>Zero configuration needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>Role-based workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>Real-time tracking</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="hidden sm:flex absolute -top-5 -left-5 z-20 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-200 dark:border-emerald-900/50 items-center gap-3 animate-float-slow">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Application Approved</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Apex Systems Tech</div>
              </div>
            </div>

            <div className="hidden sm:flex absolute -bottom-5 -right-5 z-20 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-200 dark:border-blue-900/50 items-center gap-3 animate-float-delayed">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">85% Progress</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Final Evaluation Ready</div>
              </div>
            </div>

            <div className="hidden md:flex absolute top-10 -right-6 z-20 bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl shadow-lg shadow-purple-500/10 border border-purple-200 dark:border-purple-900/50 items-center gap-2 animate-float-slow">
              <UserCheck size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Mentor: Dr. Sarah Chen
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-left">
              <div className="bg-slate-100/90 dark:bg-slate-800/90 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400">
                  app.internflow.io/dashboard/student
                </div>
                <Bell size={16} className="text-slate-400" />
              </div>

              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-0.5">
                      Active Internship
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Software Engineer Intern @ TechCorp
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    Active • Week 8
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Overall Completion Progress
                    </span>
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      85%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-7 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                      Current Sprint Tasks
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 line-through">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>Build OAuth2 Auth Module</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 line-through">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>Setup Firestore Security Rules</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <Clock size={16} className="text-amber-500 shrink-0" />
                        <span>Write OpenAPI Documentation</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                        Assigned Mentor
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          SC
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Chen</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Senior Tech Lead</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-950/60 rounded-lg text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                      ★ Feedback: Excellent Work!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
