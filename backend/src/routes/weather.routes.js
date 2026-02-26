const express = require('express');
const router = express.Router();

// GET /api/weather?lat=&lon= or ?city=
router.get('/', (req, res) => {
  const { lat, lon, city } = req.query;
  res.json({
    temperature: 24,
    humidity: 65,
    condition: 'Partly cloudy',
    city: city || 'Mumbai',
    recommendation: 'Light layers recommended. AC might be cold indoors.'
  });
});

module.exports = router;
