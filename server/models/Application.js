import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    resumeUrl: { type: String }, 
    coverLetter: { type: String },
    status: { 
      type: String, 
      enum: ["Applied", "Shortlisted", "Interviewing", "Accepted", "Rejected"], 
      default: "Applied" 
    },
    interviewDate: { type: Date },
    mentorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mentor assigned when accepted
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
