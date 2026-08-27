import express from "express";
import {
  assignMentor,
  getAssignments,
  getMyAssignments,
  getStudentAssignments,
  getInternshipAssignments,
  getAssignmentById,
  updateAssignmentStatus,
  getMentors
} from "../controllers/mentorAssignment.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("company", "admin"), assignMentor);
router.get("/mentors", protect, authorizeRoles("company", "admin"), getMentors);
router.get("/admin/all", protect, authorizeRoles("admin"), getAssignments);
router.get("/my", protect, authorizeRoles("mentor", "student"), (req, res, next) => {
  if (req.user.role === "student") {
    return getStudentAssignments(req, res, next);
  }
  return getMyAssignments(req, res, next);
});
router.get("/student", protect, authorizeRoles("student"), getStudentAssignments);
router.get("/internship/:internshipId", protect, authorizeRoles("company", "admin"), getInternshipAssignments);
router.get("/:id", protect, getAssignmentById);
router.patch("/:id/status", protect, authorizeRoles("company", "admin", "mentor"), updateAssignmentStatus);

export default router;
