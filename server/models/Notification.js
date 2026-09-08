import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["Application", "Interview", "Task", "Evaluation", "System", "NEW_INTERNSHIP", "MENTOR_ASSIGNED", "INTERVIEW_SCHEDULED", "INTERVIEW_UPDATED", "APPLICATION_STATUS", "INTERNSHIP_ACCEPTED"], 
      default: "System" 
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // Optional link to redirect user when clicked
    
    // Email tracking fields
    emailStatus: { type: String, enum: ["PENDING", "SENT", "FAILED", "N/A"], default: "N/A" },
    sentAt: { type: Date },
    error: { type: String },
    
    // Entity relations for deduplication / tracking
    relatedEntityType: { type: String },
    relatedEntityId: { type: mongoose.Schema.Types.ObjectId }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, type: 1, relatedEntityId: 1 });

export default mongoose.model("Notification", notificationSchema);
