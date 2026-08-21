import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);

// Real Google OAuth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Real Google OAuth Callback Route
router.get(
  "/google/callback",
  (req, res, next) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err || !user) {
        console.error("Google Auth Failed:", err || info);
        return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(err?.message || "Google authentication failed")}`);
      }

      try {
        // Sign real JWT token for authenticated Google User
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET || "12121212",
          { expiresIn: "7d" }
        );

        const userData = encodeURIComponent(
          JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || "student",
            avatar: user.avatar || "",
          })
        );

        return res.redirect(`${clientUrl}/dashboard?token=${token}&user=${userData}`);
      } catch (tokenErr) {
        console.error("Token Generation Error:", tokenErr);
        return res.redirect(`${clientUrl}/login?error=token_error`);
      }
    })(req, res, next);
  }
);

export default router;