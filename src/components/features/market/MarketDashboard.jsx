import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function MarketDashboard({ 
  walletBalance, 
  sharesOwned, 
  onTradeExecute, 
  showToast,
  triggerTrade
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

        <div className="responsive-two-col-grid">
          {/* Left Column: Market Search, Filters, and Securities List */}
          <div className="market-main-col">
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
                    <div className="stock-card-main">
                      <div className="stock-logo" style={{ background: stock.color }}>
                        {stock.symbol.slice(0, 3)}
                      </div>
                      <div className="stock-info">
                        <div className="stock-symbol">{stock.symbol}</div>
                        <div className="stock-name-desktop">{stock.name}</div>
                        {owned > 0 && <div className="stock-owned-badge">OWNED: {owned}</div>}
                      </div>
                      <div className="stock-prices">
                        <div className="stock-price">ZMW {stock.price.toFixed(2)}</div>
                        <div className={`stock-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                          {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="stock-card-actions">
                      <button 
                        className="btn-quick-action btn-quick-trade"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerTrade(stock.symbol);
                        }}
                      >
                        Trade
                      </button>
                      <button 
                        className="btn-quick-action btn-quick-book"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/market/${stock.symbol}/orderbook`);
                        }}
                      >
                        Order Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Market Performance Statistics & Indices (Desktop Only) */}
          <div className="market-side-col desktop-only">
            <div className="desktop-sidebar-card">
              <h3 className="services-section-title" style={{ marginTop: 0, marginBottom: '16px', color: 'var(--primary-red)' }}>Top Gainers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>1. DotCom Zambia (DCZM)</span>
                  <strong style={{ color: '#10B981' }}>▲ +4.12%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>2. Puma Energy (PUMA)</span>
                  <strong style={{ color: '#10B981' }}>▲ +4.52%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>3. Airtel Networks (ATEL)</span>
                  <strong style={{ color: '#10B981' }}>▲ +2.11%</strong>
                </div>
              </div>
            </div>

            <div className="desktop-sidebar-card">
              <h3 className="services-section-title" style={{ marginTop: 0, marginBottom: '16px' }}>Highest Yields</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>1. GRZ 10-Yr Gov Bond</span>
                  <strong style={{ color: 'var(--primary-red)' }}>23.50% yield</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>2. GRZ 364-Day Treasury Bill</span>
                  <strong style={{ color: 'var(--primary-red)' }}>18.00% yield</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>3. Puma Energy (PUMA)</span>
                  <strong style={{ color: 'var(--primary-red)' }}>11.20% yield</strong>
                </div>
              </div>
            </div>

            <div className="desktop-sidebar-card">
              <h3 className="services-section-title" style={{ marginTop: 0, marginBottom: '12px' }}>Market Details</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 8px 0' }}>• <strong>Market State:</strong> Live trading active till 15:30 PM (LUS).</p>
                <p style={{ margin: '0 0 8px 0' }}>• <strong>Settlement Cycle:</strong> T+3 standard settlement via Airtel Money.</p>
                <p style={{ margin: 0 }}>• <strong>Fee Schedule:</strong> 0.25% transaction fee per completed buy/sell order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
