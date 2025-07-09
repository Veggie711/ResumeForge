import React, { useState } from "react";
import axios from "axios";

const ScoreResume = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/api/gemini/score", {
        resumeText,
        jobDesc,
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setResult("An error occurred while scoring the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Gemini Resume Scorer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Resume Text:</label>
          <textarea
            rows="8"
            cols="80"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            required
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            rows="6"
            cols="80"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Scoring..." : "Get Score"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem" }}>
          <h4>Result:</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default ScoreResume;
