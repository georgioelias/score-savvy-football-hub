
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img 
            src="/lovable-uploads/13885943-967d-40da-996c-fe771a3770ed.png" 
            alt="Footballytics Logo" 
            className="w-8 h-8"
          />
          <h4 className="text-lg font-bold">footballytics</h4>
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
