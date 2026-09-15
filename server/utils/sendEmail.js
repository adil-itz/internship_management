import nodemailer from 'nodemailer';
import dns from 'dns';

/**
 * Send email utility
 * Supports:
 * 1. Resend HTTP API (RESEND_API_KEY) - Recommended for Render (Port 443, never blocked)
 * 2. Brevo HTTP API (BREVO_API_KEY) - Recommended for Render (Port 443, never blocked)
 * 3. Nodemailer SMTP (Gmail / Custom host) - For local dev or unblocked hosts
 */
export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
    const brevoKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : null;

    console.log(`[EMAIL_DEBUG] --------------------------------------------------`);
    console.log(`[EMAIL_DEBUG] Initiating email to: ${to}`);
    console.log(`[EMAIL_DEBUG] ENV RESEND_API_KEY: ${resendKey ? 'DETECTED (' + resendKey.substring(0, 5) + '...)' : 'NOT FOUND'}`);
    console.log(`[EMAIL_DEBUG] ENV BREVO_API_KEY: ${brevoKey ? 'DETECTED' : 'NOT FOUND'}`);
    console.log(`[EMAIL_DEBUG] ENV EMAIL_USER: ${process.env.EMAIL_USER || 'NOT FOUND'}`);
    console.log(`[EMAIL_DEBUG] --------------------------------------------------`);

    // ----------------------------------------------------
    // 1. Check if Resend API key is available (HTTPS Port 443 - Works 100% on Render)
    // ----------------------------------------------------
    if (resendKey) {
      console.log(`🌐 [EMAIL] Sending via Resend HTTPS API to ${to}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [to],
          subject: subject,
          html: html || text,
          text: text,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`❌ [EMAIL] Resend API Error:`, data);
        throw new Error(data.message || JSON.stringify(data));
      }

      console.log(`✉️ [EMAIL] Sent successfully via Resend to ${to}: ${data.id}`);
      return { success: true, messageId: data.id };
    }

    // ----------------------------------------------------
    // 2. Check if Brevo (Sendinblue) API key is available (HTTPS Port 443)
    // ----------------------------------------------------
    if (brevoKey) {
      console.log(`🌐 [EMAIL] Sending via Brevo HTTPS API to ${to}...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: process.env.EMAIL_USER || 'noreply@internflow.com', name: 'InternFlow' },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html || text,
          textContent: text,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`❌ [EMAIL] Brevo API Error:`, data);
        throw new Error(data.message || JSON.stringify(data));
      }

      console.log(`✉️ [EMAIL] Sent successfully via Brevo to ${to}: ${data.messageId}`);
      return { success: true, messageId: data.messageId };
    }

    // ----------------------------------------------------
    // 3. Fallback to Nodemailer SMTP (Localhost / standard SMTP)
    // ----------------------------------------------------
    console.log(`⚠️ [EMAIL] Neither RESEND_API_KEY nor BREVO_API_KEY found! Falling back to Nodemailer SMTP...`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS is missing in environment variables!');
    }

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;
    const isSecure = port === 465;

    console.log(`🔌 [EMAIL] Connecting to SMTP Host: ${host}, Port: ${port}, Secure: ${isSecure}`);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
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
    console.log(`✉️ [EMAIL] Sent successfully via SMTP to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`⚠️ Email sending error: ${error.message}`);
    // Return false without throwing so fallback simulation still functions in dev
    return { success: false, error: error.message };
  }
};

export default sendEmail;
