import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import MentorAssignment from "../models/MentorAssignment.js";
import Attendance from "../models/Attendance.js";
import WorkLog from "../models/WorkLog.js";

const buildDateMatch = (startDate, endDate, dateField = 'createdAt') => {
  if (!startDate && !endDate) return {};
  const match = {};
  if (startDate) match.$gte = new Date(startDate);
  if (endDate) match.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  return { [dateField]: match };
};

export const getDashboardSummary = async (startDate, endDate) => {
  const userMatch = buildDateMatch(startDate, endDate);
  const totalUsers = await User.countDocuments(userMatch);
  const totalStudents = await User.countDocuments({ role: "student", ...userMatch });
  const totalMentors = await User.countDocuments({ role: "mentor", ...userMatch });
  const totalCompanies = await User.countDocuments({ role: "company", ...userMatch });

  const internMatch = buildDateMatch(startDate, endDate);
  const totalInternships = await Internship.countDocuments(internMatch);
  const activeInternships = await Internship.countDocuments({ status: "published", ...internMatch });

  const appMatch = buildDateMatch(startDate, endDate);
  const totalApplications = await Application.countDocuments(appMatch);
  const pendingApplications = await Application.countDocuments({ status: "applied", ...appMatch });
  const selectedApplications = await Application.countDocuments({ status: "selected", ...appMatch });
  
  const totalInterviews = await Application.countDocuments({ "interview.date": { $exists: true }, ...appMatch });

  const assignmentMatch = buildDateMatch(startDate, endDate);
  const totalMentorAssignments = await MentorAssignment.countDocuments(assignmentMatch);

  const attendanceMatch = buildDateMatch(startDate, endDate, 'date');
  const presentCount = await Attendance.countDocuments({ status: "present", ...attendanceMatch });
  const absentCount = await Attendance.countDocuments({ status: "absent", ...attendanceMatch });
  const lateCount = await Attendance.countDocuments({ status: "late", ...attendanceMatch });
  const halfDayCount = await Attendance.countDocuments({ status: "half-day", ...attendanceMatch });
  const leaveCount = await Attendance.countDocuments({ status: "leave", ...attendanceMatch });
  const totalAttendance = presentCount + absentCount + lateCount + halfDayCount + leaveCount;
  const attendancePercentage = totalAttendance > 0 
    ? Math.round(((presentCount + (halfDayCount * 0.5)) / totalAttendance) * 100) 
    : 0;

  const worklogMatch = buildDateMatch(startDate, endDate, 'date');
  const totalWorkLogs = await WorkLog.countDocuments(worklogMatch);
  const approvedWorkLogs = await WorkLog.countDocuments({ status: "approved", ...worklogMatch });
  const rejectedWorkLogs = await WorkLog.countDocuments({ status: "rejected", ...worklogMatch });
  const submittedWorkLogs = await WorkLog.countDocuments({ status: "submitted", ...worklogMatch });
  const draftWorkLogs = await WorkLog.countDocuments({ status: "draft", ...worklogMatch });

  const hoursMatch = buildDateMatch(startDate, endDate, 'date');
  const hoursMatchQuery = Object.keys(hoursMatch).length ? { $match: hoursMatch } : { $match: {} };
  const hoursResult = await WorkLog.aggregate([
    hoursMatchQuery,
    { $group: { _id: null, totalHours: { $sum: "$hoursWorked" } } }
  ]);
  const totalHoursWorked = hoursResult[0]?.totalHours || 0;

  return {
    totalUsers, totalStudents, totalMentors, totalCompanies,
    internships: { total: totalInternships, active: activeInternships },
    applications: { total: totalApplications, pending: pendingApplications, selected: selectedApplications },
    totalInterviews,
    totalMentorAssignments,
    attendance: {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      halfDay: halfDayCount,
      leave: leaveCount,
      total: totalAttendance,
      percentage: attendancePercentage
    },
    worklog: {
      totalLogs: totalWorkLogs,
      approved: approvedWorkLogs,
      rejected: rejectedWorkLogs,
      submitted: submittedWorkLogs,
      draft: draftWorkLogs,
      totalHours: totalHoursWorked
    }
  };
};

export const getMonthlyAnalytics = async (year) => {
  const startYear = new Date(`${year}-01-01`);
  const endYear = new Date(`${year}-12-31T23:59:59.999Z`);

  const userStats = await User.aggregate([
    { $match: { createdAt: { $gte: startYear, $lte: endYear } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);

  const internStats = await Internship.aggregate([
    { $match: { createdAt: { $gte: startYear, $lte: endYear } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);

  const appStats = await Application.aggregate([
    { $match: { createdAt: { $gte: startYear, $lte: endYear } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const data = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      month,
      monthName: monthNames[i],
      users: userStats.find(s => s._id === month)?.count || 0,
      internships: internStats.find(s => s._id === month)?.count || 0,
      applications: appStats.find(s => s._id === month)?.count || 0
    };
  });

  return data;
};

export const getCompanyWiseReport = async (startDate, endDate, companyId) => {
  const match = { role: "company" };
  if (companyId) match._id = companyId;

  const companies = await User.find(match).select('name email');
  
  const internMatch = buildDateMatch(startDate, endDate);
  
  const report = await Promise.all(companies.map(async (company) => {
    const totalInternships = await Internship.countDocuments({ company: company._id, ...internMatch });
    
    const companyInternships = await Internship.find({ company: company._id }).select('_id');
    const internshipIds = companyInternships.map(i => i._id);
    
    const appMatch = { internship: { $in: internshipIds }, ...buildDateMatch(startDate, endDate) };
    const totalApplications = await Application.countDocuments(appMatch);
    const selectedApplications = await Application.countDocuments({ status: "selected", ...appMatch });

    return {
      companyName: company.name,
      email: company.email,
      totalInternships,
      totalApplications,
      selectedApplications
    };
  }));

  return report;
};

export const getMentorWiseReport = async (startDate, endDate, mentorId) => {
  const match = { role: "mentor" };
  if (mentorId) match._id = mentorId;

  const mentors = await User.find(match).select('name email');
  const assignmentMatch = buildDateMatch(startDate, endDate);

  const report = await Promise.all(mentors.map(async (mentor) => {
    const totalAssignments = await MentorAssignment.countDocuments({ mentor: mentor._id, ...assignmentMatch });
    const activeAssignments = await MentorAssignment.countDocuments({ mentor: mentor._id, status: "active", ...assignmentMatch });

    return {
      mentorName: mentor.name,
      email: mentor.email,
      totalAssignments,
      activeAssignments
    };
  }));

  return report;
};

export const getStudentWiseReport = async (startDate, endDate, studentId) => {
  const match = { role: "student" };
  if (studentId) match._id = studentId;

  const students = await User.find(match).select('name email');
  const appMatch = buildDateMatch(startDate, endDate);

  const report = await Promise.all(students.map(async (student) => {
    const applicationsCount = await Application.countDocuments({ candidate: student._id, ...appMatch });
    const acceptedCount = await Application.countDocuments({ candidate: student._id, status: "selected", ...appMatch });

    return {
      studentName: student.name,
      email: student.email,
      applicationsCount,
      acceptedCount
    };
  }));

  return report;
};
