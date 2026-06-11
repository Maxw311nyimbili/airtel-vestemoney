import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import airtelLogo from '../../images/airtel_logo.png';
import { Icons } from '../Icons';

const FAQ = [
  { q: 'What is the Lusaka Securities Exchange (LuSE)?', a: 'LuSE is Zambia\'s official stock exchange where shares of publicly listed companies are bought and sold.' },
  { q: 'How do I buy shares?', a: 'Tap Buy Shares, pick any company, and confirm. Payment is deducted from your Airtel Money wallet.' },
  { q: 'What are dividends?', a: 'Dividends are cash rewards companies pay to shareholders from their profits, usually once or twice a year.' },
  { q: 'Is my investment safe?', a: 'Investments are held through Veste Money, a licensed Zambian broker. Share values can go up or down.' },
  { q: 'How do I withdraw my money?', a: 'Sell your shares in the LuSE Market section. Proceeds are credited back to your Airtel Money wallet.' },
];

export default function Header({ showToast, onLogout, isGuest }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const navItems = [
    { path: '/dashboard',  label: 'Dashboard'   },
    { path: '/portfolio',  label: 'My Portfolio' },
    { path: '/market',     label: 'LuSE Market'  },
    { path: '/dividend',   label: 'Dividends'    },
    { path: '/settings',   label: 'Account'      },
  ];

  return (
    <React.Fragment>
      <header className="mobile-header">
        <div className="mobile-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <img src={airtelLogo} alt="Airtel" className="mobile-brand-logo" />
          <span className="mobile-brand-invest desktop-only">Invest</span>
        </div>

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
          {isGuest ? (
            <button
              className="desktop-lock-btn desktop-only"
              onClick={() => navigate('/login')}
            >
              <Icons.Lock />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              className="desktop-lock-btn desktop-only"
              onClick={() => { onLogout(false); navigate('/'); }}
            >
              <Icons.LogOut />
              <span>Log Out</span>
            </button>
          )}

          <div className="header-menu-wrap">
            <button
              className="header-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="More options"
            >
              <Icons.MoreVertical />
            </button>

            {menuOpen && (
              <React.Fragment>
                <div className="header-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="header-menu-dropdown">
                  <button
                    className="header-menu-item"
                    onClick={() => { setMenuOpen(false); setHelpOpen(true); }}
                  >
                    <Icons.HelpCircle />
                    <span>Help &amp; FAQ</span>
                  </button>
                  {isGuest ? (
                    <button
                      className="header-menu-item mobile-only"
                      onClick={() => { setMenuOpen(false); navigate('/login'); }}
                    >
                      <Icons.Lock />
                      <span>Sign In</span>
                    </button>
                  ) : (
                    <button
                      className="header-menu-item mobile-only"
                      onClick={() => { setMenuOpen(false); onLogout(false); navigate('/'); }}
                    >
                      <Icons.LogOut />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </header>

      {helpOpen && (
        <React.Fragment>
          <div className="help-overlay" onClick={() => setHelpOpen(false)} />
          <div className="help-sheet">
            <div className="help-sheet-handle" />
            <div className="help-sheet-header">
              <h2 className="help-sheet-title">Help &amp; FAQ</h2>
              <button className="help-sheet-close" onClick={() => setHelpOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="help-contact-row">
              <a className="help-contact-btn" href="tel:+26097" onClick={e => { e.preventDefault(); showToast('Calling Airtel support…'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.37 2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call Support
              </a>
              <a className="help-contact-btn help-contact-chat" href="#" onClick={e => { e.preventDefault(); showToast('Live chat coming soon!'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Live Chat
              </a>
            </div>
            <div className="faq-list">
              {FAQ.map((item, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <svg className="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq === i && <div className="faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
