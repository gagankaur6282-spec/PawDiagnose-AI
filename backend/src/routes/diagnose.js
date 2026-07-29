import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";
import { generateGeminiResponse } from "../utils/gemini.js";
import { containsEmergencyKeyword } from "../utils/constants.js";
import { readDb, writeDb } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed."));
    cb(null, true);
  }
});

const router = express.Router();

router.post("/text", requireAuth, async (req, res) => {
  try {
    const { symptoms } = req.body || {};
    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: "Please describe at least one symptom." });
    }

    const prompt = `You are a veterinary-education assistant (not a substitute for a licensed vet). A dog owner reports these symptoms: "${symptoms}".
Respond ONLY with a raw JSON object (no markdown, no preamble) with exactly these keys:
{
 "possible_diseases": [array of 1-3 strings],
 "severity": "Low" | "Moderate" | "High",
 "common_causes": [array of strings],
 "home_care": [array of strings],
 "prevention": [array of strings],
 "suggested_medications": [array of strings, general/educational only, no exact dosages],
 "diet_recommendations": [array of strings],
 "vet_recommended": boolean,
 "emergency": boolean
}`;

    const text = await generateGeminiResponse([{ role: "user", content: prompt }]);
    const parsed = extractJson(text);
    if (!parsed) return res.status(502).json({ error: "The AI response couldn't be parsed. Please try again." });

    if (containsEmergencyKeyword(symptoms)) parsed.emergency = true;

    const db = readDb();
    db.diagnoses.unshift({
      id: crypto.randomUUID(),
      userId: req.user.id,
      type: "text",
      input: symptoms,
      result: parsed,
      date: new Date().toISOString()
    });
    writeDb(db);

    res.json(parsed);
  } catch (e) {
    console.error("diagnose/text error:", e);
    res.status(500).json({ error: e.message || "The AI analysis couldn't be completed right now." });
  }
});

router.post("/image", requireAuth, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      if (!req.file) return res.status(400).json({ error: "Please upload a photo first." });

      const base64 = fs.readFileSync(req.file.path, { encoding: "base64" });
      const mediaType = req.file.mimetype || "image/jpeg";

      const prompt = `You are a veterinary-education assistant (not a substitute for a licensed vet). Examine this photo of a dog's skin/eye/ear/paw/body area for visible signs of injury or disease.
Respond ONLY with a raw JSON object (no markdown, no preamble) with exactly these keys:
{
 "condition": "most likely condition (string)",
 "confidence": "Low" | "Moderate" | "High",
 "description": "1-3 sentence plain-language description of what's visible",
 "home_care": [array of strings],
 "emergency": boolean,
 "vet_recommended": boolean
}`;

     const text = await generateGeminiResponse([
  {
    role: "user",
    content: [
      { type: "image", mimeType: mediaType, data: base64 },
      { type: "text", text: prompt }
    ]
  }
]);

      const parsed = extractJson(text);
      if (!parsed) return res.status(502).json({ error: "The AI response couldn't be parsed. Please try again." });

      const storedName = path.basename(req.file.path) + path.extname(req.file.originalname || "");
      const finalPath = path.join(UPLOAD_DIR, storedName);
      fs.renameSync(req.file.path, finalPath);
      const imageUrl = `/uploads/${storedName}`;

      const db = readDb();
      db.diagnoses.unshift({
        id: crypto.randomUUID(),
        userId: req.user.id,
        type: "image",
        input: req.file.originalname,
        imagePath: imageUrl,
        result: parsed,
        date: new Date().toISOString()
      });
      writeDb(db);

      res.json({ ...parsed, imageUrl });
    } catch (e) {
      console.error("diagnose/image error:", e);
      res.status(500).json({ error: e.message || "The image analysis couldn't be completed right now." });
    }
  });
});

router.get("/history", requireAuth, (req, res) => {
  const db = readDb();
  const mine = db.diagnoses.filter((d) => d.userId === req.user.id).slice(0, 30);
  res.json(mine);
});

router.delete("/history", requireAuth, (req, res) => {
  const db = readDb();
  db.diagnoses = db.diagnoses.filter((d) => d.userId !== req.user.id);
  writeDb(db);
  res.json({ ok: true });
});
function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export default router;
