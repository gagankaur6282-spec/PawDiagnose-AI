import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateGeminiResponse } from '../utils/gemini.js';

const router = express.Router();

const SYSTEM_PROMPT = "You are a friendly, knowledgeable dog care assistant inside the PawDiagnose AI app. Answer questions about pet health, care, and behavior.";

router.post("/", requireAuth, async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: "No message provided." });
    }

    // Format the messages for Gemini
    const apiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      content: m.text || m.content,
    }));

    // Call the Gemini helper function
    const text = await generateGeminiResponse(apiMessages, SYSTEM_PROMPT);

    res.json({ text });
  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ error: e.message || "Sorry, something went wrong reaching the assistant." });
  }
});

export default router;