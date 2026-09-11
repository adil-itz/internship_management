import Groq from 'groq-sdk';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and Career Coach. 
Analyze the provided resume text. Be critical but constructive.
Respond ONLY with a valid JSON object matching this schema, nothing else:
{
  "score": <number between 0 and 100>,
  "advantages": ["point 1", "point 2"],
  "disadvantages": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "summary": "A short overall professional summary"
}
Ensure the output is 100% valid JSON. Do not include markdown formatting like \`\`\`json around the output. Just raw JSON.`;

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = "";

    // If file is uploaded
    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.mimetype.includes('pdf')) {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text;
      } else {
        return res.status(400).json({ success: false, message: 'Only PDF files are supported.' });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ success: false, message: 'Please provide a PDF file or pasted resume text.' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Resume content is too short or unreadable.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API Key is not configured on the server' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze the following resume:\n\n${resumeText.substring(0, 8000)}` }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'qwen/qwen3.8-27b',
      temperature: 0.2,
    });

    let reply = chatCompletion.choices[0]?.message?.content || "{}";
    let analysis;
    try {
      // Try to parse raw, or extract json from markdown
      if (reply.includes('```json')) {
        reply = reply.split('```json')[1].split('```')[0];
      } else if (reply.includes('```')) {
        reply = reply.split('```')[1].split('```')[0];
      }
      analysis = JSON.parse(reply.trim());
    } catch (e) {
      console.error('JSON parsing failed. Raw reply:', reply);
      return res.status(500).json({ success: false, message: 'AI returned an invalid format. Please try again.' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Resume Analyzer Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error analyzing resume' });
  }
};
