const express = require('express');
const multer = require('multer');
const router = express.Router();
const { MOCK_WARDROBE_ITEMS, uuidv4 } = require('../data/mockData');
const googleDrive = require('../services/googleDrive');
const googleSheets = require('../services/googleSheets');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

let items = [...MOCK_WARDROBE_ITEMS];

// GET /api/wardrobe/:userId
router.get('/:userId', (req, res) => {
  const userItems = items.filter(i => i.userId === req.params.userId && !i.isDonated);
  res.json({ items: userItems });
});

// POST /api/wardrobe/:userId/upload - multipart file upload
router.post('/:userId/upload', upload.single('photo'), async (req, res) => {
  const userId = req.params.userId;
  const { category, tags, color } = req.body || {};
  if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });
  let finalImageUrl = 'https://picsum.photos/400/500';
  let driveFileId = null;
  const driveResult = await googleDrive.uploadClothPhoto(userId, req.file.buffer, req.file.originalname, req.file.mimetype);
  if (driveResult) {
    finalImageUrl = driveResult.url;
    driveFileId = driveResult.fileId;
  }
  const newItem = {
    id: uuidv4(),
    userId,
    imageUrl: finalImageUrl,
    driveFileId,
    category: category || 't-shirt',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    color: color || 'unknown',
    source: null,
    isDonated: false
  };
  items.push(newItem);
  await googleSheets.createWardrobeItem(newItem).catch(err => console.error('Sheets sync:', err.message));
  res.status(201).json(newItem);
});

// POST /api/wardrobe/:userId
router.post('/:userId', async (req, res) => {
  const { imageUrl, category, tags, color, source } = req.body;
  const userId = req.params.userId;
  let finalImageUrl = imageUrl || 'https://picsum.photos/400/500';
  let driveFileId = null;
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    const driveResult = await googleDrive.uploadFromUrl(userId, imageUrl, 'clothes');
    if (driveResult) {
      finalImageUrl = driveResult.url;
      driveFileId = driveResult.fileId;
    }
  }
  const newItem = {
    id: uuidv4(),
    userId,
    imageUrl: finalImageUrl,
    driveFileId,
    category: category || 't-shirt',
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
    color: color || 'unknown',
    source: source || null,
    isDonated: false
  };
  items.push(newItem);
  await googleSheets.createWardrobeItem(newItem).catch(err => console.error('Sheets sync:', err.message));
  res.status(201).json(newItem);
});

// PUT /api/wardrobe/:userId/items/:itemId
router.put('/:userId/items/:itemId', (req, res) => {
  const idx = items.findIndex(i => i.id === req.params.itemId && i.userId === req.params.userId);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

// DELETE /api/wardrobe/:userId/items/:itemId
router.delete('/:userId/items/:itemId', (req, res) => {
  items = items.filter(i => !(i.id === req.params.itemId && i.userId === req.params.userId));
  res.json({ success: true });
});

// GET /api/wardrobe/:userId/items/:itemId
router.get('/:userId/items/:itemId', (req, res) => {
  const item = items.find(i => i.id === req.params.itemId && i.userId === req.params.userId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/wardrobe/:userId/bulk-upload
router.post('/:userId/bulk-upload', async (req, res) => {
  const { images } = req.body;
  const userId = req.params.userId;
  const created = [];
  for (const img of images || []) {
    const url = typeof img === 'string' ? img : img.url;
    let finalUrl = url || 'https://picsum.photos/400/500';
    let driveFileId = null;
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      const driveResult = await googleDrive.uploadFromUrl(userId, url, 'clothes');
      if (driveResult) {
        finalUrl = driveResult.url;
        driveFileId = driveResult.fileId;
      }
    }
    const newItem = {
      id: uuidv4(),
      userId,
      imageUrl: finalUrl,
      driveFileId,
      category: raw.category || 't-shirt',
      tags: raw.tags || [],
      color: raw.color || 'unknown',
      isDonated: false
    };
    items.push(newItem);
    created.push(newItem);
    await googleSheets.createWardrobeItem(newItem).catch(err => console.error('Sheets sync:', err.message));
  }
  res.status(201).json({ items: created });
});

module.exports = router;
