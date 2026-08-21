import React, { useState } from 'react';
import { Layers, Globe, Share2, MessageSquare, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 text-left">
          <div className="lg:col-span-1">
            <a href="#hero" className="inline-flex items-center gap-3 font-extrabold text-xl text-white mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                <Layers size={20} />
              </div>
              <span>
                Intern<span className="text-cyan-400">Flow</span>
              </span>
            </a>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Connecting talent, companies, mentors, and opportunities — from application to successful completion.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#social"
                aria-label="Twitter"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Globe size={18} />
              </a>
              <a
                href="#social"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Share2 size={18} />
              </a>
              <a
                href="#social"
                aria-label="Community Chat"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Platform
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#roles" className="hover:text-white transition-colors">For Students</a>
              <a href="#roles" className="hover:text-white transition-colors">For Companies</a>
              <a href="#roles" className="hover:text-white transition-colors">For Mentors</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Resources
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#contact" className="hover:text-white transition-colors">About Us</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <a href="#contact" className="hover:text-white transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-white transition-colors">Help Center</a>
              <a href="#contact" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Legal & Security
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#contact" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#contact" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition-colors">Security</a>
              <a href="#contact" className="hover:text-white transition-colors">FERPA Compliance</a>
              <a href="#contact" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe to receiving platform updates and internship insights.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                ✓ Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 <strong className="text-slate-300">InternFlow</strong> (Smart Internship Management Platform). All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>Status: All Systems Operational</span>
            <span>Made for Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
