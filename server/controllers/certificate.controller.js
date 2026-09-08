import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import MentorAssignment from '../models/MentorAssignment.js';
import User from '../models/User.js';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { generateCertificatePDF } from '../services/certificateGenerator.service.js';
import sendEmail from '../utils/sendEmail.js';

export const generateCertificate = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.user.id;

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can generate certificates' });
    }

    let existingCert = await Certificate.findOne({ studentId, internshipId });
    if (existingCert) {
      return res.status(200).json({
        success: true,
        alreadyGenerated: true,
        certificate: existingCert
      });
    }

    const assignment = await MentorAssignment.findOne({
      internship: internshipId,
      student: studentId
    }).populate([
      { path: 'internship', populate: { path: 'company', select: 'name' } },
      { path: 'student', select: 'name email' },
      { path: 'mentor', select: 'name email' }
    ]);

    if (!assignment) {
      return res.status(404).json({ message: 'Internship participation not found' });
    }

    if (assignment.status !== 'completed') {
      return res.status(400).json({ message: 'Internship must be completed to generate a certificate' });
    }

    const studentName = assignment.student ? assignment.student.name : 'Student';
    const internshipTitle = assignment.internship ? assignment.internship.title : 'Internship';
    const companyObj = assignment.internship ? assignment.internship.company : null;
    const companyId = companyObj ? (companyObj._id || companyObj) : null;
    const companyName = companyObj && typeof companyObj === 'object' && companyObj.name ? companyObj.name : 'Company';
    
    const mentorId = assignment.mentor ? assignment.mentor._id : null;
    const mentorName = assignment.mentor ? assignment.mentor.name : 'Mentor';

    const startDate = assignment.internship.startDate || assignment.assignedAt;
    const endDate = new Date(); // Or fetch from a completion record if available

    // Generate unique ID and token
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const certificateId = `IF-CERT-${year}-${randomHex}`;
    const verificationToken = crypto.randomBytes(16).toString('hex');

    const certData = {
      certificateId,
      studentId,
      internshipId,
      companyId,
      mentorId,
      studentName,
      internshipTitle,
      companyName,
      mentorName,
      startDate,
      endDate,
      verificationToken
    };

    // Generate PDF
    const pdfPath = await generateCertificatePDF(certData);
    certData.pdfPath = pdfPath;

    // Save to DB
    const certificate = await Certificate.create(certData);

    // Send Email
    try {
      await sendEmail({
        to: assignment.student.email,
        subject: 'Your InterFlow Internship Certificate',
        text: `Dear ${studentName},\n\nCongratulations on successfully completing your internship.\nYour official InterFlow Internship Completion Certificate is attached to this email.\n\nCertificate ID: ${certificateId}\nInternship: ${internshipTitle}\nCompany: ${companyName}\n\nRegards,\nInterFlow Team`,
        attachments: [
          {
            filename: `${certificateId}.pdf`,
            path: pdfPath
          }
        ]
      });
      certificate.emailSent = true;
      certificate.emailSentAt = new Date();
      certificate.status = 'emailed';
      await certificate.save();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the whole request if only email fails
    }

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      certificate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Authorization
    if (req.user.role === 'student' && certificate.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this certificate' });
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Authorization
    if (req.user.role === 'student' && certificate.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to download this certificate' });
    }

    if (!certificate.pdfPath || !fs.existsSync(certificate.pdfPath)) {
      return res.status(404).json({ message: 'PDF file not found' });
    }

    res.download(certificate.pdfPath, `${certificateId}.pdf`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const emailCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId }).populate('studentId', 'email name');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (req.user.role === 'student' && certificate.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!certificate.pdfPath || !fs.existsSync(certificate.pdfPath)) {
      return res.status(404).json({ message: 'PDF file not found' });
    }

    await sendEmail({
      to: certificate.studentId.email,
      subject: 'Your InterFlow Internship Certificate',
      text: `Dear ${certificate.studentName},\n\nCongratulations on successfully completing your internship.\nYour official InterFlow Internship Completion Certificate is attached to this email.\n\nCertificate ID: ${certificateId}\nInternship: ${certificate.internshipTitle}\nCompany: ${certificate.companyName}\n\nRegards,\nInterFlow Team`,
      attachments: [
        {
          filename: `${certificateId}.pdf`,
          path: certificate.pdfPath
        }
      ]
    });

    certificate.emailSent = true;
    certificate.emailSentAt = new Date();
    if (certificate.status === 'generated') certificate.status = 'emailed';
    await certificate.save();

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ valid: false, message: 'Certificate not found' });
    }

    if (certificate.status === 'revoked') {
      return res.status(200).json({ valid: false, status: 'revoked' });
    }

    res.status(200).json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        internshipTitle: certificate.internshipTitle,
        companyName: certificate.companyName,
        mentorName: certificate.mentorName,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
        issueDate: certificate.issueDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
