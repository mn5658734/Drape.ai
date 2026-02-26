# Drape.ai

**Tagline:** Open App. Get Outfit. Step Out.

AI-powered digital wardrobe that helps users decide what to wear instantly during rush hours.

---

## Project Structure

```
drape-ai/
├── backend/          # Node.js + Express API
├── web/              # React web app (photo upload)
├── mobile/           # React Native (Expo) app
├── docs/             # API docs, DB schema, UI flow
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── UI_UX_FLOW.md
└── README.md
```

---

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:3000`

### Web

```bash
cd web
npm install
npm run dev
```

Runs at http://localhost:5173. **Photo upload** – click or drag & drop images to add clothes.

### Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan QR code with Expo Go app, or press `i` for iOS simulator / `a` for Android emulator.

**Note:** Update `API_BASE` in `mobile/src/services/api.js` if your backend runs on a different host (e.g. `http://YOUR_IP:3000/api` for physical device).

---

## Features

- **Authentication** – Phone OTP (mock)
- **Profile Setup** – Gender, style, skin tone
- **Digital Wardrobe** – Add, view, categorize clothes
- **Occasion Selection** – Office, Party, Dating, Trip, etc.
- **AI Outfit Suggestions** – Tinder-style swipe (Like/Skip/Save)
- **Rush Mode** – "I'm Getting Late!" – instant outfit
- **Declutter & Donate** – Schedule NGO pickup
- **Profile** – Edit profile, preferences

---

## API Documentation

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

## Google Sheets & Drive Integration

User signup, wardrobe items, outfits, donations, and collections sync to [Google Sheets](https://docs.google.com/spreadsheets/d/1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg). Cloth photos and saved outfit images are stored in [Google Drive](https://drive.google.com/drive/u/0/folders/1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP).

See [docs/GOOGLE_SETUP.md](docs/GOOGLE_SETUP.md) for setup instructions.

## UI/UX Flow

See [docs/UI_UX_FLOW.md](docs/UI_UX_FLOW.md)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Node.js, Express |
| Mobile | React Native, Expo |
| API | REST, mock data |
| DB (future) | MongoDB, Mongoose |

---

## Push to GitHub

```bash
cd drape-ai
git init
git add .
git commit -m "Initial commit: Drape.ai scaffold"
git remote add origin https://github.com/YOUR_USERNAME/drape-ai.git
git push -u origin main
```

---

## License

MIT
