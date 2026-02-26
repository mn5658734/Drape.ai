import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { get } from '../api';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Blue Formal Shirt', brand: 'Peter England', price: '₹999', originalPrice: '₹1,499', platform: 'Myntra', url: 'https://www.myntra.com', image: 'https://picsum.photos/seed/shirt1/200/250', rating: 4.5 },
  { id: '2', name: 'Navy Slim Fit Trousers', brand: 'Louis Philippe', price: '₹1,299', originalPrice: '₹1,999', platform: 'Flipkart', url: 'https://www.flipkart.com', image: 'https://picsum.photos/seed/pants1/200/250', rating: 4.3 },
  { id: '3', name: 'Brown Leather Formal Shoes', brand: 'Bata', price: '₹1,499', originalPrice: '₹2,199', platform: 'Amazon', url: 'https://www.amazon.in', image: 'https://picsum.photos/seed/shoes1/200/250', rating: 4.6 },
  { id: '4', name: 'White Cotton T-Shirt', brand: 'Roadster', price: '₹499', originalPrice: '₹799', platform: 'Myntra', url: 'https://www.myntra.com', image: 'https://picsum.photos/seed/tshirt2/200/250', rating: 4.4 },
  { id: '5', name: 'Black Blazer', brand: 'Van Heusen', price: '₹2,999', originalPrice: '₹4,499', platform: 'Ajio', url: 'https://www.ajio.com', image: 'https://picsum.photos/seed/blazer2/200/250', rating: 4.5 },
];

export default function ShoppingRecommendationsPage() {
  const [searchParams] = useSearchParams();
  const outfitId = searchParams.get('outfitId');
  const occasion = searchParams.get('occasion');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    get(`/shopping/recommendations?outfitId=${outfitId || ''}&occasion=${occasion || ''}`)
      .then(d => setProducts(d.products || []))
      .catch(() => setProducts(MOCK_PRODUCTS));
  }, [outfitId, occasion]);

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/outfit-swipe" style={{ color: '#8892b0', fontSize: 14 }}>← Back to suggestions</Link>
      </div>

      <h1 className="title">🛍 Shopping Recommendations</h1>
      <p className="subtitle">Similar products from our partner stores. Tap to shop.</p>

      <div style={{ display: 'grid', gap: 16 }}>
        {products.map(p => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
            style={{ display: 'flex', gap: 16, textDecoration: 'none', color: 'inherit' }}
          >
            <img src={p.image} alt={p.name} style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</p>
              <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 4 }}>{p.brand}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#e94560', fontWeight: 600 }}>{p.price}</span>
                {p.originalPrice && <span style={{ fontSize: 12, color: '#8892b0', textDecoration: 'line-through' }}>{p.originalPrice}</span>}
              </div>
              <span style={{ fontSize: 12, background: '#16213e', padding: '4px 8px', borderRadius: 6 }}>{p.platform}</span>
              {p.rating && <span style={{ marginLeft: 8, fontSize: 12, color: '#8892b0' }}>★ {p.rating}</span>}
            </div>
            <span style={{ alignSelf: 'center', color: '#e94560' }}>→</span>
          </a>
        ))}
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: '#8892b0', textAlign: 'center' }}>
        Affiliate links. We may earn a commission when you make a purchase.
      </p>
    </div>
  );
}
