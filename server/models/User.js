import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "company", "mentor", "admin"],
      default: "student",
    },

    googleId: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,

    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);