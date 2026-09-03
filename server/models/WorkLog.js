import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternshipTask", // Using InternshipTask as per previous setup
    },
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "draft",
    },
    challenges: {
      type: String,
    },
    learning: {
      type: String,
    },
    githubLink: {
      type: String,
    },
    mentorFeedback: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

workLogSchema.index({ studentId: 1, date: -1 });
workLogSchema.index({ internshipId: 1, date: -1 });
workLogSchema.index({ internshipId: 1, status: 1 });
workLogSchema.index({ taskId: 1 });

export default mongoose.model("WorkLog", workLogSchema);
