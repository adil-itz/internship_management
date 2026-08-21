import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mentor or Company
    dueDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Submitted", "Completed", "Overdue"], 
      default: "Pending" 
    },
    submissionUrl: { type: String }, // Link to work done (e.g. GitHub repo, Document)
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
