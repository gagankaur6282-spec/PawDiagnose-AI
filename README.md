# PawDiagnose AI

A full-stack app that helps dog owners get educational guidance on possible
health issues from symptoms or a photo, powered by Claude. **Not a substitute
for professional veterinary care.**

This project has two parts you run separately:

```
pawdiagnose-ai/
  backend/   Express API — auth, AI calls, and data storage
  frontend/  React (Vite) app — the UI
```

## 1. Prerequisites

- Node.js 18 or later (check with `node -v`)
- An Anthropic API key — get one at https://console.anthropic.com/

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
JWT_SECRET=some-long-random-string
```

(You can generate a random secret with:
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)

Start the backend:

```bash
npm run dev
```

It runs at **http://localhost:5000**. Data is stored in
`backend/data/db.json` (auto-created) and uploaded diagnosis photos in
`backend/uploads/`. Both are gitignored.

> This uses a simple JSON-file datastore instead of a real database, on
> purpose — it means `npm install` never needs a C++ build toolchain, so it
> "just works" locally. If you deploy this for real, swap `backend/src/db.js`
> for Postgres/MySQL/Mongo — every route only touches `readDb()`/`writeDb()`,
> so the rest of the code doesn't need to change.

## 3. Frontend setup

In a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173** in your browser.

The frontend's `.env` just needs `VITE_API_URL=http://localhost:5000` (already
set by default) so it knows where to find the backend.

## 4. Using the app

- **Sign up** with a name/email/password, or use **Continue with Google
  (demo)** — see the note below about what "demo" means here.
- **Diagnose** a symptom by describing it or uploading a photo — both call
  Claude on the backend and save the result to your history.
- **Vets** page: search a city or share your location. It always gives you a
  working "Open in Google Maps / OpenStreetMap" link, and additionally tries
  to show inline results via OpenStreetMap's free Overpass API (this can be
  slow or rate-limited — the map links are the reliable fallback).
- **Vaccination** page: register a dog to see computed reminders for rabies,
  DHPP, deworming, and tick treatment.
- **Dashboard**: your diagnosis history, favorite vets, and reminders in one
  place, with a "Clear my data" button.

## 5. Important notes

- **This is a demo/prototype auth system.** Passwords are hashed with
  bcrypt and sessions use JWTs, which is reasonable for local use, but there's
  no email verification, rate limiting, HTTPS, or password-reset email
  sending. Don't reuse a real password here, and don't deploy this publicly
  without hardening it first.
- **"Continue with Google (demo)"** does not perform real Google OAuth — it
  logs you into a fixed demo account so you can see the feature working. To
  wire up real Google sign-in, add `passport-google-oauth20` (or Google
  Identity Services on the frontend) and a `/api/auth/google/callback` route
  that issues a JWT the same way `google-demo` does now.
- **AI-generated results are for educational purposes only** and should never
  replace consultation with a licensed veterinarian. This disclaimer is shown
  throughout the app — please keep it if you extend or redeploy this project.
- **Emergency detection** is keyword-based (checked in
  `backend/src/utils/constants.js`) combined with the model's own judgment —
  it's a best-effort safety net, not a guarantee.

## 6. Deploying beyond your machine

If you want this reachable outside `localhost`:

1. Replace the JSON file datastore with a real database.
2. Put the backend behind HTTPS (e.g. behind Nginx/Caddy, or on a platform
   like Render/Railway/Fly.io).
3. Set `CORS_ORIGIN` in `backend/.env` to your real frontend domain.
4. Set `VITE_API_URL` in `frontend/.env` to your real backend domain, then
   `npm run build` in `frontend/` and serve the `dist/` folder as static
   files (e.g. Vercel, Netlify, Cloudflare Pages, or from the Express server
   itself).
5. Add rate limiting and stricter input validation on the backend before
   accepting real user traffic.
