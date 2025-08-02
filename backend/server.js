const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Clean API Key
const apiKey = "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".trim();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  console.log("✅ Received prompt:", prompt);

  if (!prompt) {
    console.log("❌ No prompt provided.");
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-coder:free",
        messages: [
          {
            role: "system",
            content: "You're an expert web developer. Generate full HTML code based on the user's prompt. Only return HTML, no explanations or markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // ✅ Clean usage
          "Content-Type": "application/json",
          "HTTP-Referer": "https://webbot-ai-website-builder.netlify.app",
          "X-Title": "Webbot AI Site Builder"
        },
      }
    );

    const html = response.data.choices[0]?.message?.content || "";

    console.log("✅ AI Response received:");
    console.log(html);

    res.json({ html });
  } catch (err) {
    console.error("❌ Error from AI API:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Message:", err.message);
    }

    res.status(500).json({ error: "Failed to generate code from AI." });
  }
});

app.get("/", (req, res) => {
  res.send("⚡ AI HTML Generator API is running.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
