const express = require('express');
const router = express.Router();
const { MOCK_OCCASIONS } = require('../data/mockData');

// GET /api/occasions
router.get('/', (req, res) => {
  const sorted = [...MOCK_OCCASIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  res.json({ occasions: sorted });
});

module.exports = router;
