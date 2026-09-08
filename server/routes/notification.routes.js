import express from "express";
import { 
  testEmailConfig, 
  getUserNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from "../controllers/notification.controller.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.post("/test-email", protect, authorizeAdmin, testEmailConfig);

export default router;
