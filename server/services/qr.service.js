import QRCode from 'qrcode';

/**
 * Generates a base64 encoded string of the QR code for a given URL or text.
 * @param {string} text - The text or URL to encode.
 * @returns {Promise<string>} Base64 image string.
 */
export const generateQRCode = async (text) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};
