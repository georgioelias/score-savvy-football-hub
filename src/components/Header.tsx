
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              {/* Hexagon shape with green background */}
              <div className="w-10 h-10 bg-green-500 transform rotate-45" style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}>
                {/* Football icon inside */}
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <div className="w-5 h-5 bg-white rounded-full relative">
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-green-500 rounded-full"></div>
                    <div className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-1 left-1.5 w-0.5 h-0.5 bg-green-500 rounded-full"></div>
                    {/* Curved lines to simulate football pattern */}
                    <div className="absolute top-0 left-0 w-full h-1/2 border-b border-green-500"></div>
                    <div className="absolute top-1/2 left-0 w-full h-1/2 border-t border-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">footballytics</h1>
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
