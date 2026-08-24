import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import User from "../models/User.js";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env
dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const adminEmail = "admin@internflow.com";
    const adminPassword = "Admin@12345";

    // Check if an admin already exists
    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("❌ Admin already exists.");
      console.log(`Admin email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Check if email already belongs to another user
    const existingUser = await User.findOne({
      email: adminEmail,
    });

    if (existingUser) {
      console.log("❌ This email is already registered.");
      console.log(`Email: ${adminEmail}`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin
    const admin = await User.create({
      name: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("=================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin");
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();