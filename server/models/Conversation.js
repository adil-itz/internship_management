import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ mentorId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
