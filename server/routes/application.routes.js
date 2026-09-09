import express from "express";
import {
  createApplication,
  getStudentApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  updateInterview,
  withdrawApplication,
  getAllApplicationsAdmin,
  getCompanyApplications
} from "../controllers/application.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), createApplication);
router.get("/my", protect, authorizeRoles("student"), getStudentApplications);
router.get("/company/all", protect, authorizeRoles("company", "admin"), getCompanyApplications);
router.get("/admin/all", protect, authorizeRoles("admin"), getAllApplicationsAdmin);
router.get("/:id", protect, getApplicationById);
router.patch("/:id/status", protect, authorizeRoles("company", "admin"), updateApplicationStatus);
router.patch("/:id/interview", protect, authorizeRoles("company", "admin"), scheduleInterview);
router.patch("/:id/withdraw", protect, authorizeRoles("student"), withdrawApplication);

export default router;
