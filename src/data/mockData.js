import zambeefLogo from '../images/optimized/zambeef_logo.png';
import zanacoLogo from '../images/optimized/zanaco_logo.png';

export const MOCK_STOCKS = [
  {
    symbol: 'ZMBF',
    name: 'Zambeef Products Plc',
    price: 1.85,
    change: 1.64,
    yield: 5.41,
    type: 'equities',
    color: '#E30613',
    logo: zambeefLogo,
    marketOpen: '09:45 AM',
    availableShares: '8.8M',
    sector: 'Consumer',
    trend: [1.78, 1.80, 1.82, 1.85, 1.82, 1.88, 1.86, 1.85, 1.87, 1.84],
    open: 1.80,
    prevClose: 1.82,
    dayLow: 1.75,
    dayHigh: 1.88,
    volume: '21.4K',
    orderBook: {
      bestBid: '1.83',
      speed: 'High',
      bestAsk: '1.87',
      rows: [
        { volume: '2.5K', bid: '1.83', ask: '1.87', askVolume: '2.0K' },
        { volume: '1.7K', bid: '1.81', ask: '1.89', askVolume: '1.8K' },
        { volume: '1.1K', bid: '1.79', ask: '1.91', askVolume: '1.4K' }
      ]
    }
  },
  {
    symbol: 'ZNCO',
    name: 'Zambia National Commercial Bank Plc',
    price: 3.45,
    change: 1.20,
    yield: 8.50,
    type: 'equities',
    color: '#5F6577',
    marketOpen: '09:45 AM',
    availableShares: '6.2M',
    sector: 'Financials',
    trend: [3.35, 3.38, 3.40, 3.42, 3.39, 3.45, 3.48, 3.43, 3.45, 3.44],
    open: 3.40,
    prevClose: 3.41,
    dayLow: 3.32,
    dayHigh: 3.50,
    volume: '15.8K',
    orderBook: {
      bestBid: '3.42',
      speed: 'Medium',
      bestAsk: '3.47',
      rows: [
        { volume: '1.9K', bid: '3.42', ask: '3.47', askVolume: '1.5K' },
        { volume: '1.3K', bid: '3.40', ask: '3.49', askVolume: '1.8K' },
        { volume: '950', bid: '3.38', ask: '3.51', askVolume: '1.1K' }
      ]
    }
  },
  {
    symbol: 'ZMFA',
    name: 'Metal Fabricators of Zambia Plc',
    price: 2.15,
    change: -0.45,
    yield: 4.80,
    type: 'equities',
    color: '#C40510',
    marketOpen: '09:45 AM',
    availableShares: '3.8M',
    sector: 'Industrial',
    trend: [2.20, 2.18, 2.19, 2.17, 2.15, 2.16, 2.14, 2.15, 2.13, 2.15],
    open: 2.16,
    prevClose: 2.16,
    dayLow: 2.10,
    dayHigh: 2.22,
    volume: '8.4K',
    orderBook: {
      bestBid: '2.13',
      speed: 'Low',
      bestAsk: '2.17',
      rows: [
        { volume: '1.0K', bid: '2.13', ask: '2.17', askVolume: '900' },
        { volume: '800', bid: '2.11', ask: '2.19', askVolume: '1.1K' },
        { volume: '600', bid: '2.09', ask: '2.21', askVolume: '850' }
      ]
    }
  },
  {
    symbol: 'DCZM',
    name: 'DotCom Zambia Plc',
    price: 0.95,
    change: 4.12,
    yield: 3.20,
    type: 'equities',
    color: '#B80510',
    marketOpen: '09:45 AM',
    availableShares: '12.4M',
    sector: 'Technology',
    trend: [0.88, 0.90, 0.91, 0.93, 0.92, 0.95, 0.96, 0.94, 0.95, 0.94],
    open: 0.91,
    prevClose: 0.91,
    dayLow: 0.87,
    dayHigh: 0.98,
    volume: '34.2K',
    orderBook: {
      bestBid: '0.93',
      speed: 'High',
      bestAsk: '0.96',
      rows: [
        { volume: '5.2K', bid: '0.93', ask: '0.96', askVolume: '4.8K' },
        { volume: '3.8K', bid: '0.91', ask: '0.98', askVolume: '5.1K' },
        { volume: '2.4K', bid: '0.89', ask: '1.00', askVolume: '3.3K' }
      ]
    }
  },
  {
    symbol: 'PUMA',
    name: 'Puma Energy Zambia Plc',
    price: 2.10,
    change: 4.52,
    yield: 11.20,
    type: 'equities',
    color: '#9F050D',
    marketOpen: '09:45 AM',
    availableShares: '4.6M',
    sector: 'Energy',
    trend: [2.01, 2.03, 2.05, 2.10, 2.08, 2.12, 2.09, 2.10, 2.11, 2.08],
    open: 2.04,
    prevClose: 2.01,
    dayLow: 2.00,
    dayHigh: 2.12,
    volume: '9.3K',
    orderBook: {
      bestBid: '2.08',
      speed: 'High',
      bestAsk: '2.11',
      rows: [
        { volume: '1.9K', bid: '2.08', ask: '2.11', askVolume: '1.7K' },
        { volume: '1.3K', bid: '2.06', ask: '2.12', askVolume: '1.5K' },
        { volume: '930', bid: '2.04', ask: '2.14', askVolume: '1.2K' }
      ]
    }
  },
  {
    symbol: 'CHIL',
    name: 'Chilanga Cement Plc',
    price: 4.25,
    change: 0.85,
    yield: 9.10,
    type: 'equities',
    color: '#8B030D',
    marketOpen: '09:45 AM',
    availableShares: '5.1M',
    sector: 'Construction',
    trend: [4.15, 4.18, 4.20, 4.22, 4.20, 4.25, 4.27, 4.23, 4.25, 4.24],
    open: 4.20,
    prevClose: 4.21,
    dayLow: 4.12,
    dayHigh: 4.30,
    volume: '11.2K',
    orderBook: {
      bestBid: '4.22',
      speed: 'Medium',
      bestAsk: '4.26',
      rows: [
        { volume: '1.4K', bid: '4.22', ask: '4.26', askVolume: '1.1K' },
        { volume: '900', bid: '4.20', ask: '4.28', askVolume: '1.3K' },
        { volume: '600', bid: '4.18', ask: '4.30', askVolume: '850' }
      ]
    }
  },
  {
    symbol: 'CCAF',
    name: 'CEC Africa Investments Limited Company-Plc',
    price: 0.80,
    change: -1.25,
    yield: 6.50,
    type: 'equities',
    color: '#EF4444',
    marketOpen: '09:45 AM',
    availableShares: '9.4M',
    sector: 'Energy',
    trend: [0.83, 0.82, 0.81, 0.82, 0.80, 0.81, 0.79, 0.80, 0.79, 0.80],
    open: 0.81,
    prevClose: 0.81,
    dayLow: 0.78,
    dayHigh: 0.84,
    volume: '22.8K',
    orderBook: {
      bestBid: '0.79',
      speed: 'High',
      bestAsk: '0.81',
      rows: [
        { volume: '3.1K', bid: '0.79', ask: '0.81', askVolume: '2.5K' },
        { volume: '2.2K', bid: '0.77', ask: '0.83', askVolume: '2.9K' },
        { volume: '1.4K', bid: '0.75', ask: '0.85', askVolume: '1.8K' }
      ]
    }
  },
  {
    symbol: 'ZMRE',
    name: 'Zambia Reinsurance Plc',
    price: 1.50,
    change: 0.00,
    yield: 7.20,
    type: 'equities',
    color: '#9BA1B2',
    marketOpen: '09:45 AM',
    availableShares: '7.1M',
    sector: 'Insurance',
    trend: [1.50, 1.51, 1.49, 1.50, 1.48, 1.52, 1.50, 1.49, 1.50, 1.50],
    open: 1.50,
    prevClose: 1.50,
    dayLow: 1.46,
    dayHigh: 1.54,
    volume: '4.2K',
    orderBook: {
      bestBid: '1.48',
      speed: 'Low',
      bestAsk: '1.52',
      rows: [
        { volume: '800', bid: '1.48', ask: '1.52', askVolume: '600' },
        { volume: '500', bid: '1.46', ask: '1.54', askVolume: '850' },
        { volume: '300', bid: '1.44', ask: '1.56', askVolume: '450' }
      ]
    }
  },
  {
    symbol: 'BATZ',
    name: 'British American Tobacco Zambia Plc',
    price: 3.10,
    change: 0.65,
    yield: 8.10,
    type: 'equities',
    color: '#475569',
    marketOpen: '09:45 AM',
    availableShares: '2.9M',
    sector: 'Tobacco',
    trend: [3.05, 3.08, 3.09, 3.11, 3.08, 3.12, 3.10, 3.09, 3.10, 3.09],
    open: 3.08,
    prevClose: 3.08,
    dayLow: 3.02,
    dayHigh: 3.16,
    volume: '6.3K',
    orderBook: {
      bestBid: '3.08',
      speed: 'Medium',
      bestAsk: '3.12',
      rows: [
        { volume: '1.1K', bid: '3.08', ask: '3.12', askVolume: '950' },
        { volume: '750', bid: '3.06', ask: '3.14', askVolume: '1.2K' },
        { volume: '500', bid: '3.04', ask: '3.16', askVolume: '700' }
      ]
    }
  },
  {
    symbol: 'MAPS',
    name: 'Madison Financial Services Plc',
    price: 1.25,
    change: -2.10,
    yield: 5.80,
    type: 'equities',
    color: '#E30613',
    marketOpen: '09:45 AM',
    availableShares: '5.5M',
    sector: 'Financials',
    trend: [1.30, 1.28, 1.29, 1.27, 1.25, 1.26, 1.24, 1.25, 1.23, 1.25],
    open: 1.28,
    prevClose: 1.28,
    dayLow: 1.21,
    dayHigh: 1.31,
    volume: '14.1K',
    orderBook: {
      bestBid: '1.23',
      speed: 'Medium',
      bestAsk: '1.27',
      rows: [
        { volume: '2.0K', bid: '1.23', ask: '1.27', askVolume: '1.8K' },
        { volume: '1.4K', bid: '1.21', ask: '1.29', askVolume: '1.3K' },
        { volume: '900', bid: '1.19', ask: '1.31', askVolume: '1.1K' }
      ]
    }
  },
  {
    symbol: 'ZABR',
    name: 'Zambia Breweries Plc',
    price: 5.60,
    change: 1.85,
    yield: 6.20,
    type: 'equities',
    color: '#5F6577',
    marketOpen: '09:45 AM',
    availableShares: '3.2M',
    sector: 'Consumer',
    trend: [5.45, 5.50, 5.52, 5.55, 5.51, 5.62, 5.65, 5.58, 5.60, 5.59],
    open: 5.50,
    prevClose: 5.50,
    dayLow: 5.40,
    dayHigh: 5.70,
    volume: '18.4K',
    orderBook: {
      bestBid: '5.55',
      speed: 'High',
      bestAsk: '5.62',
      rows: [
        { volume: '2.2K', bid: '5.55', ask: '5.62', askVolume: '1.9K' },
        { volume: '1.6K', bid: '5.52', ask: '5.64', askVolume: '2.1K' },
        { volume: '1.1K', bid: '5.49', ask: '5.66', askVolume: '1.3K' }
      ]
    }
  },
  {
    symbol: 'SCBL',
    name: 'Standard Chartered Bank Zambia Plc',
    price: 2.85,
    change: 0.35,
    yield: 7.80,
    type: 'equities',
    color: '#C40510',
    marketOpen: '09:45 AM',
    availableShares: '4.8M',
    sector: 'Financials',
    trend: [2.80, 2.82, 2.84, 2.85, 2.83, 2.87, 2.89, 2.84, 2.85, 2.84],
    open: 2.84,
    prevClose: 2.84,
    dayLow: 2.78,
    dayHigh: 2.91,
    volume: '11.8K',
    orderBook: {
      bestBid: '2.83',
      speed: 'Medium',
      bestAsk: '2.87',
      rows: [
        { volume: '1.5K', bid: '2.83', ask: '2.87', askVolume: '1.2K' },
        { volume: '1.1K', bid: '2.81', ask: '2.89', askVolume: '1.5K' },
        { volume: '750', bid: '2.79', ask: '2.91', askVolume: '950' }
      ]
    }
  },
  {
    symbol: 'ZFCO',
    name: 'Zambia Forestry and Forest Industries Corporation Plc',
    price: 1.95,
    change: 2.15,
    yield: 5.90,
    type: 'equities',
    color: '#B80510',
    marketOpen: '09:45 AM',
    availableShares: '7.5M',
    sector: 'Forestry',
    trend: [1.88, 1.90, 1.92, 1.95, 1.92, 1.98, 1.96, 1.95, 1.97, 1.94],
    open: 1.91,
    prevClose: 1.91,
    dayLow: 1.86,
    dayHigh: 2.00,
    volume: '16.2K',
    orderBook: {
      bestBid: '1.92',
      speed: 'High',
      bestAsk: '1.97',
      rows: [
        { volume: '2.4K', bid: '1.92', ask: '1.97', askVolume: '2.1K' },
        { volume: '1.6K', bid: '1.90', ask: '1.99', askVolume: '1.7K' },
        { volume: '1.1K', bid: '1.88', ask: '2.01', askVolume: '1.2K' }
      ]
    }
  },
  {
    symbol: 'ZSUG',
    name: 'Zambia Sugar Plc',
    price: 6.80,
    change: -0.95,
    yield: 10.10,
    type: 'equities',
    color: '#9F050D',
    marketOpen: '09:45 AM',
    availableShares: '4.3M',
    sector: 'Consumer',
    trend: [6.95, 6.90, 6.88, 6.85, 6.81, 6.85, 6.82, 6.80, 6.83, 6.80],
    open: 6.86,
    prevClose: 6.86,
    dayLow: 6.74,
    dayHigh: 6.98,
    volume: '22.4K',
    orderBook: {
      bestBid: '6.78',
      speed: 'High',
      bestAsk: '6.84',
      rows: [
        { volume: '3.4K', bid: '6.78', ask: '6.84', askVolume: '2.9K' },
        { volume: '2.2K', bid: '6.74', ask: '6.86', askVolume: '2.5K' },
        { volume: '1.5K', bid: '6.70', ask: '6.88', askVolume: '1.7K' }
      ]
    }
  },
  {
    symbol: 'REIZ',
    name: 'Real Estate Investment Zambia Plc',
    price: 2.50,
    change: 0.00,
    yield: 9.50,
    type: 'equities',
    color: '#8B030D',
    marketOpen: '09:45 AM',
    availableShares: '3.4M',
    sector: 'Real Estate',
    trend: [2.50, 2.52, 2.48, 2.50, 2.49, 2.51, 2.50, 2.48, 2.50, 2.50],
    open: 2.50,
    prevClose: 2.50,
    dayLow: 2.44,
    dayHigh: 2.56,
    volume: '5.3K',
    orderBook: {
      bestBid: '2.46',
      speed: 'Low',
      bestAsk: '2.54',
      rows: [
        { volume: '700', bid: '2.46', ask: '2.54', askVolume: '500' },
        { volume: '400', bid: '2.42', ask: '2.56', askVolume: '750' },
        { volume: '250', bid: '2.38', ask: '2.58', askVolume: '350' }
      ]
    }
  },
  {
    symbol: 'NATB',
    name: 'National Breweries Plc',
    price: 1.65,
    change: -1.20,
    yield: 6.90,
    type: 'equities',
    color: '#EF4444',
    marketOpen: '09:45 AM',
    availableShares: '6.7M',
    sector: 'Consumer',
    trend: [1.70, 1.68, 1.67, 1.65, 1.63, 1.66, 1.64, 1.65, 1.63, 1.65],
    open: 1.67,
    prevClose: 1.67,
    dayLow: 1.60,
    dayHigh: 1.72,
    volume: '9.1K',
    orderBook: {
      bestBid: '1.63',
      speed: 'Medium',
      bestAsk: '1.67',
      rows: [
        { volume: '1.2K', bid: '1.63', ask: '1.67', askVolume: '1.1K' },
        { volume: '800', bid: '1.61', ask: '1.69', askVolume: '1.4K' },
        { volume: '500', bid: '1.59', ask: '1.71', askVolume: '800' }
      ]
    }
  },
  {
    symbol: 'ZCCM',
    name: 'Zambia Consolidated Copper Mines – Investment Holding Plc',
    price: 12.50,
    change: 0.00,
    yield: 2.40,
    type: 'equities',
    color: '#9BA1B2',
    marketOpen: '09:45 AM',
    availableShares: '1.2M',
    sector: 'Mining',
    trend: [12.38, 12.40, 12.42, 12.50, 12.48, 12.54, 12.52, 12.50, 12.48, 12.51],
    open: 12.50,
    prevClose: 12.50,
    dayLow: 12.34,
    dayHigh: 12.60,
    volume: '6.7K',
    orderBook: {
      bestBid: '12.42',
      speed: 'Low',
      bestAsk: '12.54',
      rows: [
        { volume: '1.0K', bid: '12.42', ask: '12.54', askVolume: '950' },
        { volume: '750', bid: '12.40', ask: '12.56', askVolume: '1.1K' },
        { volume: '530', bid: '12.38', ask: '12.58', askVolume: '780' }
      ]
    }
  },
  {
    symbol: 'AECI',
    name: 'AECI Mining Explosives Plc',
    price: 5.20,
    change: 1.15,
    yield: 4.50,
    type: 'equities',
    color: '#475569',
    marketOpen: '09:45 AM',
    availableShares: '2.1M',
    sector: 'Mining',
    trend: [5.10, 5.15, 5.12, 5.20, 5.18, 5.24, 5.22, 5.20, 5.18, 5.21],
    open: 5.14,
    prevClose: 5.14,
    dayLow: 5.08,
    dayHigh: 5.28,
    volume: '4.8K',
    orderBook: {
      bestBid: '5.15',
      speed: 'Low',
      bestAsk: '5.24',
      rows: [
        { volume: '1.2K', bid: '5.15', ask: '5.24', askVolume: '850' },
        { volume: '700', bid: '5.12', ask: '5.26', askVolume: '1.0K' },
        { volume: '450', bid: '5.09', ask: '5.28', askVolume: '600' }
      ]
    }
  },
  {
    symbol: 'CEC',
    name: 'Copperbelt Energy Corporation Plc',
    price: 3.20,
    change: -0.78,
    yield: 9.38,
    type: 'equities',
    color: '#E30613',
    marketOpen: '09:45 AM',
    availableShares: '3.1M',
    sector: 'Energy',
    trend: [3.26, 3.28, 3.30, 3.29, 3.24, 3.22, 3.20, 3.21, 3.23, 3.20],
    open: 3.30,
    prevClose: 3.22,
    dayLow: 3.14,
    dayHigh: 3.34,
    volume: '12.8K',
    orderBook: {
      bestBid: '3.18',
      speed: 'Medium',
      bestAsk: '3.25',
      rows: [
        { volume: '1.8K', bid: '3.18', ask: '3.24', askVolume: '1.4K' },
        { volume: '1.2K', bid: '3.16', ask: '3.26', askVolume: '1.8K' },
        { volume: '850', bid: '3.14', ask: '3.28', askVolume: '1.6K' }
      ]
    }
  },
  {
    symbol: 'ATEL',
    name: 'Airtel Networks Plc',
    price: 4.85,
    change: 2.11,
    yield: 9.28,
    type: 'equities',
    color: '#5F6577',
    marketOpen: '09:45 AM',
    availableShares: '5.4M',
    sector: 'Telecom',
    trend: [4.72, 4.76, 4.80, 4.85, 4.78, 4.82, 4.90, 4.87, 4.85, 4.88],
    open: 4.72,
    prevClose: 4.75,
    dayLow: 4.60,
    dayHigh: 4.90,
    volume: '18.2K',
    orderBook: {
      bestBid: '4.78',
      speed: 'High',
      bestAsk: '4.86',
      rows: [
        { volume: '2.1K', bid: '4.78', ask: '4.84', askVolume: '1.9K' },
        { volume: '1.4K', bid: '4.76', ask: '4.86', askVolume: '2.3K' },
        { volume: '900', bid: '4.74', ask: '4.88', askVolume: '1.5K' }
      ]
    }
  },
  {
    symbol: 'SHOP',
    name: 'Shoprite Holdings Plc',
    price: 8.50,
    change: 0.50,
    yield: 3.50,
    type: 'equities',
    color: '#C40510',
    marketOpen: '09:45 AM',
    availableShares: '1.9M',
    sector: 'Retail',
    trend: [8.40, 8.45, 8.42, 8.50, 8.48, 8.55, 8.52, 8.50, 8.48, 8.51],
    open: 8.45,
    prevClose: 8.45,
    dayLow: 8.35,
    dayHigh: 8.60,
    volume: '4.5K',
    orderBook: {
      bestBid: '8.46',
      speed: 'Medium',
      bestAsk: '8.54',
      rows: [
        { volume: '1.2K', bid: '8.46', ask: '8.54', askVolume: '900' },
        { volume: '800', bid: '8.42', ask: '8.56', askVolume: '1.1K' },
        { volume: '500', bid: '8.38', ask: '8.58', askVolume: '650' }
      ]
    }
  },
  {
    symbol: 'KLAP',
    name: 'Klapton Reinsurance PLC',
    price: 2.25,
    change: 3.20,
    yield: 4.80,
    type: 'equities',
    color: '#B80510',
    marketOpen: '09:45 AM',
    availableShares: '8.2M',
    sector: 'Insurance',
    trend: [2.15, 2.18, 2.20, 2.25, 2.22, 2.27, 2.25, 2.24, 2.25, 2.25],
    open: 2.18,
    prevClose: 2.18,
    dayLow: 2.12,
    dayHigh: 2.30,
    volume: '19.4K',
    orderBook: {
      bestBid: '2.21',
      speed: 'High',
      bestAsk: '2.27',
      rows: [
        { volume: '2.8K', bid: '2.21', ask: '2.27', askVolume: '2.3K' },
        { volume: '1.9K', bid: '2.19', ask: '2.29', askVolume: '1.6K' },
        { volume: '1.1K', bid: '2.17', ask: '2.31', askVolume: '1.0K' }
      ]
    }
  },
  {
    symbol: 'BATA',
    name: 'Bata Zambia Plc',
    price: 1.45,
    change: -0.65,
    yield: 5.20,
    type: 'equities',
    color: '#9F050D',
    marketOpen: '09:45 AM',
    availableShares: '6.4M',
    sector: 'Manufacturing',
    trend: [1.50, 1.48, 1.47, 1.45, 1.43, 1.46, 1.44, 1.45, 1.43, 1.45],
    open: 1.46,
    prevClose: 1.46,
    dayLow: 1.40,
    dayHigh: 1.50,
    volume: '7.8K',
    orderBook: {
      bestBid: '1.43',
      speed: 'Low',
      bestAsk: '1.47',
      rows: [
        { volume: '950', bid: '1.43', ask: '1.47', askVolume: '800' },
        { volume: '600', bid: '1.41', ask: '1.49', askVolume: '1.1K' },
        { volume: '400', bid: '1.39', ask: '1.51', askVolume: '550' }
      ]
    }
  },
];

