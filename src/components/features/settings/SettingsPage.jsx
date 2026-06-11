import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import GuestLock from '../../shared/GuestLock';

export default function SettingsPage({ userName, phoneNumber, csdAccountNumber, tradingAccountNumber, onLogout, showToast, isGuest }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(false);
    navigate('/');
  };

  const copyValue = (label, value) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    showToast(`${label} copied`);
  };

  if (isGuest) {
    return (
      <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="pf-header">
          <span className="pf-header-title">My Account</span>
        </div>
        <GuestLock
          title="Sign in to view your account"
          message="Create an account or sign in to see your profile, CSD account, and trading account details."
        />
      </div>
    );
  }

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>

      {/* ── Header ── */}
      <div className="pf-header">
        <span className="pf-header-title">My Account</span>
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

        {/* ── LuSE trading details ── */}
        <p className="pf-section-label">LuSE Trading Details</p>
        <div className="stg-section">
          <div className="stg-row stg-row-static" onClick={() => copyValue('CSD account number', csdAccountNumber)}>
            <div className="stg-row-icon">
              <Icons.Hash />
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">CSD Account Number</span>
              <span className="stg-row-sub stg-row-mono">{csdAccountNumber}</span>
            </div>
          </div>

          <div className="stg-row stg-row-static" onClick={() => copyValue('Trading account number', tradingAccountNumber)}>
            <div className="stg-row-icon">
              <Icons.Portfolio />
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">Trading Account Number</span>
              <span className="stg-row-sub stg-row-mono">{tradingAccountNumber}</span>
            </div>
          </div>

          <div className="stg-row stg-row-static">
            <div className="stg-row-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <div className="stg-row-body">
              <span className="stg-row-title">What are these for?</span>
              <span className="stg-row-sub">Your CSD and trading account numbers identify you on the Lusaka Securities Exchange. You may be asked for these when contacting support.</span>
            </div>
          </div>
        </div>

        {/* ── Security section ── */}
        <p className="pf-section-label">Security</p>
        <div className="stg-section">
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
