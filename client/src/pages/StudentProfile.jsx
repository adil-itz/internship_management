import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ResumeSection from '../components/ResumeSection';
import { getStudentProfile, updateStudentProfile } from '../services/student.service';
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, Link as LinkIcon, 
  Globe, Edit2, Check, AlertCircle, Plus, X as XIcon, ChevronDown
} from 'lucide-react';

export default function StudentProfile({ darkMode, setDarkMode, user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfile();
      if (data) {
        const profileData = data.profile || data;
        if (!profileData.skills) profileData.skills = [];
        setProfile(profileData);
        setEditForm(JSON.parse(JSON.stringify(profileData)));
      } else {
        setProfile(null);
        setEditForm({ skills: [] });
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
      }
    }
    fetchProfile();
  }, [user]);

  const handleEditClick = () => {
    setEditForm(profile ? JSON.parse(JSON.stringify(profile)) : { skills: [] });
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Check if form was changed
    const baseProfile = profile || { skills: [] };
    const hasChanges = JSON.stringify(baseProfile) !== JSON.stringify(editForm);
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setIsEditing(false);
    setEditForm(profile ? JSON.parse(JSON.stringify(profile)) : { skills: [] });
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !editForm.skills.includes(trimmed)) {
      setEditForm(prev => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!editForm.fullName?.trim()) errors.fullName = 'Full Name is required';
    if (editForm.cgpa) {
      const cgpaNum = parseFloat(editForm.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        errors.cgpa = 'CGPA must be between 0 and 10';
      }
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (editForm.linkedinUrl && !urlPattern.test(editForm.linkedinUrl)) {
      errors.linkedinUrl = 'Please enter a valid URL';
    }
    if (editForm.githubUrl && !urlPattern.test(editForm.githubUrl)) {
      errors.githubUrl = 'Please enter a valid URL';
    }
    if (editForm.portfolioUrl && !urlPattern.test(editForm.portfolioUrl)) {
      errors.portfolioUrl = 'Please enter a valid URL';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = { ...editForm };
    
    // Convert empty strings to null for Mongoose Number/Date/Enum fields
    if (payload.cgpa === '') payload.cgpa = null;
    if (payload.graduationYear === '') payload.graduationYear = null;
    if (payload.semester === '') payload.semester = null;
    if (payload.dateOfBirth === '') payload.dateOfBirth = null;
    if (payload.gender === '' || payload.gender === 'Prefer not to say') payload.gender = null;

    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await updateStudentProfile(payload);
      if (updatedProfile && !updatedProfile.skills) updatedProfile.skills = [];
      setProfile(updatedProfile.profile || updatedProfile);
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpdate = (newResumeData) => {
    setProfile(prev => ({ ...prev, resume: newResumeData }));
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="profile">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback to empty profile object if none
  const currentData = isEditing ? editForm : (profile || { skills: [] });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="profile">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {currentData?.fullName ? currentData.fullName.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'U')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentData?.fullName || user?.name || 'Student Name'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <Mail size={14} /> {currentData?.email || user?.email || 'email@example.com'}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <GraduationCap size={14} />
                Student
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
            <Check size={18} />
            {success}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-6">
          
          {/* About / Bio */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editForm.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {currentData?.bio || 'No bio provided yet.'}
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {validationErrors.fullName && <p className="text-xs text-rose-500 mt-1">{validationErrors.fullName}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> {currentData?.fullName || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" /> {currentData?.phone || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editForm.location || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> {currentData?.location || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editForm.dateOfBirth ? editForm.dateOfBirth.split('T')[0] : ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> 
                    {currentData?.dateOfBirth ? new Date(currentData.dateOfBirth).toLocaleDateString() : '-'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Gender</label>
                {isEditing ? (
                  <div className="relative">
                    <select
                      name="gender"
                      value={editForm.gender || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> {currentData?.gender || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-semibold text-slate-500">College / University</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="college"
                    value={editForm.college || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" /> {currentData?.college || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Degree</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="degree"
                    placeholder="e.g. B.Tech"
                    value={editForm.degree || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{currentData?.degree || '-'}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Branch / Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="branch"
                    placeholder="e.g. Computer Science"
                    value={editForm.branch || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{currentData?.branch || '-'}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Graduation Year</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="graduationYear"
                    placeholder="e.g. 2026"
                    value={editForm.graduationYear || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{currentData?.graduationYear || '-'}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">CGPA</label>
                {isEditing ? (
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      name="cgpa"
                      value={editForm.cgpa || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {validationErrors.cgpa && <p className="text-xs text-rose-500 mt-1">{validationErrors.cgpa}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{currentData?.cgpa || '-'}</p>
                )}
              </div>

            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Professional Information</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Preferred Domain</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="preferredDomain"
                      placeholder="e.g. Software Development"
                      value={editForm.preferredDomain || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-400" /> {currentData?.preferredDomain || '-'}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Preferred Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="preferredRole"
                      placeholder="e.g. Backend Developer"
                      value={editForm.preferredRole || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{currentData?.preferredRole || '-'}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {(currentData?.skills || []).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center gap-1.5"
                    >
                      {skill}
                      {isEditing && (
                        <button onClick={() => removeSkill(skill)} className="hover:text-rose-500 focus:outline-none">
                          <XIcon size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add skill..."
                        className="w-32 px-3 py-1 text-sm bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={addSkill}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                  {(!currentData?.skills || currentData.skills.length === 0) && !isEditing && (
                    <span className="text-sm text-slate-500 italic">No skills added</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Social Links</h3>
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 w-32 shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <LinkIcon size={18} className="text-[#0A66C2]" /> LinkedIn
                </div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="url"
                      name="linkedinUrl"
                      placeholder="https://linkedin.com/in/..."
                      value={editForm.linkedinUrl || ''}
                      onChange={handleChange}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {validationErrors.linkedinUrl && <p className="text-xs text-rose-500 mt-1">{validationErrors.linkedinUrl}</p>}
                  </div>
                ) : (
                  <a href={currentData?.linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                    {currentData?.linkedinUrl || 'Not provided'}
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 w-32 shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <LinkIcon size={18} /> GitHub
                </div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="url"
                      name="githubUrl"
                      placeholder="https://github.com/..."
                      value={editForm.githubUrl || ''}
                      onChange={handleChange}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {validationErrors.githubUrl && <p className="text-xs text-rose-500 mt-1">{validationErrors.githubUrl}</p>}
                  </div>
                ) : (
                  <a href={currentData?.githubUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                    {currentData?.githubUrl || 'Not provided'}
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 w-32 shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Globe size={18} className="text-emerald-500" /> Portfolio
                </div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="url"
                      name="portfolioUrl"
                      placeholder="https://..."
                      value={editForm.portfolioUrl || ''}
                      onChange={handleChange}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {validationErrors.portfolioUrl && <p className="text-xs text-rose-500 mt-1">{validationErrors.portfolioUrl}</p>}
                  </div>
                ) : (
                  <a href={currentData?.portfolioUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                    {currentData?.portfolioUrl || 'Not provided'}
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Resume Section (only visible when not editing profile info to keep focus) */}
          {!isEditing && (
            <ResumeSection 
              resume={currentData?.resume} 
              onResumeUpdate={handleResumeUpdate} 
            />
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-lg">
              <button
                onClick={handleCancelClick}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Unsaved Changes Warning Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Discard Changes?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
