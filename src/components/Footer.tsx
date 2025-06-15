
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-6 w-6 bg-green-400 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="h-4 w-4 bg-white rounded-full relative">
              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
              <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-green-400"></div>
          </div>
          <h4 className="text-lg font-bold">Footballytics</h4>
        </div>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Your go-to platform for real-time football data and statistics from Europe's top leagues.
        </p>
        <div className="flex justify-center space-x-6 mb-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link to="/live" className="text-gray-400 hover:text-white transition-colors">Live Data</Link>
          <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
        </div>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Footballytics. All Rights Reserved.</p>
        <p className="text-xs text-gray-600 mt-2">Data provided by TheSportsDB API</p>
      </div>
    </footer>
  );
};

export default Footer;
