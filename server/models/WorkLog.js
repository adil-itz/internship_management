import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    date: { type: Date, required: true, default: Date.now },
    hoursWorked: { type: Number, required: true },
    activities: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mentor who approves
  },
  { timestamps: true }
);

export default mongoose.model("WorkLog", workLogSchema);
