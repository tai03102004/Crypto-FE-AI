
"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertTriangle, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AIChatWidget from '../Widget/AIChatWidget';

interface AnalysisData {
  timestamp: string;
  data: {
    coin: string;
    price: {
      usd: number;
      usd_market_cap: number;
      usd_24h_vol: number;
      usd_24h_change: number;
    };
    indicators: {
      rsi: {
        value: number;
      };
      macd: {
        valueMACD: number;
        valueMACDSignal: number;
        valueMACDHist: number;
      };
    };
  }[];
  aiAnalysis: {
    analysis: string;
    tradingSignals: any[];
  };
  alerts: {
    message: string;
    timestamp: string;
    severity: string;
  }[];
}

const CryptoAnalysisClient = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch dữ liệu từ API thực tế
        const response = await fetch('http://localhost:3000/api/analysis');
  
        if (!response.ok) {
          throw new Error('Lỗi khi fetch dữ liệu từ API');
        }
  
        const data = await response.json();
        console.log('Fetched data:', data);
  
        // Gán dữ liệu thực tế vào state
        setAnalysisData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return 'text-red-500';
    if (rsi <= 30) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return 'Quá mua';
    if (rsi <= 30) return 'Quá bán';
    return 'Trung tính';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Crypto Co-Pilot Analysis</h1>
            </div>
            <div className="text-sm text-gray-500">
              Cập nhật: {analysisData ? new Date(analysisData.timestamp).toLocaleString('vi-VN') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {analysisData?.data?.map((coin) => (
            <div key={coin.coin} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {coin.coin === 'bitcoin' ? 'BTC' : 'ETH'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{coin.coin}</h3>
                    <p className="text-sm text-gray-500">
                      {coin.coin === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(coin.price.usd)}
                  </p>
                  <div className="flex items-center space-x-1">
                    {coin.price.usd_24h_change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      coin.price.usd_24h_change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.price.usd_24h_change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Market Cap</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${formatNumber(coin.price.usd_market_cap)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">24h Volume</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${formatNumber(coin.price.usd_24h_vol)}
                  </p>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Chỉ báo kỹ thuật</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">RSI</span>
                      <span className={`text-sm font-medium ${getRSIColor(coin.indicators.rsi.value)}`}>
                        {getRSILabel(coin.indicators.rsi.value)}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {coin.indicators.rsi.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">MACD</span>
                      <span className={`text-sm font-medium ${
                        coin.indicators.macd.valueMACD > coin.indicators.macd.valueMACDSignal ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {coin.indicators.macd.valueMACD > coin.indicators.macd.valueMACDSignal ? 'Bullish' : 'Bearish'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {coin.indicators.macd.valueMACD.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span>Phân tích AI</span>
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{analysisData?.aiAnalysis.analysis || ''}</ReactMarkdown>
          </div>

        </div>

        {/* Alerts Section */}
        {analysisData && analysisData?.alerts?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Cảnh báo</span>
            </h3>
            <div className="space-y-3">
              {analysisData.alerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AIChatWidget />
    </div>
  );
};

export default CryptoAnalysisClient;