import React from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../images/airtel_logo.png';
import vesteLogo from '../images/Veste.money logo.png';
import heroImage from '../images/img-1.jpg';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <img src={airtelLogo} alt="Airtel logo" className="landing-logo-icon" />
        </div>
        <nav className="landing-nav">
          <button className="landing-nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="landing-nav-link" onClick={() => navigate('/market')}>Features</button>
          <button className="landing-nav-link" onClick={() => navigate('/dividend')}>Support</button>
          <button className="landing-login-link" onClick={() => navigate('/login')}>
            Login
          </button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-copy">
          <span className="hero-eyebrow">Airtel Money Zambia</span>
          <h1 className="hero-title">A modern investment experience for every wallet.</h1>
          <p className="hero-description">
            Manage your savings, monitor market moves, and track dividend growth with one secure Airtel Money dashboard. All in a clean, fast interface designed for Zambian investors.
          </p>

          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={() => navigate('/login')}>
              Get Started
            </button>
            <button className="hero-secondary-btn" onClick={() => navigate('/login')}>
              Open Wallet
            </button>
          </div>
        </section>

        <section className="hero-visual">
          <div className="hero-image-frame">
            <img src={heroImage} alt="Airtel Money dashboard preview" className="hero-image" />
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span className="footer-terms">Terms and conditions apply.</span>
        <div className="footer-powered-by">
          <span>Powered by</span>
          <img src={vesteLogo} alt="Veste logo" className="footer-powered-by-logo" />
        </div>
      </footer>
    </div>
  );
}
