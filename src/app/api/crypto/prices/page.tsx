'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Type definitions
interface CryptoData {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
}

interface CryptoPricesResponse {
  [key: string]: CryptoData;
}

interface CoinInfo {
  name: string;
  symbol: string;
  icon: string;
  color: string;
}

interface CoinInfoMap {
  [key: string]: CoinInfo;
}

interface PercentageFormat {
  value: string;
  color: string;
  bgColor: string;
}

const CryptoPricesPage: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoPricesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();

  // Mapping coin IDs to display information
  const coinInfo: CoinInfoMap = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      color: 'text-orange-400'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      color: 'text-blue-400'
    },
    binancecoin: {
      name: 'Binance Coin',
      symbol: 'BNB',
      icon: 'BNB',
      color: 'text-yellow-400'
    }
  };

  // Fetch crypto data from API
  const fetchCryptoData = async (): Promise<void> => {
    try {
      // setLoading(true);
      const response = await fetch('http://localhost:3000/api/crypto/prices');
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CryptoPricesResponse = await response.json();
      setCryptoData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle coin click for navigation
  const handleCoinClick = (coinId: string): void => {
    // Only navigate for coins that have history data (bitcoin, ethereum)
    if (coinId === 'bitcoin' || coinId === 'ethereum') {
      router.push(`/api/crypto/history/${coinId}`);
    }
  };

  // Check if coin has history data
  const hasHistoryData = (coinId: string): boolean => {
    return coinId === 'bitcoin' || coinId === 'ethereum';
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format large numbers (market cap, volume)
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

  // Format percentage change
  const formatPercentage = (percentage: number): PercentageFormat => {
    const isPositive = percentage >= 0;
    return {
      value: `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`,
      color: isPositive ? 'text-green-400' : 'text-red-400',
      bgColor: isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
    };
  };

  // Initial fetch and set up auto-refresh
  useEffect(() => {
    fetchCryptoData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !cryptoData) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md border border-gray-700">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Cannot connect to the crypto API server. Please make sure the backend is running on localhost:3000.
          </p>
          <button
            onClick={fetchCryptoData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171c24]">
      {/* Header */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Crypto Prices
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Real-time cryptocurrency market data</p>
            </div>
            <div className="text-right">
              <button
                onClick={fetchCryptoData}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🔄</span>
                    Refresh Data
                  </>
                )}
              </button>
              {lastUpdated && (
                <p className="text-sm text-gray-400 mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cryptoData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(cryptoData).map(([coinId, data]: [string, CryptoData]) => {
              const info: CoinInfo = coinInfo[coinId] || { name: coinId, symbol: coinId.toUpperCase(), icon: '?', color: 'text-gray-400' };
              const percentChange: PercentageFormat = formatPercentage(data.usd_24h_change);
              const isClickable = hasHistoryData(coinId);
              
              return (
                <div
                  key={coinId}
                  onClick={() => isClickable && handleCoinClick(coinId)}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 transition-all duration-300 ${
                    isClickable 
                      ? 'cursor-pointer hover:scale-105 hover:bg-gray-800/70 hover:border-blue-500/50 hover:shadow-blue-500/20' 
                      : 'cursor-default hover:bg-gray-800/60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${info.color} font-bold bg-gray-700/50 p-3 rounded-xl`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{info.name}</h3>
                        <p className="text-gray-400 text-sm font-medium">{info.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${percentChange.bgColor} ${percentChange.color} border border-current/20`}>
                        {percentChange.value}
                      </div>
                      {isClickable && (
                        <div className="text-blue-400 text-lg bg-blue-500/20 p-2 rounded-lg">
                          📊
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${formatNumber(data.usd)}
                    </div>
                    <div className="text-sm text-gray-400">
                      24h Change: <span className={`font-semibold ${percentChange.color}`}>{percentChange.value}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">Market Cap</span>
                      <span className="text-sm font-semibold text-white">
                        ${formatLargeNumber(data.usd_market_cap)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">24h Volume</span>
                      <span className="text-sm font-semibold text-white">
                        ${formatLargeNumber(data.usd_24h_vol)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar for 24h change */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-medium">24h Performance</span>
                      <span className={`text-xs font-semibold ${percentChange.color}`}>
                        {Math.abs(data.usd_24h_change).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          data.usd_24h_change >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(data.usd_24h_change) * 10, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Click hint for supported coins */}
                  {isClickable && (
                    <div className="mt-6 pt-4 border-t border-gray-700/50">
                      <div className="text-xs text-blue-400 font-medium flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg">
                        <span className="text-sm">📈</span>
                        Click to view detailed price history
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-8xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Data Available</h3>
            <p className="text-gray-400 text-lg">Unable to fetch cryptocurrency data at this time.</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Chart Analysis Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <div className="text-4xl text-orange-400 bg-orange-500/20 p-3 rounded-xl">₿</div>
              <div>
                <h3 className="font-semibold text-white text-lg">Bitcoin (BTC)</h3>
                <p className="text-sm text-gray-400">Click to view candlestick chart and price history</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="text-4xl text-blue-400 bg-blue-500/20 p-3 rounded-xl">Ξ</div>
              <div>
                <h3 className="font-semibold text-white text-lg">Ethereum (ETH)</h3>
                <p className="text-sm text-gray-400">Click to view candlestick chart and price history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPricesPage;