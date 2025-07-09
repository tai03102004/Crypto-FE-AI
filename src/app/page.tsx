"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, Shield, Zap, Brain, Bell, BarChart3, Eye, ArrowRight, Star, Users, Award, CheckCircle } from 'lucide-react';

const CryptoCopilotHome = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Phân Tích AI Thông Minh",
      description: "Sử dụng OpenAI GPT để phân tích xu hướng thị trường crypto và đưa ra khuyến nghị giao dịch chính xác",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Chỉ Báo Kỹ Thuật",
      description: "Theo dõi RSI, MACD và các chỉ báo chuyên nghiệp để nắm bắt thời điểm giao dịch tối ưu",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Cảnh Báo Thời Gian Thực",
      description: "Nhận thông báo tức thì khi giá biến động mạnh hoặc xuất hiện cơ hội đầu tư",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Theo Dõi Đa Coin",
      description: "Giám sát Bitcoin, Ethereum, BNB và nhiều coin khác cùng lúc với dữ liệu cập nhật liên tục",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "10M+", label: "Giao dịch được phân tích" },
    { value: "95%", label: "Độ chính xác dự đoán" },
    { value: "24/7", label: "Theo dõi không ngừng" },
    { value: "5s", label: "Cập nhật real-time" }
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Trader chuyên nghiệp",
      content: "Crypto Co-Pilot đã giúp tôi tăng lợi nhuận 300% trong 6 tháng qua. Phân tích AI cực kỳ chính xác!",
      rating: 5
    },
    {
      name: "Trần Thu Hà",
      role: "Nhà đầu tư cá nhân",
      content: "Giao diện thân thiện, cảnh báo kịp thời. Tôi không còn lo lắng về việc bỏ lỡ cơ hội nữa.",
      rating: 5
    },
    {
      name: "Lê Văn Minh",
      role: "Quỹ đầu tư",
      content: "Chỉ báo kỹ thuật rất chi tiết và dễ hiểu. Đây là công cụ không thể thiếu cho trader.",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(featureInterval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Công nghệ AI tiên tiến nhất</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Crypto
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Co-Pilot
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trợ lý thông minh powered by AI cho trader crypto. 
              <span className="text-purple-400 font-semibold"> Phân tích chuyên sâu</span>, 
              <span className="text-blue-400 font-semibold"> cảnh báo kịp thời</span>, 
              <span className="text-green-400 font-semibold"> quyết định chính xác</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => scrollToSection('features')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Khám Phá Ngay
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => scrollToSection('demo')}
                className="px-8 py-4 border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Xem Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center transform transition-all duration-500 ${
                    currentStat === index ? 'scale-110 text-purple-400' : 'scale-100 text-gray-400'
                  }`}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-purple-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tính Năng Đột Phá
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kết hợp sức mạnh của AI, phân tích kỹ thuật và big data để mang đến trải nghiệm trading hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature Display */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeFeature === index 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 transform scale-105' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} ${activeFeature === index ? 'animate-pulse' : ''}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Demo */}
            <div className="relative">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Dashboard Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-48 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg mb-6 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-purple-400 animate-pulse" />
                </div>

                {/* Mock Data */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">BTC/USDT</span>
                    <span className="text-green-400 font-semibold">+3.45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ETH/USDT</span>
                    <span className="text-red-400 font-semibold">-1.23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">BNB/USDT</span>
                    <span className="text-green-400 font-semibold">+2.15%</span>
                  </div>
                </div>
              </div>

              {/* Floating Alert */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 transform rotate-3 animate-pulse">
                <Bell className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Alert!</div>
                <div className="text-xs">BTC breakout detected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tại Sao Chọn Crypto Co-Pilot?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12 text-green-400" />,
                title: "An Toàn & Bảo Mật",
                description: "Dữ liệu được mã hóa end-to-end, không lưu trữ thông tin nhạy cảm"
              },
              {
                icon: <Zap className="w-12 h-12 text-yellow-400" />,
                title: "Tốc Độ Vượt Trội",
                description: "Cập nhật dữ liệu mỗi 5 giây, phản hồi trong thời gian thực"
              },
              {
                icon: <Users className="w-12 h-12 text-blue-400" />,
                title: "Cộng Đồng Mạnh",
                description: "Hơn 50,000 trader tin tưởng và sử dụng hàng ngày"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300">
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Người Dùng Nói Gì?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bắt Đầu Hành Trình Crypto Của Bạn
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Tham gia cùng hàng ngàn trader thông minh đang sử dụng Crypto Co-Pilot
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              Dùng Thử Miễn Phí
            </button>
            <button className="px-8 py-4 border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Liên Hệ Tư Vấn
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <CheckCircle className="w-6 h-6" />, text: "Không cam kết dài hạn" },
              { icon: <CheckCircle className="w-6 h-6" />, text: "Hỗ trợ 24/7" },
              { icon: <CheckCircle className="w-6 h-6" />, text: "Hoàn tiền 100%" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-3">
                <div className="text-green-300">{item.icon}</div>
                <span className="text-purple-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CryptoCopilotHome;