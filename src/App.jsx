import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

// Layout Components
import Header from './components/layout/Header';

// Features Components
import LandingPage from './components/features/splash/LandingPage';
import LoginScreen from './components/features/auth/LoginScreen';
import MainDashboard from './components/features/dashboard/MainDashboard';
import PortfolioDashboard from './components/features/portfolio/PortfolioDashboard';
import MarketDashboard from './components/features/market/MarketDashboard';
import StockDetailPage from './components/features/market/StockDetailPage';
import OrderBookPage from './components/features/market/OrderBookPage';
import DividendDashboard from './components/features/dividends/DividendDashboard';

// Data and Assets
import { MOCK_STOCKS } from './data/mockData';
import { Icons } from './components/Icons';

// Custom State Hooks
import { useWallet } from './hooks/useWallet';
import { usePortfolio } from './hooks/usePortfolio';

function AppLayout({
  useWalletHook,
  showToast
}) {
  const {
    isLoggedIn,
    phoneNumber,
    setPhoneNumber,
    walletBalance,
    setWalletBalance,
    sharesOwned,
    setSharesOwned,
    setIsLoggedIn,
    executeTrade
  } = useWalletHook;

  const {
    portfolioAssets,
    dividendEarnings
  } = usePortfolio(sharesOwned);

  const location = useLocation();
  const navigate = useNavigate();
  const [activeTradeStock, setActiveTradeStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [tradeQty, setTradeQty] = useState(100);

  const triggerTrade = (symbol, type = 'buy') => {
    const stock = MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (stock) {
      setActiveTradeStock(stock);
      setTradeType(type);
      setTradeQty(100);
    }
  };

  const handleDrawerConfirm = () => {
    if (!activeTradeStock) return;
    
    const result = executeTrade(tradeType, activeTradeStock.symbol, tradeQty);
    if (!result.success) {
      showToast(result.error);
      return;
    }

    showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${tradeQty} shares of ${activeTradeStock.symbol}!`);
    setActiveTradeStock(null);
  };

  if (location.pathname === '/') {
    return <LandingPage />;
  }

  const isLoginScreen = location.pathname === '/login';

  if (isLoginScreen) {
    return (
      <LoginScreen
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showToast={showToast}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      {/* Airtel Brand Header Component */}
      <Header showToast={showToast} onLogout={setIsLoggedIn} />

      <main className="main-content">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <MainDashboard
                phoneNumber={phoneNumber}
                walletBalance={walletBalance}
                portfolioTotal={portfolioAssets.total}
                dividendMonthly={dividendEarnings.monthlyEstimated}
                showToast={showToast}
                triggerTrade={triggerTrade}
                onLogout={setIsLoggedIn}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioDashboard
                sharesOwned={sharesOwned}
                portfolioTotal={portfolioAssets.total}
                portfolioEquities={portfolioAssets.equities}
                portfolioBonds={portfolioAssets.bonds}
                portfolioSavings={portfolioAssets.savings}
                showToast={showToast}
                triggerTrade={triggerTrade}
              />
            }
          />
          <Route
            path="/market"
            element={
              <MarketDashboard
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={executeTrade}
                showToast={showToast}
                triggerTrade={triggerTrade}
              />
            }
          />
          <Route
            path="/market/:symbol"
            element={
              <StockDetailPage
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={(type, sym, qty) => executeTrade(type, sym, qty)}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/market/:symbol/orderbook"
            element={
              <OrderBookPage
                showToast={showToast}
              />
            }
          />
          <Route
            path="/dividend"
            element={
              <DividendDashboard
                sharesOwned={sharesOwned}
                dividendEarnings={dividendEarnings}
                showToast={showToast}
              />
            }
          />
        </Routes>
      </main>



      {/* Slide-Up Trade Drawer overlay */}
      {activeTradeStock && (
        <>
          <div className="trade-drawer-overlay" onClick={() => setActiveTradeStock(null)} />
          <div className="trade-drawer">
            <div className="trade-drawer-header">
              <h3>Confirm Order</h3>
              <button className="trade-drawer-close" onClick={() => setActiveTradeStock(null)}>×</button>
            </div>

            <div className="trade-drawer-body">
              <div className="trade-drawer-stock-info">
                <span className="trade-drawer-symbol">{activeTradeStock.symbol}</span>
                <span className="trade-drawer-name">{activeTradeStock.name}</span>
                <span className="trade-drawer-price">ZMW {activeTradeStock.price.toFixed(2)}</span>
              </div>

              <div className="trade-drawer-tabs">
                <button
                  className={`trade-drawer-tab buy ${tradeType === 'buy' ? 'active' : ''}`}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </button>
                <button
                  className={`trade-drawer-tab sell ${tradeType === 'sell' ? 'active' : ''}`}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="trade-drawer-balance-info">
                {tradeType === 'buy' ? (
                  <span>Airtel Balance: ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                ) : (
                  <span>Owned: {sharesOwned[activeTradeStock.symbol] || 0} shares</span>
                )}
              </div>

              <div className="trade-drawer-qty-selector">
                <label>Quantity</label>
                <div className="qty-input-row">
                  <button onClick={() => setTradeQty(q => Math.max(1, q - 10))}>-10</button>
                  <input
                    type="number"
                    min="1"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setTradeQty(q => q + 10)}>+10</button>
                </div>

                <div className="qty-presets">
                  {[10, 50, 100, 500].map(preset => (
                    <button key={preset} onClick={() => setTradeQty(preset)}>
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="trade-drawer-summary">
                <div className="summary-row">
                  <span>Est. Price:</span>
                  <span>ZMW {activeTradeStock.price.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total {tradeType === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                  <span>ZMW {(activeTradeStock.price * tradeQty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button className="trade-drawer-confirm-btn" onClick={handleDrawerConfirm} style={{ width: '100%' }}>
                Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const walletHook = useWallet();
  const [toast, setToast] = useState('');

  const showToast = (message) => setToast(message);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <HashRouter>
      {toast && (
        <div className="toast-notification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast}</span>
        </div>
      )}

      <AppLayout
        useWalletHook={walletHook}
        showToast={showToast}
      />
    </HashRouter>
  );
}
