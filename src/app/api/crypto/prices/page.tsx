'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {  useRouter } from 'next/navigation';
import { generateMetadata } from '@/app/helper/generateMetadata';

// export const metadata = generateMetadata(
//   "JadenX.AI - Crypto Prices",
//   "Real-time cryptocurrency prices and market data"
// );

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
      color: 'text-orange-500'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      color: 'text-blue-500'
    },
    binancecoin: {
      name: 'Binance Coin',
      symbol: 'BNB',
      icon: 'BNB',
      color: 'text-yellow-500'
    }
  };

  // Fetch crypto data from API
  const fetchCryptoData = async (): Promise<void> => {
    try {
      setLoading(true);
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
      color: isPositive ? 'text-green-500' : 'text-red-500',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Cannot connect to the crypto API server. Please make sure the backend is running on localhost:3000.
          </p>
          <button
            onClick={fetchCryptoData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crypto Co-Pilot</h1>
              <p className="text-gray-600 mt-1">Real-time cryptocurrency prices</p>
            </div>
            <div className="text-right">
              <button
                onClick={fetchCryptoData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    🔄 Refresh
                  </>
                )}
              </button>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(cryptoData).map(([coinId, data]: [string, CryptoData]) => {
              const info: CoinInfo = coinInfo[coinId] || { name: coinId, symbol: coinId.toUpperCase(), icon: '?', color: 'text-gray-500' };
              const percentChange: PercentageFormat = formatPercentage(data.usd_24h_change);
              const isClickable = hasHistoryData(coinId);
              
              return (
                <div
                  key={coinId}
                  onClick={() => isClickable && handleCoinClick(coinId)}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${
                    isClickable 
                      ? 'cursor-pointer hover:scale-105 hover:border-blue-200' 
                      : 'cursor-default'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${info.color} font-bold`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{info.name}</h3>
                        <p className="text-sm text-gray-500">{info.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${percentChange.bgColor} ${percentChange.color}`}>
                        {percentChange.value}
                      </div>
                      {isClickable && (
                        <div className="text-blue-500 text-sm">
                          📊
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${formatNumber(data.usd)}
                    </div>
                    <div className="text-sm text-gray-500">
                      24h Change: <span className={percentChange.color}>{percentChange.value}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Cap</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatLargeNumber(data.usd_market_cap)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">24h Volume</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatLargeNumber(data.usd_24h_vol)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar for 24h change */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">24h Performance</span>
                      <span className={`text-xs font-medium ${percentChange.color}`}>
                        {Math.abs(data.usd_24h_change).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
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
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <span>📈</span>
                        Click to view price history
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Unable to fetch cryptocurrency data at this time.</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Chart Analysis Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl text-orange-500">₿</div>
              <div>
                <h3 className="font-semibold text-gray-900">Bitcoin (BTC)</h3>
                <p className="text-sm text-gray-600">Click to view candlestick chart and price history</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl text-blue-500">Ξ</div>
              <div>
                <h3 className="font-semibold text-gray-900">Ethereum (ETH)</h3>
                <p className="text-sm text-gray-600">Click to view candlestick chart and price history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPricesPage;