import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

// Airtel Wealth & Trading Simulator Layout Components
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Feature Components
import LandingPage from './components/features/splash/LandingPage';
import LoginScreen from './components/features/auth/LoginScreen';
import MainDashboard from './components/features/dashboard/MainDashboard';
import PortfolioDashboard from './components/features/portfolio/PortfolioDashboard';
import OrderStatusPage from './components/features/portfolio/OrderStatusPage';
import MarketDashboard from './components/features/market/MarketDashboard';
import StockDetailPage from './components/features/market/StockDetailPage';
import BuySharesPage from './components/features/market/BuySharesPage';
import SellSharesPage from './components/features/market/SellSharesPage';
import OrderBookPage from './components/features/market/OrderBookPage';
import WatchlistPage from './components/features/watchlist/WatchlistPage';
import DividendDashboard from './components/features/dividends/DividendDashboard';
import SettingsPage from './components/features/settings/SettingsPage';

// Data and Assets
import { MOCK_STOCKS } from './data/mockData';
import { Icons } from './components/Icons';

// Custom State Hooks
import { useWallet } from './hooks/useWallet';
import { usePortfolio } from './hooks/usePortfolio';
import { useWatchlist } from './hooks/useWatchlist';

function AppLayout({ useWalletHook, showToast, isDarkMode, toggleDarkMode }) {
  const {
    isLoggedIn,
    isGuest,
    setIsGuest,
    userName,
    phoneNumber,
    setPhoneNumber,
    csdAccountNumber,
    tradingAccountNumber,
    atsNumber,
    walletBalance,
    setWalletBalance,
    sharesOwned,
    setSharesOwned,
    pendingTrades,
    setIsLoggedIn,
    executeTrade,
  } = useWalletHook;

  const { portfolioAssets, dividendEarnings } = usePortfolio(sharesOwned);
  const { watchlist, toggleWatchlist } = useWatchlist();

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
    if (!result.success) { showToast(result.error); return; }
    showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${tradeQty} shares of ${activeTradeStock.symbol}!`);
    setActiveTradeStock(null);
  };

  // Landing page – always show without login check
  if (location.pathname === '/') {
    return <LandingPage setIsLoggedIn={setIsLoggedIn} setIsGuest={setIsGuest} />;
  }

  // Login screen
  if (location.pathname === '/login') {
    return (
      <LoginScreen
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showToast={showToast}
        setIsLoggedIn={setIsLoggedIn}
        setIsGuest={setIsGuest}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Header showToast={showToast} onLogout={setIsLoggedIn} isGuest={isGuest} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="main-content">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <MainDashboard
                userName={userName}
                phoneNumber={phoneNumber}
                walletBalance={walletBalance}
                portfolioTotal={portfolioAssets.total}
                portfolioEquities={portfolioAssets.equities}
                portfolioBonds={portfolioAssets.bonds}
                portfolioSavings={portfolioAssets.savings}
                sharesOwned={sharesOwned}
                dividendEarnings={dividendEarnings}
                showToast={showToast}
                triggerTrade={triggerTrade}
                onLogout={setIsLoggedIn}
                isGuest={isGuest}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
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
                pendingTrades={pendingTrades}
                showToast={showToast}
                triggerTrade={triggerTrade}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/portfolio/:symbol"
            element={
              <OrderStatusPage
                sharesOwned={sharesOwned}
                pendingTrades={pendingTrades}
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
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
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
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            }
          />
          <Route
            path="/market/:symbol/buy"
            element={
              <BuySharesPage
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={(type, sym, qty) => executeTrade(type, sym, qty)}
                showToast={showToast}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/market/:symbol/sell"
            element={
              <SellSharesPage
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={(type, sym, qty) => executeTrade(type, sym, qty)}
                showToast={showToast}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/market/:symbol/orderbook"
            element={<OrderBookPage showToast={showToast} />}
          />
          <Route
            path="/watchlist"
            element={
              <WatchlistPage
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                sharesOwned={sharesOwned}
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
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                userName={userName}
                phoneNumber={phoneNumber}
                csdAccountNumber={csdAccountNumber}
                tradingAccountNumber={tradingAccountNumber}
                atsNumber={atsNumber}
                onLogout={setIsLoggedIn}
                showToast={showToast}
                isGuest={isGuest}
              />
            }
          />
        </Routes>
      </main>

      {/* Slide-Up Trade Drawer */}
      {activeTradeStock && (
        <>
          <div className="trade-drawer-overlay" onClick={() => setActiveTradeStock(null)} />
          <div className="trade-drawer">
            <div className="trade-drawer-header">
              <h3>Confirm Trade</h3>
              <button className="trade-drawer-close" onClick={() => setActiveTradeStock(null)}>×</button>
            </div>

            <div className="trade-drawer-body">
              <div className="trade-drawer-stock-info">
                <span className="trade-drawer-symbol">{activeTradeStock.symbol}</span>
                <span className="trade-drawer-name">{activeTradeStock.name}</span>
                <span className="trade-drawer-price">ZMW {activeTradeStock.price.toFixed(2)}</span>
              </div>

              <div className="trade-drawer-tabs">
                <button className={`trade-drawer-tab buy ${tradeType === 'buy' ? 'active' : ''}`} onClick={() => setTradeType('buy')}>Buy (Invest)</button>
                <button className={`trade-drawer-tab sell ${tradeType === 'sell' ? 'active' : ''}`} onClick={() => setTradeType('sell')}>Sell (Cash Out)</button>
              </div>

              <div className="trade-drawer-balance-info">
                {tradeType === 'buy'
                  ? <span>Airtel Wallet: ZMW {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  : <span>Shares Owned: {sharesOwned[activeTradeStock.symbol] || 0} shares</span>
                }
              </div>

              <div className="trade-drawer-qty-selector">
                <label>Number of Shares</label>
                <div className="qty-input-row">
                  <button onClick={() => setTradeQty(q => Math.max(1, q - 10))}>−10</button>
                  <input
                    type="number"
                    min="1"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setTradeQty(q => q + 10)}>+10</button>
                </div>
                <div className="qty-presets">
                  {[10, 50, 100, 500].map(p => (
                    <button key={p} onClick={() => setTradeQty(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="trade-drawer-summary">
                <div className="summary-row">
                  <span>Price per Share:</span>
                  <span>ZMW {activeTradeStock.price.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total {tradeType === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                  <span>ZMW {(activeTradeStock.price * tradeQty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button className="trade-drawer-confirm-btn" onClick={handleDrawerConfirm}>
                Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}

export default function App() {
  const walletHook = useWallet();
  const [toast, setToast] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const showToast = (message) => setToast(message);

  const toggleDarkMode = () => setIsDarkMode(d => !d);

  // Apply data-theme to <html> so CSS vars cascade everywhere
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast}</span>
        </div>
      )}
      <AppLayout useWalletHook={walletHook} showToast={showToast} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </HashRouter>
  );
}
