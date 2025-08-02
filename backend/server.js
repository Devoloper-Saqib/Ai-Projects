const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

// ✅ CORS for your frontend
app.use(cors({
  origin: "https://webbot-ai-website-builder.netlify.app"
}));

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a web developer who generates complete HTML websites in response to text prompts. Your responses should include full HTML, CSS, and JavaScript code inside a single HTML file."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const html = response.data.choices[0].message.content;
    res.json({ html });

  } catch (error) {
    console.error("Error generating website:", error);
    res.status(500).json({ error: "Failed to generate website." });
  }
});

// ✅ No app.listen for Vercel
module.exports = app;
