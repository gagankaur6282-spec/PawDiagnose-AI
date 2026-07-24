// Minimal file-based datastore.
// This intentionally avoids native modules (sqlite3, better-sqlite3, etc.)
// so the project installs and runs locally with zero build-tool friction.
// For a real production deployment, swap this out for Postgres/MySQL/Mongo.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const EMPTY_DB = {
  users: [],       // { id, name, email, passwordHash | null, isGoogle }
  diagnoses: [],    // { id, userId, type, input, imagePath, result, date }
  dogs: [],         // { id, userId, name, breed, age, birthDate }
  favorites: []     // { id, userId, name, address, phone, lat, lon }
};

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2));
  }
}

export function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return { ...EMPTY_DB, ...parsed };
  } catch (e) {
    console.error("Failed to read db.json, starting from an empty database:", e.message);
    return { ...EMPTY_DB };
  }
}

export function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
