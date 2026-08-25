import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    skills: [{ type: String, required: true }],
    internshipType: { type: String, required: true },
    location: { type: String, required: true },
    workMode: { type: String, required: true },
    duration: { type: String, required: true },
    stipend: { type: Number, default: 0 },
    stipendType: { type: String },
    openings: { type: Number, required: true },
    startDate: { type: Date },
    applicationDeadline: { type: Date, required: true },
    eligibility: {
      degree: [{ type: String }],
      branches: [{ type: String }],
      graduationYears: [{ type: Number }],
      minimumCGPA: { type: Number, min: 0, max: 10 },
    },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "published",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
