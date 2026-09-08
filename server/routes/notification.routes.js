import express from "express";
import { testEmailConfig } from "../controllers/notification.controller.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/test-email", protect, authorizeAdmin, testEmailConfig);

export default router;
