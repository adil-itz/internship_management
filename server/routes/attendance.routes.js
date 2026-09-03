import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  createAttendance,
  getStudentAttendance,
  getInternshipAttendance,
  getCompanyAllAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student", "mentor", "admin"), createAttendance);

router.get("/company/all", protect, authorizeRoles("company"), getCompanyAllAttendance);
router.get("/student/:studentId", protect, authorizeRoles("student", "mentor", "admin"), getStudentAttendance);
router.get("/internship/:internshipId", protect, authorizeRoles("company", "mentor", "admin"), getInternshipAttendance);
router.get("/summary/:studentId", protect, authorizeRoles("student", "company", "mentor", "admin"), getAttendanceSummary);

router.put("/:id", protect, authorizeRoles("student", "mentor", "admin"), updateAttendance);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAttendance);

export default router;
