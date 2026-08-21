import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  Bell,
  Plus
} from 'lucide-react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <section id="dashboard-preview" className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Interactive Product Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Everything You Need. One Powerful Dashboard.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Experience our role-tailored user interfaces designed for intuitive navigation and instant productivity.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg shadow-slate-900/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Administrator View</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <GraduationCap size={16} />
            <span>Student View</span>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'company'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <Building2 size={16} />
            <span>Company View</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mentor'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <UserCheck size={16} />
            <span>Mentor View</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
          <div className="bg-slate-100 dark:bg-slate-900 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>

            <div className="bg-white dark:bg-slate-950 px-5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
              https://app.internflow.io/{activeTab}/dashboard
            </div>

            <div className="flex items-center gap-3">
              <Bell size={18} className="text-slate-400" />
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                IF
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/60 dark:bg-slate-900/60">
            {activeTab === 'admin' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Institutional Governance Console</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">System-wide metrics and company verification requests.</p>
                  </div>
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm self-start sm:self-auto">
                    Export Analytics
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Internships</div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">1,248</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ +14% vs last term</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Verified Companies</div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">142</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">8 pending review</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Assigned Mentors</div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">86</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">98% response rate</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Placement Success</div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">94.2%</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Target Exceeded</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">Pending Company Approvals</div>
                  <div className="space-y-3">
                    {[
                      { name: 'Quantum Cloud AI', domain: 'Cloud & Infrastructure', positions: 12 },
                      { name: 'Apex Cybersecurity', domain: 'Security Operations', positions: 6 },
                      { name: 'BioTech Innovators', domain: 'Bioinformatics', positions: 8 },
                    ].map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">{comp.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{comp.domain} • {comp.positions} Openings</div>
                        </div>
                        <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'student' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Student Progress Workspace</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Frontend Software Engineer Intern @ Stripe</p>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-xs self-start sm:self-auto border border-blue-200 dark:border-blue-800">
                    Week 6 of 12
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">My Sprint Deliverables</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 line-through">Design Responsive Payment Form UI</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50">
                        <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Integrate Stripe Webhooks API</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <Clock size={18} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Write Integration Jest Tests</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mb-3">Assigned Mentor</div>
                      <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">Marcus Vance</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">Staff Engineer @ Stripe</div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-xs text-purple-700 dark:text-purple-300 font-semibold border border-purple-100 dark:border-purple-900/50">
                        Next 1-on-1: Tomorrow at 2:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Recruiter Candidate Pipeline</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Summer 2026 Engineering Cohort</p>
                  </div>
                  <button className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
                    <Plus size={16} />
                    <span>Post Opportunity</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-3">APPLIED (42)</div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Alex Rivera</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Stanford • CS Major</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 mb-3">INTERVIEWING (12)</div>
                    <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900/50">
                      <div className="font-bold text-xs text-cyan-900 dark:text-cyan-200">David Miller</div>
                      <div className="text-[11px] text-cyan-700 dark:text-cyan-300">MIT • Technical Round</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-3">SELECTED (8)</div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50">
                      <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200">Sophia Zhao</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300">Offer Accepted • Starts June</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mentor' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Mentor Guidance Matrix</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">5 Assigned Mentees under your supervision.</p>
                  </div>
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm self-start sm:self-auto">
                    Submit Mid-Term Form
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  {[
                    { student: 'James K. (Software Intern)', progress: 90, status: 'Evaluation Pending', badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50' },
                    { student: 'Elena R. (Data Science Intern)', progress: 75, status: 'On Track', badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50' },
                    { student: 'Michael T. (Product Intern)', progress: 60, status: 'Check-in Scheduled', badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50' },
                  ].map((mentee, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{mentee.student}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Overall Progress: {mentee.progress}%</div>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${mentee.badge}`}>
                        {mentee.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
