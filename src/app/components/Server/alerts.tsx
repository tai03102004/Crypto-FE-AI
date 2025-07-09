"use client"
import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Bell, Clock, Filter, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';
import { generateMetadata } from '@/app/helper/generateMetadata';

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
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('timestamp');
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  // Mock data với nhiều loại cảnh báo
  const mockAlerts = [
    {
      id: 1,
      type: 'PRICE_CHANGE',
      coin: 'bitcoin',
      message: 'Bitcoin thay đổi 8.5% trong thời gian ngắn',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 phút trước
      price: 107693,
      change: 8.5,
      status: 'ACTIVE'
    },
    {
      id: 2,
      type: 'RSI_OVERSOLD',
      coin: 'ethereum',
      message: 'Ethereum RSI = 28.5 - Vùng quá bán',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
      rsi: 28.5,
      status: 'ACTIVE'
    },
    {
      id: 3,
      type: 'VOLUME_SPIKE',
      coin: 'bitcoin',
      message: 'Bitcoin volume tăng 150% so với trung bình',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 phút trước
      volumeChange: 150,
      status: 'ACTIVE'
    },
    {
      id: 4,
      type: 'RSI_OVERBOUGHT',
      coin: 'ethereum',
      message: 'Ethereum RSI = 75.2 - Vùng quá mua',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 phút trước
      rsi: 75.2,
      status: 'ACTIVE'
    },
    {
      id: 5,
      type: 'PRICE_CHANGE',
      coin: 'binancecoin',
      message: 'BNB giảm 6.2% trong 1 giờ qua',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 phút trước
      price: 450.25,
      change: -6.2,
      status: 'ACTIVE'
    },
    {
      id: 6,
      type: 'MACD_SIGNAL',
      coin: 'bitcoin',
      message: 'Bitcoin MACD đảo chiều - Tín hiệu bán',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 giờ trước
      status: 'RESOLVED'
    },
    {
      id: 7,
      type: 'SUPPORT_BREAK',
      coin: 'ethereum',
      message: 'Ethereum phá vỡ mức hỗ trợ $2,400',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 75 * 60 * 1000), // 1.25 giờ trước
      supportLevel: 2400,
      status: 'ACTIVE'
    },
    {
      id: 8,
      type: 'RESISTANCE_BREAK',
      coin: 'bitcoin',
      message: 'Bitcoin vượt mức kháng cự $108,000',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 giờ trước
      resistanceLevel: 108000,
      status: 'RESOLVED'
    }
  ];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAlerts(mockAlerts);
      } catch (err) {
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
        return 'bg-red-50 border-red-200 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'LOW':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
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
      <div className={`w-8 h-8 ${colors[coin as keyof typeof colors] || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cảnh báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải cảnh báo</h2>
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
              <div className="relative">
                <Bell className="h-8 w-8 text-blue-600" />
                {activeAlertsCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeAlertsCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cảnh báo Crypto</h1>
                <p className="text-sm text-gray-500">{activeAlertsCount} cảnh báo đang hoạt động</p>
              </div>
            </div>
            <button
              onClick={refreshAlerts}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Lọc theo mức độ:</span>
              </div>
              <div className="flex space-x-2">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setFilter(severity)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === severity
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {severity === 'ALL' ? 'Tất cả' : severity}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="timestamp">Thời gian</option>
                <option value="severity">Mức độ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {sortedAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cảnh báo</h3>
              <p className="text-gray-500">Hiện tại không có cảnh báo nào cần chú ý.</p>
            </div>
          ) : (
            sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                  alert.severity === 'HIGH' ? 'border-l-red-500' :
                  alert.severity === 'MEDIUM' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getAlertColor(alert.severity)}`}>
                      <div className={getIconColor(alert.severity)}>
                        {getAlertIcon(alert.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getCoinIcon(alert.coin)}
                        <div>
                          <h3 className="font-medium text-gray-900">{alert.message}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">{getTimeAgo(alert.timestamp)}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                              alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              alert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Alert Details */}
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {alert.price && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Giá hiện tại</p>
                            <p className="font-semibold text-gray-900">
                              ${alert.price.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {alert.change && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Thay đổi</p>
                            <p className={`font-semibold ${alert.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {alert.change >= 0 ? '+' : ''}{alert.change}%
                            </p>
                          </div>
                        )}
                        {alert.rsi && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">RSI</p>
                            <p className="font-semibold text-gray-900">{alert.rsi}</p>
                          </div>
                        )}
                        {alert.volumeChange && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Volume</p>
                            <p className="font-semibold text-green-600">+{alert.volumeChange}%</p>
                          </div>
                        )}
                        {alert.supportLevel && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Mức hỗ trợ</p>
                            <p className="font-semibold text-gray-900">${alert.supportLevel.toLocaleString()}</p>
                          </div>
                        )}
                        {alert.resistanceLevel && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Mức kháng cự</p>
                            <p className="font-semibold text-gray-900">${alert.resistanceLevel.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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