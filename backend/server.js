const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Fix: Allow CORS only from Netlify frontend
app.use(cors({
  origin: 'https://webbot-ai-website-builder.netlify.app',
}));

app.use(express.json());
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));

app.post("/generate", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) return res.status(400).json({ error: "Prompt is missing" });

    const finalPrompt = `
Generate a single valid HTML5 file with all CSS in <style> and all JS in <script>.
Include <!DOCTYPE html>, <html>, <head>, <body>.
Don't include Markdown, comments, or explanations.
Only output final HTML.

Prompt: "${userPrompt}"
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Website Generator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    const data = await response.json();
    const aiMessage = data?.choices?.[0]?.message?.content;

    if (!aiMessage || !aiMessage.includes("<html")) {
      return res.status(500).json({ error: "AI did not return full HTML content." });
    }

    res.json({ content: aiMessage });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
