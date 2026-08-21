import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server/config/db.js";
import authRoutes from "./server/routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
