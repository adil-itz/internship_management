import InternshipTask from "../models/InternshipTask.js";
import MentorAssignment from "../models/MentorAssignment.js";
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

// Helper to check overdue status dynamically
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
    const mentorId = req.user.id;

    // Validate required fields
    if (!internshipId || !studentId || !title || !description || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    // Ensure student is selected for this internship
    const application = await Application.findOne({ internship: internshipId, candidate: studentId });
    if (!application || application.status !== "selected") {
      return res.status(403).json({ success: false, message: "Student is not selected for this internship" });
    }

    // Ensure this mentor is assigned to this student for this internship
    const assignment = await MentorAssignment.findOne({
      internship: internshipId,
      student: studentId,
      mentor: mentorId,
      status: "active"
    });

    if (!assignment) {
      return res.status(403).json({ success: false, message: "You are not assigned as mentor for this intern" });
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

    await task.save();
    res.status(201).json({ success: true, message: "Task created successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMentorTasks = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { status, priority, internshipId, studentId, search, page = 1, limit = 10 } = req.query;

    const query = { mentor: mentorId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (internshipId) query.internship = internshipId;
    if (studentId) query.student = studentId;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let tasks = await InternshipTask.find(query)
      .populate("student", "name email avatar")
      .populate("internship", "title company")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    await updateOverdueStatus(tasks);

    const total = await InternshipTask.countDocuments(query);

    res.json({
      success: true,
      tasks,
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

export const getStudentTasks = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status, priority, internshipId, page = 1, limit = 10 } = req.query;

    const query = { student: studentId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (internshipId) query.internship = internshipId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let tasks = await InternshipTask.find(query)
      .populate("mentor", "name email avatar")
      .populate("internship", "title company")
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    await updateOverdueStatus(tasks);

    const total = await InternshipTask.countDocuments(query);
    
    // Overall progress calc
    const allTasks = await InternshipTask.find({ student: studentId, internship: internshipId || { $exists: true } });
    let overallProgress = 0;
    if (allTasks.length > 0) {
      const sum = allTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
      overallProgress = Math.round(sum / allTasks.length);
    }

    res.json({
      success: true,
      tasks,
      overallProgress,
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === "completed").length,
      inProgressTasks: allTasks.filter(t => t.status === "in_progress").length,
      submittedTasks: allTasks.filter(t => t.status === "submitted").length,
      overdueTasks: allTasks.filter(t => t.status === "overdue").length,
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

export const getTasksByIntern = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check authorization
    if (req.user.role === "mentor") {
      const assignment = await MentorAssignment.findOne({ mentor: req.user.id, student: studentId, status: "active" });
      if (!assignment) {
        return res.status(403).json({ success: false, message: "You are not assigned as mentor for this intern" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const student = await User.findById(studentId).select("name email avatar");
    
    let tasks = await InternshipTask.find({ student: studentId })
      .populate("mentor", "name email")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });
      
    await updateOverdueStatus(tasks);
    
    let overallProgress = 0;
    if (tasks.length > 0) {
      const sum = tasks.reduce((acc, t) => acc + (t.progress || 0), 0);
      overallProgress = Math.round(sum / tasks.length);
    }

    res.json({
      success: true,
      student,
      tasks,
      statistics: {
        overallProgress,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === "completed").length,
        inProgressTasks: tasks.filter(t => t.status === "in_progress").length,
        submittedTasks: tasks.filter(t => t.status === "submitted").length,
        overdueTasks: tasks.filter(t => t.status === "overdue").length,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    let task = await InternshipTask.findById(req.params.id)
      .populate("student", "name email avatar")
      .populate("mentor", "name email avatar")
      .populate("internship", "title company startDate endDate");

    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    await updateOverdueStatus([task]);

    // Check authorization
    if (req.user.role === "student" && task.student._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to access this task." });
    }
    
    if (req.user.role === "mentor" && task.mentor._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to access this task." });
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
    
    // progress can optionally be updated here, we keep it as is, or mentor can review
    
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
    res.json({ success: true, message: "Task reviewed successfully.", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
