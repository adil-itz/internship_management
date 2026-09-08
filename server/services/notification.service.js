import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sendEmail from '../utils/sendEmail.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to process simple {{}} and {{#if}}...{{/if}} blocks
const renderTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
  if (!fs.existsSync(templatePath)) return '';
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Inject global data
  data.year = new Date().getFullYear();
  data.clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // Process {{#if key}}...{{/if}}
  html = html.replace(/\\{\\{#if (\\w+)\\}\\}([\\s\\S]*?)\\{\\{.*?\\}\\}/g, (match, key, content) => {
  html = html.replace(/{{#if (\w+)}}([\s\S]*?){{.*?}}/g, (match, key, content) => {
    return data[key] ? content : '';
  });

  // Process {{key}}
  for (const [key, value] of Object.entries(data)) {
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`{{${safeKey}}}`, 'g'), value || '');
  }
  
  return html;
};

// Internal wrapper to save notification record and send email safely
const processNotification = async ({ recipientId, type, title, message, relatedEntityType, relatedEntityId, subject, html, text }) => {
  try {
    const user = await User.findById(recipientId);
    if (!user || !user.email) return; // Skip if no user/email

    // Save initial PENDING notification log
    const notification = await Notification.create({
      user: recipientId,
      title,
      message,
      type,
      relatedEntityType,
      relatedEntityId,
      emailStatus: 'PENDING'
    });

    // Send email without blocking main thread
    sendEmail({
      to: user.email,
      subject,
      html,
      text
    }).then(async (result) => {
      notification.emailStatus = result.success ? 'SENT' : 'FAILED';
      notification.sentAt = result.success ? new Date() : undefined;
      notification.error = result.error || null;
      await notification.save();
    }).catch(async (error) => {
      notification.emailStatus = 'FAILED';
      notification.error = error.message;
      await notification.save();
    });

  } catch (error) {
    console.error('Notification Processing Error:', error);
  }
};

/**
 * Bulk notification using controlled concurrency
 */
const processBulkNotifications = async (recipients, buildParamsFn) => {
  const BATCH_SIZE = 50;
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (user) => {
      try {
        const params = buildParamsFn(user);
        await processNotification({ recipientId: user._id, ...params });
      } catch (err) {
        console.error('Bulk Email Error for user', user._id, err);
      }
    }));
  }
};

export const notifyNewInternship = async (internship, company) => {
  try {
    const students = await User.find({ role: 'student' }).select('_id name email');
    if (!students.length) return;

    const subject = 'New Internship Opportunity on InterFlow';
    const title = 'New Internship Posted';
    const message = \`\${company.name} posted a new internship: \${internship.title}\`;

    await processBulkNotifications(students, (student) => {
      const templateData = {
        studentName: student.name,
        internshipTitle: internship.title,
        companyName: company.name,
        description: internship.description ? internship.description.substring(0, 150) + '...' : '',
        internshipId: internship._id
      };
      const html = renderTemplate('newInternship', templateData);
      const text = \`Hello \${student.name},\\n\\nA new internship opportunity has been posted on InterFlow.\\nInternship: \${internship.title}\\nCompany: \${company.name}\\n\\nLog in to apply!\`;

      return {
        type: 'NEW_INTERNSHIP',
        title,
        message,
        relatedEntityType: 'Internship',
        relatedEntityId: internship._id,
        subject,
        html,
        text
      };
    });
  } catch (error) {
    console.error('notifyNewInternship Error:', error);
  }
};

export const notifyMentorAssigned = async (mentorAssignment, internship, student, company, mentor) => {
  try {
    const subject = 'Mentor Assigned for Your Internship';
    const title = 'Mentor Assigned';
    const message = \`\${mentor.name} has been assigned as your mentor for \${internship.title}\`;

    const templateData = {
      studentName: student.name,
      mentorName: mentor.name,
      internshipTitle: internship.title,
      companyName: company.name
    };

    const html = renderTemplate('mentorAssigned', templateData);
    const text = \`Hello \${student.name},\\n\\nA mentor (\${mentor.name}) has been assigned to your internship (\${internship.title}) at \${company.name}.\\nLog in to InterFlow to connect.\`;

    await processNotification({
      recipientId: student._id,
      type: 'MENTOR_ASSIGNED',
      title,
      message,
      relatedEntityType: 'MentorAssignment',
      relatedEntityId: mentorAssignment._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyMentorAssigned Error:', error);
  }
};

export const notifyInterviewScheduled = async (application, internship, student, company) => {
  try {
    const { interview } = application;
    if (!interview || interview.status !== 'scheduled') return;

    const subject = 'Interview Scheduled for Your Internship Application';
    const title = 'Interview Scheduled';
    const message = \`An interview is scheduled for \${internship.title} on \${new Date(interview.date).toLocaleDateString()} at \${interview.time}\`;

    const templateData = {
      studentName: student.name,
      internshipTitle: internship.title,
      companyName: company.name,
      date: new Date(interview.date).toLocaleDateString(),
      time: interview.time,
      mode: interview.mode,
      meetingLink: interview.meetingLink,
      location: interview.location
    };

    const html = renderTemplate('interviewScheduled', templateData);
    const text = \`Hello \${student.name},\\n\\nAn interview has been scheduled for your application to \${internship.title}.\\nDate: \${templateData.date}\\nTime: \${templateData.time}\\nMode: \${templateData.mode}\\n\\nPlease log in to review full details.\`;

    await processNotification({
      recipientId: student._id,
      type: 'INTERVIEW_SCHEDULED',
      title,
      message,
      relatedEntityType: 'Application',
      relatedEntityId: application._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyInterviewScheduled Error:', error);
  }
};

export const notifyApplicationStatus = async (application, internship, student, company, oldStatus) => {
  try {
    if (application.status === oldStatus) return; // Only notify on change

    const subject = 'Update on Your Internship Application';
    const title = 'Application Status Updated';
    const message = \`Your application for \${internship.title} is now: \${application.status}\`;

    const templateData = {
      studentName: student.name,
      internshipTitle: internship.title,
      companyName: company.name,
      status: application.status
    };

    const html = renderTemplate('applicationStatus', templateData);
    const text = \`Hello \${student.name},\\n\\nYour application for \${internship.title} at \${company.name} has a new status: \${application.status.toUpperCase()}.\\nLog in for details.\`;

    await processNotification({
      recipientId: student._id,
      type: 'APPLICATION_STATUS',
      title,
      message,
      relatedEntityType: 'Application',
      relatedEntityId: application._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyApplicationStatus Error:', error);
  }
};
