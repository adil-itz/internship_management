import React from 'react';
import { motion } from 'framer-motion';
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  return (
    <section id="hero" className="relative pt-10 pb-20 overflow-hidden transition-colors duration-300">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://res.cloudinary.com/ervdgxeh/video/upload/v1789456730/vm1_online-video-cutter.com.mp4"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-slate-50/30 to-white/60 dark:from-slate-950/50 dark:via-slate-900/40 dark:to-slate-950/60 z-0" />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/15 via-cyan-400/10 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-12 max-w-3xl mx-auto text-center flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
              <Star size={14} className="fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" />
              <span>Next-Gen Smart Internship Ecosystem</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              Manage Internships.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Connect Talent.
              </span>{' '}
              <br className="hidden sm:block" />
              Build Careers.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">
              A smart internship management platform connecting <strong className="text-slate-900 dark:text-white font-semibold">students</strong>, <strong className="text-slate-900 dark:text-white font-semibold">companies</strong>, <strong className="text-slate-900 dark:text-white font-semibold">mentors</strong>, and <strong className="text-slate-900 dark:text-white font-semibold">administrators</strong> — from application to successful completion.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4 mb-10">
              <motion.a
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                className="px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center gap-2 cursor-pointer btn-interactive"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#features"
                className="px-7 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Play size={16} className="fill-slate-900 dark:fill-slate-200 text-slate-900 dark:text-slate-200" />
                <span>Explore Platform</span>
              </motion.a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium w-full">
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
            </motion.div>
          </motion.div>



        </div>
      </div>
    </section>
  );
}
