const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { prompt } = req.body;
  console.log("✅ Received prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const API_KEY = "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".trim();

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You're an expert web developer. Generate full HTML code based on the user's prompt. Only return HTML, no explanations or markdown. Strictly Css and JS must be in <script> & <style> tags.",
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
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const html = response.data.choices[0]?.message?.content || "";
    console.log("✅ AI Response received:");
    console.log(html);

    res.status(200).json({ html });
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
};
