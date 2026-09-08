import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sendEmail from '../utils/sendEmail.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
  if (!fs.existsSync(templatePath)) return '';
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  data.year = new Date().getFullYear();
  data.clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  html = html.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, key, content) => {
    return data[key] ? content : '';
  });

  for (const [key, value] of Object.entries(data)) {
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`{{${safeKey}}}`, 'g'), value || '');
  }
  
  return html;
};

const processNotification = async ({ recipientId, type, title, message, relatedEntityType, relatedEntityId, subject, html, text }) => {
  try {
    const user = await User.findById(recipientId);
    if (!user || !user.email) return;

    const notification = await Notification.create({
      user: recipientId,
      title,
      message,
      type,
      relatedEntityType,
      relatedEntityId,
      emailStatus: 'PENDING'
    });

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
    const message = `${company.name} posted a new internship: ${internship.title}`;

    await processBulkNotifications(students, (student) => {
      const templateData = {
        studentName: student.name,
        internshipTitle: internship.title,
        companyName: company.name,
        description: internship.description ? internship.description.substring(0, 150) + '...' : '',
        internshipId: internship._id
      };
      const html = renderTemplate('newInternship', templateData);
      const text = `Hello ${student.name},\n\nA new internship opportunity has been posted on InterFlow.\nInternship: ${internship.title}\nCompany: ${company.name}\n\nLog in to apply!`;

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
    const message = `${mentor.name} has been assigned as your mentor for ${internship.title}`;

    const templateData = {
      studentName: student.name,
      mentorName: mentor.name,
      internshipTitle: internship.title,
      companyName: company.name
    };

    const html = renderTemplate('mentorAssigned', templateData);
    const text = `Hello ${student.name},\n\nA mentor (${mentor.name}) has been assigned to your internship (${internship.title}) at ${company.name}.\nLog in to InterFlow to connect.`;

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
    if (!interview) return;

    const interviewDate = interview.date ? new Date(interview.date).toLocaleDateString() : 'TBD';
    const interviewTime = interview.time || 'TBD';

    const subject = 'Interview Scheduled for Your Internship Application';
    const title = 'Interview Scheduled';
    const message = `An interview is scheduled for ${internship.title} on ${interviewDate} at ${interviewTime}`;

    const templateData = {
      studentName: student.name,
      internshipTitle: internship.title,
      companyName: company?.name || 'Company',
      date: interviewDate,
      time: interviewTime,
      mode: interview.mode || 'online',
      meetingLink: interview.meetingLink || '',
      location: interview.location || ''
    };

    const html = renderTemplate('interviewScheduled', templateData);
    const text = `Hello ${student.name},\n\nAn interview has been scheduled for your application to ${internship.title}.\nDate: ${templateData.date}\nTime: ${templateData.time}\nMode: ${templateData.mode}\n\nPlease log in to review full details.`;

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
    if (application.status === oldStatus) return;

    const statusTitleMap = {
      shortlisted: 'Application Shortlisted',
      selected: 'Application Accepted',
      rejected: 'Application Rejected',
      interview_scheduled: 'Interview Scheduled'
    };

    const title = statusTitleMap[application.status] || 'Application Status Updated';
    const subject = `Update on Your Internship Application - ${application.status.toUpperCase()}`;
    const message = `Your application for ${internship.title} is now: ${application.status.replace('_', ' ').toUpperCase()}`;

    const templateData = {
      studentName: student.name,
      internshipTitle: internship.title,
      companyName: company?.name || 'Company',
      status: application.status
    };

    const html = renderTemplate('applicationStatus', templateData);
    const text = `Hello ${student.name},\n\nYour application for ${internship.title} at ${company?.name || 'Company'} has a new status: ${application.status.toUpperCase()}.\nLog in for details.`;

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

export const notifyNewTask = async (task, internship, student, mentorOrAdmin) => {
  try {
    const subject = 'New Internship Task Assigned';
    const title = 'New Task Assigned';
    const message = `${mentorOrAdmin.name || 'Mentor'} assigned a new task: ${task.title}`;

    const html = `<p>Hello ${student.name},</p><p>You have been assigned a new task for <strong>${internship.title}</strong>:</p><h3>${task.title}</h3><p>${task.description}</p><p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>`;
    const text = `Hello ${student.name},\n\nYou have been assigned a new task: ${task.title}\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}\n\nLog in to review and submit.`;

    await processNotification({
      recipientId: student._id,
      type: 'Task',
      title,
      message,
      relatedEntityType: 'Task',
      relatedEntityId: task._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyNewTask Error:', error);
  }
};

export const notifyTaskEvaluation = async (task, internship, student, mentorOrAdmin) => {
  try {
    const subject = 'Task Review Update';
    const title = 'Task Evaluated';
    const message = `Your task "${task.title}" has been reviewed: ${task.status.toUpperCase()}`;

    const html = `<p>Hello ${student.name},</p><p>Your task <strong>${task.title}</strong> has been reviewed.</p><p><strong>Status:</strong> ${task.status.toUpperCase()}</p>${task.mentorFeedback ? `<p><strong>Feedback:</strong> ${task.mentorFeedback}</p>` : ''}`;
    const text = `Hello ${student.name},\n\nYour task "${task.title}" review status: ${task.status.toUpperCase()}.\n${task.mentorFeedback ? `Feedback: ${task.mentorFeedback}\n` : ''}`;

    await processNotification({
      recipientId: student._id,
      type: 'Evaluation',
      title,
      message,
      relatedEntityType: 'Task',
      relatedEntityId: task._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyTaskEvaluation Error:', error);
  }
};

export const notifyWorkLogStatus = async (workLog, internship, student, reviewer) => {
  try {
    const subject = `Work Log ${workLog.status.toUpperCase()}`;
    const title = `Work Log ${workLog.status === 'approved' ? 'Approved' : 'Rejected'}`;
    const message = `Your work log for ${new Date(workLog.date).toLocaleDateString()} was ${workLog.status}`;

    const html = `<p>Hello ${student.name},</p><p>Your work log for <strong>${new Date(workLog.date).toLocaleDateString()}</strong> has been <strong>${workLog.status}</strong>.</p>${workLog.mentorFeedback ? `<p><strong>Feedback:</strong> ${workLog.mentorFeedback}</p>` : ''}`;
    const text = `Hello ${student.name},\n\nYour work log for ${new Date(workLog.date).toLocaleDateString()} has been ${workLog.status}.\n${workLog.mentorFeedback ? `Feedback: ${workLog.mentorFeedback}\n` : ''}`;

    await processNotification({
      recipientId: student._id,
      type: 'System',
      title,
      message,
      relatedEntityType: 'WorkLog',
      relatedEntityId: workLog._id,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('notifyWorkLogStatus Error:', error);
  }
};
