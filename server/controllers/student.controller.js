import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id }).populate(
      "user",
      "name email role"
    );

    if (!profile) {
      // Return empty profile layout if not found yet
      return res.status(200).json({
        success: true,
        profile: {
          fullName: req.user.name,
          email: req.user.email,
        },
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      gender,
      location,
      bio,
      college,
      degree,
      branch,
      graduationYear,
      cgpa,
      semester,
      skills,
      preferredDomain,
      preferredRole,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    } = req.body;

    // Validate URLs basic
    const validateUrl = (url) => {
      if (!url) return true;
      try {
        new URL(url);
        return true;
      } catch (err) {
        return false;
      }
    };

    if (!validateUrl(linkedinUrl) || !validateUrl(githubUrl) || !validateUrl(portfolioUrl)) {
      return res.status(400).json({ success: false, message: "Invalid URL provided." });
    }

    if (cgpa && (cgpa < 0 || cgpa > 10)) {
      return res.status(400).json({ success: false, message: "CGPA must be between 0 and 10." });
    }

    const user = await User.findById(req.user.id);

    let profile = await StudentProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    profile.fullName = fullName || profile.fullName || user.name;
    profile.email = user.email; // keep in sync with user
    if (phone !== undefined) profile.phone = phone;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profile.gender = gender;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (college !== undefined) profile.college = college;
    if (degree !== undefined) profile.degree = degree;
    if (branch !== undefined) profile.branch = branch;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (semester !== undefined) profile.semester = semester;
    if (skills !== undefined) profile.skills = skills;
    if (preferredDomain !== undefined) profile.preferredDomain = preferredDomain;
    if (preferredRole !== undefined) profile.preferredRole = preferredRole;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;

    await profile.save();

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded or invalid file format." });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    // If an old resume exists, delete it
    if (profile.resume && profile.resume.fileName) {
      const oldFilePath = path.join(__dirname, "..", "uploads", "resumes", profile.resume.fileName);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error("Failed to delete old resume:", err);
        }
      }
    }

    profile.resume = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: `uploads/resumes/${req.file.filename}`,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile || !profile.resume || !profile.resume.fileName) {
      return res.status(404).json({ success: false, message: "No resume found." });
    }

    const filePath = path.join(__dirname, "..", "uploads", "resumes", profile.resume.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete resume file:", err);
        return res.status(500).json({ success: false, message: "Failed to delete file from server." });
      }
    }

    profile.resume = undefined;
    await profile.save();

    res.status(200).json({ success: true, message: "Resume deleted successfully.", profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile || !profile.resume || !profile.resume.fileName) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    const filePath = path.join(__dirname, "..", "uploads", "resumes", profile.resume.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Resume file not found on server." });
    }

    res.download(filePath, profile.resume.originalName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
