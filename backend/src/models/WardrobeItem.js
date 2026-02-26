const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  category: {
    type: String,
    enum: [
      'shirt', 't-shirt', 'pants', 'jeans', 'kurta', 'saree', 'blazer', 'jacket',
      'vest', 'skirt', 'shorts', 'swimwear', 'shoes', 'sneakers', 'heels',
      'accessories', 'innerwear', 'dress', 'top', 'sweater', 'coat'
    ],
    required: true
  },
  tags: [{
    type: String,
    enum: [
      'favourite', 'anniversary', 'office_wear', 'party_wear', 'travel_wear',
      'summer', 'winter', 'ethnic', 'casual', 'formal', 'monsoon'
    ]
  }],
  color: { type: String },
  pattern: { type: String },
  source: {
    platform: { type: String, enum: ['myntra', 'flipkart', 'amazon', 'ajio', 'meesho', 'other'] },
    productUrl: String,
    productId: String
  },
  isDonated: { type: Boolean, default: false },
  donatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WardrobeItem', wardrobeItemSchema);
