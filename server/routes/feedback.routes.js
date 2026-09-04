import express from "express";
import { protect, authorizeRoles, authorizeAdmin } from "../middleware/auth.middleware.js";
import {
    createInternshipRating,
    createCompanyRating,
    createMentorOngoingFeedback,
    createMentorMidtermFeedback,
    createMentorFinalFeedback,
    createCompanyFinalFeedback,
    getStudentFeedback,
    getCompanyRatings,
    getInternshipRatings,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    getAdminFeedback
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Student -> Rating
router.post("/internship/:internshipId", protect, authorizeRoles("student"), createInternshipRating);
router.post("/company/:companyId", protect, authorizeRoles("student"), createCompanyRating);

// Mentor -> Feedback
router.post("/mentor/ongoing/:studentId", protect, authorizeRoles("mentor"), createMentorOngoingFeedback);
router.post("/mentor/midterm/:studentId", protect, authorizeRoles("mentor"), createMentorMidtermFeedback);
router.post("/mentor/final/:studentId", protect, authorizeRoles("mentor"), createMentorFinalFeedback);

// Company -> Feedback
router.post("/company/final/:studentId", protect, authorizeRoles("company"), createCompanyFinalFeedback);

// View feedback endpoints
router.get("/student/:studentId", protect, getStudentFeedback);
router.get("/company/:companyId/ratings", getCompanyRatings);
router.get("/internship/:internshipId/ratings", getInternshipRatings);
router.get("/admin", protect, authorizeAdmin, getAdminFeedback);
router.get("/:feedbackId", protect, getFeedbackById);

// Update / Delete
router.put("/:feedbackId", protect, updateFeedback);
router.delete("/:feedbackId", protect, deleteFeedback);

export default router;
