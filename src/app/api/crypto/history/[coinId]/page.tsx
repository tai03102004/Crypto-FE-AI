'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateMetadata } from '@/app/helper/generateMetadata';

// export const metadata = generateMetadata(
//   "JadenX.AI - History of Crypto Prices",
//   "Detailed historical price data for cryptocurrencies with interactive charts and statistics."
// );

interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CryptoHistoryResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
}

interface CoinInfo {
  name: string;
  symbol: string;
  icon: string;
  color: string;
}


const CryptoHistoryPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const coinId = params.coinId as string;
  
  const [historyData, setHistoryData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Coin information mapping
  const coinInfo: { [key: string]: CoinInfo } = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      color: 'text-orange-500'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      color: 'text-blue-500'
    }
  };

  // Fetch crypto history data
  const fetchHistoryData = async (coin: string, range: string = '30d'): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/crypto/history/${coin}?range=${range}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CryptoHistoryResponse = await response.json();
      
      // Convert price data to candlestick format
      const candlestickData: CandlestickData[] = [];
      if (!data.prices || data.prices.length === 0) {
        throw new Error('No price data available for this coin');
      }
      for (let i = 0; i < data.prices.length; i++) {
        const [timestamp, price] = data.prices[i];
        const [, marketCap] = data.market_caps[i] || [timestamp, 0];
        const [, volume] = data.total_volumes[i] || [timestamp, 0];
        
        // For candlestick, we need OHLC data
        // Since we only have closing prices, we'll simulate OHLC based on price movements
        const prevPrice = i > 0 ? data.prices[i - 1][1] : price;
        const nextPrice = i < data.prices.length - 1 ? data.prices[i + 1][1] : price;
        
        // Create realistic OHLC data
        const volatility = Math.random() * 0.02 + 0.01; // 1-3% volatility
        const high = price * (1 + volatility);
        const low = price * (1 - volatility);
        const open = i === 0 ? price : data.prices[i - 1][1];
        const close = price;
        
        const change = close - open;
        const changePercent = (change / open) * 100;
        
        candlestickData.push({
          date: new Date(timestamp).toISOString().split('T')[0],
          open,
          high,
          low,
          close,
          volume,
          change,
          changePercent
        });
      }
      
      setHistoryData(candlestickData);
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else {
      return `${formatNumber(num)}`;
    }
  };

  // Calculate candlestick dimensions
  const calculateCandlestickDimensions = (data: CandlestickData[], index: number, chartHeight: number, minPrice: number, maxPrice: number) => {
    const priceRange = maxPrice - minPrice;
    const scaleY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    var k = 0;
    const { open, high, low, close } = data[k++];
    
    return {
      x: index * 25 + 50, // 25px width per candle + 50px left margin
      openY: scaleY(open),
      highY: scaleY(high),
      lowY: scaleY(low),
      closeY: scaleY(close),
      isGreen: close > open,
      bodyHeight: Math.abs(scaleY(close) - scaleY(open)),
      bodyTop: Math.min(scaleY(open), scaleY(close))
    };
  };

  // Get current coin info
  const currentCoin = coinInfo[coinId as string] || { name: coinId, symbol: coinId?.toString().toUpperCase(), icon: '?', color: 'text-gray-500' };

  // Effect to fetch data when component mounts or coinId changes
  useEffect(() => {
    if (coinId && typeof coinId === 'string') {
      fetchHistoryData(coinId, timeRange);
    }
  }, [coinId, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {currentCoin.name} history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => coinId && fetchHistoryData(coinId as string, timeRange)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartHeight = 400;
  const chartWidth = Math.max(800, historyData.length * 25);
  const minPrice = Math.min(...historyData.map(d => d.low));
  const maxPrice = Math.max(...historyData.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${currentCoin.color} font-bold`}>
                  {currentCoin.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentCoin.name}</h1>
                  <p className="text-gray-600">{currentCoin.symbol} Price History</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Price Chart</h2>
          
          {/* Chart Container */}
          <div className="overflow-x-auto">
            <svg width={chartWidth} height={chartHeight + 100} className="border rounded-lg">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="25" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Price axis labels */}
              {Array.from({ length: 6 }, (_, i) => {
                const price = minPrice + (priceRange * i / 5);
                const y = chartHeight - ((price - minPrice) / priceRange) * chartHeight;
                return (
                  <g key={i}>
                    <line x1="40" y1={y} x2="45" y2={y} stroke="#9ca3af" strokeWidth="1" />
                    <text x="35" y={y + 4} textAnchor="end" className="text-xs" fill="#6b7280">
                      ${formatNumber(price)}
                    </text>
                  </g>
                );
              })}
              
              {/* Candlesticks */}
              {historyData.map((data, index) => {
                const dims = calculateCandlestickDimensions([data], index, chartHeight, minPrice, maxPrice);
                const color = dims.isGreen ? '#10b981' : '#ef4444';
                
                return (
                  <g key={index}>
                    {/* High-Low line */}
                    <line
                      x1={dims.x + 10}
                      y1={dims.highY}
                      x2={dims.x + 10}
                      y2={dims.lowY}
                      stroke={color}
                      strokeWidth="1"
                    />
                    
                    {/* Open-Close body */}
                    <rect
                      x={dims.x + 2}
                      y={dims.bodyTop}
                      width="16"
                      height={Math.max(dims.bodyHeight, 1)}
                      fill={dims.isGreen ? color : 'white'}
                      stroke={color}
                      strokeWidth="1"
                    />
                    
                    {/* Date label (every 5th candle) */}
                    {index % 5 === 0 && (
                      <text
                        x={dims.x + 10}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        className="text-xs"
                        fill="#6b7280"
                        transform={`rotate(45, ${dims.x + 10}, ${chartHeight + 20})`}
                      >
                        {data.date}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {historyData.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Price</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${formatNumber(historyData[historyData.length - 1].close)}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24h Change</h3>
                <p className={`text-2xl font-bold ${
                  historyData[historyData.length - 1].changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {historyData[historyData.length - 1].changePercent >= 0 ? '+' : ''}
                  {historyData[historyData.length - 1].changePercent.toFixed(2)}%
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Highest Price</h3>
                <p className="text-2xl font-bold text-green-500">
                  ${formatNumber(Math.max(...historyData.map(d => d.high)))}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lowest Price</h3>
                <p className="text-2xl font-bold text-red-500">
                  ${formatNumber(Math.min(...historyData.map(d => d.low)))}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Price History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyData.slice(-10).reverse().map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatNumber(data.open)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${formatNumber(data.high)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${formatNumber(data.low)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatNumber(data.close)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatLargeNumber(data.volume)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoHistoryPage;