import WorkLog from "../models/WorkLog.js";
import Application from "../models/Application.js";
import InternshipTask from "../models/InternshipTask.js";
import { validateMentorStudentAssignment } from "../utils/assignmentHelper.js";

const startOfDay = (dateString) => {
  const d = new Date(dateString);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const createWorkLog = async (req, res) => {
  try {
    const { internshipId, taskId, date, title, description, hoursWorked, challenges, learning, githubLink } = req.body;
    const studentId = req.user.id;
    const role = req.user.role;

    if (role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can create work logs." });
    }

    if (!internshipId || !date || !title || !description || hoursWorked === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    if (hoursWorked < 0 || hoursWorked > 24) {
      return res.status(400).json({ success: false, message: "Hours worked must be between 0 and 24." });
    }

    const workDate = startOfDay(date);
    if (isNaN(workDate)) {
      return res.status(400).json({ success: false, message: "Invalid date." });
    }

    // Verify student is associated with internship
    const application = await Application.findOne({ internship: internshipId, candidate: studentId, status: "selected" });
    if (!application) {
      return res.status(400).json({ success: false, message: "Not selected for this internship." });
    }

    if (taskId) {
      const task = await InternshipTask.findById(taskId);
      if (!task || task.internship.toString() !== internshipId || task.student.toString() !== studentId) {
        return res.status(400).json({ success: false, message: "Invalid task reference." });
      }
    }

    const workLog = new WorkLog({
      studentId,
      internshipId,
      taskId,
      date: workDate,
      title,
      description,
      hoursWorked,
      challenges,
      learning,
      githubLink,
      status: "draft"
    });

    await workLog.save();

    res.status(201).json({ success: true, message: "Work log created successfully.", workLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentWorkLogs = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, from, to, internshipId, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "student" && studentId !== userId) {
      return res.status(403).json({ success: false, message: "Can only access own work logs." });
    }

    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, studentId, internshipId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
    }

    const query = { studentId };
    if (status) query.status = status;
    if (internshipId) query.internshipId = internshipId;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = startOfDay(from);
      if (to) query.date.$lte = startOfDay(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await WorkLog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("internshipId", "title company")
      .populate("taskId", "title")
      .lean();

    const total = await WorkLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
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

export const getInternshipWorkLogs = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { studentId, status, from, to, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    const query = { internshipId };
    
    if (role === "mentor") {
      if (studentId) {
        const assignment = await validateMentorStudentAssignment(userId, studentId, internshipId);
        if (!assignment) {
           return res.status(403).json({ success: false, message: "Not assigned to this student." });
        }
        query.studentId = studentId;
      } else {
        // Find all students assigned to this mentor for this internship
        const MentorAssignment = (await import("../models/MentorAssignment.js")).default;
        const assignments = await MentorAssignment.find({ mentor: userId, internship: internshipId, status: "active" });
        const studentIds = assignments.map(a => a.student);
        query.studentId = { $in: studentIds };
      }
    } else if (role === "admin") {
      if (studentId) query.studentId = studentId;
    } else {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (status) query.status = status;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = startOfDay(from);
      if (to) query.date.$lte = startOfDay(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await WorkLog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("studentId", "name email avatar")
      .populate("taskId", "title")
      .lean();

    const total = await WorkLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
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

export const getWorkLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const workLog = await WorkLog.findById(id)
      .populate("studentId", "name email avatar")
      .populate("internshipId", "title company")
      .populate("taskId", "title")
      .populate("reviewedBy", "name");

    if (!workLog) {
      return res.status(404).json({ success: false, message: "Work log not found." });
    }

    if (role === "student" && workLog.studentId._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, workLog.studentId._id);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }
    }

    res.json({ success: true, data: workLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, hoursWorked, challenges, learning, githubLink, taskId } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: "Work log not found." });
    }

    if (role === "student") {
      if (workLog.studentId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }
      if (workLog.status === "submitted" || workLog.status === "approved") {
        return res.status(400).json({ success: false, message: "Cannot edit submitted or approved work logs." });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Mentors cannot edit student logs directly." });
    }

    if (hoursWorked !== undefined) {
      if (hoursWorked < 0 || hoursWorked > 24) {
        return res.status(400).json({ success: false, message: "Hours worked must be between 0 and 24." });
      }
      workLog.hoursWorked = hoursWorked;
    }

    if (title !== undefined) workLog.title = title;
    if (description !== undefined) workLog.description = description;
    if (challenges !== undefined) workLog.challenges = challenges;
    if (learning !== undefined) workLog.learning = learning;
    if (githubLink !== undefined) workLog.githubLink = githubLink;
    if (taskId !== undefined) workLog.taskId = taskId || null;

    await workLog.save();

    res.json({ success: true, message: "Work log updated successfully.", workLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: "Work log not found." });
    }

    if (role === "student") {
      if (workLog.studentId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }
      if (workLog.status !== "draft" && workLog.status !== "rejected") {
        return res.status(400).json({ success: false, message: "Cannot delete submitted or approved work logs." });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete." });
    }

    await WorkLog.deleteOne({ _id: id });

    res.json({ success: true, message: "Work log deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const submitWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can submit work logs." });
    }

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: "Work log not found." });
    }

    if (workLog.studentId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (workLog.status !== "draft" && workLog.status !== "rejected") {
      return res.status(400).json({ success: false, message: "Only draft or rejected work logs can be submitted." });
    }

    workLog.status = "submitted";
    // Clear old feedback upon resubmission
    workLog.mentorFeedback = undefined;
    
    await workLog.save();

    res.json({ success: true, message: "Work log submitted successfully.", workLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const reviewWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mentorFeedback } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or rejected." });
    }

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: "Work log not found." });
    }

    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, workLog.studentId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (workLog.status !== "submitted") {
      return res.status(400).json({ success: false, message: "Only submitted work logs can be reviewed." });
    }

    workLog.status = status;
    workLog.mentorFeedback = mentorFeedback;
    workLog.reviewedBy = userId;
    workLog.reviewedAt = new Date();

    await workLog.save();

    res.json({ success: true, message: "Work log reviewed successfully.", workLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getWorkLogSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "student" && studentId !== userId) {
      return res.status(403).json({ success: false, message: "Can only access own summary." });
    }
    
    if (role === "mentor") {
      const assignment = await validateMentorStudentAssignment(userId, studentId);
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not assigned to this student." });
      }
    }

    const matchStage = { studentId: (await import("mongoose")).default.Types.ObjectId.createFromHexString(studentId) };
    
    const stats = await WorkLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          submitted: { $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
          totalHours: { $sum: "$hoursWorked" }
        }
      }
    ]);

    let data = { totalLogs: 0, draft: 0, submitted: 0, approved: 0, rejected: 0, totalHours: 0 };
    if (stats.length > 0) {
      data = stats[0];
      delete data._id;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
