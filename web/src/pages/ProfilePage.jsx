import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user } = useApp();

  return (
    <div className="container">
      <h1 className="title">Profile</h1>

      <div className="card">
        <p style={{ fontSize: 12, color: '#8892b0' }}>Name</p>
        <p style={{ marginTop: 4 }}>{user?.name || 'User'}</p>
        <p style={{ fontSize: 12, color: '#8892b0', marginTop: 12 }}>Phone</p>
        <p style={{ marginTop: 4 }}>{user?.phone || '+91 98765 43210'}</p>
      </div>

      <div className="card" style={{ cursor: 'pointer' }}>Edit Profile</div>
      <div className="card" style={{ cursor: 'pointer' }}>Style Preference</div>
      <div className="card" style={{ cursor: 'pointer' }}>Favourite Outfits</div>
      <div className="card" style={{ opacity: 0.7 }}>Payments — Coming Soon</div>
    </div>
  );
}
