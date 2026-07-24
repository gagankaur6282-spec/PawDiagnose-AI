import express from "express";
import crypto from "crypto";
import { requireAuth } from "../middleware/auth.js";
import { readDb, writeDb } from "../db.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = readDb();
  res.json(db.dogs.filter((d) => d.userId === req.user.id));
});

router.post("/", requireAuth, (req, res) => {
  try {
    const { name, breed, age, birthDate } = req.body || {};
    if (!name || !name.trim() || !birthDate) {
      return res.status(400).json({ error: "Please provide at least a name and birth date." });
    }
    const db = readDb();
    const dog = { id: crypto.randomUUID(), userId: req.user.id, name: name.trim(), breed: breed || "", age: age || "", birthDate };
    db.dogs.push(dog);
    writeDb(db);
    res.json(dog);
  } catch (e) {
    console.error("dogs create error:", e);
    res.status(500).json({ error: "Couldn't save this dog right now." });
  }
});

router.delete("/:id", requireAuth, (req, res) => {
  const db = readDb();
  db.dogs = db.dogs.filter((d) => !(d.id === req.params.id && d.userId === req.user.id));
  writeDb(db);
  res.json({ ok: true });
});

router.delete("/", requireAuth, (req, res) => {
  const db = readDb();
  db.dogs = db.dogs.filter((d) => d.userId !== req.user.id);
  writeDb(db);
  res.json({ ok: true });
});

export default router;
