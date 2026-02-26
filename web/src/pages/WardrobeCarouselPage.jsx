import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get } from '../api';

export default function WardrobeCarouselPage() {
  const { user } = useApp();
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);

  const userId = user?.id || 'user-1';

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => setItems(d.items || [])).catch(() => setItems([]));
  }, [userId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;
    const card = el.querySelector(`[data-index="${current}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current, items.length]);

  if (items.length === 0) {
    return (
      <div className="container">
        <div style={{ marginBottom: 16 }}>
          <Link to="/" style={{ color: '#8892b0', fontSize: 14 }}>← Back to Dashboard</Link>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ fontSize: 64, marginBottom: 16 }}>👗</p>
          <h2 style={{ marginBottom: 8 }}>Your wardrobe is empty</h2>
          <p style={{ color: '#8892b0', marginBottom: 24 }}>Add clothes to see them here in carousel view.</p>
          <Link to="/wardrobe" className="btn">Add clothes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: '#8892b0', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
      <h1 className="title">My Wardrobe</h1>
      <p className="subtitle">{items.length} items • Swipe to browse</p>

      <div
        ref={scrollRef}
        className="wardrobe-carousel"
        onScroll={(e) => {
          const el = e.target;
          const cardWidth = 280 + 24;
          const idx = Math.round(el.scrollLeft / cardWidth);
          setCurrent(Math.min(idx, items.length - 1));
        }}
        style={{
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 24px',
          padding: '24px 0',
          marginBottom: 24,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            data-index={i}
            className="carousel-card"
            style={{
              flex: '0 0 280px',
              scrollSnapAlign: 'center',
              background: '#1a1a2e',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              transform: i === current ? 'scale(1.02)' : 'scale(0.95)',
              transition: 'transform 0.3s ease',
            }}
          >
            <div style={{ padding: 16, aspectRatio: '3/4', position: 'relative', background: '#16213e' }}>
              <img
                src={item.imageUrl}
                alt={item.category}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
              />
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{item.category}</p>
              <p style={{ fontSize: 12, color: '#8892b0', marginTop: 4 }}>{item.tags?.join(', ') || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav" style={{ marginBottom: 24 }}>
        <Link to="/wardrobe">➕ Add Clothes</Link>
        <Link to="/">🏠 Dashboard</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
        >
          ← Prev
        </button>
        <span style={{ alignSelf: 'center', color: '#8892b0', fontSize: 14 }}>{current + 1} / {items.length}</span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setCurrent(Math.min(items.length - 1, current + 1))}
          disabled={current >= items.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
