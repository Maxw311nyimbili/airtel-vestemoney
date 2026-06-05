import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function StockDetailPage({ walletBalance, sharesOwned, onTradeExecute, showToast }) {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const stock = useMemo(
    () => MOCK_STOCKS.find(item => item.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );
  
  const [tradeType, setTradeType] = useState('buy');
  const [tradeQty, setTradeQty] = useState(100);
  const [timeframe, setTimeframe] = useState('1D');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!stock) {
    return (
      <div className="screen-container slide-in-right">
        <div className="page-container">
          <div className="sub-page-header">
            <button className="back-btn" onClick={() => navigate('/market')}>
              <Icons.ChevronLeft />
            </button>
            <div>
              <h1>Security not found</h1>
              <p className="page-description">The security could not be found. Please return to the market list.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const owned = sharesOwned[stock.symbol] || 0;
  const totalCost = stock.price * tradeQty;

  // Generate timeframe specific mock trend data
  const chartTrendData = useMemo(() => {
    const baseTrend = stock.trend || [stock.open, stock.prevClose, stock.price];
    if (timeframe === '1D') {
      return baseTrend;
    }
    if (timeframe === '1W') {
      return [
        baseTrend[0] * 0.96,
        baseTrend[1] * 0.98,
        baseTrend[2] * 0.97,
        baseTrend[Math.min(3, baseTrend.length - 1)] * 1.01,
        baseTrend[Math.min(4, baseTrend.length - 1)] * 0.99,
        baseTrend[Math.min(5, baseTrend.length - 1)] * 1.02,
        stock.price
      ];
    }
    if (timeframe === '1M') {
      return [
        baseTrend[0] * 0.92,
        baseTrend[0] * 0.95,
        baseTrend[1] * 0.91,
        baseTrend[2] * 0.97,
        baseTrend[Math.min(3, baseTrend.length - 1)] * 0.94,
        baseTrend[Math.min(4, baseTrend.length - 1)] * 1.03,
        baseTrend[Math.min(5, baseTrend.length - 1)] * 1.01,
        stock.price
      ];
    }
    // 1Y
    return [
      baseTrend[0] * 0.78,
      baseTrend[0] * 0.84,
      baseTrend[1] * 0.82,
      baseTrend[2] * 0.91,
      baseTrend[Math.min(3, baseTrend.length - 1)] * 0.89,
      baseTrend[Math.min(4, baseTrend.length - 1)] * 0.98,
      baseTrend[Math.min(5, baseTrend.length - 1)] * 0.95,
      stock.price * 1.05,
      stock.price * 1.02,
      stock.price
    ];
  }, [timeframe, stock]);

  // Compute SVG Coordinates
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = { top: 20, bottom: 30, left: 45, right: 20 };

  const minPrice = Math.min(...chartTrendData);
  const maxPrice = Math.max(...chartTrendData);
  const priceRange = maxPrice - minPrice || 1;

  const points = useMemo(() => {
    return chartTrendData.map((val, idx) => {
      const x = padding.left + (idx / (chartTrendData.length - 1)) * (svgWidth - padding.left - padding.right);
      const y = svgHeight - padding.bottom - ((val - minPrice) / priceRange) * (svgHeight - padding.top - padding.bottom);
      return { x, y, value: val, index: idx };
    });
  }, [chartTrendData, minPrice, maxPrice, priceRange]);

  // Line path
  const linePath = useMemo(() => {
    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  // Area path for gradient fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${points[points.length - 1].x} ${svgHeight - padding.bottom} L ${points[0].x} ${svgHeight - padding.bottom} Z`;
  }, [linePath, points]);

  const trendColor = '#E30613';

  // Current price to show (changes on scrub)
  const displayPrice = hoveredPoint ? hoveredPoint.value : stock.price;
  const displayChange = hoveredPoint
    ? ((hoveredPoint.value - chartTrendData[0]) / chartTrendData[0]) * 100
    : stock.change;

  const executeTrade = () => {
    if (tradeType === 'buy' && walletBalance < totalCost) {
      showToast('Insufficient Airtel Wallet Balance!');
      return;
    }

    if (tradeType === 'sell' && owned < tradeQty) {
      showToast('Not enough shares in portfolio to sell!');
      return;
    }

    onTradeExecute(tradeType, stock.symbol, tradeQty, totalCost);
    showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${tradeQty} shares of ${stock.symbol}!`);
    navigate('/market');
  };

  const handleMouseMove = (e) => {
    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const xInSvg = mouseX * scaleX;

    let closest = points[0];
    let minDiff = Math.abs(points[0].x - xInSvg);
    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - xInSvg);
      if (diff < minDiff) {
        minDiff = diff;
        closest = points[i];
      }
    }
    setHoveredPoint(closest);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const svgEl = e.currentTarget;
      const rect = svgEl.getBoundingClientRect();
      const mouseX = touch.clientX - rect.left;
      const scaleX = svgWidth / rect.width;
      const xInSvg = mouseX * scaleX;

      let closest = points[0];
      let minDiff = Math.abs(points[0].x - xInSvg);
      for (let i = 1; i < points.length; i++) {
        const diff = Math.abs(points[i].x - xInSvg);
        if (diff < minDiff) {
          minDiff = diff;
          closest = points[i];
        }
      }
      setHoveredPoint(closest);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="screen-container slide-in-right">
      <div className="page-container">
        <div className="sub-page-header">
          <button className="back-btn" onClick={() => navigate('/market')}>
            <Icons.ChevronLeft />
          </button>
          <div>
            <h1>{stock.symbol}</h1>
            <p className="page-description">Deep market view for {stock.name} with order book, news, and trading actions.</p>
          </div>
          <button className="header-action-text" onClick={() => navigate('/market')}>Back to Market</button>
        </div>

        <div className="security-top-card">
          <div>
            <span className="security-label">LuSE Equities</span>
            <h2 className="security-price">ZMW {displayPrice.toFixed(2)}</h2>
            <div className={`stock-change ${displayChange >= 0 ? 'up' : 'down'}`}>
              {displayChange >= 0 ? '▲' : '▼'} {Math.abs(displayChange).toFixed(2)}%
              {hoveredPoint && <span className="scrub-label"> (Scrubbed)</span>}
            </div>
          </div>
          <div className="security-position-summary">
            <div>
              <span>Held</span>
              <strong>{owned} shares</strong>
            </div>
            <div>
              <span>Market Open</span>
              <strong>{stock.marketOpen}</strong>
            </div>
            <div>
              <span>Available Shares</span>
              <strong>{stock.availableShares}</strong>
            </div>
          </div>
        </div>

        <div className="security-detail-grid">
          <section className="security-detail-panel">
            
            {/* Interactive Trading Chart */}
            <div className="stock-trading-chart-card">
              <div className="chart-header">
                <span className="chart-title">Market Price Trend</span>
                <div className="timeframe-selector">
                  {['1D', '1W', '1M', '1Y'].map(tf => (
                    <button
                      key={tf}
                      className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="svg-chart-container" style={{ position: 'relative' }}>
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="trading-svg"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchMove}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseLeave}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                >
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendColor} stopOpacity="0.24" />
                      <stop offset="100%" stopColor={trendColor} stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={svgWidth - padding.right}
                    y2={padding.top}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={padding.left}
                    y1={(svgHeight - padding.bottom + padding.top) / 2}
                    x2={svgWidth - padding.right}
                    y2={(svgHeight - padding.bottom + padding.top) / 2}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={padding.left}
                    y1={svgHeight - padding.bottom}
                    x2={svgWidth - padding.right}
                    y2={svgHeight - padding.bottom}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                  />

                  {/* Y-Axis Labels */}
                  <text x={padding.left - 8} y={padding.top + 4} textAnchor="end" fill="#9BA1B2" fontSize="10" fontWeight="600">
                    {maxPrice.toFixed(2)}
                  </text>
                  <text x={padding.left - 8} y={(svgHeight - padding.bottom + padding.top) / 2 + 3} textAnchor="end" fill="#9BA1B2" fontSize="10" fontWeight="600">
                    {((maxPrice + minPrice) / 2).toFixed(2)}
                  </text>
                  <text x={padding.left - 8} y={svgHeight - padding.bottom + 3} textAnchor="end" fill="#9BA1B2" fontSize="10" fontWeight="600">
                    {minPrice.toFixed(2)}
                  </text>

                  {/* X-Axis labels */}
                  <text x={padding.left} y={svgHeight - 10} textAnchor="start" fill="#9BA1B2" fontSize="10" fontWeight="600">
                    Start
                  </text>
                  <text x={svgWidth - padding.right} y={svgHeight - 10} textAnchor="end" fill="#9BA1B2" fontSize="10" fontWeight="600">
                    End
                  </text>

                  {/* Area fill */}
                  <path d={areaPath} fill="url(#chart-area-grad)" />

                  {/* Price Path */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke={trendColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pulse dot at last price */}
                  {!hoveredPoint && points.length > 0 && (
                    <>
                      <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="8"
                        fill={trendColor}
                        opacity="0.3"
                        className="pulse-dot"
                      />
                      <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="4"
                        fill={trendColor}
                      />
                    </>
                  )}

                  {/* Hover crosshairs & dot */}
                  {hoveredPoint && (
                    <g>
                      {/* Vertical line */}
                      <line
                        x1={hoveredPoint.x}
                        y1={padding.top}
                        x2={hoveredPoint.x}
                        y2={svgHeight - padding.bottom}
                        stroke="#9BA1B2"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      {/* Hover dot */}
                      <circle
                        cx={hoveredPoint.x}
                        cy={hoveredPoint.y}
                        r="6"
                        fill={trendColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}
                      />
                      {/* Tooltip value */}
                      <rect
                        x={Math.max(padding.left, Math.min(hoveredPoint.x - 40, svgWidth - padding.right - 80))}
                        y={Math.max(padding.top + 5, hoveredPoint.y - 30)}
                        width="80"
                        height="20"
                        rx="4"
                        fill="#1A1D27"
                      />
                      <text
                        x={Math.max(padding.left + 40, Math.min(hoveredPoint.x, svgWidth - padding.right - 40))}
                        y={Math.max(padding.top + 18, hoveredPoint.y - 17)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="700"
                      >
                        ZMW {hoveredPoint.value.toFixed(2)}
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            <div className="stock-detail-summary">
              <div>
                <span>Open</span>
                <strong>ZMW {stock.open.toFixed(2)}</strong>
              </div>
              <div>
                <span>Prev Close</span>
                <strong>ZMW {stock.prevClose.toFixed(2)}</strong>
              </div>
              <div>
                <span>Day Low</span>
                <strong>ZMW {stock.dayLow.toFixed(2)}</strong>
              </div>
              <div>
                <span>Day High</span>
                <strong>ZMW {stock.dayHigh.toFixed(2)}</strong>
              </div>
              <div>
                <span>Volume</span>
                <strong>{stock.volume}</strong>
              </div>
              <div>
                <span>Sector</span>
                <strong>{stock.sector}</strong>
              </div>
            </div>

            <div className="stock-detail-tabs">
              <button className="detail-tab active">Dividends & News</button>
              <button
                className="detail-tab orderbook-redirect-tab"
                onClick={() => navigate(`/market/${stock.symbol}/orderbook`)}
              >
                View Order Book ↗
              </button>
            </div>

            <div className="detail-panel-content">
              <p className="detail-panel-copy">Market conditions, yield commentary, and recent activity for {stock.symbol} are shown here for a clean, trade-ready snapshot.</p>
              <ul className="detail-bullet-list">
                <li>Latest dividends: {stock.yield}% yield estimate</li>
                <li>Sector momentum: {stock.sector} is stabilizing</li>
                <li>Liquidity view: {stock.volume} traded today</li>
              </ul>
            </div>
          </section>

          <aside className="security-order-panel">
            <div className="order-card-header">
              <div>
                <span>Order Book Action</span>
                <strong>{tradeType === 'buy' ? 'Buy shares' : 'Sell shares'}</strong>
              </div>
              <div>
                <span>Balance</span>
                <strong>ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="order-panel-header">
              <button className={`order-action-tab ${tradeType === 'buy' ? 'active' : ''}`} onClick={() => setTradeType('buy')}>Buy</button>
              <button className={`order-action-tab ${tradeType === 'sell' ? 'active' : ''}`} onClick={() => setTradeType('sell')}>Sell</button>
            </div>

            <div className="trade-input-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                className="trade-input"
                value={tradeQty}
                onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 0))}
              />
            </div>

            <div className="trade-summary">
              <div className="trade-summary-row">
                <span>Unit Price</span>
                <span>ZMW {stock.price.toFixed(2)}</span>
              </div>
              <div className="trade-summary-row total">
                <span>Estimated Total</span>
                <span>ZMW {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button className={`trade-confirm-btn ${tradeType === 'buy' ? 'buy' : 'sell'}`} onClick={executeTrade}>
              {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
