
import React from 'react';
import { ShieldCheckIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
          <h1 className="ml-3 text-2xl font-bold text-white">AI Phishing Detector</h1>
        </div>
      </div>
    </header>
  );
};
