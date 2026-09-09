import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are the official AI Assistant for InterFlow, an Internship Management Platform.
Your purpose is to help users navigate and understand the platform.

Key Features of InterFlow:
- Students can browse internships, apply, communicate with mentors, view their attendance, submit worklogs, and generate PDF certificates upon completion.
- Companies can post internships, review applications, shortlist candidates, and schedule interviews.
- Mentors are assigned to students to track their progress and review tasks.
- Admins can view analytics, manage users, and oversee the platform.
- The platform features Email OTP 2FA for security.
- Notifications are sent via email for new internships, mentor assignments, and interview schedules.

CRITICAL RULES:
1. ONLY answer questions related to the InterFlow platform, internships, careers, or the features mentioned above.
2. If the user asks about ANYTHING else (e.g., general knowledge, coding, weather, history, politics), you MUST politely refuse and state that you can only answer questions about InterFlow.
3. Keep your answers concise, friendly, and helpful. Do not output markdown code blocks unless explaining a technical platform feature.`;

export const askChatbot = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API Key is not configured on the server' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Format history for Groq
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'qwen/qwen3.8-27b',
      temperature: 0.5,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    res.json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error processing your request' });
  }
};
