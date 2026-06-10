import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';

export default function SettingsPage({ userName, phoneNumber, onLogout, showToast }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(false);
    navigate('/');
  };

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>

      {/* ── Header ── */}
      <div className="pf-header">
        <span className="pf-header-title">Settings</span>
      </div>

      <div className="stg-wrapper">

        {/* ── Profile card ── */}
        <div className="stg-profile-card">
          <div className="stg-avatar">
            <Icons.User />
          </div>
          <div className="stg-profile-info">
            <span className="stg-name">{userName}</span>
            <span className="stg-phone">+260 {phoneNumber}</span>
          </div>
        </div>

        {/* ── Account section ── */}
        <p className="pf-section-label">Account</p>
        <div className="stg-section">
          <div className="stg-row" onClick={() => showToast('Profile editing coming soon')}>
            <div className="stg-row-icon">
              <Icons.User />
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">Edit Profile</span>
              <span className="stg-row-sub">Name, phone number</span>
            </div>
            <Icons.ChevronRight />
          </div>

          <div className="stg-row" onClick={() => showToast('Security settings coming soon')}>
            <div className="stg-row-icon">
              <Icons.Lock />
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">Security & PIN</span>
              <span className="stg-row-sub">Change your login PIN</span>
            </div>
            <Icons.ChevronRight />
          </div>
        </div>

        {/* ── About section ── */}
        <p className="pf-section-label">About</p>
        <div className="stg-section">
          <div className="stg-row stg-row-static">
            <div className="stg-row-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">App Version</span>
              <span className="stg-row-sub">1.0.0 · Powered by Veste Money</span>
            </div>
          </div>
        </div>

        {/* ── Logout button ── */}
        <div className="stg-logout-area">
          <button className="stg-logout-btn" onClick={handleLogout}>
            <Icons.LogOut />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
