const express = require('express');
const router = express.Router();
const { MOCK_OUTFITS, MOCK_WARDROBE_ITEMS, uuidv4 } = require('../data/mockData');
const googleDrive = require('../services/googleDrive');
const googleSheets = require('../services/googleSheets');

let outfits = MOCK_OUTFITS.map(o => ({ ...o, id: o.id || uuidv4() }));

// GET /api/outfits/:userId/suggestions
// Query: occasion, limit, source=wardrobe|recent_photos
// source=wardrobe: use cached wardrobe items (tags/LLM classified)
// source=recent_photos: prioritize recently uploaded items for suggestions
router.get('/:userId/suggestions', (req, res) => {
  const { occasion, limit = 10, source = 'wardrobe' } = req.query;
  let filtered = outfits.filter(o => o.status === 'suggested' || o.status === 'liked');
  if (occasion) filtered = filtered.filter(o => o.occasion === occasion);
  // When source=recent_photos, backend would use recently uploaded items; for now same results
  res.json({ outfits: filtered.slice(0, parseInt(limit)), source });
});

// POST /api/outfits/:userId/suggest
router.post('/:userId/suggest', (req, res) => {
  const { occasion, weather, location } = req.body;
  const newOutfits = outfits.slice(0, 5).map(o => ({
    ...o,
    id: uuidv4(),
    occasion: occasion || 'casual_hangout',
    weatherContext: weather,
    locationContext: location
  }));
  res.json({ outfits: newOutfits });
});

// POST /api/outfits/:userId/rush-mode
router.post('/:userId/rush-mode', (req, res) => {
  const bestOutfit = outfits[0] || {
    id: uuidv4(),
    itemIds: ['item-1', 'item-2', 'item-6'],
    occasion: 'office',
    aiExplanation: 'AI picked your most liked items. Quick, professional, ready to go!',
    status: 'liked'
  };
  res.json({ outfit: bestOutfit });
});

// POST /api/outfits/:userId/:outfitId/action
router.post('/:userId/:outfitId/action', (req, res) => {
  const { action, tags, collectionId } = req.body;
  const validActions = ['like', 'skip', 'save'];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }
  const statusMap = { like: 'liked', skip: 'skipped', save: 'saved' };
  const outfit = outfits.find(o => o.id === req.params.outfitId);
  if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
  outfit.status = statusMap[action];
  if (tags && Array.isArray(tags)) outfit.tags = [...(outfit.tags || []), ...tags];
  if (collectionId) outfit.collectionId = collectionId;
  res.json(outfit);
});

// GET /api/outfits/:userId/collections
router.get('/:userId/collections', (req, res) => {
  const userCollections = collections.filter(c => c.userId === req.params.userId);
  res.json({ collections: userCollections });
});

// POST /api/outfits/:userId/collections
router.post('/:userId/collections', async (req, res) => {
  const { name, icon } = req.body;
  const newCollection = { id: uuidv4(), userId: req.params.userId, name: name || 'New Collection', icon: icon || 'folder' };
  collections.push(newCollection);
  await googleSheets.createCollection(newCollection).catch(err => console.error('Sheets sync:', err.message));
  res.status(201).json(newCollection);
});

// GET /api/outfits/:userId/favorites
router.get('/:userId/favorites', (req, res) => {
  const favs = outfits.filter(o => o.status === 'liked' || o.status === 'saved');
  res.json({ outfits: favs });
});

module.exports = router;
