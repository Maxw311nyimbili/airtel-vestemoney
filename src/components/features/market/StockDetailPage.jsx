import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function StockDetailPage({ walletBalance, sharesOwned, onTradeExecute, showToast }) {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  const [timeframe, setTimeframe] = useState('1D');
  const [hoveredPoint, setHoveredPoint] = useState(null);

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

  const owned = sharesOwned[stock.symbol] || 0;

  // ── Chart data ──────────────────────────────────────────────
  const chartData = useMemo(() => {
    const b = stock.trend || [stock.open, stock.prevClose, stock.price];
    if (timeframe === '1D') return b;
    if (timeframe === '1W') return [b[0]*0.96, b[1]*0.98, b[2]*0.97, b[Math.min(3,b.length-1)]*1.01, b[Math.min(4,b.length-1)]*0.99, b[Math.min(5,b.length-1)]*1.02, stock.price];
    if (timeframe === '1M') return [b[0]*0.92, b[0]*0.95, b[1]*0.91, b[2]*0.97, b[Math.min(3,b.length-1)]*0.94, b[Math.min(4,b.length-1)]*1.03, b[Math.min(5,b.length-1)]*1.01, stock.price];
    if (timeframe === '3M') return [b[0]*0.85, b[0]*0.88, b[1]*0.86, b[2]*0.92, b[Math.min(3,b.length-1)]*0.91, b[Math.min(4,b.length-1)]*0.97, stock.price*1.02, stock.price];
    return [b[0]*0.78, b[0]*0.84, b[1]*0.82, b[2]*0.91, b[Math.min(3,b.length-1)]*0.89, b[Math.min(4,b.length-1)]*0.98, b[Math.min(5,b.length-1)]*0.95, stock.price*1.05, stock.price*1.02, stock.price];
  }, [timeframe, stock]);

  // ── SVG chart ───────────────────────────────────────────────
  const W = 500, H = 180;
  const pad = { top: 12, bottom: 24, left: 44, right: 12 };
  const minP = Math.min(...chartData);
  const maxP = Math.max(...chartData);
  const range = maxP - minP || 1;
  const isUp = stock.change >= 0;
  const chartColor = isUp ? '#4B5563' : '#E30613';

  const points = useMemo(() => chartData.map((v, i) => ({
    x: pad.left + (i / (chartData.length - 1)) * (W - pad.left - pad.right),
    y: H - pad.bottom - ((v - minP) / range) * (H - pad.top - pad.bottom),
    value: v,
  })), [chartData, minP, range]);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length-1].x} ${H-pad.bottom} L ${points[0].x} ${H-pad.bottom} Z`;

  const displayPrice = hoveredPoint ? hoveredPoint.value : stock.price;
  const displayChange = hoveredPoint
    ? ((hoveredPoint.value - chartData[0]) / chartData[0]) * 100
    : stock.change;
  const displayDiff = displayPrice - (stock.prevClose || stock.open);

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

  // Mock extra stats
  const marketCap = (stock.price * parseFloat(stock.availableShares) * 1000).toFixed(1);
  const peRatio = (stock.price / (stock.price * 0.08)).toFixed(2);

  return (
    <div className="screen-container slide-in-right sd-page">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate('/market')}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">{stock.name.split(' ').slice(0, 3).join(' ')}</span>
        {owned > 0 && <span className="sd-owned-chip">{owned.toLocaleString()} owned</span>}
      </div>

      <div className="sd-wrapper">

        {/* ── Company identity ── */}
        <div className="sd-company-row">
          <div className="sd-company-logo" style={{ background: stock.color }}>
            {stock.symbol.slice(0, 3)}
          </div>
          <div className="sd-company-info">
            <span className="sd-company-name">{stock.name}</span>
            <span className="sd-company-sym">{stock.symbol} · {stock.sector}</span>
          </div>
        </div>

        {/* ── Price hero ── */}
        <div className="sd-price-hero">
          <span className="sd-price">ZMW {displayPrice.toFixed(2)}</span>
          <div className="sd-price-sub">
            <span className={`sd-change ${isUp ? 'chg-up' : 'chg-dn'}`}>
              {displayChange >= 0 ? '+' : ''}{displayChange.toFixed(2)}% ({displayDiff >= 0 ? '+' : ''}{displayDiff.toFixed(2)})
            </span>
            <span className="sd-today-label">Today</span>
          </div>
        </div>

        {/* ── Time period tabs ── */}
        <div className="sd-timeframe-row">
          {['1D','1W','1M','3M','1Y','5Y'].map(tf => (
            <button
              key={tf}
              className={`sd-tf-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >{tf}</button>
          ))}
        </div>

        {/* ── Chart ── */}
        <div className="sd-chart-wrap">
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
              <linearGradient id="sd-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={chartColor} stopOpacity="0.18" />
                <stop offset="100%" stopColor={chartColor} stopOpacity="0.00" />
              </linearGradient>
            </defs>
            {[pad.top, (H-pad.bottom+pad.top)/2, H-pad.bottom].map((y, i) => (
              <line key={i} x1={pad.left} y1={y} x2={W-pad.right} y2={y}
                stroke="#E5E7EB" strokeWidth="1" strokeDasharray={i===2?'none':'4 4'} />
            ))}
            <text x={pad.left-6} y={pad.top+4} textAnchor="end" fill="#9BA1B2" fontSize="10">{maxP.toFixed(2)}</text>
            <text x={pad.left-6} y={(H-pad.bottom+pad.top)/2+3} textAnchor="end" fill="#9BA1B2" fontSize="10">{((maxP+minP)/2).toFixed(2)}</text>
            <text x={pad.left-6} y={H-pad.bottom+3} textAnchor="end" fill="#9BA1B2" fontSize="10">{minP.toFixed(2)}</text>
            <path d={areaPath} fill="url(#sd-area-grad)" />
            <path d={linePath} fill="none" stroke={chartColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {!hoveredPoint && points.length > 0 && (
              <>
                <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="8" fill={chartColor} opacity="0.2" />
                <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill={chartColor} />
              </>
            )}
            {hoveredPoint && (
              <g>
                <line x1={hoveredPoint.x} y1={pad.top} x2={hoveredPoint.x} y2={H-pad.bottom}
                  stroke="#9BA1B2" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="5"
                  fill={chartColor} stroke="#fff" strokeWidth="2" />
                <rect x={Math.max(pad.left, Math.min(hoveredPoint.x-36, W-pad.right-72))} y={Math.max(pad.top+4, hoveredPoint.y-26)} width="72" height="18" rx="4" fill="#1A1D27" />
                <text x={Math.max(pad.left+36, Math.min(hoveredPoint.x, W-pad.right-36))} y={Math.max(pad.top+16, hoveredPoint.y-14)} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">ZMW {hoveredPoint.value.toFixed(2)}</text>
              </g>
            )}
          </svg>
        </div>

        {/* ── Stats table ── */}
        <div className="sd-stats-table">
          {[
            ['Open',          `ZMW ${stock.open.toFixed(2)}`],
            ['Prev Close',    `ZMW ${stock.prevClose.toFixed(2)}`],
            ['52 Week High',  `ZMW ${stock.dayHigh.toFixed(2)}`],
            ['52 Week Low',   `ZMW ${stock.dayLow.toFixed(2)}`],
            ['Volume',        stock.volume],
            ['Dividend Yield',`${stock.yield}%`],
          ].map(([label, value]) => (
            <div key={label} className="sd-stat-row">
              <span className="sd-stat-lbl">{label}</span>
              <span className="sd-stat-val">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Market Depth link ── */}
        <button
          className="sd-depth-link"
          onClick={() => navigate(`/market/${stock.symbol}/orderbook`)}
        >
          <span>See who's buying &amp; selling</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* ── Bottom spacer for buttons ── */}
        <div style={{ height: 96 }} />

      </div>

      {/* ── Sticky bottom buy/sell ── */}
      <div className="sd-bottom-bar">
        <button className="sd-buy-btn" onClick={() => navigate(`/market/${stock.symbol}/buy`)}>
          Buy
        </button>
        <button className="sd-sell-btn" onClick={() => navigate(`/market/${stock.symbol}/sell`)}>
          Sell
        </button>
      </div>

    </div>
  );
}
