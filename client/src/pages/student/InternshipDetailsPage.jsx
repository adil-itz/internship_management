import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationFormModal from '../../components/applications/ApplicationFormModal';
import RatingSummary from '../../components/feedback/RatingSummary';
import ReviewList from '../../components/feedback/ReviewList';
import StudentInternshipRating from '../../components/feedback/StudentInternshipRating';
import { getInternshipById } from '../../services/internship.service';
import { getMyApplications } from '../../services/application.service';
import { getInternshipRatings, getStudentFeedback } from '../../services/feedback.service';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Award,
  Users,
  Send,
  BookOpen,
  Star,
  Edit
} from 'lucide-react';

export default function InternshipDetailsPage({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [existingApp, setExistingApp] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const [ratingSummary, setRatingSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [existingStudentFeedback, setExistingStudentFeedback] = useState(null);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  const role = activeUser?.role || 'student';

  useEffect(() => {
    if (id) {
      fetchDetails();
      fetchRatings(1);
      if (role === 'student') {
        checkStudentApplication();
      }
    }
  }, [id, role]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInternshipById(id);
      if (res && res.success) {
        setInternship(res.internship);
      } else {
        setError('Internship not found');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (page = 1) => {
    try {
      const res = await getInternshipRatings(id, { page, limit: 10 });
      if (res && res.success) {
        setRatingSummary(res.summary);
        setReviews(res.reviews || []);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkStudentApplication = async () => {
    try {
      const res = await getMyApplications();
      if (res && res.success && res.applications) {
        const found = res.applications.find(
          (a) => (a.internship?._id === id || a.internship === id) && a.status !== 'withdrawn'
        );
        if (found) setExistingApp(found);
      }

      if (activeUser?.id || activeUser?._id) {
        const fbRes = await getStudentFeedback(activeUser.id || activeUser._id);
        if (fbRes && fbRes.success && fbRes.feedbacks) {
          const foundFb = fbRes.feedbacks.find(
            f => f.type === 'internship_rating' && (f.internshipId?._id === id || f.internshipId === id)
          );
          if (foundFb) setExistingStudentFeedback(foundFb);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={activeUser} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading internship details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !internship) {
    return (
      <DashboardLayout user={activeUser} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error || 'Internship Not Found'}</h3>
            <p className="text-xs text-rose-600/80">The requested internship posting could not be found or has been removed.</p>
            <Link
              to="/student/internships"
              className="inline-block px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl shadow-md"
            >
              Browse All Internships
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const {
    title,
    company,
    description,
    domain,
    skills = [],
    internshipType,
    location,
    workMode,
    duration,
    stipend,
    stipendType,
    openings,
    startDate,
    applicationDeadline,
    eligibility,
    responsibilities = [],
    requirements = [],
    benefits = [],
  } = internship;

  const companyName = typeof company === 'object' && company !== null ? company.name : 'Company';
  const companyEmail = typeof company === 'object' && company !== null ? company.email : '';
  const companyId = typeof company === 'object' && company !== null ? company._id : company;
  const isCompanyOwner = role === 'company' && typeof company === 'object' && company !== null && (company._id === activeUser?.id || company.toString() === activeUser?.id);

  const isEligibleToRate = role === 'student' && existingApp && existingApp.status === 'selected';

  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Immediate';

  const formattedStipend = stipend && stipend > 0
    ? `₹${stipend.toLocaleString('en-IN')}${stipendType ? ` / ${stipendType}` : ' / Month'}`
    : 'Unpaid';

  const isClosed = internship.status !== 'published' || (applicationDeadline && new Date() > new Date(applicationDeadline));

  const renderActionButton = () => {
    if (isCompanyOwner) {
      return (
        <button
          onClick={() => navigate(`/company/internships/${id}/applications`)}
          className="px-6 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Users size={15} />
          <span>View Applicants</span>
        </button>
      );
    }

    if (existingApp) {
      return (
        <button
          onClick={() => navigate(`/student/applications/${existingApp._id}`)}
          className="px-6 py-3 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <CheckCircle2 size={15} />
          <span>View Application ({existingApp.status})</span>
        </button>
      );
    }

    if (isClosed) {
      return (
        <button
          disabled
          className="px-6 py-3 text-xs font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 cursor-not-allowed"
        >
          Applications Closed
        </button>
      );
    }

    return (
      <button
        onClick={() => setApplyModalOpen(true)}
        className="px-6 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 group hover:scale-105"
      >
        <Send size={15} />
        <span>Apply Now</span>
      </button>
    );
  };

  return (
    <DashboardLayout user={activeUser} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                {companyName ? companyName.charAt(0).toUpperCase() : <Building2 size={28} />}
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {domain}
                </span>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {title}
                </h1>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Building2 size={14} className="text-blue-500" />
                  {companyId ? (
                    <Link to={`/company/${companyId}`} className="hover:text-blue-600 underline">
                      {companyName}
                    </Link>
                  ) : (
                    <span>{companyName}</span>
                  )}
                  {companyEmail && <span className="text-slate-400">({companyEmail})</span>}
                </p>
              </div>
            </div>

            {renderActionButton()}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin size={12} /> Location & Mode
              </span>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                {location} • {workMode}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-500" /> Stipend
              </span>
              <p className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {formattedStipend}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Duration
              </span>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                {duration} ({internshipType})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users size={12} /> Openings
              </span>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                {openings} Position{openings > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <BookOpen size={16} className="text-blue-500" />
                <span>About the Internship</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {description}
              </p>
            </div>

            {skills && skills.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Skills Required</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {responsibilities && responsibilities.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  <span>Responsibilities</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {responsibilities.map((res, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="text-blue-500 font-extrabold shrink-0 mt-0.5">✓</span>
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {requirements && requirements.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CheckCircle2 size={16} className="text-indigo-500" />
                  <span>Requirements</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="text-indigo-500 font-extrabold shrink-0 mt-0.5">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Star size={20} className="text-amber-500 fill-amber-400" />
                  <span>Internship Experience & Reviews</span>
                </h3>

                {isEligibleToRate && (
                  <button
                    onClick={() => setRateModalOpen(true)}
                    className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {existingStudentFeedback ? <Edit size={14} /> : <Star size={14} />}
                    <span>{existingStudentFeedback ? 'Edit Your Review' : 'Rate This Internship'}</span>
                  </button>
                )}
              </div>

              <RatingSummary summary={ratingSummary} type="internship" />
              <ReviewList
                reviews={reviews}
                pagination={pagination}
                onPageChange={(p) => fetchRatings(p)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {eligibility && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <GraduationCap size={16} className="text-purple-500" />
                  <span>Eligibility Criteria</span>
                </h3>
                
                <div className="space-y-3 text-xs">
                  {eligibility.degree && eligibility.degree.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Degree</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {eligibility.degree.join(', ')}
                      </p>
                    </div>
                  )}

                  {eligibility.branches && eligibility.branches.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Branches</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {eligibility.branches.join(', ')}
                      </p>
                    </div>
                  )}

                  {eligibility.minimumCGPA !== undefined && (
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Minimum CGPA</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {eligibility.minimumCGPA} / 10.0
                      </p>
                    </div>
                  )}

                  {eligibility.graduationYears && eligibility.graduationYears.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Graduation Batch</span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {eligibility.graduationYears.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {benefits && benefits.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Award size={16} className="text-emerald-500" />
                  <span>Benefits & Perks</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {benefits.map((ben, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                      <span className="text-emerald-500">✓</span>
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar size={14} /> Start Date
                  </span>
                  <span className="font-extrabold">{formattedStartDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> Application Deadline
                  </span>
                  <span className="font-extrabold text-amber-400">{formattedDeadline}</span>
                </div>
              </div>

              {!isCompanyOwner && !existingApp && !isClosed && (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3 text-xs font-extrabold text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={15} className="text-blue-600" />
                  <span>Apply Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ApplicationFormModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        internshipId={id}
        internshipTitle={title}
        companyName={companyName}
        onSuccess={() => {
          checkStudentApplication();
        }}
      />

      {rateModalOpen && (
        <StudentInternshipRating
          isOpen={true}
          onClose={() => setRateModalOpen(false)}
          internshipId={id}
          internshipTitle={title}
          existingFeedback={existingStudentFeedback}
          onSuccess={() => {
            fetchRatings(1);
            checkStudentApplication();
          }}
        />
      )}
    </DashboardLayout>
  );
}
