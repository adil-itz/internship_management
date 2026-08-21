import React, { useState } from 'react';
import {
  Search,
  Send,
  UserCheck,
  Users,
  CheckSquare,
  Award,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Discover',
      short: 'Explore Roles',
      icon: Search,
      heading: 'Discover Relevant Opportunities',
      desc: 'Students browse curated internship listings filtered by tech stack, domain, location, and institution partners.',
      details: [
        'AI-assisted skill and interest matching',
        'Direct company verification badges',
        'Detailed stipend & outcome specs',
      ],
      color: 'text-blue-600 dark:text-blue-400',
      activeBorder: 'border-blue-600 dark:border-blue-500',
      activeBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400',
    },
    {
      num: '02',
      title: 'Apply',
      short: 'Submit Application',
      icon: Send,
      heading: 'Apply with Digital Portfolio',
      desc: 'Submit applications using a single unified profile containing verified coursework, projects, and resume credentials.',
      details: [
        '1-Click quick submission',
        'Real-time status tracking pipeline',
        'Automated receipt confirmation',
      ],
      color: 'text-cyan-600 dark:text-cyan-400',
      activeBorder: 'border-cyan-600 dark:border-cyan-500',
      activeBg: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400',
    },
    {
      num: '03',
      title: 'Get Selected',
      short: 'Candidate Selection',
      icon: UserCheck,
      heading: 'Company Review & Selection',
      desc: 'Recruiters screen applicants, schedule video interviews, send offers, and confirm internship enrollment digitally.',
      details: [
        'Structured candidate scoring matrix',
        'Automated offer letter generation',
        'Direct onboarding checklist',
      ],
      color: 'text-purple-600 dark:text-purple-400',
      activeBorder: 'border-purple-600 dark:border-purple-500',
      activeBg: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400',
    },
    {
      num: '04',
      title: 'Get Mentored',
      short: 'Mentor Guidance',
      icon: Users,
      heading: 'Dedicated Mentor Assignment',
      desc: 'Assign internal corporate mentors or faculty advisors to provide 1-on-1 coaching, advice, and project roadmap alignment.',
      details: [
        'Weekly 1-on-1 check-in scheduler',
        'Direct messaging & document exchange',
        'Goal setting & skill roadmaps',
      ],
      color: 'text-emerald-600 dark:text-emerald-400',
      activeBorder: 'border-emerald-600 dark:border-emerald-500',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    },
    {
      num: '05',
      title: 'Complete Tasks',
      short: 'Track Work',
      icon: CheckSquare,
      heading: 'Execute Tasks & Track Progress',
      desc: 'Students submit task deliverables, log sprint progress, and receive instant feedback from assigned mentors.',
      details: [
        'Kanban task management board',
        'Sprint deadline alerts & status meters',
        'Code and document review feedback',
      ],
      color: 'text-amber-600 dark:text-amber-400',
      activeBorder: 'border-amber-600 dark:border-amber-500',
      activeBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
    },
    {
      num: '06',
      title: 'Evaluate & Complete',
      short: 'Final Evaluation',
      icon: Award,
      heading: 'Final Rubric & Certification',
      desc: 'Mentors submit comprehensive performance reviews, companies grade outcomes, and verified digital certificates are issued.',
      details: [
        'Multi-factor evaluation rubrics',
        'Automated institutional grade report',
        'Cryptographic digital certificate',
      ],
      color: 'text-pink-600 dark:text-pink-400',
      activeBorder: 'border-pink-600 dark:border-pink-500',
      activeBg: 'bg-pink-50 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400',
    },
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            End-to-End Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            From Application to Completion — All in One Place
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            A continuous, transparent 6-step lifecycle that connects all stakeholders into a seamless digital journey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`bg-white dark:bg-slate-950 rounded-2xl p-4 border text-center transition-all duration-200 cursor-pointer ${
                  isActive ? `border-2 ${step.activeBorder} shadow-lg shadow-blue-500/10` : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`text-xs font-extrabold mb-1 ${isActive ? step.color : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.num}
                </div>
                <div className={`text-xs font-bold truncate ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
          <div className="lg:col-span-7">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs mb-5 ${currentStep.activeBg}`}>
              <span>Step {currentStep.num}</span>
              <span>•</span>
              <span>{currentStep.short}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              {currentStep.heading}
            </h3>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {currentStep.desc}
            </p>

            <div className="space-y-3 mb-8">
              {currentStep.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${currentStep.activeBg} flex items-center justify-center shrink-0`}>
                    <ChevronRight size={14} />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
            >
              <span>Explore {currentStep.title} Workflow</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className={`w-20 h-20 rounded-3xl ${currentStep.activeBg} flex items-center justify-center mb-6 shadow-xl`}>
              <StepIcon size={40} />
            </div>

            <div className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Stage {currentStep.num}: {currentStep.title}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Automated status updates and role-based permissions triggered instantly at this milestone.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
