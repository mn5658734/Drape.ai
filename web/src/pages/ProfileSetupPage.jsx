import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const STYLES = ['casual', 'formal', 'ethnic', 'sporty', 'minimalist'];
const SKIN_TONES = ['fair', 'medium', 'olive', 'tan', 'brown', 'dark'];

export default function ProfileSetupPage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState([]);
  const [skinTone, setSkinTone] = useState('');

  const toggleStyle = (s) => setStyle(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleComplete = () => {
    setUser({ ...user, gender, preferredStyle: style, skinTone, isProfileComplete: true });
    navigate('/wardrobe');
  };

  return (
    <div className="container">
      <h1 className="title">Complete your profile</h1>
      <p className="subtitle">Helps AI suggest better outfits</p>

      <p style={{ marginBottom: 8, color: '#8892b0' }}>Name: {user?.name || '—'}</p>

      <p style={{ marginTop: 16, marginBottom: 8, color: '#8892b0' }}>Gender</p>
      <div style={{ marginBottom: 16 }}>
        {['male', 'female', 'other'].map(g => (
          <span key={g} className={`chip ${gender === g ? 'active' : ''}`} onClick={() => setGender(g)}>{g}</span>
        ))}
      </div>

      <p style={{ marginBottom: 8, color: '#8892b0' }}>Preferred style</p>
      <div style={{ marginBottom: 16 }}>
        {STYLES.map(s => (
          <span key={s} className={`chip ${style.includes(s) ? 'active' : ''}`} onClick={() => toggleStyle(s)}>{s}</span>
        ))}
      </div>

      <p style={{ marginBottom: 8, color: '#8892b0' }}>Skin tone (optional)</p>
      <div style={{ marginBottom: 24 }}>
        {SKIN_TONES.map(s => (
          <span key={s} className={`chip ${skinTone === s ? 'active' : ''}`} onClick={() => setSkinTone(s)}>{s}</span>
        ))}
      </div>

      <button className="btn" onClick={handleComplete}>Continue to Wardrobe</button>
    </div>
  );
}
