// backend/routes/groqRoute.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful, intelligent AI assistant that can answer questions, write essays and poetry, and help with any text generation task."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ text: data.choices[0].message.content.trim() }); // ✅ Changed from "response" to "text"
    } else {
      res.status(500).json({ error: "Invalid response from Groq API", data });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to communicate with Groq API", message: err.message });
  }
});

export default router;
