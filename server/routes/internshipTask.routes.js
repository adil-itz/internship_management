import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  createTask,
  getMentorTasks,
  getStudentTasks,
  getTasksByIntern,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskProgress,
  submitTask,
  reviewTask
} from "../controllers/internshipTask.controller.js";

const router = express.Router();

// Specific routes before /:id
router.get("/my", protect, authorizeRoles("student"), getStudentTasks);
router.get("/mentor", protect, authorizeRoles("mentor"), getMentorTasks);
router.get("/intern/:studentId", protect, authorizeRoles("mentor", "admin"), getTasksByIntern);

// General CRUD and specific actions on an ID
router.post("/", protect, authorizeRoles("mentor", "admin"), createTask);
router.get("/:id", protect, getTaskById);
router.patch("/:id", protect, authorizeRoles("mentor", "admin"), updateTask);
router.delete("/:id", protect, authorizeRoles("mentor", "admin"), deleteTask);

router.patch("/:id/progress", protect, authorizeRoles("student"), updateTaskProgress);
router.post("/:id/submit", protect, authorizeRoles("student"), submitTask);
router.patch("/:id/review", protect, authorizeRoles("mentor", "admin"), reviewTask);

export default router;
