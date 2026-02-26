const express = require('express');
const router = express.Router();
const { MOCK_USERS, uuidv4 } = require('../data/mockData');
const googleSheets = require('../services/googleSheets');

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  res.json({
    success: true,
    message: 'OTP sent successfully',
    expiresIn: 300
  });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, name } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }
  const existingUser = MOCK_USERS.find(u => u.phone === phone);
  const user = existingUser || {
    id: uuidv4(),
    phone,
    name: (name || '').trim() || '',
    isProfileComplete: false
  };
  if (name && name.trim()) user.name = name.trim();
  if (!existingUser) {
    await googleSheets.createUser(user).catch(err => console.error('Sheets sync:', err.message));
  }
  res.json({
    success: true,
    token: `mock-jwt-${user.id}`,
    user: { id: user.id, phone: user.phone, name: user.name, isProfileComplete: user.isProfileComplete }
  });
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  res.json({ success: true, token: 'mock-jwt-refreshed' });
});

module.exports = router;
