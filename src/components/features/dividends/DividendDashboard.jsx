import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS, UPCOMING_DIVIDENDS } from '../../../data/mockData';

export default function DividendDashboard({ 
  sharesOwned, 
  dividendEarnings, 
  showToast 
}) {
  const navigate = useNavigate();
  const [calcStock, setCalcStock] = useState('ATEL');
  const [calcShares, setCalcShares] = useState(500);

  const calculatedDividendOutput = useMemo(() => {
    const selected = MOCK_STOCKS.find(s => s.symbol === calcStock);
    if (!selected) return 0;
    return calcShares * selected.price * (selected.yield / 100);
  }, [calcStock, calcShares]);

  return (
    <div className="screen-container slide-in-right">
      <div className="page-container">
        <div className="sub-page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <Icons.ChevronLeft />
          </button>
          <div>
            <h1>Dividend Hub</h1>
            <p className="page-description">Forecast payouts and plan your next investment from the dividend center.</p>
          </div>
          <button className="header-action-text" onClick={() => showToast('Calendar synced')}>Sync</button>
        </div>

        <div className="responsive-two-col-grid">
          {/* Left Column: Annual Estimate & Calculator */}
          <div className="dividend-main-col">
            <div className="dividend-hero">
              <span className="dividend-hero-label">Est. Annual Dividend Income</span>
              <h2 className="dividend-hero-value">ZMW {(dividendEarnings.monthlyEstimated * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className="dividend-hero-sub">Average portfolio payout: ZMW {dividendEarnings.monthlyEstimated.toLocaleString('en-US', { maximumFractionDigits: 2 })} / month</p>
            </div>

            <div className="calc-card">
              <div className="calc-card-title">
                <Icons.Calculator /> Dividend Income Calculator
              </div>
              <div className="calc-inputs">
                <div className="calc-field">
                  <label>Select Stock Asset</label>
                  <select value={calcStock} onChange={(e) => setCalcStock(e.target.value)}>
                    {MOCK_STOCKS.filter(s => s.type === 'equities').map(s => (
                      <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name.split(' ')[0]} ({s.yield}% yield)</option>
                    ))}
                  </select>
                </div>
                <div className="calc-field">
                  <label>Estimated Number of Shares</label>
                  <input type="number" value={calcShares} onChange={(e) => setCalcShares(Math.max(0, parseInt(e.target.value) || 0))} />
                </div>
              </div>
              <div className="calc-result">
                <div className="calc-result-label">Estimated Annual Dividend Payout</div>
                <div className="calc-result-value">ZMW {calculatedDividendOutput.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Dividend Calendar */}
          <div className="dividend-side-col">
            <h3 className="subsection-title" style={{ marginTop: 0 }}>Upcoming Dividend Calendar</h3>
            <div className="dividend-list">
              {UPCOMING_DIVIDENDS.map(div => {
                const owned = sharesOwned[div.symbol] || 0;
                const estPayout = owned * div.rate;
                return (
                  <div key={div.symbol} className="dividend-row">
                    <div>
                      <div className="dividend-row-symbol">{div.symbol} (Ex-Date: {div.exDate})</div>
                      <div className="dividend-row-date">Payout Date: {div.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="dividend-row-rate">ZMW {div.rate.toFixed(2)} / share</div>
                      <div className="dividend-row-payout">{owned > 0 ? `Your Payout: ZMW ${estPayout.toFixed(2)}` : '0 shares owned'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
