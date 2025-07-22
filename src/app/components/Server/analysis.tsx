"use client"
import React, { useState, useEffect, JSX } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertTriangle, Activity } from 'lucide-react';
import LSTMForecastRenderer from '../Widget/LSTMForecastRenderer';

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
    tradingSignals: [];
    lstmForecast: {
      [coin: string]: {
        next_day: number;
        multi_step: number[];
      };
    };
  };
  alerts: {
    message: string;
    timestamp: string;
    severity: string;
  }[];
}


// Component để render AI analysis mà không cần ReactMarkdown
interface AIAnalysisRendererProps {
  analysis: string;
}

const AIAnalysisRenderer: React.FC<AIAnalysisRendererProps> = ({ analysis }) => {
  if (!analysis) return <p className="text-gray-400">No Analysis...</p>;

  // Parse markdown-like content thành HTML
  const parseAnalysis = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        // Header 2
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="list-disc ml-6 mb-4 space-y-1">{listItems}</ul>);
          listItems = [];
        }
        elements.push(
          <h2 key={index} className="text-lg font-semibold text-blue-300 mb-2 mt-4 flex items-center gap-2 border-b border-gray-600 pb-1">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        // Header 3
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="list-disc ml-6 mb-4 space-y-1">{listItems}</ul>);
          listItems = [];
        }
        elements.push(
          <h3 key={index} className="text-md font-medium text-green-300 mb-2 mt-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('• ')) {
        // Bullet point
        const content = trimmed.replace('• ', '');
        const formattedContent = content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-yellow-300">$1</strong>');
        listItems.push(
          <li key={index} className="text-gray-300" dangerouslySetInnerHTML={{ __html: formattedContent }} />
        );
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // Bold text
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="list-disc ml-6 mb-4 space-y-1">{listItems}</ul>);
          listItems = [];
        }
        elements.push(
          <p key={index} className="text-gray-300 mb-2">
            <strong className="text-yellow-300">{trimmed.replace(/\*\*/g, '')}</strong>
          </p>
        );
      } else if (trimmed.length > 0) {
        // Normal paragraph
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="list-disc ml-6 mb-4 space-y-1">{listItems}</ul>);
          listItems = [];
        }
        const formattedContent = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-yellow-300">$1</strong>');
        elements.push(
          <p key={index} className="text-gray-300 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedContent }} />
        );
      }
    });

    // Add remaining list items
    if (listItems.length > 0) {
      elements.push(<ul key="final-ul" className="list-disc ml-6 mb-4 space-y-1">{listItems}</ul>);
    }

    return elements;
  };

  return <div className="space-y-2">{parseAnalysis(analysis)}</div>;
};
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
    if (rsi >= 70) return 'text-red-400';
    if (rsi <= 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return 'Quá mua';
    if (rsi <= 30) return 'Quá bán';
    return 'Trung tính';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading data analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171c24]">
      {/* Header */}
      <div className="bg-[#171c24] shadow-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">JadenX.AI Analysis</h1>
            </div>
            <div className="text-sm text-gray-400">
              Update: {analysisData ? new Date(analysisData.timestamp).toLocaleString('vi-VN') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {analysisData?.data?.map((coin) => (
            <div key={coin.coin} className="bg-[#171c24] rounded-lg shadow-sm border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {coin.coin === 'bitcoin' ? 'BTC' : 'ETH'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white capitalize">{coin.coin}</h3>
                    <p className="text-sm text-gray-400">
                      {coin.coin === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(coin.price.usd)}
                  </p>
                  <div className="flex items-center space-x-1">
                    {coin.price.usd_24h_change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      coin.price.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.price.usd_24h_change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Market Cap</span>
                  </div>
                  <p className="font-semibold text-white">
                    ${formatNumber(coin.price.usd_market_cap)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">24h Volume</span>
                  </div>
                  <p className="font-semibold text-white">
                    ${formatNumber(coin.price.usd_24h_vol)}
                  </p>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="border-t border-gray-700/50 pt-4">
                <h4 className="font-medium text-white mb-3">Chỉ báo kỹ thuật</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">RSI</span>
                      <span className={`text-sm font-medium ${getRSIColor(coin.indicators.rsi.value)}`}>
                        {getRSILabel(coin.indicators.rsi.value)}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {coin.indicators.rsi.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">MACD</span>
                      <span className={`text-sm font-medium ${
                        coin.indicators.macd.valueMACD > coin.indicators.macd.valueMACDSignal ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin.indicators.macd.valueMACD > coin.indicators.macd.valueMACDSignal ? 'Bullish' : 'Bearish'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {coin.indicators.macd.valueMACD.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <div className="space-y-6">
          <div className="bg-[#171c24] rounded-xl shadow-lg border border-gray-700/30 p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span>AI Analysis</span>
            </h3>
            <div className="text-gray-300 leading-relaxed">
              <AIAnalysisRenderer analysis={analysisData?.aiAnalysis.analysis || ''} />
            </div>
          </div>

          <div className="bg-[#171c24] rounded-xl shadow-lg border border-gray-700/30 p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">🔮</span>
              </div>
              <span>AI Predictions for the Coming Days</span>
            </h3>
            <div className="text-gray-300 leading-relaxed">
              <LSTMForecastRenderer forecastData={analysisData?.aiAnalysis.lstmForecast} />
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {analysisData && analysisData?.alerts?.length > 0 && (
          <div className="mt-8 bg-[#171c24] rounded-lg shadow-sm border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span>Cảnh báo</span>
            </h3>
            <div className="space-y-3">
              {analysisData.alerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{alert.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
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
    </div>
  );
};

export default CryptoAnalysisClient;