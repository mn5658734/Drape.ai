import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { post } from '../api';

export default function LoginPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    const p = phone.replace(/\D/g, '');
    if (p.length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await post('/auth/send-otp', { phone: p.startsWith('91') ? `+${p}` : `+91${p}` });
      setStep('otp');
    } catch (e) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      setError('Enter the 4-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const p = phone.replace(/\D/g, '');
      const phoneFormatted = p.startsWith('91') ? `+${p}` : `+91${p}`;
      const res = await post('/auth/verify-otp', { phone: phoneFormatted, otp, name: name.trim() });
      setUser({
        id: res.user?.id || 'user-1',
        phone: res.user?.phone || phoneFormatted,
        name: res.user?.name || name.trim() || 'User',
        isProfileComplete: res.user?.isProfileComplete ?? false,
      });
      navigate(res.user?.isProfileComplete ? '/' : '/profile-setup');
    } catch (e) {
      setError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-logo">
        <video autoPlay loop muted playsInline>
          <source src="/logo.mp4" type="video/mp4" />
        </video>
      </div>

      <h1 className="title">Welcome to DRIP</h1>
      <p className="subtitle">Sign in with your phone number</p>

      {error && <p style={{ color: '#e94560', marginBottom: 16, fontSize: 14 }}>{error}</p>}

      {step === 'phone' ? (
        <>
          <input
            className="input"
            type="tel"
            placeholder="Phone: +91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            className="input"
            type="tel"
            placeholder="Phone: +91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled
          />
          <input
            className="input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button className="btn" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <span className="link" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>Change number</span>
        </>
      )}
    </div>
  );
}
