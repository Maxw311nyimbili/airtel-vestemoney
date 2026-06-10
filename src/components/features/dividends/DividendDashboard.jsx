import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS, UPCOMING_DIVIDENDS } from '../../../data/mockData';

export default function DividendDashboard({
  sharesOwned,
  dividendEarnings,
  showToast,
}) {
  const navigate = useNavigate();
  const [calcStock,  setCalcStock]  = useState('ATEL');
  const [calcShares, setCalcShares] = useState(500);

  const calcResult = useMemo(() => {
    const s = MOCK_STOCKS.find(x => x.symbol === calcStock);
    if (!s) return 0;
    return calcShares * s.price * (s.yield / 100);
  }, [calcStock, calcShares]);

  const yearlyEst = dividendEarnings.monthlyEstimated * 12;

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>

      {/* ── Sticky header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Dividends</span>
      </div>

      <div className="pf-wrapper">

        {/* ── Hero card ── */}
        <div className="pf-hero-card" style={{ marginTop: 16 }}>
          <div className="pf-hero-pattern" />
          <span className="pf-hero-label">Estimated Yearly Payout</span>
          <span className="pf-hero-value">
            ZMW {yearlyEst.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="pf-hero-stats">
            <div className="pf-hero-stat">
              <span className="pf-stat-lbl">Monthly avg</span>
              <span className="pf-stat-val">
                ZMW {dividendEarnings.monthlyEstimated.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pf-stat-sep" />
            <div className="pf-hero-stat">
              <span className="pf-stat-lbl">Companies paying</span>
              <span className="pf-stat-val">{UPCOMING_DIVIDENDS.length} upcoming</span>
            </div>
          </div>
        </div>

        {/* ── Upcoming payouts ── */}
        <p className="pf-section-label">Upcoming Payouts</p>
        <div className="pf-buckets">
          {UPCOMING_DIVIDENDS.map(div => {
            const owned     = sharesOwned[div.symbol] || 0;
            const estPayout = owned * div.rate;
            return (
              <div key={div.symbol} className="div-row">
                {/* Left: company + dates */}
                <div className="div-row-left">
                  <span className="div-row-sym">{div.symbol}</span>
                  <span className="div-row-date">Pay date: {div.date}</span>
                  <span className="div-row-exdate">Own by: {div.exDate}</span>
                </div>
                {/* Right: rate + your payout */}
                <div className="div-row-right">
                  <span className="div-row-rate">ZMW {div.rate.toFixed(2)}/share</span>
                  <span className={`div-row-payout ${owned > 0 ? 'div-owned' : 'div-none'}`}>
                    {owned > 0
                      ? `+ZMW ${estPayout.toFixed(2)}`
                      : '0 shares'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Payout Calculator ── */}
        <p className="pf-section-label" style={{ marginTop: 28 }}>Payout Calculator</p>
        <div className="div-calc-card">
          <div className="calc-inputs" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
            <div className="calc-field">
              <label>Company</label>
              <select value={calcStock} onChange={e => setCalcStock(e.target.value)}>
                {MOCK_STOCKS.filter(s => s.type === 'equities').map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name.split(' ')[0]} ({s.yield}% rate)
                  </option>
                ))}
              </select>
            </div>
            <div className="calc-field">
              <label>Number of shares</label>
              <input
                type="number"
                value={calcShares}
                onChange={e => setCalcShares(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>
          <div className="calc-result">
            <div className="calc-result-label">Estimated Yearly Payout</div>
            <div className="calc-result-value">
              ZMW {calcResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
