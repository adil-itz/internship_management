import express from "express";
import {
  createResource,
  getResources,
  getMyResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("mentor", "admin"), createResource);
router.get("/", protect, getResources);
router.get("/my", protect, authorizeRoles("mentor", "admin"), getMyResources);
router.get("/:id", protect, getResourceById);
router.put("/:id", protect, authorizeRoles("mentor", "admin"), updateResource);
router.delete("/:id", protect, authorizeRoles("mentor", "admin"), deleteResource);

export default router;
