import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get, post } from '../api';

export default function OutfitSwipePage() {
  const { user, selectedOccasion } = useApp();
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState([]);
  const [current, setCurrent] = useState(0);
  const [wardrobeEmpty, setWardrobeEmpty] = useState(false);

  const userId = user?.id || 'user-1';

  useEffect(() => {
    get(`/wardrobe/${userId}`).then(d => {
      const items = d.items || [];
      setWardrobeEmpty(items.length === 0);
    }).catch(() => setWardrobeEmpty(true));
  }, [userId]);

  useEffect(() => {
    if (wardrobeEmpty) return;
    get(`/outfits/${userId}/suggestions?occasion=${selectedOccasion || 'office'}&source=wardrobe`)
      .then(d => setOutfits(d.outfits || []))
      .catch(() => setOutfits([{ id: '1', aiExplanation: 'Blue shirt + navy pants. Professional look.', itemIds: [] }]));
  }, [selectedOccasion, userId, wardrobeEmpty]);

  const outfit = outfits[current];

  const handleAction = (action) => {
    if (outfit) post(`/outfits/${userId}/${outfit.id}/action`, { action }).catch(() => {});
    setCurrent(prev => prev + 1);
    if (current >= outfits.length - 1) navigate('/');
  };

  if (wardrobeEmpty) {
    return (
      <div className="container">
        <div style={{ marginBottom: 16 }}>
          <Link to="/" style={{ color: '#8892b0', fontSize: 14 }}>← Back to Dashboard</Link>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ fontSize: 64, marginBottom: 16 }}>👗</p>
          <h2 style={{ marginBottom: 8 }}>Your wardrobe is empty</h2>
          <p style={{ color: '#8892b0', marginBottom: 24 }}>Add clothes first to get AI outfit suggestions from your wardrobe.</p>
          <Link to="/wardrobe" className="btn">Add clothes</Link>
        </div>
      </div>
    );
  }

  if (!outfit) return <div className="container"><p>Loading...</p></div>;

  const goToShopping = () => navigate(`/shopping?outfitId=${outfit.id}&occasion=${selectedOccasion || 'office'}`);

  return (
    <div className="container">
      <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        <button
          onClick={goToShopping}
          style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}
          title="Shopping recommendations"
        >
          🛍 Shop similar
        </button>
        <img src="https://picsum.photos/seed/outfit/400/500" alt="Outfit" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <p style={{ color: '#8892b0' }}>{outfit.aiExplanation}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={() => handleAction('skip')}>👎 Skip</button>
        <button className="btn btn-secondary" onClick={() => handleAction('save')}>🔁 Save</button>
        <button className="btn" onClick={() => handleAction('like')}>❤️ Like</button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, color: '#8892b0' }}>{current + 1} / {outfits.length}</p>
    </div>
  );
}
