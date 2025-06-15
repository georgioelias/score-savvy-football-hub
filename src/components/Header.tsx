
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="h-6 w-6 bg-white rounded-full relative">
                <div className="absolute top-1 left-1 w-1 h-1 bg-green-600 rounded-full"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-green-600 rounded-full"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-green-600 rounded-full"></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-green-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Footballytics</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-green-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/live" 
              className={`transition-colors ${isActive('/live') ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-green-600'}`}
            >
              Live Data
            </Link>
            <Link 
              to="/analytics" 
              className={`transition-colors ${isActive('/analytics') ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-green-600'}`}
            >
              Analytics
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-green-600'}`}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
