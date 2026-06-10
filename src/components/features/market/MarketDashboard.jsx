import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function MarketDashboard({
  walletBalance,
  sharesOwned,
  onTradeExecute,
  showToast,
  triggerTrade,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_STOCKS.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    || stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>

      {/* ── Sticky header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">LuSE Market</span>
      </div>

      {/* ── Status strip ── */}
      <div className="mkt-status-strip">
        <span className="mkt-status-dot" />
        <span className="mkt-status-text">Trading Active</span>
        <span className="mkt-status-sep">·</span>
        <span className="mkt-status-text">{MOCK_STOCKS.length} securities</span>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <div className="search-bar">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search shares or bonds…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


      {/* ── Stock list ── */}
      <div className="mkt-list">
        {filtered.length === 0 ? (
          <div className="pf-empty" style={{ paddingTop: 48 }}>
            <Icons.Search />
            <span>No results for "{searchQuery}"</span>
          </div>
        ) : filtered.map(stock => {
          const owned = sharesOwned[stock.symbol] || 0;
          return (
            <div
              key={stock.symbol}
              className="mkt-row"
              onClick={() => navigate(`/market/${stock.symbol}`)}
            >
              {/* Logo */}
              <div className="mkt-logo" style={{ background: stock.color }}>
                {stock.symbol.slice(0, 3)}
              </div>

              {/* Name */}
              <div className="mkt-info">
                <span className="mkt-sym">{stock.symbol}</span>
                <span className="mkt-name">{stock.name.split(' ').slice(0, 3).join(' ')}</span>
                {owned > 0 && (
                  <span className="mkt-owned">{owned.toLocaleString()} owned</span>
                )}
              </div>

              {/* Price + change */}
              <div className="mkt-price-col">
                <span className="mkt-price">ZMW {stock.price.toFixed(2)}</span>
                <span className={`mkt-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                  {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                </span>
              </div>

              {/* Single action */}
              <button
                className="mkt-trade-btn"
                onClick={e => { e.stopPropagation(); triggerTrade(stock.symbol); }}
              >
                Trade
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
