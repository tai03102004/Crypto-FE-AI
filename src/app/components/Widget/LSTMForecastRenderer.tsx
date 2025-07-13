/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { JSX } from 'react';
import { TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react';

// Type definitions
interface CoinData {
  next_day: number;
  multi_step: number[];
}

interface ForecastData {
  [coinSymbol: string]: CoinData;
}

interface LSTMForecastRendererProps {
  forecastData: ForecastData | string | null | undefined;
}

const LSTMForecastRenderer: React.FC<LSTMForecastRendererProps> = ({ forecastData }) => {
  if (!forecastData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Không có dữ liệu dự báo</div>
      </div>
    );
  }

  let parsedData: ForecastData;
  try {
    parsedData = typeof forecastData === 'string' ? JSON.parse(forecastData) : forecastData;
  } catch (error) {
    return <div className="text-red-400">Lỗi định dạng dữ liệu</div>;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const calculateChange = (current: number, previous: number): number => {
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const renderCoinForecast = (coinSymbol: string, coinData: CoinData): JSX.Element => {
    const { next_day, multi_step } = coinData;
    const coinName: string = coinSymbol.toUpperCase();
    
    return (
      <div key={coinSymbol} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              coinSymbol === 'btc' ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {coinName}
            </div>
            <div>
              <h4 className="text-white font-semibold">{coinName}</h4>
              <p className="text-gray-400 text-sm">7-Day Forecast</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{formatPrice(next_day)}</div>
            <div className="text-gray-400 text-sm">Next Day</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tomorrow</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{formatPrice(next_day)}</span>
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">Baseline</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-gray-400 text-sm mb-2">Multi-Step Forecast</div>
            <div className="grid grid-cols-1 gap-2">
              {multi_step.slice(1, 8).map((price: number, index: number) => {
                const dayNumber: number = index + 2;
                const previousPrice: number = multi_step[index];
                const change: number = calculateChange(price, previousPrice);
                const isPositive: boolean = change > 0;
                
                return (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Day {dayNumber}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">{formatPrice(price)}</span>
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {isPositive ? '+' : ''}{change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(parsedData).map(([coinSymbol, coinData]: [string, CoinData]) => 
        renderCoinForecast(coinSymbol, coinData)
      )}
    </div>
  );
};

export default LSTMForecastRenderer;