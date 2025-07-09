import dotenv from "dotenv";
import { GoogleGenAI  } from "@google/genai";

dotenv.config();

console.log("--- geminiAPI.js Debug ---");
console.log("Is dotenv loaded?", dotenv.config() ? "Yes" : "No (was already loaded)");
console.log("--- End geminiAPI.js Debug ---");

const genAI = new GoogleGenAI ({
  apiKey: process.env.GEMINI_API_KEY, // Use the logged variable
});

export async function scoreResume(resumeText, jobDesc) {
  const prompt = `
You are an Applicant Tracking System (ATS).
Evaluate how well the following resume matches the job description.
Provide a score (0 to 100) and a short explanation.

Resume:
${resumeText}

Job Description:
${jobDesc}

Respond in this format:
Score: <number>
Explanation: <text>
`;

  try {
    const result = await genAI.models.generateContent({ model: "gemini-2.5-flash" ,contents : prompt});
    return result.text;
    // ...
  } catch (err) {
    console.error("❌ Gemini API error during generateContent:", err.message);
    throw err;
  }
}