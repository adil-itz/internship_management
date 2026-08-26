import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Send,
  X,
  Plus,
  ArrowLeft,
  BookOpen,
  Layers,
  FileText,
  Video,
  Globe,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const DOMAINS = [
  'Web Development',
  'Backend Development',
  'Frontend Development',
  'AI / Machine Learning',
  'Data Science',
  'Data Analytics',
  'Cyber Security',
  'Cloud Computing',
  'DevOps',
  'Mobile Development',
  'Database',
  'Programming',
  'DSA',
  'Interview Preparation',
  'Resume & Career',
  'Git & GitHub',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const RESOURCE_TYPES = [
  { id: 'youtube', label: 'YouTube Video', icon: Video, color: 'text-red-500' },
  { id: 'ebook', label: 'E-Book / PDF', icon: BookOpen, color: 'text-amber-500' },
  { id: 'article', label: 'Article', icon: FileText, color: 'text-emerald-500' },
  { id: 'documentation', label: 'Documentation', icon: Globe, color: 'text-blue-500' },
];

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function CourseForm({ initialData = {}, onSubmit, isEditing = false, backPath = '/mentor/courses' }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [domain, setDomain] = useState(initialData.domain || DOMAINS[0]);
  const [level, setLevel] = useState(initialData.level || LEVELS[0]);
  const [duration, setDuration] = useState(initialData.duration || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl || '');
  const [skills, setSkills] = useState(initialData.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [modules, setModules] = useState(initialData.modules || []);
  const [status, setStatus] = useState(initialData.status || 'draft');

  const [activeModuleModal, setActiveModuleModal] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleVideoUrl, setModuleVideoUrl] = useState('');

  const [activeResourceModal, setActiveResourceModal] = useState(false);
  const [targetModuleIndex, setTargetModuleIndex] = useState(null);
  const [editingResourceIndex, setEditingResourceIndex] = useState(null);
  const [resTitle, setResTitle] = useState('');
  const [resDescription, setResDescription] = useState('');
  const [resType, setResType] = useState('youtube');
  const [resUrl, setResUrl] = useState('');
  const [resThumbnailUrl, setResThumbnailUrl] = useState('');

  const [confirmDeleteState, setConfirmDeleteState] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState('draft');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDomain(initialData.domain || DOMAINS[0]);
      setLevel(initialData.level || LEVELS[0]);
      setDuration(initialData.duration || '');
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setSkills(initialData.skills || []);
      setModules(initialData.modules || []);
      setStatus(initialData.status || 'draft');
    }
  }, [initialData]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const openModuleModal = (index = null) => {
    if (index !== null) {
      setEditingModuleIndex(index);
      setModuleTitle(modules[index].title || '');
      setModuleDescription(modules[index].description || '');
      const existingVideo = modules[index].resources?.find((r) => r.type === 'youtube');
      setModuleVideoUrl(existingVideo?.url || '');
    } else {
      setEditingModuleIndex(null);
      setModuleTitle('');
      setModuleDescription('');
      setModuleVideoUrl('');
    }
    setActiveModuleModal(true);
  };

  const handleSaveModule = () => {
    if (!moduleTitle.trim()) return;

    if (moduleVideoUrl.trim() && !/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(moduleVideoUrl.trim())) {
      alert('Please enter a valid YouTube video URL starting with https://www.youtube.com/... or https://youtu.be/...');
      return;
    }

    let resources = [];
    if (editingModuleIndex !== null) {
      resources = [...(modules[editingModuleIndex].resources || [])];
      if (moduleVideoUrl.trim()) {
        const vidIdx = resources.findIndex((r) => r.type === 'youtube');
        if (vidIdx >= 0) {
          resources[vidIdx] = {
            ...resources[vidIdx],
            url: moduleVideoUrl.trim(),
            title: moduleTitle.trim() + ' (Video Lesson)',
          };
        } else {
          resources.unshift({
            title: moduleTitle.trim() + ' (Video Lesson)',
            type: 'youtube',
            url: moduleVideoUrl.trim(),
          });
        }
      }
    } else {
      if (moduleVideoUrl.trim()) {
        resources.push({
          title: moduleTitle.trim() + ' (Video Lesson)',
          type: 'youtube',
          url: moduleVideoUrl.trim(),
        });
      }
    }

    if (editingModuleIndex !== null) {
      const updated = [...modules];
      updated[editingModuleIndex] = {
        ...updated[editingModuleIndex],
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        resources,
      };
      setModules(updated);
    } else {
      setModules([
        ...modules,
        {
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
          resources,
        },
      ]);
    }

    setActiveModuleModal(false);
    setModuleTitle('');
    setModuleDescription('');
    setModuleVideoUrl('');
    setEditingModuleIndex(null);
  };

  const handleDeleteModulePrompt = (moduleIndex) => {
    setConfirmDeleteState({
      type: 'module',
      moduleIndex,
      title: modules[moduleIndex]?.title,
    });
  };

  const openResourceModal = (modIndex, resIndex = null, defaultType = 'youtube') => {
    setTargetModuleIndex(modIndex);
    if (resIndex !== null) {
      setEditingResourceIndex(resIndex);
      const res = modules[modIndex].resources[resIndex];
      setResTitle(res.title || '');
      setResDescription(res.description || '');
      setResType(res.type || 'youtube');
      setResUrl(res.url || '');
      setResThumbnailUrl(res.thumbnailUrl || '');
    } else {
      setEditingResourceIndex(null);
      setResTitle('');
      setResDescription('');
      setResType(defaultType);
      setResUrl('');
      setResThumbnailUrl('');
    }
    setActiveResourceModal(true);
  };

  const handleSaveResource = () => {
    if (!resTitle.trim() || !resUrl.trim()) return;

    if (resType === 'youtube' && !/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(resUrl.trim())) {
      alert('Please provide a valid YouTube video URL');
      return;
    } else if (resType !== 'youtube' && !/^(https?\:\/\/).+$/.test(resUrl.trim())) {
      alert('Please provide a valid URL starting with http:// or https://');
      return;
    }

    const newRes = {
      title: resTitle.trim(),
      description: resDescription.trim() || undefined,
      type: resType,
      url: resUrl.trim(),
      thumbnailUrl: resThumbnailUrl.trim() || undefined,
    };

    const updatedModules = [...modules];
    if (editingResourceIndex !== null) {
      updatedModules[targetModuleIndex].resources[editingResourceIndex] = newRes;
    } else {
      if (!updatedModules[targetModuleIndex].resources) {
        updatedModules[targetModuleIndex].resources = [];
      }
      updatedModules[targetModuleIndex].resources.push(newRes);
    }

    setModules(updatedModules);
    setActiveResourceModal(false);
    setResTitle('');
    setResDescription('');
    setResUrl('');
    setResThumbnailUrl('');
    setEditingResourceIndex(null);
  };

  const handleDeleteResourcePrompt = (moduleIndex, resourceIndex) => {
    setConfirmDeleteState({
      type: 'resource',
      moduleIndex,
      resourceIndex,
      title: modules[moduleIndex]?.resources[resourceIndex]?.title,
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteState) return;

    if (confirmDeleteState.type === 'module') {
      setModules(modules.filter((_, idx) => idx !== confirmDeleteState.moduleIndex));
    } else if (confirmDeleteState.type === 'resource') {
      const updated = [...modules];
      updated[confirmDeleteState.moduleIndex].resources = updated[confirmDeleteState.moduleIndex].resources.filter(
        (_, idx) => idx !== confirmDeleteState.resourceIndex
      );
      setModules(updated);
    }

    setConfirmDeleteState(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Course title is required';
    if (!description.trim()) newErrors.description = 'Course description is required';
    if (!domain) newErrors.domain = 'Domain is required';
    if (!level) newErrors.level = 'Level is required';
    if (thumbnailUrl.trim() && !/^(https?\:\/\/).+$/.test(thumbnailUrl.trim())) {
      newErrors.thumbnailUrl = 'Thumbnail must be a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (targetStatus) => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitType(targetStatus);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      domain,
      level,
      duration: duration.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      skills,
      modules,
      status: targetStatus,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setErrors({ server: err.message || 'Failed to save course' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Courses</span>
        </button>
      </div>

      {errors.server && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
          {errors.server}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Build structured learning pathways with modules and multi-format learning resources.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Course Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Backend Development with Node.js & MongoDB"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {errors.title && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Course Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of what students will achieve in this course..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {errors.description && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Domain <span className="text-rose-500">*</span>
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {DOMAINS.map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>
                {errors.domain && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.level && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.level}</p>}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 8 Weeks or 12 Hours"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {errors.thumbnailUrl && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.thumbnailUrl}</p>}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              2. Skills & Key Learning Tags
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type skill and press Add (e.g. Node.js)"
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Skill</span>
              </button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  3. Course Modules & Content Builder
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize your course into ordered modules and assign learning resources inside each module.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openModuleModal()}
                  className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Video size={15} />
                  <span>+ Add Video Module</span>
                </button>
              </div>
            </div>

            {modules.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
                  <Video size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900 dark:text-white">No course video modules added yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Add YouTube video lessons and structured modules to build your course content.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => openModuleModal()}
                    className="px-5 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Video size={15} />
                    <span>+ Add First Video Module</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((mod, modIdx) => (
                  <div
                    key={modIdx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            Module {modIdx + 1}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{mod.title}</h4>
                        </div>
                        {mod.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{mod.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openModuleModal(modIdx)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors cursor-pointer"
                          title="Edit Module"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModulePrompt(modIdx)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                          title="Delete Module"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          Module Resources ({mod.resources ? mod.resources.length : 0})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openResourceModal(modIdx, null, 'youtube')}
                            className="px-3 py-1 text-[11px] font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Video size={12} />
                            <span>+ Add Video Lesson</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openResourceModal(modIdx, null, 'ebook')}
                            className="px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>+ Add Document / Link</span>
                          </button>
                        </div>
                      </div>

                      {mod.resources && mod.resources.length > 0 ? (
                        <div className="space-y-2">
                          {mod.resources.map((res, resIdx) => {
                            const resTypeObj =
                              RESOURCE_TYPES.find((t) => t.id === res.type) || RESOURCE_TYPES[0];
                            const ResIcon = resTypeObj.icon;

                            return (
                              <div
                                key={resIdx}
                                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${resTypeObj.color}`}>
                                    <ResIcon size={16} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                      {res.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                      {resTypeObj.label} • {res.url}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => openResourceModal(modIdx, resIdx)}
                                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded cursor-pointer"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteResourcePrompt(modIdx, resIdx)}
                                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic py-1">
                          No resources added to this module yet.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={15} />
            <span>{isSubmitting && submitType === 'draft' ? 'Saving Draft...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={15} />
            <span>{isSubmitting && submitType === 'published' ? 'Publishing Course...' : 'Publish Course'}</span>
          </button>
        </div>
      </div>

      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Video size={18} className="text-red-500" />
                <span>{editingModuleIndex !== null ? 'Edit Course Module' : 'Add Course Module & Video Lesson'}</span>
              </h3>
              <button
                onClick={() => setActiveModuleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Module Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Module 1 — Node.js Fundamentals"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Video size={14} className="text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-extrabold">YouTube Video Lesson URL</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Main Video Tutorial)</span>
                </label>
                <input
                  type="text"
                  value={moduleVideoUrl}
                  onChange={(e) => setModuleVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-red-200 dark:border-red-900/60 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>

              {moduleVideoUrl && getYouTubeEmbedUrl(moduleVideoUrl) && (
                <div className="p-3 rounded-2xl bg-slate-950 text-white space-y-2 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400">
                    <Video size={13} />
                    <span>Live Video Preview</span>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      src={getYouTubeEmbedUrl(moduleVideoUrl)}
                      title="Module Video Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Module Description <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  placeholder="Briefly describe module learning goals..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setActiveModuleModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModule}
                className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
              >
                Save Module
              </button>
            </div>
          </div>
        </div>
      )}

      {activeResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                {resType === 'youtube' && <Video size={18} className="text-red-500" />}
                <span>
                  {editingResourceIndex !== null
                    ? resType === 'youtube'
                      ? 'Edit Video Lesson'
                      : 'Edit Resource'
                    : resType === 'youtube'
                    ? 'Add Video Lesson to Module'
                    : 'Add Resource to Module'}
                </span>
              </h3>
              <button
                onClick={() => setActiveResourceModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resource / Lesson Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder={resType === 'youtube' ? 'e.g. Node.js Crash Course Video' : 'e.g. Express Documentation'}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  {resType === 'youtube' ? (
                    <>
                      <Video size={14} className="text-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-extrabold">YouTube Video Lesson URL</span>
                    </>
                  ) : (
                    <span>Resource Link URL</span>
                  )}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder={
                    resType === 'youtube'
                      ? 'https://www.youtube.com/watch?v=...'
                      : 'https://example.com/doc.pdf'
                  }
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    resType === 'youtube'
                      ? 'border-red-300 dark:border-red-900/60 focus:ring-red-500/40'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/40'
                  }`}
                />
              </div>

              {resType === 'youtube' && resUrl && getYouTubeEmbedUrl(resUrl) && (
                <div className="p-3 rounded-2xl bg-slate-950 text-white space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-bold text-red-400">
                    <div className="flex items-center gap-1.5">
                      <Video size={13} />
                      <span>Live Video Lecture Preview</span>
                    </div>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      src={getYouTubeEmbedUrl(resUrl)}
                      title="Video Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  placeholder="Short summary of this resource..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail URL <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={resThumbnailUrl}
                  onChange={(e) => setResThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setActiveResourceModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResource}
                className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Delete {confirmDeleteState.type === 'module' ? 'Module' : 'Resource'}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{confirmDeleteState.title}"</strong>?
              {confirmDeleteState.type === 'module' && ' Deleting this module will remove its resources from this course.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteState(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
