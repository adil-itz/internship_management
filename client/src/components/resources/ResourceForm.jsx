import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send, X, Plus, ExternalLink, Image as ImageIcon, Sparkles, ArrowLeft, BookOpen } from 'lucide-react';

const CATEGORIES = [
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

export default function ResourceForm({ initialData = {}, onSubmit, isEditing = false, backPath = '/mentor/resources' }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl || '');
  const [category, setCategory] = useState(initialData.category || CATEGORIES[0]);
  const [level, setLevel] = useState(initialData.level || LEVELS[0]);
  const [skills, setSkills] = useState(initialData.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState(initialData.status || 'draft');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState('draft');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setYoutubeUrl(initialData.youtubeUrl || '');
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setCategory(initialData.category || CATEGORIES[0]);
      setLevel(initialData.level || LEVELS[0]);
      setSkills(initialData.skills || []);
      setTags(initialData.tags || []);
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

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'Resource URL is required';
    } else if (!/^(https?\:\/\/).+$/.test(youtubeUrl.trim())) {
      newErrors.youtubeUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (thumbnailUrl.trim() && !/^(https?\:\/\/).+$/.test(thumbnailUrl.trim())) {
      newErrors.thumbnailUrl = 'Thumbnail must be a valid URL starting with http:// or https://';
    }
    if (!category) newErrors.category = 'Category is required';
    if (!level) newErrors.level = 'Level is required';

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
      youtubeUrl: youtubeUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      category,
      level,
      skills,
      tags,
      status: targetStatus,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setErrors({ server: err.message || 'Failed to save resource' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 max-w-4xl mx-auto" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Resources</span>
        </button>
      </div>

      {errors.server && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
          {errors.server}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isEditing ? 'Edit Study Resource' : 'Create Study Resource'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share Google Drive links, E-Books, practice question banks, and documentation with students.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Node.js & Express E-Book / 100+ Practice Questions PDF"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.title && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what study materials, books, or practice questions are included..."
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.description && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <ExternalLink size={14} className="text-blue-500" />
                <span>Resource Link / Drive / E-Book URL</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://example.com/ebook.pdf"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {errors.youtubeUrl && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.youtubeUrl}</p>}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-blue-500" />
                <span>Custom Cover Image URL</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level <span className="text-rose-500">*</span>
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
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Skills Covered
            </label>
            <div className="flex gap-2 mb-2">
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
                className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add</span>
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

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Search Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Add (e.g. ebook, drive, questions)"
                className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Tag</span>
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
            <span>{isSubmitting && submitType === 'published' ? 'Publishing Resource...' : 'Publish Resource'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
