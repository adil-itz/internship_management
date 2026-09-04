import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ["student", "company", "mentor", "admin"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "internship_rating",
        "company_rating",
        "mentor_ongoing",
        "mentor_midterm",
        "mentor_final",
        "company_final",
      ],
      required: true,
    },
    ratings: {
      overall: { type: Number, min: 1, max: 5 },
      learning: { type: Number, min: 1, max: 5 },
      taskQuality: { type: Number, min: 1, max: 5 },
      mentorSupport: { type: Number, min: 1, max: 5 },
      workEnvironment: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      workLifeBalance: { type: Number, min: 1, max: 5 },
      companyCulture: { type: Number, min: 1, max: 5 },
      professionalGrowth: { type: Number, min: 1, max: 5 },
      internshipManagement: { type: Number, min: 1, max: 5 },
      technicalSkills: { type: Number, min: 1, max: 5 },
      problemSolving: { type: Number, min: 1, max: 5 },
      teamwork: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      taskCompletion: { type: Number, min: 1, max: 5 },
      learningAbility: { type: Number, min: 1, max: 5 },
    },
    comments: {
      type: String,
    },
    recommendation: {
      type: Boolean,
    },
    ppoEligible: {
      type: Boolean,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    workLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkLog",
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ studentId: 1 });
feedbackSchema.index({ internshipId: 1 });
feedbackSchema.index({ companyId: 1 });
feedbackSchema.index({ reviewerId: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);
