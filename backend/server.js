const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert web developer AI. Your job is to take the user's prompt and generate a COMPLETE and CLEAN HTML document. Only return the HTML code — no explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://webbot-ai-website-builder.netlify.app", // optional
          "X-Title": "WebBot AI Website Builder", // optional
        },
      }
    );

    const html = response.data.choices[0]?.message?.content || "";
    res.json({ html });
  } catch (error) {
    console.error("OpenRouter API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong while generating HTML." });
  }
});

app.get("/", (req, res) => {
  res.send("WebBot backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
