import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import MentorAssignment from "../models/MentorAssignment.js";

let io;
const userSocketMap = new Map(); // userId -> Set of socketIds

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust according to environment
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware for Socket
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach user info
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id.toString();
    
    // Add user to online map
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
    
    socket.emit("onlineUsersList", { userIds: Array.from(userSocketMap.keys()) });
    io.emit("userOnline", { userId });

    socket.on("joinConversation", async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        
        // Verify user belongs to conversation
        if (conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
          return;
        }
        
        socket.join(`conversation:${conversationId}`);
      } catch (error) {
        console.error("joinConversation error", error);
      }
    });

    socket.on("leaveConversation", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { conversationId, message } = data;
        if (!message || message.trim() === "") return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        if (conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
          return;
        }

        const isAssigned = await MentorAssignment.findOne({
          mentor: conversation.mentorId,
          student: conversation.studentId,
          status: "active"
        });
        if (!isAssigned) return;

        const receiverId = conversation.mentorId.toString() === userId ? conversation.studentId : conversation.mentorId;
        const trimmedMessage = message.trim().substring(0, 2000);

        const newMessage = new Message({
          conversationId,
          senderId: userId,
          receiverId,
          message: trimmedMessage
        });

        await newMessage.save();

        conversation.lastMessage = trimmedMessage;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        io.to(`conversation:${conversationId}`).emit("newMessage", newMessage);
      } catch (error) {
        console.error("sendMessage error", error);
      }
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("userTyping", { userId, conversationId });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("userStoppedTyping", { userId, conversationId });
    });

    socket.on("markMessagesAsRead", async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        if (conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
          return;
        }

        await Message.updateMany(
          { conversationId, receiverId: userId, read: false },
          { $set: { read: true, readAt: new Date() } }
        );

        io.to(`conversation:${conversationId}`).emit("messagesRead", {
          conversationId,
          readBy: userId,
          readAt: new Date()
        });
      } catch (error) {
        console.error("markMessagesAsRead error", error);
      }
    });

    socket.on("disconnect", () => {
      const userSockets = userSocketMap.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
          io.emit("userOffline", { userId });
        }
      }
    });
  });
};

export const getIo = () => io;
export const getReceiverSocketId = (receiverId) => {
  const userSockets = userSocketMap.get(receiverId);
  return userSockets && userSockets.size > 0 ? Array.from(userSockets)[0] : null;
};
