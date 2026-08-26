import express from "express";
import {
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("mentor", "admin"), createCourse);
router.get("/", protect, getCourses);
router.get("/my", protect, authorizeRoles("mentor", "admin"), getMyCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, authorizeRoles("mentor", "admin"), updateCourse);
router.delete("/:id", protect, authorizeRoles("mentor", "admin"), deleteCourse);

export default router;
