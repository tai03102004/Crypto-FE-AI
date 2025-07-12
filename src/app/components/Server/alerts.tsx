"use client"
import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Bell, Clock, Filter, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

const CryptoAlertsClient = () => {
  interface Alert {
    id: number;
    type: string;
    coin: string;
    message: string;
    severity: string;
    timestamp: Date;
    price?: number;
    change?: number;
    rsi?: number;
    volumeChange?: number;
    supportLevel?: number;
    resistanceLevel?: number;
    status: string;
  }

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('timestamp');
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:3000/api/alerts');
  
        if (!response.ok) {
          throw new Error('Lỗi khi fetch dữ liệu từ API');
        }
  
        const data = await response.json();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        throw new Error('Lỗi khi fetch dữ liệu từ API');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'PRICE_CHANGE':
        return <TrendingUp className="h-5 w-5" />;
      case 'RSI_OVERSOLD':
      case 'RSI_OVERBOUGHT':
        return <AlertTriangle className="h-5 w-5" />;
      case 'VOLUME_SPIKE':
        return <TrendingUp className="h-5 w-5" />;
      case 'MACD_SIGNAL':
        return <AlertCircle className="h-5 w-5" />;
      case 'SUPPORT_BREAK':
        return <TrendingDown className="h-5 w-5" />;
      case 'RESISTANCE_BREAK':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500/20 border-red-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'LOW':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'LOW':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCoinIcon = (coin: string) => {
    const colors = {
      bitcoin: 'bg-orange-500',
      ethereum: 'bg-blue-500',
      binancecoin: 'bg-yellow-500'
    };
    const symbols = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      binancecoin: 'BNB'
    };
    return (
      <div className={`w-10 h-10 ${colors[coin as keyof typeof colors] || 'bg-gray-500'} rounded-xl flex items-center justify-center shadow-lg`}>
        <span className="text-white text-xs font-bold">{symbols[coin as keyof typeof colors] || coin.slice(0, 3).toUpperCase()}</span>
      </div>
    );
  };

  const getTimeAgo = (timestamp: string | number | Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  const dismissAlert = (alertId: number) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.includes(alert.id)) return false;
    if (filter === 'ALL') return true;
    return alert.severity === filter;
  });

  const sortedAlerts = filteredAlerts.sort((a, b) => {
    if (sortBy === 'timestamp') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'severity') {
      const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
    }
    return 0;
  });

  const activeAlertsCount = alerts.filter(alert => 
    alert.status === 'ACTIVE' && !dismissedAlerts.includes(alert.id)
  ).length;

  const refreshAlerts = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">Đang tải cảnh báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171c24] flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md border border-gray-700">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Lỗi tải cảnh báo</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171c24]">
      {/* Header */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Bell className="h-8 w-8 text-blue-400" />
                </div>
                {activeAlertsCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {activeAlertsCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Crypto Alerts
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">{sortedAlerts.length} cảnh báo đang hoạt động</p>
              </div>
            </div>
            <button
              onClick={refreshAlerts}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium hover:scale-105"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Lọc theo mức độ:</span>
              </div>
              <div className="flex space-x-2">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setFilter(severity)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === severity
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {severity === 'ALL' ? 'Tất cả' : severity}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="timestamp">Thời gian</option>
                <option value="severity">Mức độ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          {sortedAlerts.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Không có cảnh báo</h3>
              <p className="text-gray-400 text-lg">Hiện tại không có cảnh báo nào cần theo dõi.</p>
            </div>
          ) : (
            sortedAlerts.map((alert,index) => (
              <div key= {index}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 border-l-4 p-6 transition-all duration-300 hover:bg-gray-800/70 ${
                  alert.severity === 'HIGH' ? 'border-l-red-500' :
                  alert.severity === 'MEDIUM' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${getAlertColor(alert.severity)}`}>
                      <div className={getIconColor(alert.severity)}>
                        {getAlertIcon(alert.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        {getCoinIcon(alert.coin)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">{alert.message}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-400 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {getTimeAgo(alert.timestamp)}
                            </span>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              alert.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Alert Details */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {alert.price && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">Giá hiện tại</p>
                            <p className="font-bold text-white text-lg">
                              ${alert.price.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {alert.change && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">Thay đổi</p>
                            <p className={`font-bold text-lg ${alert.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {alert.change >= 0 ? '+' : ''}{alert.change}%
                            </p>
                          </div>
                        )}
                        {alert.rsi && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">RSI</p>
                            <p className="font-bold text-white text-lg">{alert.rsi}</p>
                          </div>
                        )}
                        {alert.volumeChange && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">Volume</p>
                            <p className="font-bold text-green-400 text-lg">+{alert.volumeChange}%</p>
                          </div>
                        )}
                        {alert.supportLevel && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">Mức hỗ trợ</p>
                            <p className="font-bold text-white text-lg">${alert.supportLevel.toLocaleString()}</p>
                          </div>
                        )}
                        {alert.resistanceLevel && (
                          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                            <p className="text-sm text-gray-400 mb-1">Mức kháng cự</p>
                            <p className="font-bold text-white text-lg">${alert.resistanceLevel.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ml-4"
                    title="Đóng cảnh báo"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoAlertsClient;