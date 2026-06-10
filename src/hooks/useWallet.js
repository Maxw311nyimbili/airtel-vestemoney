import { useState } from 'react';
import { StocksService } from '../services/api';

export function useWallet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Mercy');
  const [phoneNumber, setPhoneNumber] = useState('978541220');
  const [walletBalance, setWalletBalance] = useState(1280.50);
  const [sharesOwned, setSharesOwned] = useState({
    ATEL: 1200,
    CEC: 850,
    ZCCM: 100,
    ZMBF: 400,
    PUMA: 0
  });

  const executeTrade = (type, symbol, qty) => {
    const stock = StocksService.getStockBySymbol(symbol);
    if (!stock) return { success: false, error: 'Asset not found' };

    const cost = StocksService.calculateTradeCost(stock.price, qty);
    const owned = sharesOwned[symbol] || 0;

    const validation = StocksService.validateTrade(type, walletBalance, owned, qty, cost);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

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
        [symbol]: Math.max(0, (prev[symbol] || 0) - parseInt(qty))
      }));
    }

    return { success: true, cost };
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
    phoneNumber,
    setPhoneNumber,
    walletBalance,
    setWalletBalance,
    sharesOwned,
    setSharesOwned,
    executeTrade
  };
}