export const MOCK_TRANSACTIONS = [
  { id: 1, title: 'Airtel Zambia Dividend Payout', date: 'May 24, 2026', amount: 504.00, type: 'dividend', plus: true },
  { id: 2, title: 'Purchased 150 shares of CEC Plc', date: 'May 20, 2026', amount: 480.00, type: 'market', plus: false },
  { id: 3, title: 'GRZ 10Y Coupon Distribution', date: 'May 15, 2026', amount: 587.50, type: 'dividend', plus: true },
  { id: 4, title: 'Deposit via Airtel Money Wallet', date: 'May 08, 2026', amount: 1500.00, type: 'wallet', plus: true },
  { id: 5, title: 'CEC Plc Dividend Payout', date: 'Apr 30, 2026', amount: 255.00, type: 'dividend', plus: true }
];

export const UPCOMING_DIVIDENDS = [
  { symbol: 'ATEL', exDate: 'Jun 10, 2026', rate: 0.42, date: 'Jun 28, 2026' },
  { symbol: 'CEC', exDate: 'Jun 15, 2026', rate: 0.30, date: 'Jul 05, 2026' },
  { symbol: 'PUMA', exDate: 'Jun 25, 2026', rate: 0.22, date: 'Jul 18, 2026' },
  { symbol: 'ZMBF', exDate: 'Jul 02, 2026', rate: 0.10, date: 'Jul 24, 2026' }
];
