import express from 'express';
import {
  generateCertificate,
  getStudentCertificates,
  getCertificate,
  downloadCertificate,
  emailCertificate,
  verifyCertificate
} from '../controllers/certificate.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate/:internshipId', protect, generateCertificate);
router.get('/student', protect, getStudentCertificates);
router.get('/verify/:certificateId', verifyCertificate); // Public
router.get('/:certificateId', protect, getCertificate);
router.get('/:certificateId/download', protect, downloadCertificate);
router.post('/:certificateId/email', protect, emailCertificate);

export default router;
