
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const Analytics = () => {
  const [selectedTeam1, setSelectedTeam1] = useState('Manchester City');
  const [selectedTeam2, setSelectedTeam2] = useState('Arsenal');
  const [seasonData, setSeasonData] = useState([]);
  const [comparisonData, setComparisonData] = useState({});
  const [leagueStats, setLeagueStats] = useState([]);

  const teams = [
    'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Manchester United',
    'Newcastle United', 'Brighton', 'Tottenham', 'Aston Villa', 'West Ham'
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    // Generate mock season data
    const mockSeasonData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
      goals: Math.floor(Math.random() * 30) + 15,
      points: Math.floor(Math.random() * 15) + 5,
      wins: Math.floor(Math.random() * 8) + 2
    }));
    setSeasonData(mockSeasonData);

    // Generate comparison data
    setComparisonData({
      [selectedTeam1]: {
        goals: Math.floor(Math.random() * 50) + 40,
        assists: Math.floor(Math.random() * 30) + 20,
        cleanSheets: Math.floor(Math.random() * 15) + 5,
        possession: Math.floor(Math.random() * 20) + 50,
        passAccuracy: Math.floor(Math.random() * 15) + 80
      },
      [selectedTeam2]: {
        goals: Math.floor(Math.random() * 50) + 40,
        assists: Math.floor(Math.random() * 30) + 20,
        cleanSheets: Math.floor(Math.random() * 15) + 5,
        possession: Math.floor(Math.random() * 20) + 50,
        passAccuracy: Math.floor(Math.random() * 15) + 80
      }
    });

    // Generate league stats
    setLeagueStats([
      { name: 'Goals', value: 1247, color: '#0088FE' },
      { name: 'Assists', value: 823, color: '#00C49F' },
      { name: 'Clean Sheets', value: 156, color: '#FFBB28' },
      { name: 'Yellow Cards', value: 892, color: '#FF8042' },
      { name: 'Red Cards', value: 47, color: '#8884D8' }
    ]);
  }, [selectedTeam1, selectedTeam2]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Football Analytics</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              <Link to="/live" className="text-gray-600 hover:text-green-600 transition-colors">Live Data</Link>
              <Link to="/analytics" className="text-green-600 font-medium">Analytics</Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Match Statistics & Data</h2>
          <p className="text-gray-600">Comprehensive analytics and performance data visualization</p>
        </div>

        {/* Season Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Season Overview - Goals & Points Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={2} name="Goals" />
                  <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} name="Points" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Comparison */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Team Comparison</span>
              </CardTitle>
              <div className="flex space-x-4 mt-4">
                <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Team 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Team 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats Comparison */}
                <div>
                  <h4 className="font-semibold mb-4">Key Statistics</h4>
                  <div className="space-y-4">
                    {['goals', 'assists', 'cleanSheets', 'possession', 'passAccuracy'].map((stat) => (
                      <div key={stat} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{comparisonData[selectedTeam1]?.[stat] || 0} vs {comparisonData[selectedTeam2]?.[stat] || 0}</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (comparisonData[selectedTeam1]?.[stat] || 0) / 100 * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (comparisonData[selectedTeam2]?.[stat] || 0) / 100 * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div>
                  <h4 className="font-semibold mb-4">Performance Comparison</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { stat: 'Goals', team1: comparisonData[selectedTeam1]?.goals || 0, team2: comparisonData[selectedTeam2]?.goals || 0 },
                      { stat: 'Assists', team1: comparisonData[selectedTeam1]?.assists || 0, team2: comparisonData[selectedTeam2]?.assists || 0 },
                      { stat: 'Clean Sheets', team1: comparisonData[selectedTeam1]?.cleanSheets || 0, team2: comparisonData[selectedTeam2]?.cleanSheets || 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stat" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="team1" fill="#10b981" name={selectedTeam1} />
                      <Bar dataKey="team2" fill="#3b82f6" name={selectedTeam2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* League Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <span>League Statistics Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={leagueStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leagueStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Goals This Season</p>
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Average Goals per Match</p>
                    <p className="text-2xl font-bold text-blue-600">2.8</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Top Scorer Goals</p>
                    <p className="text-2xl font-bold text-purple-600">27</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Clean Sheets Record</p>
                    <p className="text-2xl font-bold text-orange-600">15</p>
                  </div>
                  <PieChart className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Data */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="wins" stroke="#ef4444" strokeWidth={2} name="Wins" />
                  <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={2} name="Goals" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
