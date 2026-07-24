import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { readDb, writeDb } from "../db.js";
import { generateToken, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({ error: "Please provide a name, email, and password." });
    }
    const db = readDb();
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.find((u) => u.email === normalizedEmail)) {
      return res.status(409).json({ error: "An account with this email already exists — try logging in instead." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash, isGoogle: false };
    db.users.push(user);
    writeDb(db);
    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (e) {
    console.error("signup error:", e);
    res.status(500).json({ error: "Something went wrong creating your account. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Please provide an email and password." });
    const db = readDb();
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email === normalizedEmail);
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Incorrect email or password." });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Incorrect email or password." });
    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Something went wrong signing you in. Please try again." });
  }
});

// Demo-only "Google sign-in" — creates/reuses a fixed demo account.
// This is NOT real OAuth. To wire up real Google sign-in, integrate
// passport-google-oauth20 (or Google Identity Services) here instead.
router.post("/google-demo", (req, res) => {
  try {
    const db = readDb();
    const demoEmail = "demo.google.user@example.com";
    let user = db.users.find((u) => u.email === demoEmail);
    if (!user) {
      user = { id: crypto.randomUUID(), name: "Demo Google User", email: demoEmail, passwordHash: null, isGoogle: true };
      db.users.push(user);
      writeDb(db);
    }
    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (e) {
    console.error("google-demo error:", e);
    res.status(500).json({ error: "Something went wrong with demo sign-in." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: { name: user.name, email: user.email } });
});

export default router;
