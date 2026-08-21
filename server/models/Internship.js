import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencing company User
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skillsRequired: [{ type: String }],
    location: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., '3 months', '6 months'
    stipend: { type: String }, 
    type: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "On-site" },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    applicantsCount: { type: Number, default: 0 },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
