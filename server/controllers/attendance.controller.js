import Attendance from "../models/Attendance.js";
import Application from "../models/Application.js";
import { validateMentorStudentAssignment } from "../utils/assignmentHelper.js";

// Helper to start of day for accurate querying
const startOfDay = (dateString) => {
  const d = new Date(dateString);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const createAttendance = async (req, res) => {
  try {
    const { studentId, internshipId, date, status, checkIn, checkOut, remarks } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!studentId || !internshipId || !date || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const attendanceDate = startOfDay(date);
    if (isNaN(attendanceDate)) {
      return res.status(400).json({ success: false, message: "Invalid date." });
    }

    // Verify student belongs to internship
    const application = await Application.findOne({ internship: internshipId, candidate: studentId, status: "selected" });
    if (!application) {
      return res.status(400).json({ success: false, message: "Student is not selected for this internship." });
    }

    let mentorId = userId;
    if (role === "student") {
      if (studentId !== userId) {
        return res.status(403).json({ success: false, message: "Can only mark own attendance." });
      }
      const MentorAssignment = (await import("../models/MentorAssignment.js")).default;
      const assignment = await MentorAssignment.findOne({ student: studentId, internship: internshipId, status: "active" });
      mentorId = assignment ? assignment.mentor : null;
    } else if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, studentId, internshipId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
      mentorId = assignment.mentor;
    } else if (role === "admin") {
      const MentorAssignment = (await import("../models/MentorAssignment.js")).default;
      const assignment = await MentorAssignment.findOne({ student: studentId, internship: internshipId, status: "active" });
      mentorId = assignment ? assignment.mentor : null;
    } else {
       return res.status(403).json({ success: false, message: "Unauthorized role." });
    }

    // Prevent duplicate
    const existing = await Attendance.findOne({ studentId, internshipId, date: attendanceDate });
    if (existing) {
      return res.status(409).json({ success: false, message: "Attendance for this date already exists." });
    }

    const attendance = new Attendance({
      studentId,
      internshipId,
      mentorId,
      date: attendanceDate,
      status,
      checkIn,
      checkOut,
      remarks,
      markedBy: userId
    });

    await attendance.save();

    res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { from, to, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "student" && studentId !== userId) {
      return res.status(403).json({ success: false, message: "Can only access own attendance." });
    }

    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, studentId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
    }

    const query = { studentId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = startOfDay(from);
      if (to) query.date.$lte = startOfDay(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("internshipId", "title company")
      .populate("markedBy", "name")
      .lean();

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInternshipAttendance = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { date, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    const query = { internshipId };
    
    if (role === "mentor") {
      query.mentorId = userId;
    } else if (role === "company") {
      const Internship = (await import("../models/Internship.js")).default;
      const intern = await Internship.findOne({ _id: internshipId, company: userId });
      if (!intern) {
        return res.status(403).json({ success: false, message: "Not authorized to view attendance for this internship." });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (date) {
      query.date = startOfDay(date);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("studentId", "name email avatar")
      .populate("internshipId", "title company")
      .lean();

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompanyAllAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, internshipId } = req.query;

    const Internship = (await import("../models/Internship.js")).default;
    const companyInternships = await Internship.find({ company: userId }).select("_id");
    const internshipIds = companyInternships.map((i) => i._id);

    const query = { internshipId: { $in: internshipIds } };
    if (internshipId) {
      query.internshipId = internshipId;
    }
    if (date) {
      query.date = startOfDay(date);
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate("studentId", "name email avatar")
      .populate("internshipId", "title company")
      .lean();

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, checkIn, checkOut, remarks } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found." });
    }

    if (role === "student") {
      if (attendance.studentId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this record." });
      }
    } else if (role === "mentor") {
      if (attendance.mentorId && attendance.mentorId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this record." });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (status) attendance.status = status;
    if (checkIn !== undefined) attendance.checkIn = checkIn;
    if (checkOut !== undefined) attendance.checkOut = checkOut;
    if (remarks !== undefined) attendance.remarks = remarks;

    await attendance.save();

    res.json({ success: true, message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found." });
    }

    if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can delete attendance records." });
    }

    await Attendance.deleteOne({ _id: id });

    res.json({ success: true, message: "Attendance deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { internshipId } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    // Auth check
    if (role === "student" && studentId !== userId) {
      return res.status(403).json({ success: false, message: "Can only access own summary." });
    }
    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, studentId, internshipId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
    }

    const matchStage = { studentId: (await import("mongoose")).default.Types.ObjectId.createFromHexString(studentId) };
    if (internshipId) {
      matchStage.internshipId = (await import("mongoose")).default.Types.ObjectId.createFromHexString(internshipId);
    }

    const stats = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absentDays: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          lateDays: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
          halfDayDays: { $sum: { $cond: [{ $eq: ["$status", "half-day"] }, 1, 0] } },
          leaveDays: { $sum: { $cond: [{ $eq: ["$status", "leave"] }, 1, 0] } }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, halfDayDays: 0, leaveDays: 0, attendancePercentage: 0
        }
      });
    }

    const data = stats[0];
    const eligibleDays = data.totalDays - data.leaveDays;
    
    let attendancePercentage = 0;
    if (eligibleDays > 0) {
      attendancePercentage = ((data.presentDays + data.lateDays + (data.halfDayDays * 0.5)) / eligibleDays) * 100;
    }

    delete data._id;
    data.eligibleDays = eligibleDays;
    data.attendancePercentage = parseFloat(attendancePercentage.toFixed(2));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
