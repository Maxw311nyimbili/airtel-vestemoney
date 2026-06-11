import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../Icons';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = useMemo(() => [
    { path: '/dashboard', label: 'Home',      icon: <Icons.Home />      },
    { path: '/portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
    { path: '/market',    label: 'Market',    icon: <Icons.Plus />      },
    { path: '/dividend',  label: 'Dividends', icon: <Icons.Coins />     },
    { path: '/settings',  label: 'Account',   icon: <Icons.Settings />  },
  ], []);

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(item => {
        const isActive = location.pathname === item.path ||
          (item.path === '/market' && location.pathname.startsWith('/market/'));
        return (
          <button
            key={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="mobile-nav-icon">{item.icon}</div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
