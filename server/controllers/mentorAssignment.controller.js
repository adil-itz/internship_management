import MentorAssignment from "../models/MentorAssignment.js";
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

export const assignMentor = async (req, res) => {
  try {
    const { internshipId, studentId, mentorId } = req.body;
    const assignedBy = req.user.id;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    if (req.user.role !== "admin" && internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") return res.status(404).json({ success: false, message: "Mentor not found" });

    const application = await Application.findOne({ internship: internshipId, candidate: studentId });
    if (!application || application.status !== "selected") {
      return res.status(400).json({ success: false, message: "Mentor can only be assigned to a selected candidate." });
    }

    const existingAssignment = await MentorAssignment.findOne({ internship: internshipId, student: studentId, status: "active" });
    if (existingAssignment) {
      return res.status(400).json({ success: false, message: "Student is already assigned to an active mentor for this internship" });
    }

    const assignment = new MentorAssignment({
      internship: internshipId,
      student: studentId,
      mentor: mentorId,
      assignedBy
    });

    await assignment.save();

    res.status(201).json({ success: true, message: "Mentor assigned successfully", assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await MentorAssignment.find()
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("internship", "title company");
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyAssignments = async (req, res) => {
  try {
    const assignments = await MentorAssignment.find({ mentor: req.user.id })
      .populate("student", "name email")
      .populate("internship", "title description startDate endDate company");
      
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await MentorAssignment.find({ student: req.user.id })
      .populate("mentor", "name email")
      .populate("internship", "title company");
      
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInternshipAssignments = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    if (req.user.role !== "admin" && internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const assignments = await MentorAssignment.find({ internship: req.params.internshipId })
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("internship", "title company");

    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await MentorAssignment.findById(req.params.id)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("internship", "title company");
      
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const assignment = await MentorAssignment.findById(req.params.id).populate("internship");
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    const isMentor = req.user.role === "mentor" && assignment.mentor.toString() === req.user.id;
    const isCompany = req.user.role === "company" && assignment.internship.company.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isMentor && !isCompany && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    assignment.status = status;
    await assignment.save();

    res.json({ success: true, message: "Assignment status updated", assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("name email avatar");
    res.json({ success: true, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
