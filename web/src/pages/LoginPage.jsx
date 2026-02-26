import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');

  const handleSendOtp = () => setStep('otp');
  const handleVerify = () => {
    setUser({ id: 'user-1', phone, name: name.trim() || 'User', isProfileComplete: false });
    navigate('/profile-setup');
  };

  const handleTryDemo = () => {
    setUser({ id: 'user-1', phone: '+919876543210', name: 'Demo User', isProfileComplete: true });
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to Drape.ai</h1>
      <p className="subtitle">Sign in with your phone number</p>

      <button className="btn btn-secondary" onClick={handleTryDemo} style={{ marginBottom: 24 }}>
        Try demo (explore prototype)
      </button>

      {step === 'phone' ? (
        <>
          <input className="input" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="btn" onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Enter 4-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} />
          <button className="btn" onClick={handleVerify}>Verify & Continue</button>
          <span className="link" onClick={() => setStep('phone')}>Change number</span>
        </>
      )}
    </div>
  );
}
