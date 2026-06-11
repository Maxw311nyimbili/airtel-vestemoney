import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../Icons';

export default function GuestLock({ title, message }) {
  const navigate = useNavigate();
  return (
    <div className="guest-lock">
      <div className="guest-lock-icon"><Icons.Lock /></div>
      <h2 className="guest-lock-title">{title}</h2>
      <p className="guest-lock-message">{message}</p>
      <button className="guest-lock-btn" onClick={() => navigate('/login')}>
        Sign In
      </button>
    </div>
  );
}
