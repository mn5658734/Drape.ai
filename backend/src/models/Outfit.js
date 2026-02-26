const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem', required: true }],
  occasion: { type: String },
  weatherContext: {
    temperature: Number,
    humidity: Number,
    condition: String
  },
  locationContext: { type: String },
  aiExplanation: { type: String },
  status: {
    type: String,
    enum: ['suggested', 'liked', 'skipped', 'saved'],
    default: 'suggested'
  },
  compositeImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Outfit', outfitSchema);
