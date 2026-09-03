import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  createWorkLog,
  getStudentWorkLogs,
  getInternshipWorkLogs,
  getWorkLogById,
  updateWorkLog,
  deleteWorkLog,
  submitWorkLog,
  reviewWorkLog,
  getWorkLogSummary
} from "../controllers/worklog.controller.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), createWorkLog);

router.get("/student/:studentId", protect, authorizeRoles("student", "mentor", "admin"), getStudentWorkLogs);
router.get("/internship/:internshipId", protect, authorizeRoles("mentor", "admin"), getInternshipWorkLogs);
router.get("/summary/:studentId", protect, authorizeRoles("student", "mentor", "admin"), getWorkLogSummary);

router.get("/:id", protect, authorizeRoles("student", "mentor", "admin"), getWorkLogById);
router.put("/:id", protect, authorizeRoles("student", "admin"), updateWorkLog);
router.delete("/:id", protect, authorizeRoles("student", "admin"), deleteWorkLog);

router.post("/:id/submit", protect, authorizeRoles("student"), submitWorkLog);
router.post("/:id/review", protect, authorizeRoles("mentor", "admin"), reviewWorkLog);

export default router;
