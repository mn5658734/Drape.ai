import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { uploadPhoto } from '../api';

export default function WardrobePage() {
  const { user } = useApp();
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('t-shirt');
  const [customCategory, setCustomCategory] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const fileRef = useRef(null);

  const effectiveCategory = category === 'other' ? (customCategory.trim() || 'other') : category;
  const userTags = category === 'other' && customCategory.trim() ? [customCategory.trim()] : [];
  const canSave = pendingFile && (category !== 'other' || customCategory.trim());

  const userId = user?.id || 'user-1';

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
      await uploadPhoto(userId, pendingFile, effectiveCategory, userTags);
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
      <h1 className="title">My Wardrobe</h1>
      <p className="subtitle">Add clothes to your wardrobe</p>

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
    </div>
  );
}
