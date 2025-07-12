"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, Shield, Zap, Brain, Bell, BarChart3, Eye, ArrowRight, Star, Users, CheckCircle, Sparkles } from 'lucide-react';

const CryptoCopilotHome = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Leverage IO Intelligence workflow with meta-llama IO integration to automatically analyze market trends and provide trading recommendations",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Technical Indicators",
      description: "Auto-calculate RSI, MACD, EMA using TAAPI.io API. RSI signals: >70 overbought, <30 oversold for optimal entry/exit points",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Anomaly Detection",
      description: "Smart alerts for unusual price movements (5-10% drops in 1 hour) using automated workflow conditions",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "CoinGecko Integration",
      description: "Real-time data collection from CoinGecko API with 1-5 minute intervals for multiple cryptocurrencies",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "1-5min", label: "Data refresh rate" },
    { value: "100+", label: "Technical indicators" },
    { value: "24/7", label: "Automated monitoring" },
    { value: "7-10", label: "Days to deploy" }
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn", 
      role: "Quantitative Analyst",
      content: "The IO workflow automation saves me 4 hours daily. RSI and MACD calculations are perfectly integrated with CoinGecko data!"
    },
    {
      name: "Trần Thu Hà",
      role: "Individual investor",
      content: "Friendly interface, timely alerts. I no longer worry about missing opportunities.",
      rating: 5
    },
    {
      name: "Lê Văn Minh",
      role: "Investment fund",
      content: "Technical indicators are very detailed and easy to understand. This is an indispensable tool for traders.",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(featureInterval);
  }, [features.length]);

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
              <span className="text-sm font-medium">The most advanced AI technology</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Crypto
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                JadenX.AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered crypto analysis agent using IO Intelligence workflow

              <span className="text-purple-400 font-semibold"> CoinGecko data </span>, 
              <span className="text-blue-400 font-semibold"> TAAPI.io indicators </span>, 
              <span className="text-green-400 font-semibold"> automated alerts </span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => scrollToSection('features')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Explore Now
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => scrollToSection('demo')}
                className="px-8 py-4 border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Watch Demo
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
              Breakthrough Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powered by IO Intelligence workflow automation, CoinGecko API, and advanced ML models including LSTM for time series prediction
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
                    <span className="text-green-400 font-semibold">RSI: 65 (Normal)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ETH/USDT</span>
                    <span className="text-red-400 font-semibold">RSI: 75 (Overbought)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Workflow Status</span>
                    <span className="text-blue-400 font-semibold">Running (5min)</span>
                </div>
              </div>

              {/* Floating Alert */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 transform rotate-3 animate-pulse">
                <Bell className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Anomaly Alert!</div>
                <div className="text-xs">BTC dropped 7% in 1hr</div>  
              </div>
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
              Why Choose JadenX.AI?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12 text-green-400" />,
                title: "IO Workflow Security",
                description: "Built on IO Intelligence platform with enterprise-grade security and encrypted API connections"
              },
              {
                icon: <Zap className="w-12 h-12 text-yellow-400" />,
                title: "LSTM Predictions",
                description: "Advanced time series forecasting using LSTM neural networks for crypto price trends"
              },
              {
                icon: <Users className="w-12 h-12 text-blue-400" />,
                title: "Template Ready",
                description: "Quick 7-10 day deployment using pre-built IO workflow templates"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300">
                <div className="mb-6">
                  <div  className="flex items-center">
                    {benefit.icon}
                    <h3 className="text-xl font-semibold ml-[10px]">{benefit.title}</h3>
                  </div>
                </div>
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
              What Do Users Say?
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
                <p className="text-gray-300 mb-6">{testimonial.content}</p>
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
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-oklch(0.47 0.12 349.25)
">
        <div className="max-w-6xl mx-auto text-center px-6 py-16">
          {/* Header with enhanced styling */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full transform -translate-y-4"></div>
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Deploy Your Crypto Agent
                </h2>
                <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
              </div>
              <p className="text-xl text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
                Get started with <span className="font-semibold text-purple-300">IO Intelligence</span> workflow templates in 
                <span className="inline-block mx-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold">
                  7-10 days
                </span>
              </p>
            </div>
          </div>

          {/* Enhanced buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-white to-purple-50 text-purple-700 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Zap className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                Get Workflow Template
              </div>
            </button>
            
            <button className="group relative px-10 py-5 border-2 border-white/40 rounded-2xl font-bold text-lg text-white overflow-hidden transform hover:scale-105 transition-all duration-300 hover:border-purple-400">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Shield className="w-5 h-5 group-hover:text-purple-300 transition-colors" />
                Contact for consultation
              </div>
            </button>
          </div>

          {/* Enhanced features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <CheckCircle className="w-8 h-8" />, 
                title: "Long term commitment",
                description: "Reliable partnership for sustained growth"
              },
              { 
                icon: <CheckCircle className="w-8 h-8" />, 
                title: "24/7 Support",
                description: "Round-the-clock assistance whenever you need"
              },
              { 
                icon: <CheckCircle className="w-8 h-8" />, 
                title: "Give alerts anytime, anywhere",
                description: "Instant notifications across all your devices"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg group-hover:shadow-green-400/25 transition-shadow duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-purple-100 mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-purple-200/80 leading-relaxed group-hover:text-purple-100 transition-colors">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional visual elements */}
            <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-200">Ready to deploy</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CryptoCopilotHome;