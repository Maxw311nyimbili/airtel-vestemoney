import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from './Icons';
import { MOCK_STOCKS } from '../data/mockData';

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
              <h1>Order book not found</h1>
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
            <h1>{stock.symbol} Order Book</h1>
            <p className="page-description">Real-time market depth and trade execution feed for {stock.name}.</p>
          </div>
          <button className="header-action-text" onClick={() => showToast('Order book depth refreshed')}>
            Refresh Depth
          </button>
        </div>

        {/* Market Price Header Summary */}
        <div className="orderbook-price-bar">
          <div className="price-stat">
            <span className="stat-label">LATEST TRADED PRICE</span>
            <div className="stat-val-row">
              <strong className="stat-price">ZMW {stock.price.toFixed(2)}</strong>
              <span className={`stat-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="price-stat">
            <span className="stat-label">SPREAD</span>
            <strong className="stat-value">
              ZMW {(parseFloat(stock.orderBook.bestAsk) - parseFloat(stock.orderBook.bestBid)).toFixed(2)}
            </strong>
          </div>
          <div className="price-stat">
            <span className="stat-label">MARKET SPEED</span>
            <strong className="stat-value speed-badge">{stock.orderBook.speed}</strong>
          </div>
        </div>

        <div className="orderbook-content-grid">
          {/* Main Order Book Depth Tables */}
          <div className="orderbook-tables-panel">
            <div className="panel-header-title">Market Depth (Bids & Asks)</div>
            
            <div className="double-side-tables">
              {/* Bids Column */}
              <div className="orderbook-side bids-side">
                <div className="side-title bid-text">Bids (Buy Orders)</div>
                <div className="table-header-row">
                  <span>Size</span>
                  <span style={{ textAlign: 'right' }}>Bid Price</span>
                </div>
                <div className="order-rows-container">
                  {rows.map((row, idx) => (
                    <div key={idx} className="depth-row">
                      {/* Depth visualizer bar overlay */}
                      <div
                        className="depth-bar-fill bid-bar"
                        style={{ width: `${(row.numericBidVol / maxBidVol) * 100}%` }}
                      />
                      <span className="row-val size">{row.volume}</span>
                      <span className="row-val price bid-text">ZMW {row.bid}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asks Column */}
              <div className="orderbook-side asks-side">
                <div className="side-title ask-text">Asks (Sell Orders)</div>
                <div className="table-header-row">
                  <span>Ask Price</span>
                  <span style={{ textAlign: 'right' }}>Size</span>
                </div>
                <div className="order-rows-container">
                  {rows.map((row, idx) => (
                    <div key={idx} className="depth-row">
                      {/* Depth visualizer bar overlay */}
                      <div
                        className="depth-bar-fill ask-bar"
                        style={{ width: `${(row.numericAskVol / maxAskVol) * 100}%` }}
                      />
                      <span className="row-val price ask-text">ZMW {row.ask}</span>
                      <span className="row-val size" style={{ textAlign: 'right' }}>{row.askVolume}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Depth Chart Wall Visualizer */}
          <div className="depth-chart-panel">
            <div className="panel-header-title">Depth Wall Chart</div>
            
            <div className="svg-depth-container">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="depth-svg">
                {/* Background grid */}
                <line x1="0" y1={svgHeight - chartPadding.bottom} x2={svgWidth} y2={svgHeight - chartPadding.bottom} stroke="#D1D5DB" strokeWidth="1" />
                <line x1={svgWidth / 2} y1={chartPadding.top} x2={svgWidth / 2} y2={svgHeight - chartPadding.bottom} stroke="#9BA1B2" strokeWidth="1" strokeDasharray="3 3" />

                {/* Bids Wall Polygon (Airtel Red) */}
                <path d={depthPoints.bidPath} fill="rgba(227, 6, 19, 0.12)" stroke="#E30613" strokeWidth="2" />
                
                {/* Asks Wall Polygon (Grey) */}
                <path d={depthPoints.askPath} fill="rgba(95, 101, 119, 0.12)" stroke="#5F6577" strokeWidth="2" />

                {/* Mid labels */}
                <text x={svgWidth / 2} y={svgHeight - 6} textAnchor="middle" fill="#5F6577" fontSize="10" fontWeight="700">
                  ZMW {stock.price.toFixed(2)} (Mid Market)
                </text>
                <text x={chartPadding.left} y={svgHeight - 6} textAnchor="start" fill="#9BA1B2" fontSize="9" fontWeight="600">
                  ZMW {depthPoints.bids && depthPoints.bids.length > 0 ? depthPoints.bids[depthPoints.bids.length - 1].price.toFixed(2) : ''}
                </text>
                <text x={svgWidth - chartPadding.right} y={svgHeight - 6} textAnchor="end" fill="#9BA1B2" fontSize="9" fontWeight="600">
                  ZMW {depthPoints.asks && depthPoints.asks.length > 0 ? depthPoints.asks[depthPoints.asks.length - 1].price.toFixed(2) : ''}
                </text>
              </svg>
            </div>
            
            <div className="depth-legend">
              <div className="legend-item"><span className="legend-dot bid" /> Cumulative Buy Orders</div>
              <div className="legend-item"><span className="legend-dot ask" /> Cumulative Sell Orders</div>
            </div>
          </div>

          {/* Recent Live Execution Feed */}
          <div className="recent-trades-panel">
            <div className="panel-header-title">Live Executed Trades</div>
            
            <div className="trades-table-wrapper">
              <div className="trades-table-header">
                <span>Time</span>
                <span>Type</span>
                <span>Price</span>
                <span style={{ textAlign: 'right' }}>Size</span>
              </div>
              <div className="trades-list-container">
                {mockTrades.map(trade => (
                  <div key={trade.id} className="trade-item-row">
                    <span className="trade-time">{trade.time}</span>
                    <span className={`trade-type ${trade.type}`}>
                      {trade.type.toUpperCase()}
                    </span>
                    <span className="trade-price">ZMW {trade.price.toFixed(2)}</span>
                    <span className="trade-size" style={{ textAlign: 'right' }}>{trade.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
