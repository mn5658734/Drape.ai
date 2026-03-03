import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get, post, uploadPhoto } from '../api';

const OCCASIONS = [
  { key: 'office', label: 'Office' },
  { key: 'party', label: 'Party' },
  { key: 'dating', label: 'Dating' },
  { key: 'trip', label: 'Trip' },
  { key: 'casual_hangout', label: 'Casual' },
  { key: 'interview', label: 'Interview' },
  { key: 'wedding', label: 'Wedding' },
  { key: 'gym', label: 'Gym' },
  { key: 'beach', label: 'Beach' },
  { key: 'brunch', label: 'Brunch' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'date_night', label: 'Date Night' },
  { key: 'family_gathering', label: 'Family Gathering' },
  { key: 'conference', label: 'Conference' },
  { key: 'outing', label: 'Outing' },
  { key: 'festival', label: 'Festival' },
  { key: 'formal_dinner', label: 'Formal Dinner' },
  { key: 'picnic', label: 'Picnic' },
  { key: 'travel', label: 'Travel' },
];

const DAY_NIGHT = [
  { key: 'day', label: 'Day' },
  { key: 'night', label: 'Night' },
];

const HAIR_MALE = [
  { key: 'short', label: 'Short' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' },
  { key: 'bald', label: 'Bald' },
  { key: 'slicked_back', label: 'Slicked back' },
  { key: 'messy', label: 'Messy' },
  { key: 'ponytail', label: 'Ponytail' },
];

const HAIR_FEMALE = [
  { key: 'short', label: 'Short' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' },
  { key: 'updo', label: 'Updo' },
  { key: 'ponytail', label: 'Ponytail' },
  { key: 'braid', label: 'Braid' },
  { key: 'loose', label: 'Loose' },
  { key: 'bun', label: 'Bun' },
];

const SLEEVE = [
  { key: 'full', label: 'Full sleeve' },
  { key: 'half', label: 'Half sleeve' },
  { key: 'sleeveless', label: 'Sleeveless' },
];

const SHOE_FEMALE = [
  { key: 'heel', label: 'Heel' },
  { key: 'flat', label: 'Flat' },
  { key: 'sneakers', label: 'Sneakers' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'half_shoes', label: 'Half shoes' },
];

const FOOTER_TABS = [
  { key: 'home', label: 'HOME', icon: '🧥' },
  { key: 'wardrobe', label: 'WARDROBE', icon: '👗' },
  { key: 'declutter', label: 'DECLUTTER', icon: '♻️' },
  { key: 'profile', label: 'PROFILE', icon: '👤' },
];

export default function DashboardPage() {
  const { user, setUser, selectedOccasion, setSelectedOccasion, outfitPrefs, setOutfitPrefs } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const isFemale = user?.gender === 'female';
  const [weather, setWeather] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedForDonate, setSelectedForDonate] = useState([]);
  const [current, setCurrent] = useState(0);
  const [declutterScheduled, setDeclutterScheduled] = useState(false);

  // Add clothes form state
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('t-shirt');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  const userId = user?.id || 'user-1';
  const effectiveCategory = category === 'other' ? (customCategory.trim() || 'other') : category;
  const userTags = [
    ...(category === 'other' && customCategory.trim() ? [customCategory.trim()] : []),
    ...(tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
  ];
  const canSave = pendingFiles.length > 0 && (category !== 'other' || customCategory.trim());

  useEffect(() => {
    get('/weather?city=Mumbai').then(setWeather).catch(() => setWeather({ temperature: 24, condition: 'Sunny' }));
  }, []);

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => setItems(d.items || [])).catch(() => setItems([]));
  }, [userId]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length) setPendingFiles(files);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
  };

  const handleSave = async () => {
    if (!pendingFiles.length || !canSave) return;
    setUploading(true);
    try {
      for (const file of pendingFiles) {
        const item = await uploadPhoto(userId, file, effectiveCategory, userTags);
        setItems(prev => [item, ...prev]);
      }
      setPendingFiles([]);
      setTab('wardrobe');
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleDonateSelect = (id) => {
    setSelectedForDonate(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSchedulePickup = () => {
    post('/donate/schedule', { userId, itemIds: selectedForDonate, partnerId: 'ngo-1' })
      .then(() => setDeclutterScheduled(true))
      .catch(() => setDeclutterScheduled(true));
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (declutterScheduled) {
    return (
      <div className="container">
        <p style={{ fontSize: 64, textAlign: 'center', marginTop: 80 }}>❤️</p>
        <h1 className="title" style={{ textAlign: 'center' }}>Pickup Scheduled!</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>You helped someone today. Tentative pickup: Tomorrow 10 AM</p>
        <button className="btn" onClick={() => setDeclutterScheduled(false)}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="container">
      {tab !== 'home' && (
        <h1 className="title" style={{ marginBottom: 24 }}>
          {tab === 'wardrobe' && 'Wardrobe'}
          {tab === 'declutter' && 'Declutter'}
          {tab === 'profile' && 'Profile'}
        </h1>
      )}
      {tab === 'home' && (
        <>
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
        </>
      )}

      <div className="card" style={{ minHeight: 200, marginBottom: 80 }}>
        {tab === 'home' && (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Digital wardrobe</h2>
            <p style={{ color: '#8892b0', marginBottom: 16 }}>{items.length} items</p>
            {items.length === 0 ? (
              <div className="upload-zone" style={{ marginBottom: 0, cursor: 'pointer' }} onClick={() => setTab('wardrobe')}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>👗</p>
                <p style={{ color: '#8892b0' }}>No clothes yet. Tap to add photos.</p>
              </div>
            ) : (
              <div
                ref={scrollRef}
                className="wardrobe-carousel"
                onScroll={(e) => {
                  const el = e.target;
                  const cardWidth = 200 + 16;
                  const idx = Math.round(el.scrollLeft / cardWidth);
                  setCurrent(Math.min(Math.max(0, idx), items.length - 1));
                }}
                style={{
                  display: 'flex',
                  gap: 16,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  padding: '8px 0',
                  marginBottom: 24,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      flex: '0 0 200px',
                      scrollSnapAlign: 'center',
                      background: '#16213e',
                      borderRadius: 12,
                      overflow: 'hidden',
                      transform: i === current ? 'scale(1.02)' : 'scale(0.98)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div style={{ aspectRatio: '3/4', background: '#0f0f23' }}>
                      <img src={item.imageUrl} alt={item.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{item.category}</p>
                      <p style={{ fontSize: 12, color: '#8892b0' }}>{item.tags?.join(', ') || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid #16213e', paddingTop: 24, marginTop: 24 }}>
              <p style={{ marginBottom: 8, color: '#8892b0', fontWeight: 600 }}>Occasion</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {OCCASIONS.map(o => (
                  <span
                    key={o.key}
                    className={`chip ${selectedOccasion === o.key ? 'active' : ''}`}
                    onClick={() => setSelectedOccasion(o.key)}
                  >
                    {o.label}
                  </span>
                ))}
              </div>

              <p style={{ marginBottom: 8, color: '#8892b0', fontWeight: 600 }}>Day or Night?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {DAY_NIGHT.map(d => (
                  <span
                    key={d.key}
                    className={`chip ${outfitPrefs.dayNight === d.key ? 'active' : ''}`}
                    onClick={() => setOutfitPrefs(p => ({ ...p, dayNight: d.key }))}
                  >
                    {d.label}
                  </span>
                ))}
              </div>

              <p style={{ marginBottom: 8, color: '#8892b0', fontWeight: 600 }}>Hair style</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {(isFemale ? HAIR_FEMALE : HAIR_MALE).map(h => (
                  <span
                    key={h.key}
                    className={`chip ${outfitPrefs.hairStyle === h.key ? 'active' : ''}`}
                    onClick={() => setOutfitPrefs(p => ({ ...p, hairStyle: h.key }))}
                  >
                    {h.label}
                  </span>
                ))}
              </div>

              <p style={{ marginBottom: 8, color: '#8892b0', fontWeight: 600 }}>Sleeve preference</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {SLEEVE.map(s => (
                  <span
                    key={s.key}
                    className={`chip ${outfitPrefs.sleeveType === s.key ? 'active' : ''}`}
                    onClick={() => setOutfitPrefs(p => ({ ...p, sleeveType: s.key }))}
                  >
                    {s.label}
                  </span>
                ))}
              </div>

              {isFemale && (
                <>
                  <p style={{ marginBottom: 8, color: '#8892b0', fontWeight: 600 }}>Shoe type</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SHOE_FEMALE.map(s => (
                      <span
                        key={s.key}
                        className={`chip ${outfitPrefs.shoeType === s.key ? 'active' : ''}`}
                        onClick={() => setOutfitPrefs(p => ({ ...p, shoeType: s.key }))}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {tab === 'wardrobe' && (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Your wardrobe</h2>
            <p style={{ color: '#8892b0', marginBottom: 16 }}>{items.length} items</p>
            {items.length === 0 ? (
              <p style={{ color: '#8892b0', marginBottom: 16 }}>No clothes yet. Select photos from your device below.</p>
            ) : (
              <div
                ref={scrollRef}
                className="wardrobe-carousel"
                onScroll={(e) => {
                  const el = e.target;
                  const cardWidth = 200 + 16;
                  const idx = Math.round(el.scrollLeft / cardWidth);
                  setCurrent(Math.min(Math.max(0, idx), items.length - 1));
                }}
                style={{
                  display: 'flex',
                  gap: 16,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  padding: '8px 0',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      flex: '0 0 200px',
                      scrollSnapAlign: 'center',
                      background: '#16213e',
                      borderRadius: 12,
                      overflow: 'hidden',
                      transform: i === current ? 'scale(1.02)' : 'scale(0.98)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div style={{ aspectRatio: '3/4', background: '#0f0f23' }}>
                      <img src={item.imageUrl} alt={item.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{item.category}</p>
                      <p style={{ fontSize: 12, color: '#8892b0' }}>{item.tags?.join(', ') || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              className="upload-zone"
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e)} style={{ display: 'none' }} />
              <p style={{ fontSize: 32, marginBottom: 8 }}>📷</p>
              <p style={{ color: '#8892b0', marginBottom: 8 }}>Select photos from device</p>
              <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()} style={{ maxWidth: 240 }}>
                Choose photos from device
              </button>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#8892b0' }}>Category:</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); if (e.target.value !== 'other') setCustomCategory(''); }} className="input" style={{ width: '100%', marginBottom: 12 }}>
                <option value="t-shirt">T-shirt</option>
                <option value="shirt">Shirt</option>
                <option value="pants">Pants</option>
                <option value="jeans">Jeans</option>
                <option value="dress">Dress</option>
                <option value="other">Other (custom)</option>
              </select>
              {category === 'other' && (
                <input className="input" placeholder="Name your category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ marginBottom: 12 }} />
              )}
              <input className="input" placeholder="Tags (e.g. office, casual)" value={tags} onChange={(e) => setTags(e.target.value)} style={{ marginBottom: 12 }} />
              {pendingFiles.length > 0 && <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 8 }}>Selected: {pendingFiles.length} photo(s)</p>}
              <button className="btn" onClick={handleSave} disabled={!canSave || uploading}>
                {uploading ? 'Saving...' : 'Save to wardrobe'}
              </button>
            </div>
          </>
        )}

        {tab === 'declutter' && (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Select items to donate</h2>
            <p style={{ color: '#8892b0', marginBottom: 16 }}>Choose photos from carousel. We'll schedule a pickup.</p>
            {items.length === 0 ? (
              <p style={{ color: '#8892b0' }}>No clothes in wardrobe. Add clothes first.</p>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="wardrobe-carousel"
                  style={{
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    padding: '8px 0',
                    marginBottom: 24,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => toggleDonateSelect(item.id)}
                      style={{
                        flex: '0 0 200px',
                        scrollSnapAlign: 'center',
                        background: selectedForDonate.includes(item.id) ? 'rgba(233,69,96,0.2)' : '#16213e',
                        borderRadius: 12,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedForDonate.includes(item.id) ? '2px solid #e94560' : '2px solid transparent',
                      }}
                    >
                      <div style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="radio" checked={selectedForDonate.includes(item.id)} readOnly style={{ accentColor: '#e94560' }} />
                        <span style={{ fontSize: 12, color: '#8892b0' }}>Select</span>
                      </div>
                      <div style={{ aspectRatio: '3/4', background: '#0f0f23' }}>
                        <img src={item.imageUrl} alt={item.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 8 }}>
                        <p style={{ fontSize: 14 }}>{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn"
                  onClick={handleSchedulePickup}
                  disabled={selectedForDonate.length === 0}
                >
                  Schedule Pickup ({selectedForDonate.length} selected)
                </button>
              </>
            )}
          </>
        )}

        {tab === 'profile' && (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Profile</h2>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#8892b0' }}>Name</p>
              <p style={{ marginTop: 4 }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: 12, color: '#8892b0', marginTop: 12 }}>Phone</p>
              <p style={{ marginTop: 4 }}>{user?.phone || '+91 98765 43210'}</p>
            </div>
            <Link to="/profile" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Full Profile
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: 12 }}>
              Log out
            </button>
          </>
        )}
      </div>

      <footer className="app-footer">
        {FOOTER_TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`footer-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span className="footer-icon">{t.icon}</span>
            <span className="footer-label">{t.label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}
