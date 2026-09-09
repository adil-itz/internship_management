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
import attendanceRoutes from "./server/routes/attendance.routes.js";
import worklogRoutes from "./server/routes/worklog.routes.js";
import feedbackRoutes from "./server/routes/feedback.routes.js";
import certificateRoutes from "./server/routes/certificate.routes.js";
import reportRoutes from "./server/routes/report.routes.js";
import notificationRoutes from "./server/routes/notification.routes.js";
import chatbotRoutes from "./server/routes/chatbot.routes.js";

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
app.use("/api/attendance", attendanceRoutes);
app.use("/api/worklogs", worklogRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chatbot", chatbotRoutes);

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

const startServer = (port) => {
  server.listen(port)
    .on('listening', () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} is busy, retrying in 1 second...`);
        setTimeout(() => {
          server.close();
          server.listen(port);
        }, 1000);
      } else {
        console.error('Server error:', err);
      }
    });
};

startServer(PORT);

const handleShutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
