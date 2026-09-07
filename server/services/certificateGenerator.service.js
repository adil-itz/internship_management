import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { generateQRCode } from './qr.service.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a PDF certificate.
 * @param {Object} data - Certificate data.
 * @returns {Promise<string>} Path to the generated PDF.
 */
export const generateCertificatePDF = async (data) => {
  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'certificate', 'certificate.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Read background image
    const bgImagePath = path.join(__dirname, '..', 'templates', 'certificate', 'assets', 'certificate-background.png');
    const bgImageBase64 = fs.readFileSync(bgImagePath, 'base64');
    const bgImageSrc = `data:image/png;base64,${bgImageBase64}`;

    // Generate QR Code
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${data.certificateId}`;
    const qrCodeBase64 = await generateQRCode(verificationUrl);

    // Format dates
    const startDate = data.startDate ? new Date(data.startDate).toLocaleDateString() : 'N/A';
    const endDate = data.endDate ? new Date(data.endDate).toLocaleDateString() : 'N/A';

    // Replace placeholders
    const replacements = {
      '{{certificateId}}': data.certificateId,
      '{{studentName}}': data.studentName,
      '{{internshipTitle}}': data.internshipTitle,
      '{{companyName}}': data.companyName,
      '{{mentorName}}': data.mentorName || 'Mentor',
      '{{startDate}}': startDate,
      '{{endDate}}': endDate,
      '{{qrCode}}': qrCodeBase64,
      '{{backgroundImage}}': bgImageSrc
    };

    for (const [key, value] of Object.entries(replacements)) {
      // Escape special characters in key for regex
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      htmlContent = htmlContent.replace(new RegExp(safeKey, 'g'), value);
    }

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const outputDir = path.join(__dirname, '..', 'generated', 'certificates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const fileName = `${data.certificateId}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    await page.pdf({
      path: outputPath,
      width: '1122px',
      height: '793px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    return outputPath;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF certificate: ${error.message}`);
  }
};
