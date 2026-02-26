import { useState, useEffect } from 'react';
import { get, post } from '../api';

export default function DonatePage() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    get('/donate/partners').then(d => setPartners(d.partners || [])).catch(() => setPartners([{ id: 'ngo-1', name: 'Goonj', city: 'Mumbai' }]));
  }, []);

  const handleSchedule = () => {
    post('/donate/schedule', { userId: 'user-1', itemIds: ['item-1'], partnerId: selected || 'ngo-1' })
      .then(() => setScheduled(true))
      .catch(() => setScheduled(true));
  };

  if (scheduled) {
    return (
      <div className="container">
        <p style={{ fontSize: 64, textAlign: 'center', marginTop: 80 }}>❤️</p>
        <h1 className="title" style={{ textAlign: 'center' }}>Pickup Scheduled!</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>You helped someone today. Tentative pickup: Tomorrow 10 AM</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Declutter & Donate</h1>
      <p className="subtitle">Select items from your wardrobe to donate. We'll schedule a pickup.</p>

      <p style={{ marginBottom: 12, color: '#8892b0' }}>Select NGO Partner</p>
      {partners.map(p => (
        <div key={p.id} className={`card ${selected === p.id ? 'active' : ''}`} style={{ cursor: 'pointer', border: selected === p.id ? '2px solid #e94560' : 'none' }} onClick={() => setSelected(p.id)}>
          <strong>{p.name}</strong>
          <p style={{ fontSize: 14, color: '#8892b0', marginTop: 4 }}>{p.city}</p>
        </div>
      ))}

      <button className="btn" onClick={handleSchedule} style={{ marginTop: 24 }}>Schedule Pickup</button>
    </div>
  );
}
