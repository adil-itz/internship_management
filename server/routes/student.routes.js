import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import {
  getProfile,
  updateProfile,
  uploadResume as uploadResumeController,
  deleteResume,
  getResume,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.post(
  "/profile/resume",
  protect,
  uploadResume.single("resume"),
  uploadResumeController
);

router.delete("/profile/resume", protect, deleteResume);
router.get("/profile/resume", protect, getResume);

export default router;
