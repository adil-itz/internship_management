import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, Calendar, Clock, DollarSign } from 'lucide-react';

export default function InternshipCard({ internship, onViewDetails, onApplyNow, isCompanyView, hideApplicantsButton, onEdit, onDelete }) {
  if (!internship) return null;

  const {
    _id,
    title,
    company,
    location,
    workMode,
    stipend,
    stipendType,
    duration,
    skills = [],
    applicationDeadline,
    status,
  } = internship;

  const companyName = typeof company === 'object' && company !== null ? company.name : 'Company';

  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const formattedStipend = stipend && stipend > 0
    ? `₹${stipend.toLocaleString('en-IN')}${stipendType ? ` / ${stipendType}` : ' / Month'}`
    : 'Unpaid';

  return (
    <motion.div
      whileHover={{ translateY: -5, scale: 1.01 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group card-glow-light card-glow-dark"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0"
            >
              {companyName ? companyName.charAt(0).toUpperCase() : <Building2 size={20} />}
            </motion.div>
            <div className="min-w-0">
              <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {title}
              </h3>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                <Building2 size={13} className="text-blue-500 shrink-0" />
                <span>{companyName}</span>
              </p>
            </div>
          </div>

          {status && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 capitalize ${
              status === 'published'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : status === 'draft'
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              {status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <Briefcase size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{workMode}</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <DollarSign size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate font-extrabold text-slate-900 dark:text-white">{formattedStipend}</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <Clock size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{duration}</span>
          </div>
        </div>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill, idx) => (
              <motion.span
                whileHover={{ scale: 1.05 }}
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Calendar size={13} />
          <span>Deadline: <strong className="text-slate-700 dark:text-slate-300 font-bold">{formattedDeadline}</strong></span>
        </div>

        {isCompanyView ? (
          <div className="flex items-center gap-1.5">
            {!hideApplicantsButton && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/company/internships/${_id}/applications`}
                  className="px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 rounded-xl transition-all block"
                >
                  Applicants
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/student/internships/${_id}`}
                className="px-2.5 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all block"
              >
                View
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit && onEdit(_id)}
              className="px-2.5 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete && onDelete(_id, title)}
              className="px-2.5 py-1.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-all cursor-pointer"
            >
              Delete
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/student/internships/${_id}`}
                className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl transition-all shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-1 btn-interactive"
              >
                View Details
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
