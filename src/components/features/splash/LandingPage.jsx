import React from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../../../images/airtel_logo.png';
import vesteLogo from '../../../images/optimized/veste_logo.png';
import heroImage from '../../../images/optimized/hero-1.jpg';
import './LandingPage.css';

export default function LandingPage({ setIsLoggedIn, setIsGuest }) {
  const navigate = useNavigate();

  const handleGuestContinue = () => {
    if (setIsGuest) setIsGuest(true);
    if (setIsLoggedIn) setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="splash-page">

      {/* ── Hero ── */}
      <div className="splash-hero">
        <img src={heroImage} alt="" className="splash-hero-img" />
        <div className="splash-hero-vignette" />
        <div className="splash-hero-fade" />

        {/* Brand logo at top */}
        <div className="splash-logos">
          <img src={airtelLogo} alt="Airtel" className="splash-logo-airtel" />
        </div>
      </div>

      {/* ── Bottom card ── */}
      <div className="splash-bottom-card">
        <div className="splash-card-handle" />

        <h1 className="splash-title">Airtel Invest</h1>

        <div className="splash-actions">
          <button className="splash-btn-primary" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>

        <button className="splash-btn-ghost" onClick={handleGuestContinue}>
          Continue without signing in
        </button>

        <div className="splash-footer">
          <span className="splash-terms">By continuing you agree to our Terms &amp; Privacy Policy</span>
          <div className="splash-powered">
            <span>Powered by</span>
            <img src={vesteLogo} alt="Veste Money" className="splash-powered-logo" />
          </div>
          </div>
      </div>

    </div>
  );
}
