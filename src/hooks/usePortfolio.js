import { useMemo } from 'react';
import { StocksService } from '../services/api';

export function usePortfolio(sharesOwned) {
  const allStocks = useMemo(() => StocksService.getAllStocks(), []);

  const portfolioAssets = useMemo(() => {
    let equitiesVal = 0;
    allStocks.forEach(stock => {
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
  }, [sharesOwned, allStocks]);

  const dividendEarnings = useMemo(() => {
    let monthlyEarning = 0;
    allStocks.forEach(stock => {
      if (stock.type === 'equities' && sharesOwned[stock.symbol]) {
        monthlyEarning += (sharesOwned[stock.symbol] * stock.price * (stock.yield / 100)) / 12;
      }
    });
    return { monthlyEstimated: monthlyEarning };
  }, [sharesOwned, allStocks]);

  return {
    portfolioAssets,
    dividendEarnings
  };
}
