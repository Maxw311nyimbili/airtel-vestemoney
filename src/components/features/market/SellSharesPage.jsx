import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import paymentLogo from '../../../images/payment_logo.png';
import GuestLock from '../../shared/GuestLock';
import StockLogo from '../../StockLogo';

const PRESETS = [10, 50, 100, 500];
const BROKER_RATE = 0.010;
const LUSE_RATE   = 0.003;
const SEC_RATE    = 0.002;
const FEE_RATE    = BROKER_RATE + LUSE_RATE + SEC_RATE;

function genOrderId() {
  return 'SLL' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/* ── Step 1: Order Review ── */
function OrderReview({ stock, qty, proceeds, onBack, onContinue }) {
  const fees   = proceeds * FEE_RATE;
  const net    = proceeds - fees;
  const rows = [
    { label: 'Order Type',    value: 'Sell', cls: 'orev-type-sell' },
    { label: 'Company',       value: stock.name },
    { label: 'Current Price', value: `ZMW ${stock.price.toFixed(2)}` },
    { label: 'Shares to Sell',value: `${qty} Shares` },
    { label: 'Gross Proceeds',value: `ZMW ${proceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Broker Fees (1.0%)', value: `ZMW ${(proceeds * BROKER_RATE).toFixed(2)}` },
    { label: 'LuSE Fees (0.3%)',   value: `ZMW ${(proceeds * LUSE_RATE).toFixed(2)}` },
    { label: 'SEC Fees (0.2%)',    value: `ZMW ${(proceeds * SEC_RATE).toFixed(2)}` },
  ];
  return (
    <div className="order-modal-overlay">
      <div className="order-modal-header">
        <button className="back-btn" onClick={onBack}><Icons.ChevronLeft /></button>
        <span className="order-modal-title">Order Review</span>
      </div>
      <div className="order-modal-body">
        <div className="orev-rows">
          {rows.map(r => (
            <div key={r.label} className="orev-row">
              <span className="orev-label">{r.label}</span>
              <span className={`orev-value ${r.cls || ''}`}>{r.value}</span>
            </div>
          ))}
          <div className="orev-row orev-total">
            <span className="orev-label">Net Proceeds</span>
            <span className="orev-value">ZMW {net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      <div className="order-modal-footer">
        <button className="order-cta-btn" onClick={onContinue}>Continue to PIN</button>
      </div>
    </div>
  );
}

/* ── Step 2: PIN Entry ── */
function PinEntry({ onBack, onSuccess }) {
  const [pin, setPin] = useState('');
  const handleKey = (key) => {
    if (key === 'del') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) setTimeout(onSuccess, 350);
  };
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
  return (
    <div className="order-modal-overlay">
      <div className="order-modal-header">
        <button className="back-btn" onClick={onBack}><Icons.ChevronLeft /></button>
        <span className="order-modal-title">Enter Airtel PIN</span>
      </div>
      <div className="pin-modal-body">
        <p className="pin-modal-subtitle">Enter your Airtel Money PIN to complete the transaction</p>
        <div className="pin-dots">
          {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />)}
        </div>
        <button className="pin-forgot">Forgot PIN?</button>
        <div className="pin-numpad">
          {keys.map((k, i) =>
            k === '' ? <div key={i} className="pin-key empty" /> :
            k === 'del' ? (
              <button key={i} className="pin-key pin-del" onClick={() => handleKey('del')}>
                <svg width="22" height="16" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H21a1 1 0 011 1v10a1 1 0 01-1 1H9l-6-6 6-6z"/>
                  <line x1="13" y1="8" x2="17" y2="12"/><line x1="17" y1="8" x2="13" y2="12"/>
                </svg>
              </button>
            ) : (
              <button key={i} className="pin-key" onClick={() => handleKey(k)}>{k}</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Success ── */
function OrderSuccess({ stock, qty, proceeds, orderId, onViewPortfolio, onBackHome }) {
  const fees = proceeds * FEE_RATE;
  const net  = proceeds - fees;
  const now  = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const rows = [
    { label: 'Net Proceeds', value: `ZMW ${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Stock',        value: stock.name },
    { label: 'Shares Sold',  value: `${qty} Shares` },
    { label: 'Order ID',     value: orderId },
    { label: 'Date & Time',  value: now },
  ];
  return (
    <div className="order-modal-overlay success-overlay">
      <div className="success-top">
        <div className="success-check-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="success-heading">Payment Successful!</h2>
        <p className="success-sub-text">You have successfully sold {qty} shares of {stock.name}.</p>
      </div>
      <div className="success-card">
        {rows.map(r => (
          <div key={r.label} className="orev-row">
            <span className="orev-label">{r.label}</span>
            <span className="orev-value">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="success-actions">
        <button className="order-cta-btn" onClick={onViewPortfolio}>View Portfolio</button>
        <button className="success-home-btn" onClick={onBackHome}>Back to Home</button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function SellSharesPage({ walletBalance, sharesOwned, onTradeExecute, showToast, isGuest }) {
  const { symbol } = useParams();
  const navigate   = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [selectedQty,   setSelectedQty]   = useState(null);
  const [customMode,    setCustomMode]     = useState(false);
  const [customValue,   setCustomValue]    = useState('');
  const [step,          setStep]           = useState('select');
  const [orderId,       setOrderId]        = useState('');
  const [noSharesModal, setNoSharesModal]  = useState(false);

  if (!stock) return null;

  if (isGuest) {
    return (
      <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">Sell {stock.symbol}</span>
        </div>
        <GuestLock
          title="Sign in to manage your shares"
          message="Create an account or sign in to sell shares from your portfolio."
        />
      </div>
    );
  }

  const owned   = sharesOwned[stock.symbol] || 0;
  const qty     = customMode ? (parseInt(customValue) || 0) : (selectedQty || 0);
  const proceeds= qty * stock.price;
  const fees    = proceeds * FEE_RATE;
  const net     = proceeds - fees;
  const canSell = qty > 0 && qty <= owned;

  const handleReviewOrder = () => {
    if (owned === 0) {
      setNoSharesModal(true);
      return;
    }
    if (!canSell) {
      if (qty > owned) showToast(`You only own ${owned} shares.`);
      else showToast('Enter a valid number of shares.');
      return;
    }
    setStep('review');
  };

  const handlePinSuccess = () => {
    const id = genOrderId();
    setOrderId(id);
    onTradeExecute('sell', stock.symbol, qty);
    setStep('success');
  };

  return (
    <div className="screen-container slide-in-right sd-page">
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Sell Shares</span>
      </div>

      <div className="trade-page-body">
        <div className="trade-stock-card">
          <StockLogo stock={stock} className="trade-stock-logo" />
          <div className="trade-stock-info">
            <span className="trade-stock-name">{stock.name}</span>
            <span className="trade-stock-price-lbl">Current Price</span>
            <span className="trade-stock-price">ZMW {stock.price.toFixed(2)}</span>
          </div>
          <span className={`trade-stock-chg ${stock.change >= 0 ? 'chg-up' : 'chg-dn'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
          </span>
        </div>

        <div className="trade-owned-bar">
          <span>Shares you own:</span>
          <span className="trade-owned-count">{owned.toLocaleString()} shares</span>
        </div>

        <div className="trade-section">
          <span className="trade-section-title">Shares to Sell</span>
          <div className="trade-presets">
            {PRESETS.filter(n => n <= owned || owned === 0).map(n => (
              <button key={n}
                className={`trade-preset-btn ${!customMode && selectedQty === n ? 'active' : ''}`}
                onClick={() => { setCustomMode(false); setSelectedQty(n); }}>
                {n} shares
              </button>
            ))}
            {owned > 0 && (
              <button className={`trade-preset-btn ${!customMode && selectedQty === owned ? 'active' : ''}`}
                onClick={() => { setCustomMode(false); setSelectedQty(owned); }}>
                All ({owned})
              </button>
            )}
            <button className={`trade-preset-btn ${customMode ? 'active' : ''}`}
              onClick={() => { setCustomMode(true); setSelectedQty(null); }}>
              Custom
            </button>
          </div>
          {customMode && (
            <div className="trade-custom-input-wrap">
              <input type="number" className="trade-custom-input" placeholder="Number of shares"
                value={customValue} onChange={e => setCustomValue(e.target.value)} autoFocus min="1" max={owned} />
              <span className="trade-custom-suffix">shares</span>
            </div>
          )}
          <div className="trade-est-row" style={{ marginTop: 10 }}>
            <span className="trade-est-note">Actual shares</span>
            <span className="trade-est-value">{qty.toLocaleString()} {qty === 1 ? 'share' : 'shares'}</span>
          </div>
        </div>

        {/* ── Order summary breakdown ── */}
        <div className="trade-section">
          <span className="trade-section-title">Order Summary</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Share Price</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {stock.price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Number of Shares</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{qty} Shares</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Gross Proceeds</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {proceeds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Broker Fees (1.0%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(proceeds * BROKER_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>LuSE Fees (0.3%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(proceeds * LUSE_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>SEC Fees (0.2%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(proceeds * SEC_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ height: 1, background: '#F0F0F0', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, color: '#E30613' }}>
              <span>Net Proceeds (Airtel Payout)</span>
              <span>ZMW {net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="trade-section">
          <span className="trade-section-title">Proceeds go to</span>
          <div className="trade-payment-row">
            <div className="trade-payment-logo">
              <img src={paymentLogo} alt="Payment" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            </div>
            <div className="trade-payment-info">
              <span className="trade-payment-name">Airtel Money</span>
            </div>
            <div className="trade-payment-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="sd-bottom-bar">
        <button className={`trade-review-btn sell ${canSell ? '' : 'disabled'}`} onClick={handleReviewOrder}>
          Review Order
        </button>
      </div>

      {step === 'review' && (
        <OrderReview stock={stock} qty={qty} proceeds={proceeds}
          onBack={() => setStep('select')} onContinue={() => setStep('pin')} />
      )}
      {step === 'pin' && (
        <PinEntry onBack={() => setStep('review')} onSuccess={handlePinSuccess} />
      )}
      {step === 'success' && (
        <OrderSuccess stock={stock} qty={qty} proceeds={proceeds} orderId={orderId}
           onBackHome={() => navigate('/dashboard')} />
      )}

      {/* No Shares Modal */}
      {noSharesModal && (
        <div className="no-shares-modal-overlay" onClick={() => setNoSharesModal(false)}>
          <div className="no-shares-modal" onClick={e => e.stopPropagation()}>
            <StockLogo stock={stock} className="no-shares-modal-logo" />
            <h3 className="no-shares-modal-title">No Shares to Sell</h3>
            <p className="no-shares-modal-msg">
              You don't own any shares of <strong>{stock.symbol}</strong>. Buy shares first before you can sell.
            </p>
            <button
              className="no-shares-buy-btn"
              onClick={() => { setNoSharesModal(false); navigate(`/buy/${stock.symbol}`); }}
            >
              Buy {stock.symbol} Shares
            </button>
            <button className="no-shares-cancel-btn" onClick={() => setNoSharesModal(false)}>
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
