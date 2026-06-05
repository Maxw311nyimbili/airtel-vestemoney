import { MOCK_STOCKS } from '../data/mockData';

// Simulated Network APIs Client
export const StocksService = {
  getAllStocks() {
    return MOCK_STOCKS;
  },

  getStockBySymbol(symbol) {
    if (!symbol) return null;
    return MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  },

  calculateTradeCost(price, quantity) {
    return price * quantity;
  },

  validateTrade(type, walletBalance, ownedShares, quantity, cost) {
    if (type === 'buy' && walletBalance < cost) {
      return { valid: false, error: 'Insufficient Airtel Wallet Balance!' };
    }
    if (type === 'sell' && ownedShares < quantity) {
      return { valid: false, error: 'Not enough shares in portfolio to sell!' };
    }
    return { valid: true };
  }
};
