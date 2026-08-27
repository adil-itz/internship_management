import express from "express";
import {
  createInternship,
  getInternships,
  getCompanyInternships,
  getAllInternshipsAdmin,
  getInternshipById,
  updateInternship,
  deleteInternship,
} from "../controllers/internship.controller.js";
import { getInternshipApplications } from "../controllers/application.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("company"), createInternship);
router.get("/", protect, getInternships);
router.get("/company/my", protect, authorizeRoles("company"), getCompanyInternships);
router.get("/admin/all", protect, authorizeRoles("admin"), getAllInternshipsAdmin);
router.get("/:id", protect, getInternshipById);
router.put("/:id", protect, authorizeRoles("company", "admin"), updateInternship);
router.delete("/:id", protect, authorizeRoles("company", "admin"), deleteInternship);

// Added application list route
router.get("/:internshipId/applications", protect, authorizeRoles("company", "admin"), getInternshipApplications);

export default router;
