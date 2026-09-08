import sendEmail from "../utils/sendEmail.js";

export const testEmailConfig = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const result = await sendEmail({
      to: email,
      subject: "InterFlow SMTP Configuration Test",
      text: "If you are reading this, the email configuration for InterFlow is working correctly.",
      html: "<p>If you are reading this, the email configuration for InterFlow is <strong>working correctly</strong>.</p>"
    });

    if (result.success) {
      res.json({ success: true, message: "Test email sent successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send test email", error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
