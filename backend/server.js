const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://webbot-ai-website-builder.netlify.app", // optional
          "X-Title": "WebBot AI Builder", // optional
        },
      }
    );

    const htmlContent = response.data.choices[0].message.content;
    res.json({ html: htmlContent });
  } catch (err) {
    console.error("Error fetching from OpenRouter:", err.message);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
