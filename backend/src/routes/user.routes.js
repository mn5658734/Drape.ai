const express = require('express');
const router = express.Router();
const { MOCK_USERS } = require('../data/mockData');

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = MOCK_USERS.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  const { name, gender, ageRange, preferredStyle, skinTone, facePhotos, location } = req.body;
  const user = MOCK_USERS.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const updated = {
    ...user,
    ...(name && { name }),
    ...(gender && { gender }),
    ...(ageRange && { ageRange }),
    ...(preferredStyle && { preferredStyle }),
    ...(skinTone && { skinTone }),
    ...(facePhotos && { facePhotos }),
    ...(location && { location }),
    isProfileComplete: !!(name && gender && preferredStyle?.length)
  };
  res.json(updated);
});

// POST /api/users/:id/face-photos
router.post('/:id/face-photos', (req, res) => {
  const { photos } = req.body;
  const user = MOCK_USERS.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, facePhotos: photos || [] });
});

// GET /api/users/:id/favorite-outfits
router.get('/:id/favorite-outfits', (req, res) => {
  res.json({ outfits: [] });
});

module.exports = router;
