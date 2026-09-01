import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  getConversations,
  getMessages,
  createConversation,
  sendMessage,
  markMessagesAsRead
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/conversations", protect, authorizeRoles("student", "mentor"), getConversations);
router.post("/conversations", protect, authorizeRoles("student", "mentor"), createConversation);

router.get("/conversations/:conversationId/messages", protect, authorizeRoles("student", "mentor"), getMessages);
router.post("/conversations/:conversationId/messages", protect, authorizeRoles("student", "mentor"), sendMessage);
router.patch("/conversations/:conversationId/read", protect, authorizeRoles("student", "mentor"), markMessagesAsRead);

export default router;
