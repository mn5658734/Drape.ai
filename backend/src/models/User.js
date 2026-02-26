const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  email: { type: String, sparse: true },
  name: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  ageRange: { type: String, enum: ['18-24', '25-34', '35-44', '45-54', '55+'] },
  preferredStyle: [{ type: String, enum: ['casual', 'formal', 'ethnic', 'sporty', 'minimalist', 'bohemian', 'classic'] }],
  skinTone: { type: String, enum: ['fair', 'medium', 'olive', 'tan', 'brown', 'dark'] },
  facePhotos: [{ type: String }],
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    coordinates: { type: [Number], default: undefined }
  },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
