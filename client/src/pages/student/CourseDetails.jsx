import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Layers,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Globe,
  ExternalLink,
  Sparkles,
  Play,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCourseById } from '../../services/course.service';

const RESOURCE_TYPES = {
  youtube: { label: 'YouTube Video', icon: Video, badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  ebook: { label: 'E-Book / PDF', icon: BookOpen, badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  article: { label: 'Article', icon: FileText, badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  documentation: { label: 'Documentation', icon: Globe, badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function CourseDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCourseById(id);
        if (res && res.success) {
          setCourse(res.course);
          if (res.course.modules && res.course.modules.length > 0) {
            setExpandedModules({ 0: true });
          }
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Error loading course details:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getThumbnail = () => {
    if (course?.thumbnailUrl) return course.thumbnailUrl;
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  };

  const totalModules = course?.modules?.length || 0;
  const totalResources = course?.modules?.reduce(
    (acc, mod) => acc + (mod.resources?.length || 0),
    0
  ) || 0;

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Courses</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 animate-pulse">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
            <p className="text-rose-500 font-extrabold text-sm">{error}</p>
            <Link
              to="/student/courses"
              className="inline-block px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
            >
              Explore Other Courses
            </Link>
          </div>
        ) : course ? (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                      {course.domain}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.level}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {course.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      <span>Created by <strong className="text-slate-800 dark:text-slate-200">{course.createdBy?.name || 'Mentor'}</strong></span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-500" />
                      <span>{totalModules} Modules ({totalResources} Video Lessons & Resources)</span>
                    </div>
                  </div>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img src={getThumbnail()} alt={course.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {course.skills && course.skills.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Skills You Will Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
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
            </div>

            {activeVideoUrl && (
              <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-4 shadow-xl border border-slate-800 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <Video size={16} />
                    <span>Course Video Lecture Player</span>
                  </div>
                  <button
                    onClick={() => setActiveVideoUrl(null)}
                    className="text-xs font-extrabold text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    Close Player
                  </button>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                  <iframe
                    src={activeVideoUrl}
                    title="Course Video Player"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={20} className="text-blue-500" />
                  <span>Course Modules & Video Lessons</span>
                </h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {totalModules} {totalModules === 1 ? 'Module' : 'Modules'}
                </span>
              </div>

              {!course.modules || course.modules.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400">
                  No modules published for this course yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {course.modules.map((mod, modIdx) => {
                    const isExpanded = !!expandedModules[modIdx];
                    const resCount = mod.resources ? mod.resources.length : 0;

                    return (
                      <div
                        key={modIdx}
                        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          onClick={() => toggleModule(modIdx)}
                          className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                Module {modIdx + 1}
                              </span>
                              <h3 className="text-sm font-black text-slate-900 dark:text-white">{mod.title}</h3>
                            </div>
                            {mod.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">{mod.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {resCount} {resCount === 1 ? 'Resource' : 'Resources'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-slate-400" />
                            ) : (
                              <ChevronDown size={18} className="text-slate-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && mod.resources && mod.resources.length > 0 && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            {mod.resources.map((res, resIdx) => {
                              const typeInfo = RESOURCE_TYPES[res.type] || RESOURCE_TYPES.youtube;
                              const TypeIcon = typeInfo.icon;
                              const embedUrl = getYouTubeEmbedUrl(res.url);

                              return (
                                <div
                                  key={resIdx}
                                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 transition-all space-y-3"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs">
                                        <TypeIcon size={16} className="text-red-500" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                          {res.title}
                                        </p>
                                        {res.description && (
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {res.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${typeInfo.badgeClass}`}>
                                        {typeInfo.label}
                                      </span>

                                      {embedUrl ? (
                                        <button
                                          onClick={() => setActiveVideoUrl(embedUrl)}
                                          className="px-3 py-1.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                        >
                                          <Play size={13} />
                                          <span>Play Video</span>
                                        </button>
                                      ) : (
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <ExternalLink size={13} />
                                          <span>Open Link</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
