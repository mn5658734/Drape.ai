const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem', required: true }],
  partnerId: { type: String },
  partnerName: { type: String },
  status: {
    type: String,
    enum: ['scheduled', 'pickup_pending', 'pickup_completed', 'cancelled'],
    default: 'scheduled'
  },
  scheduledPickupAt: { type: Date },
  pickupCompletedAt: { type: Date },
  otp: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
