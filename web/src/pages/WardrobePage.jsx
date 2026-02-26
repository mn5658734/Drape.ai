import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { get, uploadPhoto } from '../api';

export default function WardrobePage() {
  const { user } = useApp();
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('t-shirt');
  const fileRef = useRef(null);

  const userId = user?.id || 'user-1';

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => setItems(d.items || [])).catch(() => setItems([
      { id: '1', category: 'shirt', tags: ['office_wear'], imageUrl: 'https://picsum.photos/seed/shirt1/200/250' },
      { id: '2', category: 'pants', tags: ['casual'], imageUrl: 'https://picsum.photos/seed/pants1/200/250' },
      { id: '3', category: 't-shirt', tags: ['summer'], imageUrl: 'https://picsum.photos/seed/tshirt1/200/250' },
    ]));
  }, [userId]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const item = await uploadPhoto(userId, file, category);
      setItems(prev => [item, ...prev]);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      setUploading(true);
      try {
        const item = await uploadPhoto(userId, file, category);
        setItems(prev => [item, ...prev]);
      } catch (err) {
        alert(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
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
      <p className="subtitle">{items.length} items</p>

      <div
        className="upload-zone"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
        <p style={{ fontSize: 48, marginBottom: 8 }}>📷</p>
        <p style={{ color: '#8892b0', marginBottom: 8 }}>Click or drag & drop to upload photos</p>
        <p style={{ fontSize: 12, color: '#8892b0' }}>JPG, PNG up to 10MB</p>
        {uploading && <p style={{ marginTop: 12, color: '#e94560' }}>Uploading...</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8, color: '#8892b0' }}>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input" style={{ display: 'inline-block', width: 'auto', marginBottom: 0 }}>
          <option value="t-shirt">T-shirt</option>
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="jeans">Jeans</option>
          <option value="blazer">Blazer</option>
          <option value="jacket">Jacket</option>
          <option value="shoes">Shoes</option>
          <option value="dress">Dress</option>
        </select>
      </div>

      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={item.imageUrl} alt={item.category} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <div style={{ padding: 8 }}>
              <p style={{ fontSize: 14 }}>{item.category}</p>
              <p style={{ fontSize: 12, color: '#8892b0' }}>{item.tags?.join(', ') || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
