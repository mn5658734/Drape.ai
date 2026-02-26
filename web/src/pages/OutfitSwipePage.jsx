import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { get, post } from '../api';

export default function OutfitSwipePage() {
  const { selectedOccasion } = useApp();
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    get(`/outfits/user-1/suggestions?occasion=${selectedOccasion || 'office'}`)
      .then(d => setOutfits(d.outfits || []))
      .catch(() => setOutfits([{ id: '1', aiExplanation: 'Blue shirt + navy pants. Professional look.', itemIds: [] }]));
  }, [selectedOccasion]);

  const outfit = outfits[current];

  const handleAction = (action) => {
    if (outfit) post(`/outfits/user-1/${outfit.id}/action`, { action }).catch(() => {});
    setCurrent(prev => prev + 1);
    if (current >= outfits.length - 1) navigate('/');
  };

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
