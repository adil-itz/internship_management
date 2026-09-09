import express from "express";
import { askChatbot } from "../controllers/chatbot.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route is unprotected or protected? Let's leave it protected so only logged-in users can use the chatbot.
// But if they want a floating chatbot on the landing page, maybe it shouldn't be protected.
// I will create an unprotected endpoint for the landing page chatbot.
router.post("/ask", askChatbot);

export default router;
