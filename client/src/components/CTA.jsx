import React from 'react';
import { ArrowRight, Play, Sparkles, ShieldCheck } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-16 sm:py-20 px-8 sm:px-12 overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles size={16} />
              <span>Get Started Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Ready to Transform Internship Management?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
              Bring students, companies, mentors, and administrators together on one smart, centralized platform today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight size={18} />
              </a>

              <a
                href="#features"
                className="px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Play size={16} className="fill-white text-white" />
                <span>Explore Platform</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-400" />
                <span>Enterprise Security</span>
              </div>
              <span>•</span>
              <div>Instant Deployment</div>
              <span>•</span>
              <div>24/7 Dedicated Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
