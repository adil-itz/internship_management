import Application from "../models/Application.js";
import Internship from "../models/Internship.js";

export const createApplication = async (req, res) => {
  try {
    const { internshipId, resumeUrl, coverLetter } = req.body;
    const candidateId = req.user.id;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    if (internship.status !== "published") {
      return res.status(400).json({ success: false, message: "Internship is not accepting applications" });
    }

    if (new Date() > new Date(internship.applicationDeadline)) {
      return res.status(400).json({ success: false, message: "Application deadline has passed" });
    }

    const existingApp = await Application.findOne({ internship: internshipId, candidate: candidateId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: "You have already applied for this internship." });
    }

    const application = new Application({
      internship: internshipId,
      candidate: candidateId,
      resumeUrl,
      coverLetter,
      status: "applied"
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already applied for this internship." });
    }
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate("internship", "title company location duration startDate endDate")
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("internship", "title company location duration startDate endDate company")
      .populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const isStudent = req.user.role === "student" && application.candidate._id.toString() === req.user.id;
    const isCompany = req.user.role === "company" && application.internship.company.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    
    if (!isStudent && !isCompany && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to view this application" });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInternshipApplications = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    if (req.user.role !== "admin" && internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const query = { internship: internshipId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate("candidate", "name email avatar")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
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

export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const applications = await Application.find(query)
      .populate("candidate", "name email avatar")
      .populate("internship", "title company location duration")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
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

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const validStatuses = ["shortlisted", "interview_scheduled", "selected", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("internship");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role !== "admin" && application.internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const currentStatus = application.status;
    const validTransitions = {
      applied: ["shortlisted", "interview_scheduled", "selected", "rejected"],
      shortlisted: ["interview_scheduled", "selected", "rejected"],
      interview_scheduled: ["selected", "rejected"],
      selected: [],
      rejected: [],
      withdrawn: []
    };

    if (req.user.role !== "admin" && !validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status transition" });
    }

    application.status = status;
    if (status === "rejected" && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    res.json({
      success: true,
      message: "Application status updated",
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { date, time, mode, meetingLink, location, notes } = req.body;

    const application = await Application.findById(req.params.id).populate("internship");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role !== "admin" && application.internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (application.status === "rejected" || application.status === "withdrawn") {
      return res.status(400).json({ success: false, message: "Cannot schedule interview for rejected or withdrawn application" });
    }

    if (mode === "online" && !meetingLink) {
      return res.status(400).json({ success: false, message: "Meeting link required for online interview" });
    }
    if (mode === "offline" && !location) {
      return res.status(400).json({ success: false, message: "Location required for offline interview" });
    }

    application.interview = {
      date, time, mode, meetingLink, location, notes, status: "scheduled"
    };
    application.status = "interview_scheduled";

    await application.save();

    res.json({ success: true, message: "Interview scheduled", application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("internship");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role !== "admin" && application.internship.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (!application.interview) {
      return res.status(400).json({ success: false, message: "No interview found" });
    }

    const { date, time, mode, meetingLink, location, notes, status } = req.body;
    
    if (date) application.interview.date = date;
    if (time) application.interview.time = time;
    if (mode) application.interview.mode = mode;
    if (meetingLink) application.interview.meetingLink = meetingLink;
    if (location) application.interview.location = location;
    if (notes) application.interview.notes = notes;
    if (status) application.interview.status = status;

    await application.save();

    res.json({ success: true, message: "Interview updated", application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (application.status === "selected" || application.status === "rejected") {
      return res.status(400).json({ success: false, message: "Cannot withdraw at this stage" });
    }

    application.status = "withdrawn";
    await application.save();

    res.json({ success: true, message: "Application withdrawn", application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
