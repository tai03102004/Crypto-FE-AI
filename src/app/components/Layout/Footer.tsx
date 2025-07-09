import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crypto Co-Pilot
          </div>
          <p className="text-gray-400 mb-6">
            Trợ lý thông minh cho trader crypto hiện đại
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <span>© 2025 Crypto Co-Pilot. All rights reserved.</span>
          </div>
        </div>
      </footer>
  );
};

export default Footer;