import React from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../../../images/airtel_logo.png';
import vesteLogo from '../../../images/Veste.money logo.png';
import airtelSplash from '../../../images/airtel_splash.png';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="splash-page">
      {/* Splash background image */}
      <div className="splash-hero-image" style={{ backgroundImage: `url(${airtelSplash})` }}></div>

      {/* Splash bottom wave card */}
      <div className="splash-bottom-card">
        <div className="splash-brand">
          <img src={airtelLogo} alt="Airtel logo" className="splash-logo" />
        </div>

        <div className="text-red-500 font-extrabold text-2xl"><h2 style={{ color: 'red' }}>Trade Market</h2></div>

        <button className="splash-signup-btn" onClick={() => navigate('/login')}>
          Sign up
        </button>

        {/* Horizontal input placeholder matching the screenshot */}
        <button className="splash-input-placeholder" onClick={() => navigate('/login')}>Create Account</button>

        <div className="splash-powered-by">
          <span className="text-black" >By Continuing, you agree to the Terms of Service and Privacy Policy</span>
        </div>

        <div className="splash-powered-by">
          <span>Powered by</span>
          <img src={vesteLogo} alt="Veste logo" className="splash-powered-logo" />
        </div>
      </div>
    </div>
  );
}
