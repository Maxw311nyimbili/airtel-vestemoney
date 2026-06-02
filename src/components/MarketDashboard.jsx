import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { MOCK_STOCKS } from '../data/mockData';

export default function MarketDashboard({ 
  walletBalance, 
  sharesOwned, 
  onTradeExecute, 
  showToast 
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');

  const equities = MOCK_STOCKS.filter(stock => stock.type === 'equities');
  const marketOpen = '09:45 AM';
  const totalEquitiesShares = '23.1M';

  return (
    <div className="screen-container slide-in-right">
      <div className="page-container">
        <div className="sub-page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <Icons.ChevronLeft />
          </button>
          <div>
            <h1>Zambian Markets</h1>
            <p className="page-description">Explore local shares and bonds, then execute trades directly from the market view.</p>
          </div>
          <button className="header-action-text" onClick={() => showToast('Refreshed live rates')}>Refresh</button>
        </div>

        <div className="market-hero">
          <span className="market-hero-label">Lusaka Securities Exchange</span>
          <h2 className="market-hero-value">LuSE Equities &amp; Bonds</h2>
          <p className="market-hero-sub">Live trading speed: High • 25 active securities</p>
        </div>

        <div className="search-bar">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search shares or bonds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${marketFilter === 'all' ? 'active' : ''}`} onClick={() => setMarketFilter('all')}>All Assets</button>
          <button className={`filter-tab ${marketFilter === 'equities' ? 'active' : ''}`} onClick={() => setMarketFilter('equities')}>LuSE Equities</button>
          <button className={`filter-tab ${marketFilter === 'bonds' ? 'active' : ''}`} onClick={() => setMarketFilter('bonds')}>Gov Bonds</button>
        </div>

        {marketFilter === 'equities' && (
          <div className="market-overview-card">
            <div>
              <span className="market-overview-label">Market opens</span>
              <strong>{marketOpen}</strong>
            </div>
            <div>
              <span className="market-overview-label">LuSE trading portfolio</span>
              <strong>{equities.length} securities</strong>
            </div>
            <div>
              <span className="market-overview-label">Available shares</span>
              <strong>{totalEquitiesShares}</strong>
            </div>
          </div>
        )}

        <div className="stock-list">
          {MOCK_STOCKS.filter(stock => {
            const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || stock.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = marketFilter === 'all' || stock.type === marketFilter;
            return matchesSearch && matchesFilter;
          }).map(stock => {
            const owned = sharesOwned[stock.symbol] || 0;
            return (
              <div key={stock.symbol} className="stock-card btn-press-active" onClick={() => navigate(`/market/${stock.symbol}`)}>
                <div className="stock-logo" style={{ background: stock.color }}>
                  {stock.symbol.slice(0, 3)}
                </div>
                <div className="stock-info">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                  {owned > 0 && <div className="stock-owned-badge">OWNED: {owned}</div>}
                </div>
                <div className="stock-prices">
                  <div className="stock-price">ZMW {stock.price.toFixed(2)}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                  </div>
                  <div className="stock-yield">Yield: {stock.yield}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
