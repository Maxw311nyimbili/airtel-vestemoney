import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STOCKS } from '../../../data/mockData';

// ─── Mini sparkline SVG ───────────────────────────────────────────
function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null;
  const w = 64, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const color = positive ? '#16A34A' : '#E30613';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Help / FAQ data ─────────────────────────────────────────────
const FAQ = [
  { q: 'What is the Lusaka Securities Exchange (LuSE)?', a: 'LuSE is Zambia\'s official stock exchange where shares of publicly listed companies are bought and sold.' },
  { q: 'How do I buy shares?', a: 'Tap Buy Shares, pick any company, and confirm. Payment is deducted from your Airtel Money wallet.' },
  { q: 'What are dividends?', a: 'Dividends are cash rewards companies pay to shareholders from their profits, usually once or twice a year.' },
  { q: 'Is my investment safe?', a: 'Investments are held through Veste Money, a licensed Zambian broker. Share values can go up or down.' },
  { q: 'How do I withdraw my money?', a: 'Sell your shares in the LuSE Market section. Proceeds are credited back to your Airtel Money wallet.' },
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
  const [hideValue, setHideValue] = useState(false);

  // P&L
  const costBasis     = portfolioTotal * 0.871;
  const pnlValue      = portfolioTotal - costBasis;
  const pnlPct        = ((pnlValue / costBasis) * 100).toFixed(2);
  const isPnlPositive = pnlValue >= 0;

  // Popular stocks — top 6
  const popularStocks = [...MOCK_STOCKS.filter(s => s.type === 'equities')].slice(0, 6);

  return (
    <>
      <div className="screen-container dashboard-screen slide-in-right">
        <div className="dash-wrapper">

          {/* ── Greeting ── */}
          <div className="dash-greeting">
            <span className="dash-greeting-text">Welcome, {userName || 'there'}</span>
          </div>

          {/* ── Portfolio card ── */}
          <div className="dash-port-card">
            <span className="dash-port-label">Portfolio Value</span>
            <div className="dash-port-value-row">
              <span className="dash-port-value">
                {hideValue
                  ? 'ZMW ••••••'
                  : `ZMW ${portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <button className="dash-port-eye" onClick={() => setHideValue(v => !v)} aria-label="Toggle visibility">
                {hideValue ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="dash-port-stats">
              <div className="dash-port-stat">
                <span className="dash-port-stat-lbl">Invested</span>
                <span className="dash-port-stat-val">ZMW {costBasis.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="dash-port-stat-sep" />
              <div className="dash-port-stat">
                <span className="dash-port-stat-lbl">Profit / Loss</span>
                <span className={`dash-port-stat-val ${isPnlPositive ? 'gain-up' : 'gain-dn'}`}>
                  {isPnlPositive ? '+' : ''}ZMW {Math.abs(pnlValue).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="dash-port-stat-sep" />
              <div className="dash-port-stat">
                <span className="dash-port-stat-lbl">Return</span>
                <span className={`dash-port-stat-val ${isPnlPositive ? 'gain-up' : 'gain-dn'}`}>
                  {isPnlPositive ? '+' : ''}{pnlPct}%
                </span>
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="dash-quick-actions">
            <button className="dash-qa-btn qa-market" onClick={() => navigate('/market')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
              <span>LuSE Market</span>
            </button>

            <button className="dash-qa-btn qa-dividend" onClick={() => navigate('/dividend')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>Dividend</span>
            </button>

            <button className="dash-qa-btn qa-portfolio" onClick={() => navigate('/portfolio')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span>My Portfolio</span>
            </button>

            <button className="dash-qa-btn qa-help" onClick={() => setHelpOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Help</span>
            </button>
          </div>

          {/* ── Popular Stocks ── */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Popular Stocks</span>
              <button className="dash-section-link" onClick={() => navigate('/market')}>See All</button>
            </div>

            <div className="dash-stocks-list">
              {popularStocks.map(stock => (
                <div key={stock.symbol} className="dash-stock-row" onClick={() => navigate(`/market/${stock.symbol}`)}>
                  <div className="dash-stock-logo" style={{ background: stock.color }}>
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div className="dash-stock-info">
                    <span className="dash-stock-sym">{stock.symbol}</span>
                    <span className="dash-stock-name">{stock.name}</span>
                  </div>
                  <div className="dash-stock-spark">
                    <Sparkline data={stock.trend} positive={stock.change >= 0} />
                  </div>
                  <div className="dash-stock-right">
                    <span className="dash-stock-price">ZMW {stock.price.toFixed(2)}</span>
                    <span className={`dash-stock-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
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
                  {openFaq === i && <div className="faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
