import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import StockLogo from '../../StockLogo';

export default function OrderStatusPage({ sharesOwned, pendingTrades }) {
  const navigate = useNavigate();
  const { symbol } = useParams();

  const stock = MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());

  if (!stock) {
    return (
      <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate('/portfolio')}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">Order Status</span>
        </div>
      </div>
    );
  }

  const qty   = sharesOwned[stock.symbol] || 0;
  const value = qty * stock.price;

  const pending = pendingTrades && pendingTrades[stock.symbol];
  const action  = pending === 'sell' ? 'Sell' : 'Buy';

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
      <div className="pf-wrapper">

        {/* ── Header ── */}
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate('/portfolio')}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">Order Status</span>
        </div>

        <div className="os-body">

          {/* ── Stock info ── */}
          <div className="os-stock-card">
            <StockLogo stock={stock} className="os-stock-logo" />
            <div className="os-stock-info">
              <span className="os-stock-sym">{stock.symbol}</span>
              <span className="os-stock-name">{stock.name}</span>
            </div>
            <span className="os-stock-price">ZMW {stock.price.toFixed(2)}</span>
          </div>

          {/* ── Status ── */}
          <div className="pf-view-status-row">
            <span className="pf-view-status-lbl">{action} Order Status</span>
            {pending ? (
              <span className="pf-status-pill pf-status-pending">Pending</span>
            ) : (
              <span className="pf-status-pill pf-status-settled">Settled</span>
            )}
          </div>
          <p className="pf-view-status-note">
            {pending
              ? 'Waiting for LuSE to match this order. This usually settles within one trading session.'
              : 'This order has been matched and settled on LuSE.'}
          </p>

          {/* ── Summary ── */}
          <div className="trade-drawer-summary os-summary">
            <div className="summary-row">
              <span>Shares Owned:</span>
              <span>{qty.toLocaleString()} shares</span>
            </div>
            <div className="summary-row">
              <span>Current Value:</span>
              <span>ZMW {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
