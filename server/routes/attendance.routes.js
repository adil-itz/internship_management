import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  createAttendance,
  getStudentAttendance,
  getInternshipAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("mentor", "admin"), createAttendance);

router.get("/student/:studentId", protect, authorizeRoles("student", "mentor", "admin"), getStudentAttendance);
router.get("/internship/:internshipId", protect, authorizeRoles("mentor", "admin"), getInternshipAttendance);
router.get("/summary/:studentId", protect, authorizeRoles("student", "mentor", "admin"), getAttendanceSummary);

router.put("/:id", protect, authorizeRoles("mentor", "admin"), updateAttendance);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAttendance);

export default router;
