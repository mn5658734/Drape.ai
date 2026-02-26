const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const wardrobeRoutes = require('./wardrobe.routes');
const outfitRoutes = require('./outfit.routes');
const occasionRoutes = require('./occasion.routes');
const donateRoutes = require('./donate.routes');
const weatherRoutes = require('./weather.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wardrobe', wardrobeRoutes);
router.use('/outfits', outfitRoutes);
router.use('/occasions', occasionRoutes);
router.use('/donate', donateRoutes);
router.use('/weather', weatherRoutes);

module.exports = router;
