import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid YouTube URL!`,
      },
    },
    thumbnailUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?\:\/\/).+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      }
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Backend Development",
        "Frontend Development",
        "AI / Machine Learning",
        "Data Science",
        "Data Analytics",
        "Cyber Security",
        "Cloud Computing",
        "DevOps",
        "Mobile Development",
        "Database",
        "Programming",
        "DSA",
        "Interview Preparation",
        "Resume & Career",
        "Git & GitHub",
        "Other",
      ],
    },
    skills: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ category: 1 });
resourceSchema.index({ level: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ createdBy: 1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  skills: "text",
});

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
