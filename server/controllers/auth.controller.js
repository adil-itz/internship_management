import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot be created through signup",
      });
    }

    let user = await User.findOne({
      email: email?.toLowerCase(),
    });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email: email?.toLowerCase(),
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User created successfully. Please login.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.twoFactorEnabled) {
      const otp = generateOtp();
      user.twoFactorOtp = otp;
      user.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();
      console.log(`🔑 2FA Login OTP for ${user.email}: ${otp}`);

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
      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        challengeToken,
        message: "OTP sent to your registered email"
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "12121212", { expiresIn: "1d" });

    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "InternFlow - Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It is valid for 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">InternFlow Password Reset</h2>
          <p>Hi ${user.name || 'User'},</p>
          <p>You requested to reset your password. Use the OTP below to complete the reset process:</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e40af; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address. Please check your inbox.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > new Date(user.resetOtpExpires)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, password } = req.body;
    const finalPassword = newPassword || password;
    const finalOtp = otp || req.params.token;

    if (!email || !finalOtp || !finalPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== finalOtp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > new Date(user.resetOtpExpires)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully. Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.twoFactorEnabled) return res.status(400).json({ message: '2FA is already enabled' });

    const otp = generateOtp();
    user.twoFactorOtp = otp;
    user.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log(`🔑 2FA Setup OTP for ${user.email}: ${otp}`);

    await sendEmail({
      to: user.email,
      subject: "InterFlow - 2FA Setup OTP",
      text: `Your 2FA setup OTP is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">InterFlow 2FA Setup</h2>
          <p>Hi ${user.name || 'User'},</p>
          <p>Use the OTP below to verify and enable 2FA on your account:</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e40af; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: '2FA setup initiated. OTP sent to your email.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify2FASetup = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).select('+twoFactorOtp +twoFactorOtpExpires');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.twoFactorEnabled) return res.status(400).json({ message: '2FA already enabled' });
    if (!user.twoFactorOtp) return res.status(400).json({ message: '2FA setup not initiated' });

    if (user.twoFactorOtp !== token.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(user.twoFactorOtpExpires)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    
    user.twoFactorEnabled = true;
    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA successfully enabled via Email OTP'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify2FALogin = async (req, res) => {
  try {
    const { challengeToken, token } = req.body;
    
    const decoded = jwt.verify(challengeToken, process.env.JWT_SECRET || "12121212");
    if (!decoded.is2FAChallenge) return res.status(400).json({ message: 'Invalid challenge token' });

    const user = await User.findById(decoded.id).select('+twoFactorOtp +twoFactorOtpExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.twoFactorOtp) return res.status(400).json({ message: 'No OTP generated' });

    if (user.twoFactorOtp !== token.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(user.twoFactorOtpExpires)) {
      return res.status(400).json({ message: 'OTP has expired. Please log in again.' });
    }

    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpires = undefined;
    await user.save();

    const finalToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "12121212", { expiresIn: '1d' });
    
    res.status(200).json({
      success: true,
      token: finalToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired challenge token' });
  }
};

export const verifyBackupCode = async (req, res) => {
  res.status(400).json({ message: 'Backup codes are not supported in Email OTP 2FA mode' });
};

export const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    user.twoFactorEnabled = false;
    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ success: true, enabled: user.twoFactorEnabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
