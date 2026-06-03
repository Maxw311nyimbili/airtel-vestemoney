import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import PortfolioDashboard from './components/PortfolioDashboard';
import MarketDashboard from './components/MarketDashboard';
import DividendDashboard from './components/DividendDashboard';
import StockDetailPage from './components/StockDetailPage';
import OrderBookPage from './components/OrderBookPage';
import Sidebar from './components/Sidebar';

import airtelLogo from './images/airtel_logo.png';
import { MOCK_STOCKS } from './data/mockData';
import { Icons } from './components/Icons';

function AppLayout({
  phoneNumber,
  setPhoneNumber,
  walletBalance,
  setWalletBalance,
  sharesOwned,
  setSharesOwned,
  showToast,
  isLoggedIn,
  setIsLoggedIn
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(() => [
    { path: '/dashboard', label: 'Dashboard', icon: <Icons.Home /> },
    { path: '/portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
    { path: '/market', label: 'Market', icon: <Icons.Market /> },
    { path: '/dividend', label: 'Dividends', icon: <Icons.Dividend /> },
  ], []);

  const portfolioAssets = useMemo(() => {
    let equitiesVal = 0;
    MOCK_STOCKS.forEach(stock => {
      if (stock.type === 'equities' && sharesOwned[stock.symbol]) {
        equitiesVal += sharesOwned[stock.symbol] * stock.price;
      }
    });
    const bondsVal = 3500.00;
    const savingsVal = 850.00;
    return {
      equities: equitiesVal,
      bonds: bondsVal,
      savings: savingsVal,
      total: equitiesVal + bondsVal + savingsVal
    };
  }, [sharesOwned]);

  const dividendEarnings = useMemo(() => {
    let monthlyEarning = 0;
    MOCK_STOCKS.forEach(stock => {
      if (stock.type === 'equities' && sharesOwned[stock.symbol]) {
        monthlyEarning += (sharesOwned[stock.symbol] * stock.price * (stock.yield / 100)) / 12;
      }
    });
    return { monthlyEstimated: monthlyEarning };
  }, [sharesOwned]);

  const handleTradeExecute = (type, symbol, qty, cost) => {
    if (type === 'buy') {
      setWalletBalance(prev => prev - cost);
      setSharesOwned(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + parseInt(qty)
      }));
    } else {
      setWalletBalance(prev => prev + cost);
      setSharesOwned(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) - parseInt(qty)
      }));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Account locked');
    navigate('/login');
  };

  if (location.pathname === '/') {
    return <LandingPage />;
  }

  if (location.pathname === '/login') {
    return (
      <LoginScreen
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showToast={showToast}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  // Guard routing - redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render sidebar + main content layout
  return (
    <div className="app-layout">
      <Sidebar
        phoneNumber={phoneNumber}
        currentPath={location.pathname}
        onNavigate={(path) => {
          navigate(path);
          setSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-brand">
          <img src={airtelLogo} alt="Airtel logo" className="mobile-brand-icon" />
        </div>
        <button
          className="back-btn"
          style={{ width: 36, height: 36, border: 'none', background: 'transparent' }}
          onClick={() => showToast('No new alerts')}
        >
          <Icons.Bell />
        </button>
      </div>

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
              />
            }
          />
          <Route
            path="/market"
            element={
              <MarketDashboard
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={handleTradeExecute}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/market/:symbol"
            element={
              <StockDetailPage
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={handleTradeExecute}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/market/:symbol/orderbook"
            element={
              <OrderBookPage
                walletBalance={walletBalance}
                sharesOwned={sharesOwned}
                onTradeExecute={handleTradeExecute}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path === '/market' && location.pathname.startsWith('/market/'));
          return (
            <button
              key={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="mobile-nav-icon">{item.icon}</div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('978541220');
  const [walletBalance, setWalletBalance] = useState(1280.50);
  const [toast, setToast] = useState('');
  const [sharesOwned, setSharesOwned] = useState({
    ATEL: 1200,
    CEC: 850,
    ZCCM: 100,
    ZMBF: 400,
    PUMA: 0
  });

  const showToast = (message) => setToast(message);

  useEffect(() => {
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
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
        sharesOwned={sharesOwned}
        setSharesOwned={setSharesOwned}
        showToast={showToast}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
    </HashRouter>
  );
}
