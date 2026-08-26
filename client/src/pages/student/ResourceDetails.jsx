import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, User, Calendar, Tag, Code, BookOpen, FileText, Download } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getResourceById } from '../../services/resource.service';

export default function ResourceDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getResourceById(id);
        if (res && res.success) {
          setResource(res.resource);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Error loading resource details:', err);
        setError(err.message || 'Failed to load resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const formattedDate = resource?.createdAt
    ? new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const getThumbnail = () => {
    if (resource?.thumbnailUrl) return resource.thumbnailUrl;
    return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <Link
            to="/student/resources"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Resources</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 animate-pulse">
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
            <p className="text-rose-500 font-extrabold text-sm">{error}</p>
            <Link
              to="/student/resources"
              className="inline-block px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
            >
              Explore Other Resources
            </Link>
          </div>
        ) : resource ? (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                      {resource.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {resource.level}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {resource.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      <span>Shared by <strong className="text-slate-800 dark:text-slate-200">{resource.createdBy?.name || 'Mentor'}</strong></span>
                    </div>
                    {formattedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Resource Description</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={resource.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer group"
                    >
                      <ExternalLink size={16} />
                      <span>Open Study Resource / Drive Link</span>
                    </a>
                  </div>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img src={getThumbnail()} alt={resource.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {resource.skills && resource.skills.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Skills Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Tags</h3>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
                    {resource.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
