# Drape.ai Web

Web-based digital wardrobe with photo upload.

## Run

```bash
npm install
npm run dev
```

Runs at http://localhost:5173. Requires backend at http://localhost:3000.

## Deploy to Vercel

1. Import the repo in Vercel
2. Set **Root Directory** to `web`
3. Build command: `npm run build` (default)
4. Output directory: `dist` (default)

The `vercel.json` rewrites fix 404s for client-side routes (e.g. `/login`, `/wardrobe`).

## Features

- **Photo upload** – Click or drag & drop to add clothes
- Wardrobe management
- Outfit suggestions
- Rush mode
