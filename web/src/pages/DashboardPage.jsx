import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get } from '../api';

const OCCASIONS = [
  { key: 'office', label: 'Office' },
  { key: 'party', label: 'Party' },
  { key: 'dating', label: 'Dating' },
  { key: 'trip', label: 'Trip' },
  { key: 'casual_hangout', label: 'Casual' },
  { key: 'interview', label: 'Interview' },
];

export default function DashboardPage() {
  const { user, selectedOccasion, setSelectedOccasion } = useApp();
  const [weather, setWeather] = useState(null);
  const [wardrobeCount, setWardrobeCount] = useState(null);

  const userId = user?.id || 'user-1';

  useEffect(() => {
    get('/weather?city=Mumbai').then(setWeather).catch(() => setWeather({ temperature: 24, condition: 'Sunny' }));
  }, []);

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => setWardrobeCount((d.items || []).length)).catch(() => setWardrobeCount(0));
  }, [userId]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="title" style={{ marginBottom: 0 }}>{greeting()} {user?.name || 'User'} ☀️</h1>
        {weather && (
          <div className="card" style={{ padding: 12, marginBottom: 0 }}>
            <div>{weather.temperature}°C</div>
            <div style={{ fontSize: 12, color: '#8892b0' }}>{weather.condition}</div>
          </div>
        )}
      </div>

      <Link to="/rush-mode" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 24, background: '#e94560' }}>
        <h2 style={{ fontSize: 20 }}>🔥 I'm Getting Late!</h2>
        <p style={{ fontSize: 14, opacity: 0.9 }}>AI picks best outfit in 3 sec</p>
      </Link>

      <div style={{ marginBottom: 16 }}>
        <p style={{ marginBottom: 8, color: '#8892b0' }}>What's the Occasion?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {OCCASIONS.map(o => (
            <span
              key={o.key}
              className={`chip ${selectedOccasion === o.key ? 'active' : ''}`}
              onClick={() => setSelectedOccasion(o.key)}
            >{o.label}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        <Link
          to={wardrobeCount > 0 ? '/outfit-swipe' : '/wardrobe'}
          className="card"
          style={{ display: 'block', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 24 }}
        >
          <p style={{ fontSize: 40, marginBottom: 8 }}>👗</p>
          <h3>Choose from wardrobe</h3>
          <p style={{ color: '#8892b0', marginTop: 4, fontSize: 14 }}>
            {wardrobeCount > 0
              ? `AI suggests from your ${wardrobeCount} items (tags & occasion)`
              : 'Add clothes first – your wardrobe is empty'}
          </p>
        </Link>
        <Link to="/wardrobe-view" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 24 }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>🖼️</p>
          <h3>Show wardrobe</h3>
          <p style={{ color: '#8892b0', marginTop: 4, fontSize: 14 }}>
            View your dress photos in carousel mode
          </p>
        </Link>
        <Link to="/wardrobe" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 24 }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>➕</p>
          <h3>Add clothes</h3>
          <p style={{ color: '#8892b0', marginTop: 4, fontSize: 14 }}>Upload photos – AI classifies by tag/LLM</p>
        </Link>
      </div>

      <div className="nav" style={{ marginTop: 0 }}>
        <Link to="/wardrobe">➕ Add Clothes</Link>
        <Link to="/wardrobe-view">🖼️ Show Wardrobe</Link>
        <Link to="/donate">♻️ Declutter</Link>
        <Link to="/profile">👤 Profile</Link>
      </div>
    </div>
  );
}
