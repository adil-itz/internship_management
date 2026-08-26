import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Calendar, User, ArrowRight, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import ResourceStatusBadge from './ResourceStatusBadge';

export default function ResourceCard({ resource, showActions, onEdit, onDelete, detailRoutePrefix = '/student/resources' }) {
  const getThumbnail = () => {
    if (resource.thumbnailUrl) return resource.thumbnailUrl;
    return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80';
  };

  const getResourceTypeBadge = (url) => {
    if (!url) return { label: 'Study Material', icon: FileText };
    const lower = url.toLowerCase();
    if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) {
      return { label: 'Google Drive', icon: FileText };
    }
    if (lower.includes('.pdf') || lower.includes('ebook')) {
      return { label: 'E-Book / PDF', icon: BookOpen };
    }
    if (lower.includes('question') || lower.includes('practice') || lower.includes('quiz')) {
      return { label: 'Practice Questions', icon: FileText };
    }
    return { label: 'Resource Link', icon: ExternalLink };
  };

  const formattedDate = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const creatorName = resource.createdBy?.name || 'Mentor';
  const typeBadge = getResourceTypeBadge(resource.youtubeUrl);
  const TypeIcon = typeBadge.icon;

  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={getThumbnail()}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-600/90 backdrop-blur-md text-white shadow-md">
              <TypeIcon size={13} />
              <span>{typeBadge.label}</span>
            </span>
          </div>

          {showActions && resource.status && (
            <div className="absolute top-3 right-3">
              <ResourceStatusBadge status={resource.status} />
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              {resource.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {resource.level}
            </span>
          </div>

          <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {resource.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {resource.skills && resource.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {resource.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
              {resource.skills.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold">
                  +{resource.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
              {resource.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 space-y-4">
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <User size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{creatorName}</span>
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1 shrink-0">
              <Calendar size={12} className="text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {showActions ? (
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`${detailRoutePrefix}/${resource._id}`}
              className="flex-1 py-2 px-3 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Eye size={14} />
              <span>View</span>
            </Link>
            <button
              onClick={() => onEdit && onEdit(resource)}
              className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-all cursor-pointer"
              title="Edit Resource"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete && onDelete(resource)}
              className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-xl transition-all cursor-pointer"
              title="Delete Resource"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <Link
            to={`${detailRoutePrefix}/${resource._id}`}
            className="w-full py-2.5 px-4 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
          >
            <span>View Resource</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
