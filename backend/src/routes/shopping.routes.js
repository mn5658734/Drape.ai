const express = require('express');
const router = express.Router();

const MOCK_RECOMMENDATIONS = [
  { id: '1', name: 'Blue Formal Shirt', brand: 'Peter England', price: '₹999', originalPrice: '₹1,499', platform: 'Myntra', url: 'https://www.myntra.com', image: 'https://picsum.photos/seed/shirt1/200/250', rating: 4.5 },
  { id: '2', name: 'Navy Slim Fit Trousers', brand: 'Louis Philippe', price: '₹1,299', originalPrice: '₹1,999', platform: 'Flipkart', url: 'https://www.flipkart.com', image: 'https://picsum.photos/seed/pants1/200/250', rating: 4.3 },
  { id: '3', name: 'Brown Leather Formal Shoes', brand: 'Bata', price: '₹1,499', originalPrice: '₹2,199', platform: 'Amazon', url: 'https://www.amazon.in', image: 'https://picsum.photos/seed/shoes1/200/250', rating: 4.6 },
  { id: '4', name: 'White Cotton T-Shirt', brand: 'Roadster', price: '₹499', originalPrice: '₹799', platform: 'Myntra', url: 'https://www.myntra.com', image: 'https://picsum.photos/seed/tshirt2/200/250', rating: 4.4 },
  { id: '5', name: 'Black Blazer', brand: 'Van Heusen', price: '₹2,999', originalPrice: '₹4,499', platform: 'Ajio', url: 'https://www.ajio.com', image: 'https://picsum.photos/seed/blazer2/200/250', rating: 4.5 },
  { id: '6', name: 'Blue Denim Jeans', brand: 'Levi\'s', price: '₹2,499', originalPrice: '₹3,999', platform: 'Meesho', url: 'https://www.meesho.com', image: 'https://picsum.photos/seed/jeans2/200/250', rating: 4.7 },
];

// GET /api/shopping/recommendations?outfitId=&occasion=
router.get('/recommendations', (req, res) => {
  const { outfitId, occasion } = req.query;
  res.json({
    products: MOCK_RECOMMENDATIONS,
    occasion: occasion || 'office',
    message: 'Similar products from our partners',
  });
});

module.exports = router;
