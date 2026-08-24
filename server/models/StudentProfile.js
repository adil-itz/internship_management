import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    semester: {
      type: Number,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredDomain: {
      type: String,
      trim: true,
    },
    preferredRole: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    resume: {
      originalName: String,
      fileName: String,
      filePath: String,
      fileUrl: String,
      mimeType: String,
      size: Number,
      uploadedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
