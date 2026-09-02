import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import MentorAssignment from "../models/MentorAssignment.js";
import User from "../models/User.js";
import { getIo, getReceiverSocketId } from "../socket/chat.socket.js";

// Helper to validate assignment
const validateAssignment = async (mentorId, studentId) => {
  const assignment = await MentorAssignment.findOne({
    mentor: mentorId,
    student: studentId,
    status: "active"
  });
  return !!assignment;
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query = {};
    if (role === "mentor") {
      query.mentorId = userId;
    } else if (role === "student") {
      query.studentId = userId;
    } else if (role === "admin") {
      query = {};
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const conversations = await Conversation.find(query).sort({ lastMessageAt: -1 })
      .populate("mentorId", "name email avatar role")
      .populate("studentId", "name email avatar role");
    
    // Format the response and add unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        let otherUser;
        if (role === "mentor") {
          otherUser = conv.studentId;
        } else if (role === "student") {
          otherUser = conv.mentorId;
        } else {
          const mentorName = conv.mentorId?.name || "Mentor";
          const studentName = conv.studentId?.name || "Student";
          otherUser = {
            _id: conv.studentId?._id || conv._id,
            id: conv.studentId?._id || conv._id,
            name: `${mentorName} & ${studentName}`,
            email: `Mentor: ${conv.mentorId?.email || 'N/A'} | Student: ${conv.studentId?.email || 'N/A'}`,
            avatar: conv.studentId?.avatar || conv.mentorId?.avatar,
            role: "chat",
            mentor: conv.mentorId,
            student: conv.studentId
          };
        }
        
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: userId,
          read: false
        });

        return {
          conversationId: conv._id,
          otherUser: otherUser ? {
            id: otherUser._id || otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            avatar: otherUser.avatar,
            role: otherUser.role,
            mentor: conv.mentorId,
            student: conv.studentId
          } : { name: "Conversation", id: conv._id },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount
        };
      })
    );

    res.json({ success: true, conversations: formattedConversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (req.user.role !== "admin" && conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to view these messages" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ conversationId });

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order for frontend display
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const userId = req.user.id;

    if (!studentId || !mentorId) {
      return res.status(400).json({ success: false, message: "studentId and mentorId are required" });
    }

    if (req.user.role !== "admin" && userId !== studentId && userId !== mentorId) {
      return res.status(403).json({ success: false, message: "Not authorized to create this conversation" });
    }

    if (req.user.role !== "admin") {
      const isAssigned = await validateAssignment(mentorId, studentId);
      if (!isAssigned) {
        return res.status(403).json({ success: false, message: "Mentor is not assigned to this student" });
      }
    }

    let conversation = await Conversation.findOne({ mentorId, studentId });
    if (!conversation) {
      conversation = new Conversation({ mentorId, studentId });
      await conversation.save();
    }

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    let { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }
    message = message.trim();
    if (message.length > 2000) {
      return res.status(400).json({ success: false, message: "Message too long" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (req.user.role !== "admin" && conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      const isAssigned = await validateAssignment(conversation.mentorId, conversation.studentId);
      if (!isAssigned) {
        return res.status(403).json({ success: false, message: "Mentor assignment is no longer active" });
      }
    }

    const receiverId = req.user.role === "admin"
      ? conversation.studentId
      : (conversation.mentorId.toString() === userId ? conversation.studentId : conversation.mentorId);

    const newMessage = new Message({
      conversationId,
      senderId: userId,
      receiverId,
      message
    });

    await newMessage.save();

    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const io = getIo();
    if (io) {
      // Emit to conversation room for users already in it
      io.to(`conversation:${conversationId}`).emit("newMessage", newMessage);
      
      // Also potentially emit directly to the receiver's personal room if they aren't in the conversation room
      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessageNotification", newMessage);
      }
    }

    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (req.user.role !== "admin" && conversation.mentorId.toString() !== userId && conversation.studentId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Message.updateMany(
      { conversationId, receiverId: userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    const io = getIo();
    if (io) {
      io.to(`conversation:${conversationId}`).emit("messagesRead", {
        conversationId,
        readBy: userId,
        readAt: new Date()
      });
    }

    res.json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
