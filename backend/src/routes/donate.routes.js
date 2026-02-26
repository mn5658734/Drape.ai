const express = require('express');
const router = express.Router();
const { MOCK_NGO_PARTNERS, uuidv4 } = require('../data/mockData');

// GET /api/donate/partners
router.get('/partners', (req, res) => {
  const { city } = req.query;
  let partners = MOCK_NGO_PARTNERS;
  if (city) partners = partners.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  res.json({ partners });
});

// POST /api/donate/schedule
router.post('/schedule', async (req, res) => {
  const { userId, itemIds, partnerId, scheduledPickupAt } = req.body;
  if (!userId || !itemIds?.length || !partnerId) {
    return res.status(400).json({ error: 'userId, itemIds, and partnerId are required' });
  }
  const donation = {
    id: uuidv4(),
    userId,
    itemIds,
    partnerId,
    partnerName: 'Goonj',
    status: 'scheduled',
    scheduledPickupAt: scheduledPickupAt || new Date(Date.now() + 86400000).toISOString(),
    otp: '1234',
    createdAt: new Date().toISOString()
  };
  await googleSheets.createDonation(donation).catch(err => console.error('Sheets sync:', err.message));
  res.status(201).json(donation);
});

// POST /api/donate/:donationId/confirm-pickup
router.post('/:donationId/confirm-pickup', (req, res) => {
  const { otp } = req.body;
  res.json({
    success: true,
    message: 'Pickup confirmed. You helped someone today ❤️',
    completedAt: new Date().toISOString()
  });
});

module.exports = router;
