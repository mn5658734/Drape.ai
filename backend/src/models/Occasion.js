const mongoose = require('mongoose');

const occasionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Occasion', occasionSchema);
