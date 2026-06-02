import React from 'react';
import { Icons } from './Icons';
import airtelLogo from '../images/airtel_logo.png';
import vesteLogo from '../images/Veste.money logo.png';

export default function Sidebar({ phoneNumber, currentPath, onNavigate, onLogout, isOpen, onClose }) {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Icons.Home /> },
    { path: '/portfolio', label: 'My Portfolio', icon: <Icons.Portfolio /> },
    { path: '/market', label: 'Market', icon: <Icons.Market /> },
    { path: '/dividend', label: 'Dividends', icon: <Icons.Dividend /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={onClose}>×</button>

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src={airtelLogo} alt="Airtel logo" className="sidebar-logo-icon" />
          </div>
          <div className="sidebar-powered" aria-hidden>
            <span className="powered-text">Powered by</span>
            <img src={vesteLogo} alt="Veste logo" className="powered-logo" />
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main</span>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Quick actions removed per product requirement */}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={onLogout} style={{ cursor: 'pointer' }}>
            <div className="sidebar-avatar">CM</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Chileshe Mulenga</div>
              <div className="sidebar-user-phone">+260 {phoneNumber}</div>
            </div>
            <Icons.Lock />
          </div>
        </div>
      </aside>
    </>
  );
}
