import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeUrl: String,
    coverLetter: String,
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected",
        "withdrawn"
      ],
      default: "applied"
    },
    interview: {
      date: Date,
      time: String,
      mode: {
        type: String,
        enum: ["online", "offline"]
      },
      meetingLink: String,
      location: String,
      notes: String,
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled", "rescheduled"]
      }
    },
    rejectionReason: String,
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

applicationSchema.index({ internship: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
