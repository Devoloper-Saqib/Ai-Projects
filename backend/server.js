const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Writer/codellama-34b-Instruct-hf",
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const generatedText = response.data?.[0]?.generated_text;
    if (!generatedText) {
      return res.status(500).json({ error: "No HTML content received from API" });
    }

    res.json({ html: generatedText });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to generate HTML" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
