'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useParams } from 'next/navigation';
interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

interface CoinInfo {
  name: string;
  symbol: string;
  icon: string;
  color: string;
  gradient: string;
}

interface APIResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const CryptoHistoryPage: React.FC = () => {
  const params = useParams();
  const coinId = params.coinId as string;
  const [historyData, setHistoryData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [selectedCandle, setSelectedCandle] = useState<CandlestickData | null>(null);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Coin information mapping
  const coinInfo: { [key: string]: CoinInfo } = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      color: 'text-orange-400',
      gradient: 'from-orange-500 to-yellow-500'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-purple-500'
    }
  };

  const convertApiDataToCandlestick = (apiData: APIResponse): CandlestickData[] => {
    const { prices, market_caps, total_volumes } = apiData;
    
    return prices.map((priceData, index) => {
      const [timestamp, price] = priceData;
      const volume = total_volumes[index] ? total_volumes[index][1] : 0;
      
      // Calculate OHLC from price (since API only provides closing prices)
      // We'll simulate OHLC by adding small variations
      const close = price;
      const variation = price * 0.01; // 1% variation
      const open = index > 0 ? prices[index - 1][1] : close;
      const high = Math.max(open, close) + (Math.random() * variation);
      const low = Math.min(open, close) - (Math.random() * variation);
      
      const change = close - open;
      const changePercent = open !== 0 ? (change / open) * 100 : 0;
      
      return {
        date: new Date(timestamp).toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(0)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: timestamp
      };
    });
  };

  // Fetch data from API
  const fetchHistoryData = async (coinId: string, days: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/crypto/history/${coinId}?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: APIResponse = await response.json();
      
      if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
        throw new Error('Invalid data format received from API');
      }
      
      const candlestickData = convertApiDataToCandlestick(data);
      setHistoryData(candlestickData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // Fallback to demo data
      const demoData = generateDemoData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365);
      setHistoryData(demoData);
    } finally {
      setLoading(false);
    }
  };

  // Generate demo data (fallback)
  const generateDemoData = (days: number): CandlestickData[] => {
    const data: CandlestickData[] = [];
    const basePrice = coinId === 'bitcoin' ? 45000 : 2500;
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const volatility = 0.02 + Math.random() * 0.03;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const priceChange = currentPrice * volatility * direction;
      
      const open = currentPrice;
      const close = currentPrice + priceChange;
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      
      const volume = (Math.random() * 50000000000) + 10000000000;
      const change = close - open;
      const changePercent = (change / open) * 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(0)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: date.getTime()
      });
      
      currentPrice = close;
    }
    
    return data;
  };

  // Format number
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

  // Custom Candlestick Component
  const CustomCandlestick = ({ data }: { data: CandlestickData[] }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.clientWidth,
            height: 400
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (!data.length) return null;

    const minPrice = Math.min(...data.map(d => d.low));
    const maxPrice = Math.max(...data.map(d => d.high));
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;
    const chartMinPrice = minPrice - padding;
    const chartMaxPrice = maxPrice + padding;
    const chartPriceRange = chartMaxPrice - chartMinPrice;

    const candleWidth = Math.max(8, (dimensions.width - 120) / data.length - 2);
    const wickWidth = Math.max(1, candleWidth / 4);

    return (
      <div ref={containerRef} className="w-full bg-[#0d1117] rounded-xl p-4 border border-gray-700/50 overflow-x-auto">
        <svg width={Math.max(dimensions.width, data.length * (candleWidth + 2) + 120)} height={dimensions.height}>
          {/* Grid lines */}
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Price grid lines */}
          {Array.from({ length: 8 }, (_, i) => {
            const price = chartMinPrice + (chartPriceRange * i / 7);
            const y = dimensions.height - 50 - ((price - chartMinPrice) / chartPriceRange) * (dimensions.height - 100);
            return (
              <g key={i}>
                <line 
                  x1="70" 
                  y1={y} 
                  x2={Math.max(dimensions.width, data.length * (candleWidth + 2) + 120) - 20} 
                  y2={y} 
                  stroke="#374151" 
                  strokeWidth="0.5" 
                  opacity="0.3"
                />
                <text x="70" y={y + 4} textAnchor="end" fontSize="12" fill="#9ca3af" className="pl-[10px]">
                {"$" + formatNumber(price)}
                </text>
              </g>
            );
          })}

          {/* Candlesticks */}
          {data.map((candle, index) => {
            const x = 70 + index * (candleWidth + 2);
            const scaleY = (price: number) => 
              dimensions.height - 50 - ((price - chartMinPrice) / chartPriceRange) * (dimensions.height - 100);

            const openY = scaleY(candle.open);
            const highY = scaleY(candle.high);
            const lowY = scaleY(candle.low);
            const closeY = scaleY(candle.close);
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(closeY - openY);
            const bodyTop = Math.min(openY, closeY);

            return (
              <g key={index}>
                {/* High-Low wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={highY}
                  x2={x + candleWidth / 2}
                  y2={lowY}
                  stroke={isGreen ? '#10b981' : '#ef4444'}
                  strokeWidth={wickWidth}
                  opacity="0.8"
                />
                
                {/* Candle body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(bodyHeight, 1)}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                  stroke={isGreen ? '#059669' : '#dc2626'}
                  strokeWidth="1"
                  rx="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedCandle(candle)}
                />

                {/* Date labels (every nth candle) */}
                {index % Math.max(1, Math.floor(data.length / 10)) === 0 && (
                  <text
                    x={x + candleWidth / 2}
                    y={dimensions.height - 30}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                    transform={`rotate(-45, ${x + candleWidth / 2}, ${dimensions.height - 30})`}
                  >
                    {new Date(candle.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Custom tooltip for line chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#171c24] border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{new Date(label).toLocaleDateString()}</p>
          <p className="text-blue-400">Price: ${formatNumber(data.close)}</p>
          <p className={`${data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Change: {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
          </p>
          {showVolume && (
            <p className="text-gray-300">Volume: {formatLargeNumber(data.volume)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get current coin info
  const currentCoin = coinInfo[coinId] || { 
    name: coinId, 
    symbol: coinId?.toUpperCase(), 
    icon: '?', 
    color: 'text-gray-400',
    gradient: 'from-gray-500 to-gray-600'
  };

  const getTimeRangeDays = (range: string): string => {
    switch (range) {
      case '7d': return '7';
      case '30d': return '30';
      case '90d': return '90';
      case '1y': return '365';
      default: return '30';
    }
  };

  // Load demo data
  useEffect(() => {
    const days = getTimeRangeDays(timeRange);
    fetchHistoryData(coinId, days);
  }, [coinId, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-lg font-medium">Loading {currentCoin.name}</p>
            <p className="text-gray-400">Fetching historical data...</p>
          </div>
        </div>
      </div>
    );
  }

  const latestData = historyData[historyData.length - 1];

  return (
    <div className="min-h-screen bg-[#171c24] text-white">
      {/* Header */}
      <div className="bg-[#171c24] border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={`text-4xl ${currentCoin.color} font-bold bg-gradient-to-r ${currentCoin.gradient} bg-clip-text text-transparent`}>
                  {currentCoin.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{currentCoin.name}</h1>
                  <p className="text-gray-400">{currentCoin.symbol}</p>
                </div>
              </div>
              {latestData && (
                <div className="hidden lg:block">
                  <div className="text-2xl font-bold text-white">
                    ${formatNumber(latestData.close)}
                  </div>
                  <div className={`text-sm ${latestData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {latestData.changePercent >= 0 ? '+' : ''}{latestData.changePercent.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-[#1a1f2a] border border-gray-700/50 rounded-lg p-1">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center gap-1 bg-[#1a1f2a] border border-gray-700/50 rounded-lg p-1">
                {[
                  { type: 'candlestick' as const, icon: '📊', label: 'Candles' },
                  { type: 'line' as const, icon: '📈', label: 'Line' },
                  { type: 'area' as const, icon: '🏔️', label: 'Area' }
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      chartType === type
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-xs">{icon}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Price Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {latestData && (
            <>
              <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Current Price</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xl font-bold text-white">${formatNumber(latestData.close)}</p>
              </div>
              
              <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">24h Change</h3>
                  <div className={`w-2 h-2 rounded-full ${latestData.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <p className={`text-xl font-bold ${latestData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {latestData.changePercent >= 0 ? '+' : ''}{latestData.changePercent.toFixed(2)}%
                </p>
              </div>
              
              <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">24h High</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xl font-bold text-green-400">${formatNumber(latestData.high)}</p>
              </div>
              
              <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">24h Low</h3>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-xl font-bold text-red-400">${formatNumber(latestData.low)}</p>
              </div>
            </>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-2xl shadow-2xl p-6 pb-[80px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Price Chart</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVolume}
                  onChange={(e) => setShowVolume(e.target.checked)}
                  className="rounded border-gray-700 bg-[#171c24] text-orange-500 focus:ring-orange-500"
                />
                Show Volume
              </label>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Bullish</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Bearish</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="h-96">
            {chartType === 'candlestick' ? (
              <CustomCandlestick data={historyData} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => `$${formatNumber(value)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="url(#gradient)" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: '#f59e0b' }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                ) : (
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => `$${formatNumber(value)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fill="url(#areaGradient)"
                      fillOpacity={0.3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#f59e0b' }}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Volume Chart */}
        {showVolume && (
          <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-2xl shadow-2xl p-6 my-8">
            <h2 className="text-xl font-bold text-white mb-6">Volume</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(value) => formatLargeNumber(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatLargeNumber(value), 'Volume']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{ 
                      backgroundColor: '#171c24', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="#6b7280"
                    opacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Selected Candle Info */}
        {selectedCandle && (
          <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-2xl shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Selected Day Details</h2>
              <button
                onClick={() => setSelectedCandle(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white font-medium">{selectedCandle.date}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Open</p>
                <p className="text-white font-medium">${formatNumber(selectedCandle.open)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">High</p>
                <p className="text-green-400 font-medium">${formatNumber(selectedCandle.high)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Low</p>
                <p className="text-red-400 font-medium">${formatNumber(selectedCandle.low)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Close</p>
                <p className="text-white font-medium">${formatNumber(selectedCandle.close)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Volume</p>
                <p className="text-white font-medium">{formatLargeNumber(selectedCandle.volume)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Change</p>
                <p className={`font-medium ${selectedCandle.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedCandle.changePercent >= 0 ? '+' : ''}{selectedCandle.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Range</p>
                <p className="text-white font-medium">
                  ${formatNumber(selectedCandle.high - selectedCandle.low)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Data Table */}
        <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Price History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-[#0d1117] rounded-xl">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-xl">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Open</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">High</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Low</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Close</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-xl">Change</th>
                </tr>
              </thead>
              <tbody className="bg-[#1a1f2a] divide-y divide-gray-700/50">
                {historyData.slice(-15).reverse().map((data, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-800/30 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedCandle(data)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {new Date(data.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${formatNumber(data.open)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">${formatNumber(data.high)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 font-medium">${formatNumber(data.low)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">${formatNumber(data.close)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatLargeNumber(data.volume)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          data.changePercent >= 0 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                        </span>
                        <span className={`text-xs ${
                          data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {data.changePercent >= 0 ? '↗' : '↘'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Click on any row to see detailed information</p>
          </div>
        </div>

        {/* Market Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price Range ({timeRange})</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Highest</span>
                <span className="text-green-400 font-medium">
                  ${formatNumber(Math.max(...historyData.map(d => d.high)))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lowest</span>
                <span className="text-red-400 font-medium">
                  ${formatNumber(Math.min(...historyData.map(d => d.low)))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average</span>
                <span className="text-white font-medium">
                  ${formatNumber(historyData.reduce((sum, d) => sum + d.close, 0) / historyData.length)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Volume Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Volume</span>
                <span className="text-white font-medium">
                  {formatLargeNumber(historyData.reduce((sum, d) => sum + d.volume, 0) / historyData.length)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Highest Volume</span>
                <span className="text-blue-400 font-medium">
                  {formatLargeNumber(Math.max(...historyData.map(d => d.volume)))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lowest Volume</span>
                <span className="text-gray-300 font-medium">
                  {formatLargeNumber(Math.min(...historyData.map(d => d.volume)))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2a] border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
            <div className="space-y-3">
              {historyData.length > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Period Return</span>
                    <span className={`font-medium ${
                      ((historyData[historyData.length - 1].close - historyData[0].close) / historyData[0].close * 100) >= 0 
                        ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {((historyData[historyData.length - 1].close - historyData[0].close) / historyData[0].close * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volatility</span>
                    <span className="text-white font-medium">
                      {(() => {
                        const returns = historyData.slice(1).map((d, i) => 
                          (d.close - historyData[i].close) / historyData[i].close
                        );
                        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
                        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
                        return (Math.sqrt(variance) * 100).toFixed(2);
                      })()}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bull Days</span>
                    <span className="text-green-400 font-medium">
                      {historyData.filter(d => d.changePercent > 0).length}/{historyData.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoHistoryPage;
