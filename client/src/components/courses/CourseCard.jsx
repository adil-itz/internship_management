import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, ArrowRight, Eye, Edit, Trash2, Layers } from 'lucide-react';
import CourseStatusBadge from './CourseStatusBadge';

export default function CourseCard({ course, showActions, onEdit, onDelete, detailRoutePrefix = '/student/courses' }) {
  const getThumbnail = () => {
    if (course.thumbnailUrl) return course.thumbnailUrl;
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  };

  const creatorName = course.createdBy?.name || 'Mentor';
  const totalModules = course.modules ? course.modules.length : 0;
  const totalResources = course.modules
    ? course.modules.reduce((acc, mod) => acc + (mod.resources ? mod.resources.length : 0), 0)
    : 0;

  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={getThumbnail()}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-600/90 backdrop-blur-md text-white shadow-md">
              <BookOpen size={13} />
              <span>Course</span>
            </span>
          </div>

          {showActions && course.status && (
            <div className="absolute top-3 right-3">
              <CourseStatusBadge status={course.status} />
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {course.domain}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {course.level}
            </span>
            {course.duration && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Clock size={11} />
                <span>{course.duration}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {course.skills && course.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {course.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold">
                  +{course.skills.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Layers size={12} className="text-blue-500" />
              <span>{totalModules} Modules</span>
            </span>
            <span>•</span>
            <span>{totalResources} Resources</span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-4">
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <User size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{creatorName}</span>
          </div>
        </div>

        {showActions ? (
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`${detailRoutePrefix}/${course._id}`}
              className="flex-1 py-2 px-3 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Eye size={14} />
              <span>View</span>
            </Link>
            <button
              onClick={() => onEdit && onEdit(course)}
              className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-all cursor-pointer"
              title="Edit Course"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete && onDelete(course)}
              className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-xl transition-all cursor-pointer"
              title="Delete Course"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <Link
            to={`${detailRoutePrefix}/${course._id}`}
            className="w-full py-2.5 px-4 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
          >
            <span>View Course</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
