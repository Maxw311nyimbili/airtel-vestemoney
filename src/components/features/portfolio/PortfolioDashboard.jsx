import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function PortfolioDashboard({
  sharesOwned,
  portfolioTotal,
  portfolioEquities,
  portfolioBonds,
  portfolioSavings,
  showToast,
  triggerTrade,
}) {
  const navigate = useNavigate();

  const costBasis    = portfolioTotal * 0.871;
  const pnlValue     = portfolioTotal - costBasis;
  const pnlPct       = ((pnlValue / costBasis) * 100).toFixed(2);
  const isPnlPositive = pnlValue >= 0;

  const ownedStocks = MOCK_STOCKS.filter(
    s => s.type === 'equities' && (sharesOwned[s.symbol] || 0) > 0
  );

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
      <div className="pf-wrapper">

        {/* ── Header ── */}
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">My Portfolio</span>
          <button
            className="pf-header-action"
            onClick={() => showToast('Statement emailed to you')}
          >
            Export
          </button>
        </div>

        {/* ── Total value card ── */}
        <div className="pf-hero-card">
          <div className="pf-hero-pattern" />
          <span className="pf-hero-label">Total Portfolio Value</span>
          <span className="pf-hero-value">
            ZMW {portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="pf-hero-stats">
            <div className="pf-hero-stat">
              <span className="pf-stat-lbl">Invested</span>
              <span className="pf-stat-val">
                ZMW {costBasis.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="pf-stat-sep" />
            <div className="pf-hero-stat">
              <span className="pf-stat-lbl">Return</span>
              <span className={`pf-stat-val ${isPnlPositive ? 'pf-profit' : 'pf-loss'}`}>
                {isPnlPositive ? '+' : ''}{pnlPct}%
                &nbsp;({isPnlPositive ? '▲' : '▼'} ZMW {Math.abs(pnlValue).toLocaleString('en-US', { maximumFractionDigits: 0 })})
              </span>
            </div>
          </div>
        </div>

        {/* ── Asset buckets ── */}
        <p className="pf-section-label">Where your money is</p>
        <div className="pf-buckets">

          <div className="pf-bucket">
            <div className="pf-bucket-icon" style={{ background: '#FFF1F2', color: '#E30613' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div className="pf-bucket-body">
              <span className="pf-bucket-name">Company Shares</span>
              <span className="pf-bucket-value">
                ZMW {portfolioEquities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="pf-bucket-chg chg-up">▲ 14.2%</span>
          </div>

          <div className="pf-bucket">
            <div className="pf-bucket-icon" style={{ background: 'var(--primary-red-light)', color: 'var(--primary-red)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <div className="pf-bucket-body">
              <span className="pf-bucket-name">Government Bonds</span>
              <span className="pf-bucket-value">
                ZMW {portfolioBonds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="pf-bucket-chg chg-up">▲ 23.5%</span>
          </div>

          <div className="pf-bucket">
            <div className="pf-bucket-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div className="pf-bucket-body">
              <span className="pf-bucket-name">Flexible Savings</span>
              <span className="pf-bucket-value">
                ZMW {portfolioSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="pf-bucket-chg chg-up">▲ 8.5%</span>
          </div>

        </div>

        {/* ── Holdings ── */}
        <p className="pf-section-label" style={{ marginTop: '28px' }}>My Shares</p>

        {ownedStocks.length === 0 ? (
          <div className="pf-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            <span>No shares yet</span>
            <button className="pf-empty-cta" onClick={() => navigate('/market')}>
              Browse LuSE Market
            </button>
          </div>
        ) : (
          <div className="pf-holdings">
            {ownedStocks.map(stock => {
              const qty   = sharesOwned[stock.symbol];
              const value = qty * stock.price;
              return (
                <div
                  key={stock.symbol}
                  className="pf-holding-card"
                  onClick={() => navigate(`/market/${stock.symbol}`)}
                >
                  {/* Logo */}
                  <div className="pf-holding-logo" style={{ background: stock.color }}>
                    {stock.symbol.slice(0, 3)}
                  </div>

                  {/* Name + shares */}
                  <div className="pf-holding-info">
                    <span className="pf-holding-sym">{stock.symbol}</span>
                    <span className="pf-holding-qty">{qty.toLocaleString()} shares</span>
                  </div>

                  {/* Value + change */}
                  <div className="pf-holding-right">
                    <span className="pf-holding-val">
                      ZMW {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`pf-holding-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                      {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                    </span>
                  </div>

                  {/* Trade button */}
                  <button
                    className="pf-trade-btn"
                    onClick={e => { e.stopPropagation(); triggerTrade(stock.symbol); }}
                  >
                    Trade
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
