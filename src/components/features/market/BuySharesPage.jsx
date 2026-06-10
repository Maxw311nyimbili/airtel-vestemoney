import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import airtelLogo from '../../../images/airtel_logo.png';

const PRESETS = [50, 100, 500, 1000];

export default function BuySharesPage({ walletBalance, sharesOwned, onTradeExecute, showToast }) {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!stock) return null;

  const investAmount = customMode ? (parseFloat(customValue) || 0) : selectedAmount;
  const estimatedShares = investAmount > 0 ? Math.floor(investAmount / stock.price) : 0;
  const canBuy = investAmount > 0 && investAmount <= walletBalance && estimatedShares >= 1;

  const handleReviewOrder = () => {
    if (!canBuy) {
      if (investAmount > walletBalance) showToast('Insufficient Airtel Money balance.');
      else showToast('Enter a valid investment amount.');
      return;
    }
    setConfirmed(true);
  };

  const handleConfirm = () => {
    onTradeExecute('buy', stock.symbol, estimatedShares);
    showToast(`Bought ${estimatedShares} shares of ${stock.symbol}!`);
    navigate(`/market/${stock.symbol}`);
  };

  return (
    <div className="screen-container slide-in-right sd-page">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Buy Shares</span>
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

        {/* ── Amount to invest ── */}
        <div className="trade-section">
          <span className="trade-section-title">Amount to Invest</span>
          <div className="trade-presets">
            {PRESETS.map(amt => (
              <button
                key={amt}
                className={`trade-preset-btn ${!customMode && selectedAmount === amt ? 'active' : ''}`}
                onClick={() => { setCustomMode(false); setSelectedAmount(amt); }}
              >
                ZMW {amt.toLocaleString()}
              </button>
            ))}
            <button
              className={`trade-preset-btn ${customMode ? 'active' : ''}`}
              onClick={() => { setCustomMode(true); setSelectedAmount(0); }}
            >
              Custom Amount
            </button>
          </div>
          {customMode && (
            <div className="trade-custom-input-wrap">
              <span className="trade-custom-prefix">ZMW</span>
              <input
                type="number"
                className="trade-custom-input"
                placeholder="0.00"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                autoFocus
                min="0"
              />
            </div>
          )}
        </div>

        {/* ── Estimated shares ── */}
        <div className="trade-section trade-est-row">
          <div>
            <span className="trade-section-title">Estimated Shares</span>
            <span className="trade-est-note">Estimated, may change at execution</span>
          </div>
          <span className="trade-est-value">{estimatedShares} Shares</span>
        </div>

        {/* ── Payment method ── */}
        <div className="trade-section">
          <span className="trade-section-title">Payment Method</span>
          <div className="trade-payment-row">
            <div className="trade-payment-logo">
              <img src={airtelLogo} alt="Airtel" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            </div>
            <div className="trade-payment-info">
              <span className="trade-payment-name">Airtel Money</span>
              <span className="trade-payment-bal">Available Balance: ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="trade-payment-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* ── Review Order / Confirm ── */}
      <div className="sd-bottom-bar">
        {!confirmed ? (
          <button
            className={`trade-review-btn ${canBuy ? '' : 'disabled'}`}
            onClick={handleReviewOrder}
          >
            Review Order
          </button>
        ) : (
          <div className="trade-confirm-area">
            <div className="trade-confirm-summary">
              <span>Buying <strong>{estimatedShares} shares</strong> of <strong>{stock.symbol}</strong></span>
              <span>Total: <strong>ZMW {investAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <div className="trade-confirm-btns">
              <button className="trade-cancel-btn" onClick={() => setConfirmed(false)}>Cancel</button>
              <button className="trade-confirm-btn" onClick={handleConfirm}>Confirm Buy</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
