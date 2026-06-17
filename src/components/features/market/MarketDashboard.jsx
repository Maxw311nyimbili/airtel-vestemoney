import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import Sparkline from '../../Sparkline';
import StockLogo from '../../StockLogo';

export default function MarketDashboard({
  walletBalance,
  sharesOwned,
  onTradeExecute,
  showToast,
  triggerTrade,
  watchlist,
  toggleWatchlist,
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
            {searchQuery ? `Results for "${searchQuery}"` : 'All Shares'}
          </span>

          <div className="mkt-list">
            {filtered.length === 0 ? (
              <div className="pf-empty" style={{ padding: '32px 0' }}>
                <Icons.Search />
                <span>No results for "{searchQuery}"</span>
              </div>
            ) : filtered.map(stock => {
              const owned = sharesOwned[stock.symbol] || 0;
              const inWatchlist = watchlist && watchlist.includes(stock.symbol);
              return (
                <div key={stock.symbol} className="stock-row" onClick={() => navigate(`/market/${stock.symbol}`)}>
                  <StockLogo stock={stock} className="stock-row-logo" />
                  <div className="stock-row-body">
                    <div className="stock-row-top">
                      <span className="stock-row-sym">
                        {stock.symbol}
                      </span>
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
