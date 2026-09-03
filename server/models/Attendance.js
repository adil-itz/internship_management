import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "leave"],
      required: true,
    },
    checkIn: {
      type: String,
    },
    checkOut: {
      type: String,
    },
    remarks: {
      type: String,
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, internshipId: 1, date: 1 }, { unique: true });

// Useful indexes for querying
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ internshipId: 1 });
attendanceSchema.index({ mentorId: 1 });
attendanceSchema.index({ date: -1 });

export default mongoose.model("Attendance", attendanceSchema);
