# Google Sheets & Drive Setup for Drape.ai

This guide explains how to connect Drape.ai to:

- **Google Sheets** – [Drape.ai Spreadsheet](https://docs.google.com/spreadsheets/d/1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg/edit?usp=sharing) (user signup, wardrobe items, outfits, donations, collections)
- **Google Drive** – [Drape.ai Photos Folder](https://drive.google.com/drive/u/0/folders/1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP) (cloth photos, saved outfit images)

---

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Google Sheets API**
   - **Google Drive API**

---

## 2. Create a Service Account

1. In Cloud Console: **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Name it (e.g. `drape-ai-backend`)
4. Click **Create and Continue** (skip optional steps)
5. Click the service account → **Keys** tab
6. **Add Key** → **Create new key** → **JSON**
7. Download the JSON file

---

## 3. Share Resources with the Service Account

### Google Sheets

1. Open the [Drape.ai Spreadsheet](https://docs.google.com/spreadsheets/d/1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg/edit?usp=sharing)
2. Click **Share**
3. Add the service account email (e.g. `drape-ai-backend@your-project.iam.gserviceaccount.com`)
4. Grant **Editor** access

### Google Drive

1. Open the [Drape.ai Photos Folder](https://drive.google.com/drive/u/0/folders/1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP)
2. Click **Share**
3. Add the same service account email
4. Grant **Editor** access

---

## 4. Configure the Backend

1. Create `backend/credentials/` (add to `.gitignore`)
2. Place the downloaded JSON file as:
   ```
   backend/credentials/drape-ai-service-account.json
   ```
3. Set in `.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./credentials/drape-ai-service-account.json
   ```

---

## 5. Sheet Structure (Auto-Created)

When the backend runs, it creates these sheets if they don’t exist:

| Sheet          | Purpose                                      |
|----------------|----------------------------------------------|
| **Users**      | id, phone, name, gender, style, skinTone…   |
| **WardrobeItems** | id, userId, imageUrl, category, tags…    |
| **Outfits**    | id, userId, itemIds, occasion, status…      |
| **Donations**  | id, userId, itemIds, partnerId, status…     |
| **Collections** | id, userId, name, icon…                    |

---

## 6. Drive Folder Structure

```
Drape.ai Photos (1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP)/
├── user-1/
│   ├── clothes/     ← Wardrobe item photos
│   └── outfits/     ← Saved outfit composite images
├── user-2/
│   ├── clothes/
│   └── outfits/
└── ...
```

---

## 7. When Sync Happens

| Event              | Sheets | Drive |
|--------------------|--------|-------|
| User signup        | ✓ Users row | – |
| Add wardrobe item  | ✓ WardrobeItems row | ✓ Upload to `{userId}/clothes/` |
| Save/Like outfit   | ✓ Outfits row | ✓ Upload to `{userId}/outfits/` |
| Schedule donation | ✓ Donations row | – |
| Create collection  | ✓ Collections row | – |

---

## 8. Running Without Google APIs

If `GOOGLE_APPLICATION_CREDENTIALS` is not set, the app still runs. Sheets and Drive sync are skipped and a warning is logged.
