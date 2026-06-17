import { useState } from 'react';
import { StocksService } from '../services/api';

export function useWallet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState('Mercy');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [csdAccountNumber] = useState('CSD-0048213');
  const [tradingAccountNumber] = useState('VM-ZM-77042');
  const [atsNumber] = useState('ATS-008149');
  const [walletBalance, setWalletBalance] = useState(1280.50);
  const [sharesOwned, setSharesOwned] = useState({
    ATEL: 1200,
    CEC: 850,
    ZCCM: 100,
    ZMBF: 400,
    PUMA: 0
  });

  // Symbols with an order awaiting LuSE matching/settlement
  const [pendingTrades, setPendingTrades] = useState({});

  const executeTrade = (type, symbol, qty) => {
    const stock = StocksService.getStockBySymbol(symbol);
    if (!stock) return { success: false, error: 'Asset not found' };

    const cost = StocksService.calculateTradeCost(stock.price, qty);
    const owned = sharesOwned[symbol] || 0;

    const validation = StocksService.validateTrade(type, walletBalance, owned, qty, cost);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Payment is processed immediately via Airtel Money
    if (type === 'buy') {
      setWalletBalance(prev => prev - cost);
    } else {
      setWalletBalance(prev => prev + cost);
    }

    // Order is awaiting LuSE matching/settlement — Shares Owned
    // will not update until the order settles
    setPendingTrades(prev => ({ ...prev, [symbol]: type }));

    setTimeout(() => {
      setSharesOwned(prev => {
        const current = prev[symbol] || 0;
        const updated = type === 'buy'
          ? current + parseInt(qty)
          : Math.max(0, current - parseInt(qty));
        return { ...prev, [symbol]: updated };
      });
      setPendingTrades(prev => {
        const next = { ...prev };
        delete next[symbol];
        return next;
      });
    }, 8000);

    return { success: true, cost };
  };

  return {
        isLoggedIn,
    setIsLoggedIn,
    isGuest,
    setIsGuest,
    userName,
    setUserName,
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
    setPendingTrades,
    executeTrade
  };
}
