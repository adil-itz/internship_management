import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server/config/db.js";
import authRoutes from "./server/routes/auth.routes.js";
import studentRoutes from "./server/routes/student.routes.js";
import internshipRoutes from "./server/routes/internship.routes.js";
import resourceRoutes from "./server/routes/resource.routes.js";
import courseRoutes from "./server/routes/course.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "server", ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure Session
import session from "express-session";
import passport from "./server/config/passport.js";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to Database
connectDB();

import applicationRoutes from "./server/routes/application.routes.js";
import mentorAssignmentRoutes from "./server/routes/mentorAssignment.routes.js";
import internshipTaskRoutes from "./server/routes/internshipTask.routes.js";
import chatRoutes from "./server/routes/chat.routes.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/mentor-assignments", mentorAssignmentRoutes);
app.use("/api/internship-tasks", internshipTaskRoutes);
app.use("/api/chat", chatRoutes);

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "server", "uploads")));

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (if created later)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

import http from "http";
import { initSocket } from "./server/socket/chat.socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
