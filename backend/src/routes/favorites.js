import express from "express";
import crypto from "crypto";
import { requireAuth } from "../middleware/auth.js";
import { readDb, writeDb } from "../db.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = readDb();
  res.json(db.favorites.filter((f) => f.userId === req.user.id));
});

router.post("/", requireAuth, (req, res) => {
  try {
    const { name, address, phone, lat, lon } = req.body || {};
    if (!name) return res.status(400).json({ error: "Missing vet name." });
    const db = readDb();
    const existing = db.favorites.find((f) => f.userId === req.user.id && f.name === name);
    if (existing) return res.json(existing);
    const fav = { id: crypto.randomUUID(), userId: req.user.id, name, address: address || "", phone: phone || "", lat: lat ?? null, lon: lon ?? null };
    db.favorites.push(fav);
    writeDb(db);
    res.json(fav);
  } catch (e) {
    console.error("favorites create error:", e);
    res.status(500).json({ error: "Couldn't save this favorite right now." });
  }
});

router.delete("/:id", requireAuth, (req, res) => {
  const db = readDb();
  db.favorites = db.favorites.filter((f) => !(f.id === req.params.id && f.userId === req.user.id));
  writeDb(db);
  res.json({ ok: true });
});

router.delete("/", requireAuth, (req, res) => {
  const db = readDb();
  db.favorites = db.favorites.filter((f) => f.userId !== req.user.id);
  writeDb(db);
  res.json({ ok: true });
});

export default router;
