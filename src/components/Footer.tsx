import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Your go-to platform for real-time football data and statistics from Europe's top leagues.
        </p>
        <div className="flex justify-center space-x-6 mb-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link to="/live" className="text-gray-400 hover:text-white transition-colors">Live Data</Link>
          <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
        </div>
        <p className="text-sm text-white">&copy; {new Date().getFullYear()} Footballytics. All Rights Reserved.</p>
        <p className="text-xs text-white mt-2">Data provided by TheSportsDB API</p>
      </div>
    </footer>
  );
};

export default Footer;
