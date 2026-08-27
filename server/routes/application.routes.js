import express from "express";
import {
  createApplication,
  getStudentApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  updateInterview,
  withdrawApplication,
  getAllApplicationsAdmin
} from "../controllers/application.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), createApplication);
router.get("/my", protect, authorizeRoles("student"), getStudentApplications);
router.get("/admin/all", protect, authorizeRoles("admin"), getAllApplicationsAdmin);
router.get("/:id", protect, getApplicationById);
router.patch("/:id/status", protect, authorizeRoles("company", "admin"), updateApplicationStatus);
router.patch("/:id/interview", protect, authorizeRoles("company", "admin"), (req, res, next) => {
  if (req.body.status && req.body.status !== 'scheduled' && !req.body.date && !req.body.time && !req.body.meetingLink) {
    return updateInterview(req, res, next);
  }
  if (!req.body.status) {
    return scheduleInterview(req, res, next);
  }
  return updateInterview(req, res, next);
});
router.patch("/:id/withdraw", protect, authorizeRoles("student"), withdrawApplication);

export default router;
