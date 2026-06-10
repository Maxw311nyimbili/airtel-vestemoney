import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../Icons';
import { MOCK_STOCKS } from '../../../data/mockData';

export default function OrderBookPage({ showToast }) {
  const { symbol } = useParams();
  const navigate   = useNavigate();

  const stock = useMemo(
    () => MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase()),
    [symbol]
  );

  if (!stock) return null;

  const ob   = stock.orderBook;
  const rows = ob?.rows || [];

  // Parse volumes to numbers for depth bars
  const parsed = rows.map(r => {
    const toNum = v => {
      const s = String(v || '0');
      return s.includes('K') ? parseFloat(s) * 1000 : parseFloat(s) || 0;
    };
    return { ...r, bidVol: toNum(r.volume), askVol: toNum(r.askVolume) };
  });

  const maxBid = Math.max(...parsed.map(r => r.bidVol), 1);
  const maxAsk = Math.max(...parsed.map(r => r.askVol), 1);

  const bestBid  = parseFloat(ob?.bestBid || 0);
  const bestAsk  = parseFloat(ob?.bestAsk || 0);
  const spread   = (bestAsk - bestBid).toFixed(2);
  const midPrice = ((bestBid + bestAsk) / 2).toFixed(2);

  const speedLabel = { High: 'Very Active', Medium: 'Moderate', Low: 'Quiet' }[ob?.speed] || 'Moderate';
  const speedColor = { High: '#E30613', Medium: '#F59E0B', Low: '#9BA1B2' }[ob?.speed] || '#9BA1B2';

  // Mock recent trades
  const trades = useMemo(() => [
    { id: 1, time: '15:19', price: stock.price,         qty: 450,   side: 'buy'  },
    { id: 2, time: '15:18', price: stock.price - 0.02,  qty: 1200,  side: 'sell' },
    { id: 3, time: '15:16', price: stock.price + 0.01,  qty: 850,   side: 'buy'  },
    { id: 4, time: '15:14', price: stock.price,         qty: 300,   side: 'buy'  },
    { id: 5, time: '15:11', price: stock.price - 0.01,  qty: 100,   side: 'sell' },
    { id: 6, time: '15:08', price: stock.price + 0.03,  qty: 2000,  side: 'buy'  },
  ], [stock]);

  // Buy/sell pressure ratio
  const totalBid = parsed.reduce((s, r) => s + r.bidVol, 0);
  const totalAsk = parsed.reduce((s, r) => s + r.askVol, 0);
  const buyPct   = totalBid + totalAsk > 0 ? Math.round((totalBid / (totalBid + totalAsk)) * 100) : 50;

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

        {/* ── Price strip ── */}
        <div className="ob-price-strip">
          <div className="ob-price-item">
            <span className="ob-price-lbl">Last Price</span>
            <span className="ob-price-val">ZMW {stock.price.toFixed(2)}</span>
          </div>
          <div className="ob-price-divider" />
          <div className="ob-price-item">
            <span className="ob-price-lbl">Price Gap</span>
            <span className="ob-price-val">ZMW {spread}</span>
          </div>
          <div className="ob-price-divider" />
          <div className="ob-price-item">
            <span className="ob-price-lbl">Activity</span>
            <span className="ob-price-val" style={{ color: speedColor }}>{speedLabel}</span>
          </div>
        </div>

        {/* ── Plain-language explainer ── */}
        <div className="ob-explainer">
          <span className="ob-explainer-icon">💡</span>
          <p>
            <strong>Buyers</strong> are offering to pay up to <strong>ZMW {bestBid}</strong>.{' '}
            <strong>Sellers</strong> are asking at least <strong>ZMW {bestAsk}</strong>.{' '}
            A deal happens when these prices meet.
          </p>
        </div>

        {/* ── Buy/Sell pressure bar ── */}
        <div className="ob-pressure-wrap">
          <span className="ob-pressure-lbl buy-lbl">Buyers {buyPct}%</span>
          <div className="ob-pressure-track">
            <div className="ob-pressure-fill buy-fill" style={{ width: `${buyPct}%` }} />
          </div>
          <span className="ob-pressure-lbl sell-lbl">Sellers {100 - buyPct}%</span>
        </div>

        {/* ── Bids / Asks columns ── */}
        <div className="ob-columns">

          {/* Buyers column */}
          <div className="ob-col">
            <div className="ob-col-header buy-header">
              <span className="ob-col-title">Buyers</span>
              <span className="ob-col-sub">Price they'll pay</span>
            </div>
            <div className="ob-col-labels">
              <span>Shares</span>
              <span>Price</span>
            </div>
            {parsed.map((r, i) => (
              <div key={i} className="ob-row ob-buy-row">
                <div className="ob-row-bar" style={{ width: `${(r.bidVol / maxBid) * 100}%` }} />
                <span className="ob-row-vol">{r.volume}</span>
                <span className="ob-row-price ob-bid-price">ZMW {r.bid}</span>
              </div>
            ))}
          </div>

          {/* Sellers column */}
          <div className="ob-col">
            <div className="ob-col-header sell-header">
              <span className="ob-col-title">Sellers</span>
              <span className="ob-col-sub">Price they want</span>
            </div>
            <div className="ob-col-labels">
              <span>Price</span>
              <span>Shares</span>
            </div>
            {parsed.map((r, i) => (
              <div key={i} className="ob-row ob-ask-row">
                <div className="ob-row-bar ask-bar" style={{ width: `${(r.askVol / maxAsk) * 100}%` }} />
                <span className="ob-row-price ob-ask-price">ZMW {r.ask}</span>
                <span className="ob-row-vol">{r.askVolume}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── Mid price marker ── */}
        <div className="ob-midprice">
          <div className="ob-midprice-line" />
          <span className="ob-midprice-label">Mid-price ZMW {midPrice}</span>
          <div className="ob-midprice-line" />
        </div>

        {/* ── Recent trades ── */}
        <div className="ob-trades-section">
          <span className="ob-trades-title">Recent Trades</span>
          <div className="ob-trades-header">
            <span>Time</span>
            <span>Type</span>
            <span>Price</span>
            <span className="ob-right">Shares</span>
          </div>
          {trades.map(t => (
            <div key={t.id} className="ob-trade-row">
              <span className="ob-trade-time">{t.time}</span>
              <span className={`ob-trade-badge ${t.side}`}>{t.side === 'buy' ? 'Bought' : 'Sold'}</span>
              <span className={`ob-trade-price ${t.side}`}>ZMW {t.price.toFixed(2)}</span>
              <span className="ob-right ob-trade-qty">{t.qty.toLocaleString()}</span>
            </div>
          ))}
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
