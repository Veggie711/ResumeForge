// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { scoreResume } from "./geminiAPI.js"; // assuming geminiAPI.js is inside /backend

// Load environment variables from root .env
dotenv.config({path: "../.env"}); // ✅ important if .env is outside /backend

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging to confirm .env is working
console.log("🔑 GEMINI_API_KEY Loaded?", process.env.GEMINI_API_KEY ? "✅ YES" : "❌ NO");

// API endpoint
app.post("/api/gemini/score", async (req, res) => {
  const { resumeText, jobDesc } = req.body;

  if (!resumeText || !jobDesc) {
    return res.status(400).json({ error: "Missing resumeText or jobDesc" });
  }

  try {
    const result = await scoreResume(resumeText, jobDesc);
    res.json({ result });
  } catch (err) {
    console.error("❌ Error from Gemini API:", err.message);
    res.status(500).json({ error: "Failed to score resume", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

