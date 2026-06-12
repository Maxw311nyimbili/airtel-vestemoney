import React from 'react';

// ─── Shared security logo — falls back to colored initials ───────
// Pass a stock object from MOCK_STOCKS. If `stock.logo` is set (an
// imported image), it renders the real logo on a white badge;
// otherwise it falls back to a colored circle with the symbol's
// first letters.
export default function StockLogo({ stock, className }) {
  if (stock?.logo) {
    return (
      <div 
        className={className} 
        style={{ 
          background: '#ffffff', 
          border: '1px solid #E5E7EB',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px'
        }}
      >
        <img 
        src={stock.logo} 
          alt={stock.name || stock.symbol} 
          className="stock-logo-img" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            borderRadius: '50%'
          }} 
        />
      </div>
    );
  }

  return (
    <div 
      className={className} 
      style={{ 
        background: stock?.color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 'bold'
      }}
    >
      {stock?.symbol?.slice(0, 3)}
    </div>
  );
}
