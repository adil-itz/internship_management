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
  setup2FA,
  verify2FASetup,
  verify2FALogin,
  verifyBackupCode,
  disable2FA,
  get2FAStatus,
  getAllUsers,
  updateUserRole
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/users", protect, getAllUsers);
router.patch("/users/:id/role", protect, updateUserRole);

router.post("/2fa/setup", protect, setup2FA);
router.post("/2fa/verify-setup", protect, verify2FASetup);
router.post("/2fa/verify-login", verify2FALogin);
router.post("/2fa/verify-backup-code", verifyBackupCode);
router.post("/2fa/disable", protect, disable2FA);
router.get("/2fa/status", protect, get2FAStatus);

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

    passport.authenticate("google", { session: false }, async (err, user, info) => {
      if (err || !user) {
        console.error("Google Auth Failed:", err || info);
        return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(err?.message || "Google authentication failed")}`);
      }

      try {
        if (user.twoFactorEnabled) {
          // Generate OTP
          const { default: generateOtp } = await import('../utils/generateOtp.js');
          const otp = generateOtp();
          user.twoFactorOtp = otp;
          user.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
          await user.save();

          // Send Email
          const { default: sendEmail } = await import('../utils/sendEmail.js');
          await sendEmail({
            to: user.email,
            subject: "InterFlow - 2FA Login OTP",
            text: `Your 2FA login OTP is: ${otp}. It is valid for 5 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">InterFlow 2FA Login</h2>
                <p>Hi ${user.name || 'User'},</p>
                <p>Use the OTP below to complete your login:</p>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e40af; margin: 20px 0;">
                  ${otp}
                </div>
                <p>This OTP will expire in 5 minutes.</p>
              </div>
            `,
          });

          const challengeToken = jwt.sign(
            { id: user._id, role: user.role, is2FAChallenge: true },
            process.env.JWT_SECRET || "12121212",
            { expiresIn: "5m" }
          );
          return res.redirect(`${clientUrl}/login/2fa?challenge=${challengeToken}`);
        }

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