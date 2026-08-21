import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mentor or Company
    type: { type: String, enum: ["Mid-term", "Final", "Task-based"], default: "Final" },
    score: { type: Number, min: 1, max: 10, required: true },
    feedback: { type: String, required: true },
    certificateGenerated: { type: Boolean, default: false },
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Evaluation", evaluationSchema);
