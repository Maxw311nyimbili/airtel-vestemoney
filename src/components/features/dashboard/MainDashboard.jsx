import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STOCKS } from '../../../data/mockData';

// ─── Help / FAQ data ─────────────────────────────────────────────
const FAQ = [
  {
    q: 'What is the Lusaka Securities Exchange (LuSE)?',
    a: 'LuSE is Zambia\'s official stock exchange where shares of publicly listed companies are bought and sold.'
  },
  {
    q: 'How do I buy shares?',
    a: 'Tap the LuSE Market card, pick any company, and press Buy. Payment is deducted from your Airtel Money wallet.'
  },
  {
    q: 'What are dividends?',
    a: 'Dividends are cash rewards companies pay to shareholders from their profits, usually once or twice a year.'
  },
  {
    q: 'Is my investment safe?',
    a: 'Investments are held through Veste Money, a licensed Zambian broker. Share values can go up or down.'
  },
  {
    q: 'How do I withdraw my money?',
    a: 'Sell your shares in the LuSE Market section. Proceeds are credited back to your Airtel Money wallet.'
  },
  {
    q: 'What is a government bond?',
    a: 'A bond is a loan you give to the Zambian government. They pay you guaranteed interest and return your money at maturity.'
  },
];

// ─── Main component ──────────────────────────────────────────────
export default function MainDashboard({
  userName,
  portfolioTotal,
  portfolioEquities,
  portfolioBonds,
  portfolioSavings,
  sharesOwned,
  dividendEarnings,
  showToast,
  triggerTrade,
}) {
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Portfolio P&L
  const costBasis    = portfolioTotal * 0.871;
  const pnlValue     = portfolioTotal - costBasis;
  const pnlPct       = ((pnlValue / costBasis) * 100).toFixed(2);
  const isPnlPositive = pnlValue >= 0;

  // Top movers (sorted by abs change, pick top 3)
  const topMovers = [...MOCK_STOCKS.filter(s => s.type === 'equities')]
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 4);

  return (
    <>
      <div className="screen-container dashboard-screen slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="dash-wrapper">

          {/* ── Greeting ── */}
          <div className="dash-greeting">
            <span className="dash-greeting-text">Welcome, {userName || 'there'}</span>
          </div>

          {/* ── Portfolio summary card ── */}
          <div className="invest-portfolio-card">
            <div className="invest-card-pattern" />
            <div className="invest-card-top-row">
              <span className="invest-card-label">Overall Portfolio</span>
              <span className="invest-card-badge">LuSE</span>
            </div>
            <div className="invest-card-value-row">
              <span className="invest-card-value">
                ZMW {portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="invest-card-stats">
              <div className="invest-card-stat">
                <span className="invest-stat-label">Invested</span>
                <span className="invest-stat-val">
                  ZMW {costBasis.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="invest-card-divider" />
              <div className="invest-card-stat">
                <span className="invest-stat-label">Profit / Loss</span>
                <span className={`invest-stat-val ${isPnlPositive ? 'invest-stat-profit' : 'invest-stat-loss'}`}>
                  {isPnlPositive ? '▲' : '▼'} ZMW {Math.abs(pnlValue).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="invest-card-divider" />
              <div className="invest-card-stat">
                <span className="invest-stat-label">Return</span>
                <span className={`invest-stat-val ${isPnlPositive ? 'invest-stat-profit' : 'invest-stat-loss'}`}>
                  {isPnlPositive ? '+' : ''}{pnlPct}%
                </span>
              </div>
            </div>
          </div>

          {/* ── 2×2 Service cards ── */}
          <div className="service-cards-grid">

            <button className="svc-card" onClick={() => navigate('/portfolio')}>
              <div className="svc-card-icon svc-icon-portfolio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
              </div>
              <span className="svc-card-title">My Portfolio</span>
              <span className="svc-card-desc">View your holdings &amp; bonds</span>
            </button>

            <button className="svc-card" onClick={() => navigate('/dividend')}>
              <div className="svc-card-icon svc-icon-dividend">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                  <path d="M8.5 14.5A4 4 0 0 0 12 16a4 4 0 0 0 3.5-1.5"/>
                </svg>
              </div>
              <span className="svc-card-title">Dividends</span>
              <span className="svc-card-desc">Track your cash payouts</span>
            </button>

            <button className="svc-card" onClick={() => navigate('/market')}>
              <div className="svc-card-icon svc-icon-market">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                  <polyline points="16 7 22 7 22 13"/>
                </svg>
              </div>
              <span className="svc-card-title">LuSE Market</span>
              <span className="svc-card-desc">Buy &amp; sell shares</span>
            </button>

            <button className="svc-card" onClick={() => setHelpOpen(true)}>
              <div className="svc-card-icon svc-icon-help">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <span className="svc-card-title">Help &amp; FAQ</span>
              <span className="svc-card-desc">Guides &amp; support</span>
            </button>

          </div>

          {/* ── Top Movers ── */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Top Movers Today</span>
              <button className="dash-section-link" onClick={() => navigate('/market')}>See all</button>
            </div>
            <div className="movers-list">
              {topMovers.map(stock => (
                <div key={stock.symbol} className="mover-row" onClick={() => navigate(`/market/${stock.symbol}`)}>
                  <div className="mover-logo" style={{ background: stock.color }}>
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div className="mover-info">
                    <span className="mover-sym">{stock.symbol}</span>
                    <span className="mover-name">{stock.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                  <div className="mover-right">
                    <span className="mover-price">ZMW {stock.price.toFixed(2)}</span>
                    <span className={`mover-change ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                      {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* ── Help / FAQ Sheet ── */}
      {helpOpen && (
        <>
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
                  {openFaq === i && (
                    <div className="faq-answer">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
