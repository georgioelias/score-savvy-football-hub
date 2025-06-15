
import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from './index-components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-white rounded-full relative">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-green-600 rounded-full"></div>
                  <div className="absolute top-2 right-1 w-1 h-1 bg-green-600 rounded-full"></div>
                  <div className="absolute bottom-1 left-2 w-1 h-1 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Footballytics</h1>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              <Link to="/live" className="text-gray-600 hover:text-green-600 transition-colors">Live Data</Link>
              <Link to="/analytics" className="text-gray-600 hover:text-green-600 transition-colors">Analytics</Link>
              <Link to="/contact" className="text-green-600 font-medium">Contact</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Have questions about our platform? Want to provide feedback? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-6 w-6 bg-green-400 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-white rounded-full relative">
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
                <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
                <div className="absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-green-400 rounded-full"></div>
              </div>
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
    </div>
  );
};

export default Contact;
