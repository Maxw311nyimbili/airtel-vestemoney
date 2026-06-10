import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function StockDetailPage({ walletBalance, sharesOwned, onTradeExecute, showToast }) {
  const { symbol } = useParams();
  const navigate   = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [tradeType,     setTradeType]     = useState('buy');
  const [tradeQty,      setTradeQty]      = useState(100);
  const [timeframe,     setTimeframe]     = useState('1D');
  const [hoveredPoint,  setHoveredPoint]  = useState(null);

  if (!stock) {
    return (
      <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>
        <div className="pf-header">
          <button className="back-btn" onClick={() => navigate('/market')}>
            <Icons.ChevronLeft />
          </button>
          <span className="pf-header-title">Not found</span>
        </div>
      </div>
    );
  }

  const owned     = sharesOwned[stock.symbol] || 0;
  const totalCost = stock.price * tradeQty;

  // ── Chart data ──────────────────────────────────────────────
  const chartData = useMemo(() => {
    const b = stock.trend || [stock.open, stock.prevClose, stock.price];
    if (timeframe === '1D') return b;
    if (timeframe === '1W') return [
      b[0]*0.96, b[1]*0.98, b[2]*0.97,
      b[Math.min(3,b.length-1)]*1.01,
      b[Math.min(4,b.length-1)]*0.99,
      b[Math.min(5,b.length-1)]*1.02,
      stock.price
    ];
    if (timeframe === '1M') return [
      b[0]*0.92, b[0]*0.95, b[1]*0.91, b[2]*0.97,
      b[Math.min(3,b.length-1)]*0.94,
      b[Math.min(4,b.length-1)]*1.03,
      b[Math.min(5,b.length-1)]*1.01,
      stock.price
    ];
    return [
      b[0]*0.78, b[0]*0.84, b[1]*0.82, b[2]*0.91,
      b[Math.min(3,b.length-1)]*0.89,
      b[Math.min(4,b.length-1)]*0.98,
      b[Math.min(5,b.length-1)]*0.95,
      stock.price*1.05, stock.price*1.02, stock.price
    ];
  }, [timeframe, stock]);

  // ── SVG chart ───────────────────────────────────────────────
  const W = 500, H = 200;
  const pad = { top: 16, bottom: 28, left: 44, right: 16 };
  const minP = Math.min(...chartData);
  const maxP = Math.max(...chartData);
  const range = maxP - minP || 1;

  const points = useMemo(() => chartData.map((v, i) => ({
    x: pad.left + (i / (chartData.length - 1)) * (W - pad.left - pad.right),
    y: H - pad.bottom - ((v - minP) / range) * (H - pad.top - pad.bottom),
    value: v, index: i,
  })), [chartData, minP, range]);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length-1].x} ${H-pad.bottom} L ${points[0].x} ${H-pad.bottom} Z`;

  const displayPrice  = hoveredPoint ? hoveredPoint.value  : stock.price;
  const displayChange = hoveredPoint
    ? ((hoveredPoint.value - chartData[0]) / chartData[0]) * 100
    : stock.change;
  const isUp = displayChange >= 0;

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xSvg = ((e.clientX - rect.left) / rect.width) * W;
    let closest = points[0], minD = Infinity;
    points.forEach(p => { const d = Math.abs(p.x - xSvg); if (d < minD) { minD = d; closest = p; } });
    setHoveredPoint(closest);
  };
  const onTouchMove = (e) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xSvg = ((e.touches[0].clientX - rect.left) / rect.width) * W;
    let closest = points[0], minD = Infinity;
    points.forEach(p => { const d = Math.abs(p.x - xSvg); if (d < minD) { minD = d; closest = p; } });
    setHoveredPoint(closest);
  };

  const executeTrade = () => {
    if (tradeType === 'buy' && walletBalance < totalCost) {
      showToast('Airtel Wallet balance too low.'); return;
    }
    if (tradeType === 'sell' && owned < tradeQty) {
      showToast('You do not own enough shares.'); return;
    }
    onTradeExecute(tradeType, stock.symbol, tradeQty, totalCost);
    showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${tradeQty} shares of ${stock.symbol}`);
    navigate('/market');
  };

  return (
    <div className="screen-container slide-in-right" style={{ background: 'var(--bg-body)' }}>

      {/* ── Sticky header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/market')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">{stock.symbol} · {stock.name.split(' ')[0]}</span>
        {owned > 0 && (
          <span className="sd-owned-chip">{owned.toLocaleString()} owned</span>
        )}
      </div>

      <div className="sd-wrapper">

        {/* ── Price hero ── */}
        <div className="sd-price-row">
          <div>
            <span className="sd-price">ZMW {displayPrice.toFixed(2)}</span>
            <span className={`sd-change ${isUp ? 'chg-up' : 'chg-dn'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(displayChange).toFixed(2)}%
            </span>
          </div>
          <div className="sd-sector-pill">{stock.sector}</div>
        </div>

        {/* ── Chart ── */}
        <div className="sd-chart-card">
          <div className="sd-chart-header">
            <div className="timeframe-selector">
              {['1D','1W','1M','1Y'].map(tf => (
                <button
                  key={tf}
                  className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >{tf}</button>
              ))}
            </div>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
            onTouchStart={onTouchMove}
            onTouchMove={onTouchMove}
            onTouchEnd={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="sd-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#E30613" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#E30613" stopOpacity="0.00" />
              </linearGradient>
            </defs>
            {/* grid lines */}
            {[pad.top, (H-pad.bottom+pad.top)/2, H-pad.bottom].map((y, i) => (
              <line key={i} x1={pad.left} y1={y} x2={W-pad.right} y2={y}
                stroke="#E5E7EB" strokeWidth="1" strokeDasharray={i===2?'none':'4 4'} />
            ))}
            {/* y labels */}
            <text x={pad.left-6} y={pad.top+4}             textAnchor="end" fill="#9BA1B2" fontSize="10">{maxP.toFixed(2)}</text>
            <text x={pad.left-6} y={(H-pad.bottom+pad.top)/2+3} textAnchor="end" fill="#9BA1B2" fontSize="10">{((maxP+minP)/2).toFixed(2)}</text>
            <text x={pad.left-6} y={H-pad.bottom+3}        textAnchor="end" fill="#9BA1B2" fontSize="10">{minP.toFixed(2)}</text>
            {/* area + line */}
            <path d={areaPath} fill="url(#sd-grad)" />
            <path d={linePath} fill="none" stroke="#E30613" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* live dot */}
            {!hoveredPoint && points.length > 0 && (
              <>
                <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="8" fill="#E30613" opacity="0.25" />
                <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill="#E30613" />
              </>
            )}
            {/* hover crosshair */}
            {hoveredPoint && (
              <g>
                <line x1={hoveredPoint.x} y1={pad.top} x2={hoveredPoint.x} y2={H-pad.bottom}
                  stroke="#9BA1B2" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6"
                  fill="#E30613" stroke="#fff" strokeWidth="2" />
                <rect
                  x={Math.max(pad.left, Math.min(hoveredPoint.x-36, W-pad.right-72))}
                  y={Math.max(pad.top+4, hoveredPoint.y-26)}
                  width="72" height="18" rx="4" fill="#1A1D27"
                />
                <text
                  x={Math.max(pad.left+36, Math.min(hoveredPoint.x, W-pad.right-36))}
                  y={Math.max(pad.top+16, hoveredPoint.y-14)}
                  textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700"
                >ZMW {hoveredPoint.value.toFixed(2)}</text>
              </g>
            )}
          </svg>
        </div>

        {/* ── Stats strip ── */}
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat-lbl">Open</span>
            <span className="sd-stat-val">ZMW {stock.open.toFixed(2)}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-lbl">Prev Close</span>
            <span className="sd-stat-val">ZMW {stock.prevClose.toFixed(2)}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-lbl">Day Low</span>
            <span className="sd-stat-val">ZMW {stock.dayLow.toFixed(2)}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-lbl">Day High</span>
            <span className="sd-stat-val">ZMW {stock.dayHigh.toFixed(2)}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-lbl">Volume</span>
            <span className="sd-stat-val">{stock.volume}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-lbl">Yield</span>
            <span className="sd-stat-val chg-up">{stock.yield}%</span>
          </div>
        </div>

        {/* ── Trade panel ── */}
        <div className="sd-trade-card">
          <div className="trade-drawer-tabs">
            <button
              className={`trade-drawer-tab buy ${tradeType === 'buy' ? 'active' : ''}`}
              onClick={() => setTradeType('buy')}
            >Buy</button>
            <button
              className={`trade-drawer-tab sell ${tradeType === 'sell' ? 'active' : ''}`}
              onClick={() => setTradeType('sell')}
            >Sell</button>
          </div>

          <div className="sd-trade-balance">
            Wallet: <strong>ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            {owned > 0 && <> · Owned: <strong>{owned.toLocaleString()} shares</strong></>}
          </div>

          <div className="trade-drawer-qty-selector">
            <label>Number of shares</label>
            <div className="qty-input-row">
              <button onClick={() => setTradeQty(q => Math.max(1, q - 10))}>−</button>
              <input
                type="number" min="1"
                value={tradeQty}
                onChange={e => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setTradeQty(q => q + 10)}>+</button>
            </div>
            <div className="qty-presets">
              {[50, 100, 500].map(n => (
                <button key={n} onClick={() => setTradeQty(n)}>{n}</button>
              ))}
            </div>
          </div>

          <div className="trade-drawer-summary">
            <div className="summary-row">
              <span>Price per share</span>
              <span>ZMW {stock.price.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>{tradeType === 'buy' ? 'Total cost' : 'Proceeds'}</span>
              <span>ZMW {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button
            className={`trade-drawer-confirm-btn ${tradeType}`}
            onClick={executeTrade}
          >
            {tradeType === 'buy' ? `Buy ${tradeQty} Shares` : `Sell ${tradeQty} Shares`}
          </button>
        </div>

      </div>
    </div>
  );
}
