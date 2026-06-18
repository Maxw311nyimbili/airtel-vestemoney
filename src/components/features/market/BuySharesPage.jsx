import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import paymentLogo from '../../../images/payment_logo.png';
import GuestLock from '../../shared/GuestLock';
import StockLogo from '../../StockLogo';

const BROKER_RATE = 0.010;
const LUSE_RATE   = 0.003;
const SEC_RATE    = 0.002;
const FEE_RATE    = BROKER_RATE + LUSE_RATE + SEC_RATE; // 1.5%

function genOrderId() {
  return 'INV' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/* ── Step 1: Order Review ── */
function OrderReview({ stock, amount, shares, onBack, onContinue }) {
  const amtNum = parseFloat(amount) || 0;
  const fees  = amtNum * FEE_RATE;
  const total = amtNum + fees;
  const rows = [
    { label: 'Order Type',       value: 'Buy',  cls: 'orev-type-buy' },
    { label: 'Stock',            value: stock.name },
    { label: 'Current Price',    value: `ZMW ${stock.price.toFixed(2)}` },
    { label: 'Amount',           value: `ZMW ${amtNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Number of Shares', value: `${shares} Shares` },
    { label: 'Broker Fees (1.0%)', value: `ZMW ${(amtNum * BROKER_RATE).toFixed(2)}` },
    { label: 'LuSE Fees (0.3%)',  value: `ZMW ${(amtNum * LUSE_RATE).toFixed(2)}` },
    { label: 'SEC Fees (0.2%)',   value: `ZMW ${(amtNum * SEC_RATE).toFixed(2)}` },
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
            <span className="orev-label">Total</span>
            <span className="orev-value">ZMW {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="orev-pay-section">
          <span className="orev-pay-label">Pay with</span>
          <div className="orev-pay-row">
            <img src={paymentLogo} alt="Payment" className="orev-pay-logo" style={{ objectFit: 'contain' }} />
            <span className="orev-pay-name">Airtel Money</span>
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
function OrderSuccess({ stock, amount, shares, orderId, onViewPortfolio, onBackHome }) {
  const amtNum = parseFloat(amount) || 0;
  const fees  = amtNum * FEE_RATE;
  const total = amtNum + fees;
  const now   = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const rows  = [
    { label: 'Amount Paid',   value: `ZMW ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Stock',         value: stock.name },
    { label: 'Shares Bought', value: `${shares} Shares` },
    { label: 'Order ID',      value: orderId },
    { label: 'Date & Time',   value: now },
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
        <p className="success-sub-text">You have successfully bought {shares} shares of {stock.name}.</p>
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
export default function BuySharesPage({ walletBalance, sharesOwned, onTradeExecute, showToast, isGuest }) {
  const { symbol } = useParams();
  const navigate   = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [amount,         setAmount]         = useState('');
  const [step,           setStep]           = useState('select');
  const [orderId,        setOrderId]        = useState('');

  if (!stock) return null;

  if (isGuest) {
    return (
      <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">Buy {stock.symbol}</span>
        </div>
        <GuestLock
          title="Sign in to invest"
          message="Create an account or sign in to buy shares and grow your portfolio."
        />
      </div>
    );
  }

  const amountValue = parseFloat(amount) || 0;
  const qty   = stock.price > 0 ? Math.floor(amountValue / stock.price) : 0;
  const gross = qty * stock.price;
  const fees  = gross * FEE_RATE;
  const total = gross + fees;
  const canBuy = qty > 0 && total <= walletBalance;

  const handleReviewOrder = () => {
    if (!canBuy) {
      showToast(total > walletBalance ? 'Insufficient Airtel Money balance.' : 'Enter an amount to invest.');
      return;
    }
    setStep('review');
  };

  const handlePinSuccess = () => {
    const id = genOrderId();
    setOrderId(id);
    onTradeExecute('buy', stock.symbol, qty);
    setStep('success');
  };

  return (
    <div className="screen-container slide-in-right sd-page">
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Buy Shares</span>
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

        <div className="trade-section">
          <span className="trade-section-title">Amount to Invest</span>
          <div className="trade-custom-input-wrap">
            <span className="trade-custom-prefix">ZMW</span>
            <input type="number" className="trade-custom-input" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)} autoFocus min="0" inputMode="decimal" />
          </div>
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
              <span>Subtotal (Gross)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Broker Fees (1.0%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(gross * BROKER_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>LuSE Fees (0.3%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(gross * LUSE_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>SEC Fees (0.2%)</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ZMW {(gross * SEC_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ height: 1, background: '#F0F0F0', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, color: '#E30613' }}>
              <span>Total Cost</span>
              <span>ZMW {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="trade-section">
          <span className="trade-section-title">Payment Method</span>
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
        <button className={`trade-review-btn ${canBuy ? '' : 'disabled'}`} onClick={handleReviewOrder}>
          Review Order
        </button>
      </div>

      {step === 'review' && (
        <OrderReview stock={stock} amount={amount} shares={qty}
          onBack={() => setStep('select')} onContinue={() => setStep('pin')} />
      )}
      {step === 'pin' && (
        <PinEntry onBack={() => setStep('review')} onSuccess={handlePinSuccess} />
      )}
      {step === 'success' && (
        <OrderSuccess stock={stock} amount={amount} shares={qty} orderId={orderId}
          onViewPortfolio={() => navigate('/portfolio')} onBackHome={() => navigate('/dashboard')} />
      )}
    </div>
  );
}
