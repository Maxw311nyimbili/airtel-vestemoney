import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

function InfoTip({ title, content }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button 
        type="button" 
        className="jargon-help-icon" 
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
        style={{ marginLeft: '6px' }}
      >
        ?
      </button>
      {show && (
        <div className="jargon-tooltip-card" onClick={(e) => e.stopPropagation()} style={{ marginTop: '8px', marginBottom: '8px', textAlign: 'left', fontWeight: 'normal' }}>
          <p style={{ margin: 0 }}><strong>{title}:</strong> {content}</p>
          <button type="button" className="close-btn" onClick={() => setShow(false)}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default function OrderBookPage({ showToast }) {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const stock = useMemo(
    () => MOCK_STOCKS.find(item => item.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  // Fallback if stock not found
  if (!stock) {
    return (
      <div className="screen-container slide-in-right">
        <div className="page-container">
          <div className="sub-page-header">
            <button className="back-btn" onClick={() => navigate('/market')}>
              <Icons.ChevronLeft />
            </button>
            <div>
              <h1>Offers not found</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parse numerical volumes for depth visualization
  const rows = useMemo(() => {
    if (!stock || !stock.orderBook || !stock.orderBook.rows) return [];
    return stock.orderBook.rows.map(row => {
      const volumeStr = String(row.volume || '0');
      const askVolumeStr = String(row.askVolume || '0');
      
      const bidVol = volumeStr.includes('K')
        ? parseFloat(volumeStr.replace('K', '')) * 1000
        : parseFloat(volumeStr) || 0;
        
      const askVol = askVolumeStr.includes('K')
        ? parseFloat(askVolumeStr.replace('K', '')) * 1000
        : parseFloat(askVolumeStr) || 0;

      return {
        ...row,
        numericBidVol: bidVol,
        numericAskVol: askVol,
        bidPrice: parseFloat(row.bid) || 0,
        askPrice: parseFloat(row.ask) || 0
      };
    });
  }, [stock]);

  // Calculate cumulative volumes for depth chart
  const depthData = useMemo(() => {
    let bidCumulative = 0;
    const bids = [...rows]
      .sort((a, b) => (b.bidPrice || 0) - (a.bidPrice || 0)) // highest bid first
      .map(row => {
        bidCumulative += row.numericBidVol || 0;
        return { price: row.bidPrice || 0, vol: row.numericBidVol || 0, cumulative: bidCumulative };
      });

    let askCumulative = 0;
    const asks = [...rows]
      .sort((a, b) => (a.askPrice || 0) - (b.askPrice || 0)) // lowest ask first
      .map(row => {
        askCumulative += row.numericAskVol || 0;
        return { price: row.askPrice || 0, vol: row.numericAskVol || 0, cumulative: askCumulative };
      });

    const maxCumulative = Math.max(bidCumulative, askCumulative) || 1;

    return { bids, asks, maxCumulative };
  }, [rows]);

  // SVG dimensions for depth chart
  const svgWidth = 600;
  const svgHeight = 180;
  const chartPadding = { left: 40, right: 40, top: 10, bottom: 20 };

  // Calculate coordinates for Bid wall (Green/Left) and Ask wall (Red/Right)
  const depthPoints = useMemo(() => {
    const { bids, asks, maxCumulative } = depthData;
    if (!bids || !asks || bids.length === 0 || asks.length === 0) {
      return { bidPath: '', askPath: '', bids: [], asks: [] };
    }

    const midX = svgWidth / 2;
    const innerHeight = svgHeight - chartPadding.top - chartPadding.bottom;

    // Bid Wall Points: starts at center (highest bid, low cumulative) and moves left (lower price, high cumulative)
    const bidCoords = bids.map((b, idx) => {
      const percentLeft = idx / (bids.length - 1 || 1); // 0 to 1
      const x = midX - percentLeft * (midX - chartPadding.left);
      const y = svgHeight - chartPadding.bottom - (b.cumulative / maxCumulative) * innerHeight;
      return { x, y };
    });
    // Add start and end points to anchor the polygon at the bottom
    const bidPath = bidCoords.length > 0
      ? `M ${midX} ${svgHeight - chartPadding.bottom} ` +
        bidCoords.map(p => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${bidCoords[bidCoords.length - 1].x} ${svgHeight - chartPadding.bottom} Z`
      : '';

    // Ask Wall Points: starts at center (lowest ask, low cumulative) and moves right (higher price, high cumulative)
    const askCoords = asks.map((a, idx) => {
      const percentRight = idx / (asks.length - 1 || 1); // 0 to 1
      const x = midX + percentRight * (midX - chartPadding.right);
      const y = svgHeight - chartPadding.bottom - (a.cumulative / maxCumulative) * innerHeight;
      return { x, y };
    });
    // Add start and end points to anchor the polygon at the bottom
    const askPath = askCoords.length > 0
      ? `M ${midX} ${svgHeight - chartPadding.bottom} ` +
        askCoords.map(p => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${askCoords[askCoords.length - 1].x} ${svgHeight - chartPadding.bottom} Z`
      : '';

    return { bidPath, askPath, bids, asks };
  }, [depthData]);

  // Max volumes for row background overlays
  const maxBidVol = Math.max(...rows.map(r => r.numericBidVol)) || 1;
  const maxAskVol = Math.max(...rows.map(r => r.numericAskVol)) || 1;

  // Mock Recent Trade History
  const mockTrades = useMemo(() => {
    return [
      { id: 1, time: '15:19:42', price: stock.price, size: 450, type: 'buy' },
      { id: 2, time: '15:18:11', price: stock.price - 0.02, size: 1200, type: 'sell' },
      { id: 3, time: '15:16:34', price: stock.price + 0.01, size: 850, type: 'buy' },
      { id: 4, time: '15:14:02', price: stock.price, size: 300, type: 'buy' },
      { id: 5, time: '15:11:55', price: stock.price - 0.01, size: 100, type: 'sell' },
      { id: 6, time: '15:08:21', price: stock.price + 0.03, size: 2000, type: 'buy' }
    ];
  }, [stock]);

  return (
    <div className="screen-container slide-in-right">
      <div className="page-container">
        <div className="sub-page-header">
          <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
            <Icons.ChevronLeft />
          </button>
          <div>
            <h1>{stock.symbol} Buyer &amp; Seller Offers</h1>
            <p className="page-description">Real-time buyer offers and seller proposals for {stock.name}.</p>
          </div>
          <button className="header-action-text" onClick={() => showToast('Offers list refreshed')}>
            Refresh Offers
          </button>
        </div>

        {/* Jargon Explainer Banner */}
        <div style={{ 
          background: 'var(--primary-red-light)', 
          borderLeft: '4px solid var(--primary-red)', 
          padding: '16px', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: '24px', 
          fontSize: '13px', 
          lineHeight: '1.5',
          color: 'var(--text-primary)'
        }}>
          <strong>💡 How to read this page:</strong> This page shows lists of offers from other investors on the market.
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li><strong>Buy Offers (Bids):</strong> Prices other investors are willing to pay to buy shares.</li>
            <li><strong>Sell Offers (Asks):</strong> Prices other investors are asking to sell their shares.</li>
            <li>Trades happen automatically when a buyer's price and a seller's price match!</li>
          </ul>
        </div>

        {/* Market Price Header Summary */}
        <div className="orderbook-price-bar">
          <div className="price-stat">
            <span className="stat-label">LATEST DEAL PRICE</span>
            <div className="stat-val-row">
              <strong className="stat-price">ZMW {stock.price.toFixed(2)}</strong>
              <span className={`stat-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="price-stat">
            <span className="stat-label" style={{ display: 'inline-flex', alignItems: 'center' }}>
              PRICE GAP (SPREAD)
              <InfoTip title="Price Gap (Spread)" content="The difference between the lowest selling price and the highest buying price. A smaller gap means trading is active and quick." />
            </span>
            <strong className="stat-value" style={{ display: 'block' }}>
              ZMW {(parseFloat(stock.orderBook.bestAsk) - parseFloat(stock.orderBook.bestBid)).toFixed(2)}
            </strong>
          </div>
          <div className="price-stat">
            <span className="stat-label">TRADING ACTIVITY</span>
            <strong className="stat-value speed-badge" style={{ display: 'block', textTransform: 'capitalize' }}>
              {stock.orderBook.speed === 'High' ? 'Very Busy' : stock.orderBook.speed === 'Medium' ? 'Moderate' : 'Slow'}
            </strong>
          </div>
        </div>

        <div className="orderbook-content-grid">
          {/* Main Order Book Depth Tables */}
          <div className="orderbook-tables-panel">
            <div className="panel-header-title">Current Market Offers</div>
            
            <div className="double-side-tables">
              {/* Bids Column */}
              <div className="orderbook-side bids-side">
                <div className="side-title bid-text" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Buy Offers (Bids)
                  <InfoTip title="Buy Offers (Bids)" content="Offers from people who want to buy shares, showing the price they want to pay and the number of shares they want to buy." />
                </div>
                <div className="table-header-row">
                  <span>Shares Amount</span>
                  <span style={{ textAlign: 'right' }}>Buyer Price</span>
                </div>
                <div className="order-rows-container">
                  {rows.map((row, idx) => (
                    <div key={idx} className="depth-row">
                      {/* Depth visualizer bar overlay */}
                      <div
                        className="depth-bar-fill bid-bar"
                        style={{ width: `${(row.numericBidVol / maxBidVol) * 80}%` }}
                      />
                      <span className="row-val size">{row.volume}</span>
                      <span className="row-val price bid-text" style={{ zIndex: 2 }}>ZMW {row.bid}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asks Column */}
              <div className="orderbook-side asks-side">
                <div className="side-title ask-text" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Sell Offers (Asks)
                  <InfoTip title="Sell Offers (Asks)" content="Offers from people who want to sell their shares, showing the price they want to get and the number of shares they are selling." />
                </div>
                <div className="table-header-row">
                  <span>Seller Price</span>
                  <span style={{ textAlign: 'right' }}>Shares Amount</span>
                </div>
                <div className="order-rows-container">
                  {rows.map((row, idx) => (
                    <div key={idx} className="depth-row">
                      {/* Depth visualizer bar overlay */}
                      <div
                        className="depth-bar-fill ask-bar"
                        style={{ width: `${(row.numericAskVol / maxAskVol) * 80}%` }}
                      />
                      <span className="row-val price ask-text" style={{ zIndex: 2 }}>ZMW {row.ask}</span>
                      <span className="row-val size" style={{ textAlign: 'right', zIndex: 2 }}>{row.askVolume}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Depth Chart Panel */}
          <div className="depth-chart-panel" style={{ marginBottom: '24px' }}>
            <div className="panel-header-title">Offers Visual Depth</div>
            <div className="depth-chart-container" style={{ position: 'relative' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="depth-svg"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              >
                <defs>
                  <linearGradient id="bid-depth-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A1D23" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1A1D23" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="ask-depth-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1={chartPadding.left} y1={chartPadding.top} x2={svgWidth - chartPadding.right} y2={chartPadding.top} stroke="#E5E7EB" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1={chartPadding.left} y1={(svgHeight - chartPadding.bottom + chartPadding.top) / 2} x2={svgWidth - chartPadding.right} y2={(svgHeight - chartPadding.bottom + chartPadding.top) / 2} stroke="#E5E7EB" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1={chartPadding.left} y1={svgHeight - chartPadding.bottom} x2={svgWidth - chartPadding.right} y2={svgHeight - chartPadding.bottom} stroke="#D1D5DB" strokeWidth="1" />

                {/* Bid Wall Shape */}
                {depthPoints.bidPath && <path d={depthPoints.bidPath} fill="url(#bid-depth-grad)" stroke="#1A1D23" strokeWidth="2" strokeLinejoin="round" />}
                {/* Ask Wall Shape */}
                {depthPoints.askPath && <path d={depthPoints.askPath} fill="url(#ask-depth-grad)" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />}

                {/* Midline separator */}
                <line x1={svgWidth / 2} y1={chartPadding.top} x2={svgWidth / 2} y2={svgHeight - chartPadding.bottom} stroke="#9BA1B2" strokeWidth="1" strokeDasharray="2 4" />

                {/* X-Axis Labels */}
                <text x={chartPadding.left} y={svgHeight - 4} textAnchor="start" fill="#9BA1B2" fontSize="9" fontWeight="600">
                  ZMW {depthPoints.bids[depthPoints.bids.length - 1]?.price.toFixed(2) || '0.00'}
                </text>
                <text x={svgWidth / 2} y={svgHeight - 4} textAnchor="middle" fill="#1A1D27" fontSize="9" fontWeight="700">
                  Middle price: ZMW {((parseFloat(stock.orderBook.bestBid) + parseFloat(stock.orderBook.bestAsk)) / 2).toFixed(2)}
                </text>
                <text x={svgWidth - chartPadding.right} y={svgHeight - 4} textAnchor="end" fill="#9BA1B2" fontSize="9" fontWeight="600">
                  ZMW {depthPoints.asks[depthPoints.asks.length - 1]?.price.toFixed(2) || '0.00'}
                </text>
              </svg>
            </div>

            <div className="depth-legend" style={{ marginTop: '14px' }}>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#1A1D23' }} />
                <span>Buy Orders Depth ({(depthData.bids[depthData.bids.length - 1]?.cumulative || 0).toLocaleString()} shares)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#EF4444' }} />
                <span>Sell Orders Depth ({(depthData.asks[depthData.asks.length - 1]?.cumulative || 0).toLocaleString()} shares)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades Table */}
        <div className="recent-trades-panel">
          <div className="panel-header-title">Recent Real-Time Deals Feed</div>
          <div className="trades-table-header">
            <span>Deal Time</span>
            <span>Type</span>
            <span>Deal Price</span>
            <span style={{ textAlign: 'right' }}>Shares Amount</span>
          </div>
          <div className="order-rows-container">
            {mockTrades.map(trade => (
              <div key={trade.id} className="trade-item-row">
                <span style={{ color: '#9BA1B2' }}>{trade.time}</span>
                <span>
                  <span className={`trade-type ${trade.type}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {trade.type === 'buy' ? 'bought' : 'sold'}
                  </span>
                </span>
                <span className="trade-price">ZMW {trade.price.toFixed(2)}</span>
                <span className="trade-size" style={{ textAlign: 'right' }}>{trade.size.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
