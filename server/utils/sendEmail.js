import nodemailer from 'nodemailer';
import dns from 'dns';

// Helper to create a Nodemailer transporter with explicit timeouts and IPv4 resolution
const createTransporter = (port, secure) => {
  const isGmail = (!process.env.EMAIL_HOST || process.env.EMAIL_HOST === 'smtp.gmail.com');
  
  const config = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10s timeout
    greetingTimeout: 10000,
    socketTimeout: 10000,
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  if (isGmail && port === 465) {
    // Gmail service preset for port 465 (most reliable on Render/cloud hosting)
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      ...config
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: secure,
    ...config
  });
};

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS is missing in environment variables!');
    }

    const mailOptions = {
      from: `"InternFlow" <${process.env.EMAIL_USER || 'noreply@internflow.com'}>`,
      to,
      subject,
      text,
      html,
      attachments,
    };

    // Default to Port 465 SSL (which works on Render). If user has EMAIL_PORT in env, try that first.
    const primaryPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;
    const primarySecure = primaryPort === 465;

    try {
      const transporter = createTransporter(primaryPort, primarySecure);
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Email sent successfully to ${to} (Port ${primaryPort}): ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (primaryErr) {
      // If port 587 timed out / failed on Render, automatically retry using Port 465 SSL
      if (primaryPort !== 465) {
        console.warn(`⚠️ Email failed on port ${primaryPort} (${primaryErr.message}). Retrying on Port 465 (SSL)...`);
        const fallbackTransporter = createTransporter(465, true);
        const info = await fallbackTransporter.sendMail(mailOptions);
        console.log(`✉️ Email sent successfully to ${to} via fallback Port 465: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      }
      throw primaryErr;
    }
  } catch (error) {
    console.error(`⚠️ Email sending error: ${error.message}`);
    // Return false without throwing so fallback simulation still functions in dev
    return { success: false, error: error.message };
  }
};

export default sendEmail;
