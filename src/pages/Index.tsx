
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, BarChart3, RadioTower, MousePointerSquare, Database, BrainCircuit } from 'lucide-react';
import FeatureCard from './index-components/FeatureCard';
import HowItWorksStep from './index-components/HowItWorksStep';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Football Analytics</h1>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-green-600 font-medium">Home</Link>
              <Link to="/live" className="text-gray-600 hover:text-green-600 transition-colors">Live Data</Link>
              <Link to="/analytics" className="text-gray-600 hover:text-green-600 transition-colors">Analytics</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-white overflow-hidden">
           <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
           <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              The Ultimate Football Data & Analytics Platform
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Dive deep into real-time stats, comprehensive match data, and league standings from the world's top competitions. Your winning strategy starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/live">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5">
                  <RadioTower className="mr-2 h-5 w-5" />
                  View Live Data
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" size="lg" className="border-gray-300 bg-white hover:bg-gray-100 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5">
                  Explore Analytics
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-green-600 font-semibold tracking-wider">FEATURES</span>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Unlock the Power of Football Data</h3>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Everything you need to stay ahead of the game, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<RadioTower className="h-10 w-10 text-green-600" />}
                title="Live Scores & Results"
                description="Get real-time updates from ongoing matches and browse recent results across major European leagues."
              />
              <FeatureCard
                icon={<Trophy className="h-10 w-10 text-green-600" />}
                title="In-Depth Standings"
                description="Track your favorite team's progress with detailed league tables, including form, goal difference, and more."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-green-600" />}
                title="Team Statistics"
                description="Analyze team performance with comprehensive statistics for wins, losses, goals, and overall form."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-green-600 font-semibold tracking-wider">HOW IT WORKS</span>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Get Insights in 3 Simple Steps</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <HowItWorksStep
                icon={<MousePointerSquare className="h-8 w-8 text-green-600" />}
                step="Step 1"
                title="Select Competition"
                description="Choose from a list of major football leagues and seasons to begin your analysis."
              />
              <HowItWorksStep
                icon={<Database className="h-8 w-8 text-green-600" />}
                step="Step 2"
                title="Explore Data"
                description="Navigate through live data, recent results, team stats, and league tables effortlessly."
              />
              <HowItWorksStep
                icon={<BrainCircuit className="h-8 w-8 text-green-600" />}
                step="Step 3"
                title="Gain Insights"
                description="Use the data to understand team performance, predict outcomes, and enjoy the game more."
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-green-600">
          <div className="container mx-auto px-4 py-20 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white">Ready to Dive In?</h3>
            <p className="text-lg text-green-100 mt-4 mb-8 max-w-2xl mx-auto">
              Start exploring real-time football data now. No sign-up required.
            </p>
            <Link to="/live">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-transform">
                Explore Live Data
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-6 w-6 text-green-400" />
            <h4 className="text-lg font-bold">Football Analytics</h4>
          </div>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Your go-to platform for real-time football data and statistics from Europe's top leagues.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/live" className="text-gray-400 hover:text-white transition-colors">Live Data</Link>
              <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
          </div>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Football Analytics. All Rights Reserved.</p>
          <p className="text-xs text-gray-600 mt-2">Data provided by Football-Data.org API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
