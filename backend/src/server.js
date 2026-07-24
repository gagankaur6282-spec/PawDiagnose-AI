import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import diagnoseRoutes from "./routes/diagnose.js";
import chatRoutes from "./routes/chat.js";
import dogsRoutes from "./routes/dogs.js";
import favoritesRoutes from "./routes/favorites.js";
import vetsRoutes from "./routes/vets.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "2mb" }));

// Serve uploaded diagnosis photos
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "pawdiagnose-backend",
    ai: "Google Gemini",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/diagnose", diagnoseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dogs", dogsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/vets", vetsRoutes);

// 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: err.message || "Unexpected server error.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🐾 PawDiagnose AI backend running at http://localhost:${PORT}`);

  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY.includes("your-key-here")
  ) {
    console.warn(
      "⚠️ GEMINI_API_KEY is not set in backend/.env — AI diagnosis and chat will fail until you add it."
    );
  } else {
    console.log("✅ Gemini API key loaded successfully.");
  }
});