import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';

export default function MainDashboard({ 
  walletBalance, 
  showToast,
  onLogout
}) {
  const navigate = useNavigate();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <div className="screen-container dashboard-screen slide-in-right">
      <div className="page-container">
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <p className="balance-label">Welcome back, Chileshe</p>
            <h1 className="user-greeting" style={{ fontSize: '24px', fontWeight: '800' }}>Investments</h1>
          </div>
        </div>

        <div className="responsive-two-col-grid">
          {/* Main left column: Balance & Core Grid */}
          <div className="dashboard-main-col">
            {/* Balance Hero */}
            <div className="balance-hero" style={{ marginBottom: '24px' }}>
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
            </div>

            {/* 2x2 Services Grid */}
            <h3 className="services-section-title">Wealth Services</h3>
            <div className="services-grid">
              <div className="service-card" onClick={() => navigate('/portfolio')} style={{ padding: '24px 18px', minHeight: '120px', justifyContent: 'center' }}>
                <div className="service-card-icon portfolio" style={{ width: '44px', height: '44px' }}>
                  <Icons.Portfolio />
                </div>
                <div className="service-card-title" style={{ fontSize: '14px', marginTop: '8px' }}>My Portfolio</div>
                <div className="service-card-desc">Track assets</div>
              </div>

              <div className="service-card" onClick={() => navigate('/market')} style={{ padding: '24px 18px', minHeight: '120px', justifyContent: 'center' }}>
                <div className="service-card-icon market" style={{ width: '44px', height: '44px' }}>
                  <Icons.Market />
                </div>
                <div className="service-card-title" style={{ fontSize: '14px', marginTop: '8px' }}>LuSE Market</div>
                <div className="service-card-desc">Trade equities</div>
              </div>

              <div className="service-card" onClick={() => navigate('/dividend')} style={{ padding: '24px 18px', minHeight: '120px', justifyContent: 'center' }}>
                <div className="service-card-icon dividend" style={{ width: '44px', height: '44px' }}>
                  <Icons.Dividend />
                </div>
                <div className="service-card-title" style={{ fontSize: '14px', marginTop: '8px' }}>Dividend Hub</div>
                <div className="service-card-desc">Track yields</div>
              </div>

              <div className="service-card" onClick={() => { onLogout(false); showToast('Wallet locked'); navigate('/'); }} style={{ padding: '24px 18px', minHeight: '120px', justifyContent: 'center' }}>
                <div className="service-card-icon lock" style={{ width: '44px', height: '44px' }}>
                  <Icons.Lock />
                </div>
                <div className="service-card-title" style={{ fontSize: '14px', marginTop: '8px' }}>Lock Wallet</div>
                <div className="service-card-desc">Secure account</div>
              </div>
            </div>
          </div>

          {/* Right sidebar column: Trending news & stats (Desktop Only) */}
          <div className="dashboard-side-col desktop-only">
            <div className="desktop-sidebar-card">
              <h3 className="services-section-title" style={{ marginTop: 0, marginBottom: '16px', color: 'var(--primary-red)' }}>Trending Markets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>Puma Energy (PUMA)</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Energy Sector</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontWeight: '700', fontSize: '14px' }}>ZMW 2.10</span>
                    <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '600' }}>▲ 4.52%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>Airtel Networks (ATEL)</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Telecom Sector</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontWeight: '700', fontSize: '14px' }}>ZMW 4.85</span>
                    <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '600' }}>▲ 2.11%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>Zambeef Products (ZMBF)</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Consumer Sector</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontWeight: '700', fontSize: '14px' }}>ZMW 1.85</span>
                    <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '600' }}>▲ 1.64%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="desktop-sidebar-card">
              <h3 className="services-section-title" style={{ marginTop: 0, marginBottom: '16px' }}>Wealth Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <p style={{ margin: 0, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  📈 <strong>LuSE Index Gains:</strong> Lusaka Securities Exchange index rises 1.4% led by telecoms sector improvements.
                </p>
                <p style={{ margin: 0, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  💰 <strong>Treasury Yields:</strong> Standard Treasury bill yields hit a 2-year high, boosting dividend forecast values.
                </p>
                <p style={{ margin: 0 }}>
                  💡 <strong>Smart Investing:</strong> Diversify assets across high-yield bonds and cash accounts to secure returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
