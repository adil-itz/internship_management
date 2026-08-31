import mongoose from "mongoose";

const internshipTaskSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: [
        "assigned",
        "in_progress",
        "submitted",
        "completed",
        "overdue",
        "cancelled",
      ],
      default: "assigned",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    submissionUrl: {
      type: String,
      trim: true,
    },
    submissionNote: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
    },
    mentorFeedback: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

internshipTaskSchema.index({ student: 1, internship: 1 });
internshipTaskSchema.index({ mentor: 1, internship: 1 });
internshipTaskSchema.index({ status: 1 });
internshipTaskSchema.index({ dueDate: 1 });

export default mongoose.model("InternshipTask", internshipTaskSchema);
