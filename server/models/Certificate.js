import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    // Snapshots
    studentName: { type: String, required: true },
    internshipTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    mentorName: { type: String },

    startDate: { type: Date },
    endDate: { type: Date },
    issueDate: {
      type: Date,
      default: Date.now
    },

    verificationToken: {
      type: String,
      required: true
    },

    templateVersion: {
      type: String,
      default: "1.0"
    },

    pdfPath: {
      type: String
    },

    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: {
      type: Date
    },

    status: {
      type: String,
      enum: ["generated", "emailed", "revoked"],
      default: "generated"
    }
  },
  { timestamps: true }
);

// One certificate per student per internship
certificateSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

export default mongoose.model("Certificate", certificateSchema);
