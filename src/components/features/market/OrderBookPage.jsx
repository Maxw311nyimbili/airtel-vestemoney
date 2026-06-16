import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';
import StockLogo from '../../StockLogo';

export default function OrderBookPage({ showToast }) {
  const { symbol } = useParams();
  const navigate   = useNavigate();

  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  if (!stock) return null;

  const ob           = stock.orderBook;
  const lastPrice    = stock.prevClose ?? stock.price;
  const latestPrice  = stock.price;
  const priceGap     = latestPrice - lastPrice;
  const isGapUp      = priceGap >= 0;

  return (
    <div className="screen-container slide-in-right ob-page">

      {/* ── Header ── */}
      <div className="pf-header">
        <button className="back-btn" onClick={() => navigate(`/market/${stock.symbol}`)}>
          <Icons.ChevronLeft />
        </button>
        <span className="pf-header-title">Market Depth</span>
      </div>

      <div className="ob-body">

        {/* ── Stock summary card ── */}
        <div className="ob-stock-card">
          <div className="ob-stock-card-top">
            <StockLogo stock={stock} className="ob-stock-logo" />
            <div className="ob-stock-names">
              <div className="ob-stock-full-name">{stock.name}</div>
            </div>
            <div className="ob-stock-price-col">
              <div className="ob-stock-price">ZMW {stock.price.toFixed(2)}</div>
              <div className="ob-stock-chg-wrap">
                {stock.change === 0
                  ? <span className="ob-stock-chg-flat" />
                  : stock.change > 0
                  ? <span className="ob-stock-chg-up">+{stock.change.toFixed(2)}%</span>
                  : <span className="ob-stock-chg-dn">{stock.change.toFixed(2)}%</span>
                }
              </div>
            </div>
          </div>
          <div className="ob-stock-card-bottom">
            <div className="ob-stock-bid-ask">
              <span>Best Bid: ZMW {ob?.bestBid}</span>
              <span>Best Ask: ZMW {ob?.bestAsk}</span>
            </div>
            <div className="ob-stock-supply-demand">
              <span>Supply: {(stock.supply || 0).toLocaleString()}</span>
              <span>Demand: {(stock.demand || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Price strip ── */}
        <div className="ob-price-strip">
          <div className="ob-price-item">
            <span className="ob-price-lbl">Last Price</span>
            <span className="ob-price-val">ZMW {lastPrice.toFixed(2)}</span>
          </div>
          <div className="ob-price-divider" />
          <div className="ob-price-item">
            <span className="ob-price-lbl">Latest Price</span>
            <span className="ob-price-val">ZMW {latestPrice.toFixed(2)}</span>
          </div>
          <div className="ob-price-divider" />
          <div className="ob-price-item">
            <span className="ob-price-lbl">Price Gap</span>
            <span className="ob-price-val" style={{ color: isGapUp ? '#4B5563' : '#E30613' }}>
              {isGapUp ? '+' : ''}{priceGap.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="ob-cta-row">
          <button className="ob-cta-buy" onClick={() => navigate(`/market/${stock.symbol}/buy`)}>
            Buy Shares
          </button>
          <button className="ob-cta-sell" onClick={() => navigate(`/market/${stock.symbol}/sell`)}>
            Sell Shares
          </button>
        </div>

      </div>
    </div>
  );
}
