import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import airtelLogo from '../../../images/airtel_logo.png';

const PRESETS = [10, 50, 100, 500];

export default function SellSharesPage({ walletBalance, sharesOwned, onTradeExecute, showToast }) {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [selectedQty, setSelectedQty] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!stock) return null;

  const owned = sharesOwned[stock.symbol] || 0;
  const qty = customMode ? (parseInt(customValue) || 0) : (selectedQty || 0);
  const proceeds = qty * stock.price;
  const canSell = qty > 0 && qty <= owned;

  const handleReviewOrder = () => {
    if (!canSell) {
      if (owned === 0) showToast('You don\'t own any shares of ' + stock.symbol);
      else if (qty > owned) showToast(`You only own ${owned} shares.`);
      else showToast('Enter a valid number of shares.');
      return;
    }
    setConfirmed(true);
  };

  const handleConfirm = () => {
    onTradeExecute('sell', stock.symbol, qty);
    showToast(`Sold ${qty} shares of ${stock.symbol}!`);
    navigate(`/market/${stock.symbol}`);
  };

  return (
    <div className="screen-container slide-in-right sd-page">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Sell Shares</span>
      </div>

      <div className="trade-page-body">

        {/* ── Stock summary card ── */}
        <div className="trade-stock-card">
          <div className="trade-stock-logo" style={{ background: stock.color }}>
            {stock.symbol.slice(0, 3)}
          </div>
          <div className="trade-stock-info">
            <span className="trade-stock-name">{stock.name}</span>
            <span className="trade-stock-price-lbl">Current Price</span>
            <span className="trade-stock-price">ZMW {stock.price.toFixed(2)}</span>
          </div>
          <span className={`trade-stock-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
          </span>
        </div>

        {/* ── Shares owned ── */}
        <div className="trade-owned-bar">
          <span>Shares you own:</span>
          <span className="trade-owned-count">{owned.toLocaleString()} shares</span>
        </div>

        {/* ── Shares to sell ── */}
        <div className="trade-section">
          <span className="trade-section-title">Shares to Sell</span>
          <div className="trade-presets">
            {PRESETS.filter(n => n <= owned || owned === 0).map(n => (
              <button
                key={n}
                className={`trade-preset-btn ${!customMode && selectedQty === n ? 'active' : ''}`}
                onClick={() => { setCustomMode(false); setSelectedQty(n); }}
              >
                {n} shares
              </button>
            ))}
            {owned > 0 && (
              <button
                className={`trade-preset-btn ${!customMode && selectedQty === owned ? 'active' : ''}`}
                onClick={() => { setCustomMode(false); setSelectedQty(owned); }}
              >
                All ({owned})
              </button>
            )}
            <button
              className={`trade-preset-btn ${customMode ? 'active' : ''}`}
              onClick={() => { setCustomMode(true); setSelectedQty(null); }}
            >
              Custom
            </button>
          </div>
          {customMode && (
            <div className="trade-custom-input-wrap">
              <input
                type="number"
                className="trade-custom-input"
                placeholder="Number of shares"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                autoFocus
                min="1"
                max={owned}
              />
              <span className="trade-custom-suffix">shares</span>
            </div>
          )}
        </div>

        {/* ── Estimated proceeds ── */}
        <div className="trade-section trade-est-row">
          <div>
            <span className="trade-section-title">Estimated Proceeds</span>
            <span className="trade-est-note">Estimated, may change at execution</span>
          </div>
          <span className="trade-est-value">ZMW {proceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* ── Payment destination ── */}
        <div className="trade-section">
          <span className="trade-section-title">Proceeds go to</span>
          <div className="trade-payment-row">
            <div className="trade-payment-logo">
              <img src={airtelLogo} alt="Airtel" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            </div>
            <div className="trade-payment-info">
              <span className="trade-payment-name">Airtel Money</span>
              <span className="trade-payment-bal">Current Balance: ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="trade-payment-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* ── Review / Confirm ── */}
      <div className="sd-bottom-bar">
        {!confirmed ? (
          <button
            className={`trade-review-btn sell ${canSell ? '' : 'disabled'}`}
            onClick={handleReviewOrder}
          >
            Review Order
          </button>
        ) : (
          <div className="trade-confirm-area">
            <div className="trade-confirm-summary">
              <span>Selling <strong>{qty} shares</strong> of <strong>{stock.symbol}</strong></span>
              <span>Proceeds: <strong>ZMW {proceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <div className="trade-confirm-btns">
              <button className="trade-cancel-btn" onClick={() => setConfirmed(false)}>Cancel</button>
              <button className="trade-confirm-btn sell" onClick={handleConfirm}>Confirm Sell</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
