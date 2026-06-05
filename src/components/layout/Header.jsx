import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import airtelLogo from '../../images/airtel_logo.png';
import { Icons } from '../Icons';

export default function Header({ showToast, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Icons.Home /> },
    { path: '/portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
    { path: '/market', label: 'Market', icon: <Icons.Market /> },
    { path: '/dividend', label: 'Dividends', icon: <Icons.Dividend /> },
  ];

  return (
    <header className="mobile-header">
      <div className="mobile-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <img src={airtelLogo} alt="Airtel logo" className="mobile-brand-icon" />
        <span className="desktop-brand-title desktop-only">Invest</span>
      </div>

      {/* Desktop Horizontal Navigation Menu */}
      <nav className="desktop-nav-links desktop-only">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path === '/market' && location.pathname.startsWith('/market/'));
          return (
            <button
              key={item.path}
              className={`desktop-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="header-actions">
        {/* Desktop Quick Lock Action */}
        <button
          className="desktop-lock-btn desktop-only"
          onClick={() => {
            onLogout(false);
            showToast('Wallet locked');
            navigate('/');
          }}
        >
          <Icons.Lock />
          <span>Lock Wallet</span>
        </button>

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-drawer">
            <div className="drawer-header">
              <span className="drawer-title">Invest Menu</span>
              <button className="drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="drawer-links">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/market' && location.pathname.startsWith('/market/'));
                return (
                  <button
                    key={item.path}
                    className={`drawer-link-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '20px', color: 'inherit' }}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                className="drawer-link-item lock-wallet"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout(false);
                  showToast('Wallet locked');
                  navigate('/');
                }}
              >
                <Icons.Lock />
                <span>Lock Wallet</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
