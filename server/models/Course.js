import mongoose from "mongoose";

const courseResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["youtube", "ebook", "article", "documentation"],
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        if (this.type === "youtube") {
          return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(v);
        }
        return /^(https?\:\/\/).+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL for the specified resource type!`,
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
});

const courseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  resources: {
    type: [courseResourceSchema],
    default: [],
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    domain: {
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
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    duration: {
      type: String,
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
    skills: {
      type: [String],
      default: [],
    },
    modules: {
      type: [courseModuleSchema],
      default: [],
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

courseSchema.index({ domain: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ createdBy: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({
  title: "text",
  description: "text",
  domain: "text",
  skills: "text",
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
