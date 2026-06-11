import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import Sparkline from '../../Sparkline';
import StockLogo from '../../StockLogo';

export default function WatchlistPage({ watchlist, toggleWatchlist, sharesOwned }) {
  const navigate = useNavigate();

  const watchlistStocks = watchlist
    ? MOCK_STOCKS.filter(s => watchlist.includes(s.symbol))
    : [];

  return (
    <div className="screen-container slide-in-right mkt-screen">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Watchlist</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="mkt-body">
        <div className="mkt-stocks-section">
          <span className="mkt-section-label">
            {watchlistStocks.length === 0
              ? 'Nothing tracked yet'
              : `${watchlistStocks.length} ${watchlistStocks.length === 1 ? 'security' : 'securities'}`}
          </span>

          {watchlistStocks.length === 0 ? (
            <div className="stock-row-empty">
              <Icons.Star />
              <span>Tap the star on any security to track it here</span>
              <button className="stock-row-empty-btn" onClick={() => navigate('/market')}>
                Browse LuSE Market
              </button>
            </div>
          ) : (
            <div className="stock-row-list">
              {watchlistStocks.map(stock => {
                const owned = (sharesOwned && sharesOwned[stock.symbol]) || 0;
                return (
                  <div key={stock.symbol} className="stock-row" onClick={() => navigate(`/market/${stock.symbol}`)}>
                    <StockLogo stock={stock} className="stock-row-logo" />

                    <div className="stock-row-body">
                      <div className="stock-row-top">
                        <span className="stock-row-sym">
                          {stock.symbol}
                          {owned > 0 && (
                            <span className="stock-row-owned">{owned.toLocaleString()} owned</span>
                          )}
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
                        className="stock-row-star active"
                        onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.symbol); }}
                        aria-label="Remove from watchlist"
                      >
                        <Icons.StarFilled />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
