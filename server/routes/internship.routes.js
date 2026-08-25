import express from "express";
import {
  createInternship,
  getInternships,
  getCompanyInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} from "../controllers/internship.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("company"), createInternship);
router.get("/", protect, getInternships);
router.get("/company/my", protect, authorizeRoles("company"), getCompanyInternships);
router.get("/:id", protect, getInternshipById);
router.put("/:id", protect, authorizeRoles("company"), updateInternship);
router.delete("/:id", protect, authorizeRoles("company"), deleteInternship);

export default router;
