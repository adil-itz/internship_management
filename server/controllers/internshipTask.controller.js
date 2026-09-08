import InternshipTask from "../models/InternshipTask.js";
import MentorAssignment from "../models/MentorAssignment.js";
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";
import { notifyNewTask, notifyTaskEvaluation } from "../services/notification.service.js";

const updateOverdueStatus = async (tasks) => {
  const currentDate = new Date();
  const updates = [];
  
  for (let task of tasks) {
    if (
      task.dueDate < currentDate && 
      !["completed", "cancelled", "submitted"].includes(task.status)
    ) {
      if (task.status !== "overdue") {
        task.status = "overdue";
        updates.push(task.save());
      }
    }
  }
  
  if (updates.length > 0) {
    await Promise.all(updates);
  }
};

export const createTask = async (req, res) => {
  try {
    const { internshipId, studentId, title, description, priority, dueDate } = req.body;
    let mentorId = req.body.mentorId || req.user.id;

    if (!internshipId || !studentId || !title || !description || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const application = await Application.findOne({ internship: internshipId, candidate: studentId });
    if (!application || application.status !== "selected") {
      return res.status(403).json({ success: false, message: "Student is not selected for this internship" });
    }

    if (req.user.role !== "admin") {
      const assignment = await MentorAssignment.findOne({
        internship: internshipId,
        student: studentId,
        mentor: mentorId,
        status: "active"
      });

      if (!assignment) {
        return res.status(403).json({ success: false, message: "You are not assigned as mentor for this intern" });
      }
    } else if (!req.body.mentorId) {
      const activeAssignment = await MentorAssignment.findOne({
        internship: internshipId,
        student: studentId,
        status: "active"
      });
      if (activeAssignment) {
        mentorId = activeAssignment.mentor;
      }
    }
    
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return res.status(400).json({ success: false, message: "Invalid due date" });
    }

    const task = new InternshipTask({
      internship: internshipId,
      student: studentId,
      mentor: mentorId,
      title,
      description,
      priority: priority || "medium",
      dueDate: parsedDueDate
    });

    const creatorUser = await User.findById(req.user.id || req.user._id);
    notifyNewTask(task, internship, student, creatorUser || req.user).catch(console.error);

    res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentTasks = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const { status, internshipId } = req.query;

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const query = { student: studentId };
    if (status) query.status = status;
    if (internshipId) query.internship = internshipId;

    let tasks = await InternshipTask.find(query)
      .populate("internship", "title company")
      .populate("mentor", "name email")
      .sort({ dueDate: 1 });

    await updateOverdueStatus(tasks);

    tasks = await InternshipTask.find(query)
      .populate("internship", "title company")
      .populate("mentor", "name email")
      .sort({ dueDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTasksByIntern = getStudentTasks;

export const getMentorTasks = async (req, res) => {
  try {
    const { status, internshipId, studentId } = req.query;
    
    const query = {};
    if (req.user.role === "mentor") {
      query.mentor = req.user.id;
    }
    
    if (status) query.status = status;
    if (internshipId) query.internship = internshipId;
    if (studentId) query.student = studentId;

    let tasks = await InternshipTask.find(query)
      .populate("student", "name email")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    await updateOverdueStatus(tasks);

    tasks = await InternshipTask.find(query)
      .populate("student", "name email")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInternshipTasks = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { status, studentId } = req.query;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    if (req.user.role === "mentor") {
      const assignment = await MentorAssignment.findOne({
        internship: internshipId,
        mentor: req.user.id,
        status: "active"
      });
      if (!assignment) {
        return res.status(403).json({ success: false, message: "Not authorized to view tasks for this internship" });
      }
    } else if (req.user.role === "student") {
      if (req.user.id !== studentId) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const query = { internship: internshipId };
    if (status) query.status = status;
    if (studentId) query.student = studentId;

    let tasks = await InternshipTask.find(query)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .sort({ dueDate: 1 });

    await updateOverdueStatus(tasks);

    tasks = await InternshipTask.find(query)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .sort({ dueDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await InternshipTask.findById(req.params.id)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("internship", "title company");

    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (req.user.role === "student" && task.student._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "You are not authorized to view this task." });
    }

    if (req.user.role === "mentor" && task.mentor._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "You are not authorized to view this task." });
    }
    
    if (!["student", "mentor", "admin"].includes(req.user.role)) {
       return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const task = await InternshipTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (req.user.role === "mentor" && task.mentor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to modify this task." });
    }
    
    if (req.user.role !== "admin" && req.user.role !== "mentor") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) {
      const parsed = new Date(dueDate);
      if (!isNaN(parsed)) task.dueDate = parsed;
    }

    await task.save();
    res.json({ success: true, message: "Task updated successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await InternshipTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (req.user.role === "mentor" && task.mentor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this task." });
    }
    
    if (req.user.role !== "admin" && req.user.role !== "mentor") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await InternshipTask.deleteOne({ _id: task._id });
    res.json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await InternshipTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (task.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to modify this task." });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ success: false, message: "Invalid progress value." });
    }
    
    if (task.status === "completed" || task.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cannot update progress for completed or cancelled tasks." });
    }

    task.progress = progress;
    
    if (progress > 0 && progress <= 100 && task.status === "assigned") {
      task.status = "in_progress";
    }

    await task.save();
    res.json({ success: true, message: "Progress updated successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const submitTask = async (req, res) => {
  try {
    const { submissionUrl, submissionNote } = req.body;
    const task = await InternshipTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (task.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to submit this task." });
    }

    if (task.status === "completed" || task.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Task cannot be submitted." });
    }
    
    if (!submissionUrl) {
      return res.status(400).json({ success: false, message: "submissionUrl is required." });
    }

    task.submissionUrl = submissionUrl;
    if (submissionNote !== undefined) task.submissionNote = submissionNote;
    task.status = "submitted";
    task.submittedAt = new Date();

    await task.save();
    res.json({ success: true, message: "Task submitted successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const reviewTask = async (req, res) => {
  try {
    const { status, mentorFeedback } = req.body;
    const task = await InternshipTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    if (req.user.role === "mentor" && task.mentor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to review this task." });
    }
    
    if (req.user.role !== "admin" && req.user.role !== "mentor") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (task.status !== "submitted" && task.status !== "completed") {
      return res.status(400).json({ success: false, message: "Only submitted tasks can be reviewed." });
    }

    if (!["completed", "in_progress"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid review status." });
    }

    if (mentorFeedback !== undefined) {
      task.mentorFeedback = mentorFeedback;
    }

    task.status = status;
    task.reviewedAt = new Date();

    if (status === "completed") {
      task.progress = 100;
    }

    await task.save();

    const fullTask = await InternshipTask.findById(task._id).populate('internship student');
    if (fullTask && fullTask.student) {
      const reviewerUser = await User.findById(req.user.id || req.user._id);
      notifyTaskEvaluation(fullTask, fullTask.internship, fullTask.student, reviewerUser || req.user).catch(console.error);
    }

    res.json({ success: true, message: "Task reviewed successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
