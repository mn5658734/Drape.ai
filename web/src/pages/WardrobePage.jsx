import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get, uploadPhoto } from '../api';

export default function WardrobePage() {
  const { user } = useApp();
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('t-shirt');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [current, setCurrent] = useState(0);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  const effectiveCategory = category === 'other' ? (customCategory.trim() || 'other') : category;
  const userTags = [
    ...(category === 'other' && customCategory.trim() ? [customCategory.trim()] : []),
    ...(tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
  ];
  const canSave = pendingFile && (category !== 'other' || customCategory.trim());

  const userId = user?.id || 'user-1';

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => setItems(d.items || [])).catch(() => setItems([]));
  }, [userId]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) setPendingFile(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) setPendingFile(file);
  };

  const handleSave = async () => {
    if (!pendingFile || !canSave) return;
    setUploading(true);
    try {
      const item = await uploadPhoto(userId, pendingFile, effectiveCategory, userTags);
      setItems(prev => [item, ...prev]);
      setPendingFile(null);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e) => {
    handleFileSelect(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };
  const handleDragLeave = (e) => e.currentTarget.classList.remove('dragover');

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: '#8892b0', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
      <h1 className="title">Digital Wardrobe</h1>
      <p className="subtitle">
        {items.length > 0 ? `${items.length} items` : 'Add photos of your dresses and tag them to build your wardrobe'}
      </p>

      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
        <p style={{ fontSize: 48, marginBottom: 8 }}>📷</p>
        <p style={{ color: '#8892b0', marginBottom: 12 }}>Upload photos from your device storage</p>
        <p style={{ fontSize: 12, color: '#8892b0', marginBottom: 16 }}>Choose from gallery, photos, or files • JPG, PNG up to 10MB</p>
        <button
          type="button"
          className="btn"
          onClick={() => fileRef.current?.click()}
          style={{ maxWidth: 280 }}
        >
          Choose photos from device
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#8892b0' }}>Category:</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); if (e.target.value !== 'other') setCustomCategory(''); }}
          className="input"
          style={{ width: '100%', marginBottom: 0, minHeight: 48 }}
        >
          <option value="t-shirt">T-shirt</option>
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="jeans">Jeans</option>
          <option value="blazer">Blazer</option>
          <option value="jacket">Jacket</option>
          <option value="shoes">Shoes</option>
          <option value="dress">Dress</option>
          <option value="other">Other (custom)</option>
        </select>
      </div>
      {category === 'other' && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#8892b0' }}>Name your category (used for your preference tags):</label>
          <input
            type="text"
            placeholder="e.g. Jumpsuit, Cardigan, Sneakers"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="input"
          />
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#8892b0' }}>Tags (comma-separated, e.g. office, casual, summer):</label>
        <input
          type="text"
          placeholder="e.g. office, casual, favourite"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input"
        />
      </div>

      {pendingFile && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 8 }}>
            Selected: {pendingFile.name}
            <button type="button" onClick={() => setPendingFile(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: 12 }}>Remove</button>
          </p>
        </div>
      )}

      <button
        type="button"
        className="btn"
        onClick={handleSave}
        disabled={!canSave || uploading}
        style={{ marginBottom: 24 }}
      >
        {uploading ? 'Saving...' : 'Save to wardrobe'}
      </button>

      {items.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Your wardrobe</h2>
          <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 16 }}>Swipe to browse</p>
          <div
            ref={scrollRef}
            className="wardrobe-carousel"
            onScroll={(e) => {
              const el = e.target;
              const cardWidth = 280 + 24;
              const idx = Math.round(el.scrollLeft / cardWidth);
              setCurrent(Math.min(Math.max(0, idx), items.length - 1));
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
                <div style={{ padding: 16, aspectRatio: '3/4', background: '#16213e' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { scrollRef.current?.scrollBy({ left: -304, behavior: 'smooth' }); setCurrent(Math.max(0, current - 1)); }}
              disabled={current === 0}
            >
              ← Prev
            </button>
            <span style={{ alignSelf: 'center', color: '#8892b0', fontSize: 14 }}>{current + 1} / {items.length}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { scrollRef.current?.scrollBy({ left: 304, behavior: 'smooth' }); setCurrent(Math.min(items.length - 1, current + 1)); }}
              disabled={current >= items.length - 1}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
