
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
            <img 
              src="/lovable-uploads/13885943-967d-40da-996c-fe771a3770ed.png" 
              alt="Footballytics Logo" 
              className="w-10 h-10"
            />
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
