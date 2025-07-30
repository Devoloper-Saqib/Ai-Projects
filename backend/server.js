const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// ✅ Enable CORS for Netlify frontend
app.use(cors({
  origin: "https://webbot-ai-website-builder.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openchat/openchat-7b:free",
        messages: [
          {
            role: "user",
            content: `Write complete HTML code for this website idea: ${prompt}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const html = response.data.choices?.[0]?.message?.content;
    if (!html) {
      return res.status(500).json({ error: "No HTML generated" });
    }

    res.json({ html });
  } catch (error) {
    console.error("Error calling OpenRouter API:", error.message);
    res.status(500).json({ error: "Failed to generate HTML" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

