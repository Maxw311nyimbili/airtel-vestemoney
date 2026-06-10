import React, { useState, useMemo } from 'react';
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

  const equities = MOCK_STOCKS.filter(s => s.type === 'equities');

  // Market highlights
  const topGainer = useMemo(() =>
    [...equities].sort((a, b) => b.change - a.change)[0], []);
  const topLoser = useMemo(() =>
    [...equities].sort((a, b) => a.change - b.change)[0], []);
  const luseIndex = 7852.30;
  const luseChange = 1.28;

  const filtered = equities.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    || stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="screen-container slide-in-right mkt-screen">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Market</span>
        <div className="mkt-status-chip">
          <span className="mkt-status-dot" />
          <span>Live</span>
        </div>
      </div>

      <div className="mkt-body">

        {/* ── Search ── */}
        <div className="mkt-search-wrap">
          <div className="search-bar">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search for stocks…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Market Highlights ── */}
        {!searchQuery && (
          <div className="mkt-highlights-section">
            <span className="mkt-section-label">Market Highlights</span>
            <div className="mkt-highlights-row">

              {/* LuSE Index */}
              <div className="mkt-highlight-index">
                <span className="mkt-hl-title">LuSE All Share Index</span>
                <span className="mkt-hl-big">{luseIndex.toLocaleString()}</span>
                <span className="mkt-hl-chg chg-up">+{luseChange}%</span>
              </div>

              {/* Top Gainer */}
              <div className="mkt-highlight-card mkt-hl-gainer">
                <span className="mkt-hl-badge badge-up">Top Gainer</span>
                <span className="mkt-hl-name">{topGainer.name.split(' ')[0]}</span>
                <span className="mkt-hl-chg chg-up">+{topGainer.change.toFixed(1)}%</span>
              </div>

              {/* Top Loser */}
              <div className="mkt-highlight-card mkt-hl-loser">
                <span className="mkt-hl-badge badge-dn">Top Loser</span>
                <span className="mkt-hl-name">{topLoser.name.split(' ')[0]}</span>
                <span className="mkt-hl-chg chg-dn">{topLoser.change.toFixed(1)}%</span>
              </div>

            </div>
          </div>
        )}

        {/* ── All Stocks ── */}
        <div className="mkt-stocks-section">
          <span className="mkt-section-label">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Stocks'}
          </span>

          <div className="mkt-list">
            {filtered.length === 0 ? (
              <div className="pf-empty" style={{ padding: '32px 0' }}>
                <Icons.Search />
                <span>No results for "{searchQuery}"</span>
              </div>
            ) : filtered.map(stock => {
              const owned = sharesOwned[stock.symbol] || 0;
              return (
                <div key={stock.symbol} className="mkt-row">
                  {/* Logo */}
                  <div className="mkt-logo" style={{ background: stock.color }}>
                    {stock.symbol.slice(0, 3)}
                  </div>

                  {/* Info */}
                  <div className="mkt-info">
                    <span className="mkt-sym">{stock.symbol}</span>
                    <span className="mkt-name">{stock.name}</span>
                    {owned > 0 && (
                      <span className="mkt-owned">{owned.toLocaleString()} owned</span>
                    )}
                  </div>

                  {/* Price + change */}
                  <div className="mkt-price-col">
                    <span className="mkt-price">ZMW {stock.price.toFixed(2)}</span>
                    <span className={`mkt-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </span>
                  </div>

                  {/* View button */}
                  <button
                    className="mkt-view-btn"
                    onClick={() => navigate(`/market/${stock.symbol}`)}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
