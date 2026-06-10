import React from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../../../images/airtel_logo.png';
import vesteLogo from '../../../images/Veste.money logo.png';
import './LandingPage.css';

export default function LandingPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleGuestContinue = () => {
    if (setIsLoggedIn) setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="splash-page">

      {/* ── Hero ── */}
      <div className="splash-hero">
        <div className="splash-hero-bg" />

        {/* Logos at top */}
        <div className="splash-logos">
          <img src={airtelLogo} alt="Airtel" className="splash-logo-airtel" />
          <div className="splash-logo-divider" />
          <img src={vesteLogo} alt="Veste Money" className="splash-logo-veste" />
        </div>

        {/* Hero image placeholder — swap src for your own photo */}
        <div className="splash-image-area">
          {/* Replace the div below with: <img src={yourImage} alt="..." className="splash-hero-img" /> */}
          <div className="splash-hero-img-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Add your image here</span>
          </div>
        </div>
      </div>

      {/* ── Bottom card ── */}
      <div className="splash-bottom-card">
        <div className="splash-card-handle" />

        <h1 className="splash-title">Airtel Invest</h1>
        <p className="splash-subtitle">
          Buy shares on the Lusaka Stock Exchange and grow your wealth — directly from your Airtel Money.
        </p>

        <div className="splash-actions">
          <button className="splash-btn-primary" onClick={() => navigate('/login')}>
            Get Started
          </button>
          <button className="splash-btn-outline" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>

        <button className="splash-btn-ghost" onClick={handleGuestContinue}>
          Continue without signing in
        </button>

        <div className="splash-footer">
          <span className="splash-terms">By continuing you agree to our Terms &amp; Privacy Policy</span>
          <div className="splash-powered">
            <span>Powered by</span>
            <img src={vesteLogo} alt="Veste" className="splash-powered-logo" />
          </div>
        </div>
      </div>

    </div>
  );
}
