import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { MOCK_STOCKS } from '../data/mockData';

export default function MainDashboard({ 
  phoneNumber, 
  walletBalance, 
  portfolioTotal, 
  dividendMonthly, 
  showToast 
}) {
  const navigate = useNavigate();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const equities = useMemo(() => MOCK_STOCKS.filter(stock => stock.type === 'equities'), []);
  const marketPulse = useMemo(() => {
    const avgChange = equities.reduce((sum, stock) => sum + stock.change, 0) / equities.length;
    return {
      indexLabel: 'LuSE Market Pulse',
      indexChange: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
      securities: equities.length,
      open: '09:45 AM'
    };
  }, [equities]);

  const marketMovers = useMemo(() => {
    const sorted = [...equities].sort((a, b) => b.change - a.change);
    return sorted.slice(0, 3);
  }, [equities]);

  return (
    <div className="screen-container dashboard-screen slide-in-right">
      <div className="page-container">
        <div className="page-header">
          <div>
            <p className="balance-label">Welcome back, Chileshe</p>
            <h1 className="user-greeting">Your Airtel investment command center</h1>
            <p className="page-description">Monitor your wallet, move money, and explore market opportunities in one elegant view.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => showToast('No new Airtel alerts')}>
              <Icons.Bell /> Alerts
            </button>
          </div>
        </div>

          <div className="balance-hero">
          <div className="balance-top-row">
            <div className="balance-label">Cash Account</div>
            <button className="balance-toggle" onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? <Icons.Eye /> : <Icons.EyeOff />}
            </button>
          </div>

          <div className="balance-value-row">
            <span className="balance-currency">ZMW</span>
            <span className="balance-amount">
              {isBalanceVisible ? walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '******'}
            </span>
          </div>
          <p className="balance-hero-sub">Unified Airtel Money Wallet • Active</p>
          {/* Quick actions removed — product focuses on investments and market view */}
        </div>

        {/* Services/quick-actions removed from dashboard — focus is market summary */}

        <section className="market-summary-section">
          <div className="section-heading">
            <h2>Market Summary</h2>
            <span className="section-badge">LuSE Snapshot</span>
          </div>

          <div className="wealth-cards">
            <div className="wealth-card market-card btn-press-active" onClick={() => navigate('/market')}>
              <div className="wealth-card-icon">
                <Icons.Market />
              </div>
              <h3>{marketPulse.indexLabel}</h3>
              <p className="wealth-desc">Latest local market direction across the LuSE equities watch list.</p>
              <div className="wealth-card-value">{marketPulse.indexChange}</div>
              <div className="wealth-card-change positive">{marketPulse.securities} securities</div>
              <div className="wealth-card-arrow"><Icons.ChevronRight /></div>
            </div>

            <div className="wealth-card portfolio-card btn-press-active" onClick={() => navigate('/market')}>
              <div className="wealth-card-icon">
                <Icons.TrendingUp />
              </div>
              <h3>Top Movers</h3>
              <p className="wealth-desc">Watch the strongest movers and the biggest shifts on the local exchange.</p>
              {marketMovers.map((stock, index) => (
                <div key={stock.symbol} style={{ marginBottom: index < marketMovers.length - 1 ? '10px' : 0 }}>
                  <strong>{stock.symbol}</strong> {stock.change >= 0 ? '+' : '▼'}{stock.change.toFixed(2)}%
                </div>
              ))}
              <div className="wealth-card-arrow"><Icons.ChevronRight /></div>
            </div>

            <div className="wealth-card dividend-card btn-press-active" onClick={() => navigate('/market')}>
              <div className="wealth-card-icon">
                <Icons.Market />
              </div>
              <h3>Full Market</h3>
              <p className="wealth-desc">Open the full market tab to browse securities, compare yields, and trade directly.</p>
              <button className="btn btn-primary" onClick={() => navigate('/market')}>View more</button>
            </div>
          </div>
        </section>

        <div className="dashboard-footer">
          <button className="btn btn-primary" onClick={() => { showToast('Airtel Wallet locked'); navigate('/login'); }}>
            <Icons.Lock /> Lock Airtel Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
