import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Building2,
  Calendar,
  Briefcase,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function InternshipForm({ initialData, onSubmit, isSubmitting, mode = 'create' }) {
  const navigate = useNavigate();

  const DOMAINS = [
    'Software Development',
    'AI / ML',
    'Data Science',
    'Web Development',
    'Cyber Security',
    'Cloud',
    'Other',
  ];

  const WORK_MODES = ['Remote', 'On-site', 'Hybrid'];
  const TYPES = ['Paid', 'Unpaid'];
  const STIPEND_TYPES = ['Monthly', 'One-time', 'Performance-based'];
  const DEGREES = ['B.Tech', 'B.E.', 'MCA', 'M.Tech'];
  const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE'];
  const GRAD_YEARS = [2026, 2027, 2028, 2029];

  const [formData, setFormData] = useState({
    title: '',
    domain: 'Software Development',
    description: '',
    internshipType: 'Paid',
    workMode: 'Hybrid',
    location: '',
    duration: '6 Months',
    stipend: 15000,
    stipendType: 'Monthly',
    openings: 1,
    startDate: '',
    applicationDeadline: '',
    status: 'published',
    skills: [],
    eligibility: {
      degree: [],
      branches: [],
      graduationYears: [],
      minimumCGPA: 7.0,
    },
    responsibilities: [],
    requirements: [],
    benefits: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        domain: initialData.domain || 'Software Development',
        description: initialData.description || '',
        internshipType: initialData.internshipType || 'Paid',
        workMode: initialData.workMode || 'Hybrid',
        location: initialData.location || '',
        duration: initialData.duration || '',
        stipend: initialData.stipend !== undefined ? initialData.stipend : 0,
        stipendType: initialData.stipendType || 'Monthly',
        openings: initialData.openings !== undefined ? initialData.openings : 1,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        applicationDeadline: initialData.applicationDeadline ? new Date(initialData.applicationDeadline).toISOString().split('T')[0] : '',
        status: initialData.status || 'published',
        skills: initialData.skills || [],
        eligibility: {
          degree: initialData.eligibility?.degree || [],
          branches: initialData.eligibility?.branches || [],
          graduationYears: initialData.eligibility?.graduationYears || [],
          minimumCGPA: initialData.eligibility?.minimumCGPA !== undefined ? initialData.eligibility.minimumCGPA : 7.0,
        },
        responsibilities: initialData.responsibilities || [],
        requirements: initialData.requirements || [],
        benefits: initialData.benefits || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setErrors((prev) => ({ ...prev, skills: 'Skill already added' }));
      return;
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
    setErrors((prev) => ({ ...prev, skills: null }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddResponsibility = () => {
    const trimmed = respInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, trimmed] }));
    setRespInput('');
  };

  const handleRemoveResponsibility = (idx) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
    }));
  };

  const handleAddRequirement = () => {
    const trimmed = reqInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, requirements: [...prev.requirements, trimmed] }));
    setReqInput('');
  };

  const handleRemoveRequirement = (idx) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== idx),
    }));
  };

  const handleAddBenefit = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, trimmed] }));
    setBenefitInput('');
  };

  const handleRemoveBenefit = (idx) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx),
    }));
  };

  const handleCheckboxArray = (category, value) => {
    setFormData((prev) => {
      const currentList = prev.eligibility[category] || [];
      const updated = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return {
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [category]: updated,
        },
      };
    });
  };

  const handleCGPAChange = (e) => {
    const val = parseFloat(e.target.value);
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        minimumCGPA: isNaN(val) ? '' : val,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Please enter the internship title.';
    if (!formData.description.trim()) newErrors.description = 'Please enter the internship description.';
    if (!formData.domain.trim()) newErrors.domain = 'Please select a domain.';
    if (!formData.location.trim()) newErrors.location = 'Please enter the location.';
    if (!formData.duration.trim()) newErrors.duration = 'Please specify the duration.';

    if (!formData.openings || Number(formData.openings) <= 0) {
      newErrors.openings = 'Openings must be greater than 0.';
    }

    if (formData.stipend !== undefined && Number(formData.stipend) < 0) {
      newErrors.stipend = 'Stipend cannot be negative.';
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Please select an application deadline.';
    } else if (isNaN(Date.parse(formData.applicationDeadline))) {
      newErrors.applicationDeadline = 'Invalid application deadline date.';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one required skill.';
    }

    if (formData.eligibility.minimumCGPA !== '' && formData.eligibility.minimumCGPA !== undefined) {
      const cgpa = Number(formData.eligibility.minimumCGPA);
      if (cgpa < 0 || cgpa > 10) {
        newErrors.minimumCGPA = 'CGPA must be between 0 and 10.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      ...formData,
      stipend: Number(formData.stipend),
      openings: Number(formData.openings),
      eligibility: {
        ...formData.eligibility,
        minimumCGPA: Number(formData.eligibility.minimumCGPA),
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate('/company/internships')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer mb-1 transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Internships
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{mode === 'create' ? 'Create New Internship' : 'Edit Internship Details'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/company/internships')}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
          >
            <Send size={15} />
            <span>{isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Internship' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold space-y-1 flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold">Please correct the errors below before submitting:</p>
            <ul className="list-disc list-inside font-medium text-[11px] mt-1 space-y-0.5">
              {Object.values(errors).filter(Boolean).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Internship Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Backend Developer Intern"
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
            />
            {errors.title && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Domain <span className="text-rose-500">*</span>
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Publish Status <span className="text-rose-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              <option value="published">Published (Visible to students)</option>
              <option value="draft">Draft (Hidden from students)</option>
              <option value="closed">Closed (Applications ended)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive overview of the role..."
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
            ></textarea>
            {errors.description && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Internship Details & Schedule</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Internship Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="internshipType"
              value={formData.internshipType}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Work Mode <span className="text-rose-500">*</span>
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold cursor-pointer"
            >
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bhubaneswar, Odisha"
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.location ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold`}
            />
            {errors.location && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Duration <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 6 Months"
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.duration ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold`}
            />
            {errors.duration && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Stipend (₹)
            </label>
            <input
              type="number"
              min="0"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              placeholder="e.g. 15000"
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.stipend ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold`}
            />
            {errors.stipend && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.stipend}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Stipend Type
            </label>
            <select
              name="stipendType"
              value={formData.stipendType}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold cursor-pointer"
            >
              {STIPEND_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Number of Openings <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.openings ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold`}
            />
            {errors.openings && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.openings}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Application Deadline <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.applicationDeadline ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold cursor-pointer`}
            />
            {errors.applicationDeadline && (
              <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.applicationDeadline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Required Skills <span className="text-rose-500">*</span></h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
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
              placeholder="e.g. Node.js, MongoDB, REST API..."
              className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={15} />
              <span>Add Skill</span>
            </button>
          </div>

          {errors.skills && <p className="text-[11px] font-bold text-rose-500">{errors.skills}</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Candidate Eligibility</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
              Allowed Degrees
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEGREES.map((d) => {
                const checked = formData.eligibility.degree.includes(d);
                return (
                  <label
                    key={d}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      checked
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxArray('degree', d)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{d}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
              Allowed Branches
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BRANCHES.map((b) => {
                const checked = formData.eligibility.branches.includes(b);
                return (
                  <label
                    key={b}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      checked
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxArray('branches', b)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{b}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
              Graduation Batch Years
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GRAD_YEARS.map((y) => {
                const checked = formData.eligibility.graduationYears.includes(y);
                return (
                  <label
                    key={y}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      checked
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxArray('graduationYears', y)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Batch {y}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Minimum Required CGPA (0.0 - 10.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.eligibility.minimumCGPA}
              onChange={handleCGPAChange}
              placeholder="e.g. 7.0"
              className={`w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border ${
                errors.minimumCGPA ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              } rounded-2xl text-slate-900 dark:text-white font-semibold`}
            />
            {errors.minimumCGPA && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.minimumCGPA}</p>}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            5
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Responsibilities, Requirements & Benefits</h3>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Key Responsibilities
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={respInput}
              onChange={(e) => setRespInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddResponsibility();
                }
              }}
              placeholder="e.g. Develop REST APIs using Node.js..."
              className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium"
            />
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={15} />
              <span>Add Responsibility</span>
            </button>
          </div>
          <div className="space-y-2 pt-1">
            {formData.responsibilities.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <span>{idx + 1}. {res}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveResponsibility(idx)}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Requirements & Qualifications
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequirement();
                }
              }}
              placeholder="e.g. Basic understanding of JavaScript and Git..."
              className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={15} />
              <span>Add Requirement</span>
            </button>
          </div>
          <div className="space-y-2 pt-1">
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <span>{idx + 1}. {req}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(idx)}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Perks & Benefits
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBenefit();
                }
              }}
              placeholder="e.g. Certificate of completion, PPO Opportunity..."
              className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium"
            />
            <button
              type="button"
              onClick={handleAddBenefit}
              className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={15} />
              <span>Add Benefit</span>
            </button>
          </div>
          <div className="space-y-2 pt-1">
            {formData.benefits.map((ben, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <span>{idx + 1}. {ben}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/company/internships')}
          className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-7 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-lg cursor-pointer transition-all flex items-center gap-2"
        >
          <Send size={15} />
          <span>{isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Internship' : 'Save Changes')}</span>
        </button>
      </div>
    </form>
  );
}
