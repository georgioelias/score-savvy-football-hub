
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';

const Index = () => {
  const [quickStats, setQuickStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalTeams: 0,
    competitions: 4
  });

  useEffect(() => {
    // Simulate loading quick stats
    setQuickStats({
      totalMatches: 156,
      liveMatches: 8,
      totalTeams: 80,
      competitions: 4
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Football Analytics</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-green-600 font-medium">Home</Link>
              <Link to="/live" className="text-gray-600 hover:text-green-600 transition-colors">Live Data</Link>
              <Link to="/analytics" className="text-gray-600 hover:text-green-600 transition-colors">Analytics</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Football Analytics Hub
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access real-time match data, league standings, and comprehensive statistics 
            from major European football leagues. Your gateway to data-driven football insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/live">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                View Live Data
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                Explore Analytics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Current Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-gray-900">{quickStats.totalMatches}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Total Matches</p>
                <p className="text-sm text-gray-500 mt-1">This Season</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="h-8 w-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">LIVE</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{quickStats.liveMatches}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Live Matches</p>
                <p className="text-sm text-gray-500 mt-1">Right Now</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-gray-900">{quickStats.totalTeams}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Total Teams</p>
                <p className="text-sm text-gray-500 mt-1">All Leagues</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-gray-900">{quickStats.competitions}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Competitions</p>
                <p className="text-sm text-gray-500 mt-1">Major Leagues</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">What You Can Explore</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Live Scores</h4>
              <p className="text-white/90">Real-time match data from Premier League, La Liga, Serie A, and Bundesliga</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-3">League Tables</h4>
              <p className="text-white/90">Current standings with points, wins, losses, and goal differences</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Team Analytics</h4>
              <p className="text-white/90">Comprehensive team statistics and performance analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-6 w-6 text-green-400" />
            <h4 className="text-lg font-bold">Football Analytics</h4>
          </div>
          <p className="text-gray-400 mb-4">Real-time football data and analytics platform</p>
          <p className="text-sm text-gray-500">Data provided by Football-Data.org API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
