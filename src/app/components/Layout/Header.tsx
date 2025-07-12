'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Menu,
  TrendingUp
} from 'lucide-react';
import {Url} from "next/dist/shared/lib/router/router";


export default function Header() {
  const pathname = usePathname();
  interface MenuLink {
    link : Url,
    label : string,
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

  const navItems:MenuLink[] = [
    { link: '/', label: 'Dashboard', icon: BarChart3 },
    { link: '/api/analysis', label: 'Analysis', icon: TrendingUp },
    { link: '/api/alerts', label: 'Alerts', icon: AlertTriangle },
    { link: '/api/crypto/prices', label: 'Crypto Prices', icon: BarChart3 },
  ];

  return (
    <header className="bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-[10px] sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white"> 
                {" JadenX.AI "}
              </span>
            </Link>

            <nav className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.link;
                
                return (
                  <Link
                    href={item.link}
                    key={item.label}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-[21px] transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-white-600 hover:text-white-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Status and Settings */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
