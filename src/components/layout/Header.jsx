import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import airtelLogo from '../../images/airtel_logo.png';
import { Icons } from '../Icons';

export default function Header({ showToast, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard',  label: 'Dashboard'   },
    { path: '/portfolio',  label: 'My Portfolio' },
    { path: '/market',     label: 'LuSE Market'  },
    { path: '/dividend',   label: 'Dividends'    },
    { path: '/settings',   label: 'Settings'     },
  ];

  return (
    <header className="mobile-header">
      <div className="mobile-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <img src={airtelLogo} alt="Airtel" className="mobile-brand-logo" />
        <span className="mobile-brand-invest desktop-only">Invest</span>
      </div>

      {/* Desktop horizontal nav */}
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
        <button
          className="desktop-lock-btn desktop-only"
          onClick={() => { onLogout(false); navigate('/'); }}
        >
          <Icons.LogOut />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
