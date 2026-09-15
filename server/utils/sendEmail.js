import nodemailer from 'nodemailer';
import dns from 'dns';

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS is missing in environment variables!');
    }

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;
    const isSecure = port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Custom DNS lookup to strictly enforce IPv4 resolution and prevent ENETUNREACH IPv6 errors on Render
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"InternFlow" <${process.env.EMAIL_USER || 'noreply@internflow.com'}>`,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Email sending error: ${error.message}`);
    // Return false without throwing so fallback simulation still functions in dev
    return { success: false, error: error.message };
  }
};

export default sendEmail;
