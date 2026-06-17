import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import Sparkline from '../../Sparkline';
import StockLogo from '../../StockLogo';

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
  isGuest,
  watchlist,
  toggleWatchlist,
}) {
  const navigate = useNavigate();
  const [hideValue, setHideValue] = useState(false);

  // P&L
  const costBasis     = portfolioTotal * 0.871;
  const pnlValue      = portfolioTotal - costBasis;
  const pnlPct        = ((pnlValue / costBasis) * 100).toFixed(2);
  const isPnlPositive = pnlValue >= 0;

  // Popular stocks — top 6
  const popularStocks = [...MOCK_STOCKS.filter(s => s.type === 'equities')].slice(0, 6);

  // Watchlist stocks — securities the user is tracking
  const watchlistStocks = watchlist
    ? MOCK_STOCKS.filter(s => watchlist.includes(s.symbol))
    : [];

  return (
      <div className="screen-container dashboard-screen slide-in-right">
        <div className="dash-wrapper">

          {/* ── Greeting ── */}
          <div className="dash-greeting">
            <span className="dash-greeting-text">
              {isGuest ? 'Welcome' : `Welcome, ${userName || 'there'}`}
            </span>
            {isGuest && (
              <button className="dash-guest-signin-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            )}
          </div>

          {/* ── Portfolio card ── */}
          {isGuest ? (
            <div className="dash-port-card dash-port-card-locked">
              <div className="dash-port-locked-blur">
                <span className="dash-port-label">Portfolio Value</span>
                <div className="dash-port-value-row">
                  <span className="dash-port-value">ZMW ••••••••</span>
                </div>
                <div className="dash-port-stats">
                  <div className="dash-port-stat">
                    <span className="dash-port-stat-lbl">Invested</span>
                    <span className="dash-port-stat-val">ZMW ••••</span>
                  </div>
                  <div className="dash-port-stat-sep" />
                  <div className="dash-port-stat">
                    <span className="dash-port-stat-lbl">Profit / Loss</span>
                    <span className="dash-port-stat-val">••••</span>
                  </div>
                  <div className="dash-port-stat-sep" />
                  <div className="dash-port-stat">
                    <span className="dash-port-stat-lbl">Return</span>
                    <span className="dash-port-stat-val">••••</span>
                  </div>
                </div>
              </div>
              <div className="dash-port-locked-overlay">
                <Icons.Lock />
                <span className="dash-port-locked-text">Sign in to see your portfolio, profit &amp; loss</span>
                <button className="dash-port-locked-btn" onClick={() => navigate('/login')}>Sign In</button>
              </div>
            </div>
          ) : (
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
          )}

          {/* ── Quick Actions ── */}
          <div className="dash-quick-actions">
            <button className="dash-qa-btn qa-buy" onClick={() => navigate('/market')}>
              <Icons.ArrowDownToLine />
              <span>Buy Shares</span>
            </button>

            <button className="dash-qa-btn qa-sell" onClick={() => navigate('/portfolio')}>
              <Icons.ArrowUpFromLine />
              <span>Sell Shares</span>
            </button>

            <button className="dash-qa-btn qa-watchlist" onClick={() => navigate('/watchlist')}>
              <Icons.Star />
              <span>Watchlist</span>
            </button>

            <button className="dash-qa-btn qa-portfolio" onClick={() => navigate('/portfolio')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span>My Portfolio</span>
            </button>
          </div>

          {/* ── Popular Stocks ── */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Popular Shares</span>
              <button className="dash-section-link" onClick={() => navigate('/market')}>See All</button>
            </div>

            <div className="stock-row-list">
              {popularStocks.map(stock => {
                const inWatchlist = watchlist && watchlist.includes(stock.symbol);
                return (
                  <div key={stock.symbol} className="stock-row" onClick={() => navigate(`/market/${stock.symbol}`)}>
                    <StockLogo stock={stock} className="stock-row-logo" />
                    <div className="stock-row-body">
                      <div className="stock-row-top">
                        <span className="stock-row-sym">{stock.symbol}</span>
                        <span className="stock-row-price">ZMW {stock.price.toFixed(2)}</span>
                      </div>
                      <div className="stock-row-bottom">
                        <span className="stock-row-name">{stock.name}</span>
                        <span className={`stock-row-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="stock-row-spark">
                      <Sparkline data={stock.trend} positive={stock.change >= 0} />
                    </div>
                    {toggleWatchlist && (
                      <button
                        className={`stock-row-star ${inWatchlist ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.symbol); }}
                        aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {inWatchlist ? <Icons.StarFilled /> : <Icons.Star />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
  );
}
