
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import FootballAPI from '../utils/footballApi';

const Analytics = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('PL');
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const api = new FootballAPI();

  const competitions = {
    'PL': 'Premier League',
    'PD': 'La Liga', 
    'SA': 'Serie A',
    'BL1': 'Bundesliga',
    'FL1': 'Ligue 1'
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedCompetition]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchAnalyticsData(selectedCompetition);
      setAnalyticsData(data);
      
      // Set default teams for comparison
      if (data.topTeams?.length >= 2) {
        setSelectedTeam1(data.topTeams[0]?.team?.name || '');
        setSelectedTeam2(data.topTeams[1]?.team?.name || '');
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamComparisonData = () => {
    const team1Data = analyticsData.topTeams?.find((t: any) => t.team.name === selectedTeam1);
    const team2Data = analyticsData.topTeams?.find((t: any) => t.team.name === selectedTeam2);

    if (!team1Data || !team2Data) return [];

    return [
      { stat: 'Goals For', team1: team1Data.goalsFor, team2: team2Data.goalsFor },
      { stat: 'Points', team1: team1Data.points, team2: team2Data.points },
      { stat: 'Wins', team1: team1Data.won, team2: team2Data.won },
      { stat: 'Goal Difference', team1: team1Data.goalDifference, team2: team2Data.goalDifference }
    ];
  };

  const getSeasonTrendData = () => {
    // Generate trend data based on recent matches
    const matches = analyticsData.recentMatches || [];
    const monthlyData: { [key: string]: { goals: number, matches: number } } = {};

    matches.forEach((match: any) => {
      const date = new Date(match.utcDate);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { goals: 0, matches: 0 };
      }
      
      monthlyData[month].goals += (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0);
      monthlyData[month].matches += 1;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      goals: data.goals,
      avgGoals: (data.goals / data.matches).toFixed(1)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const seasonTrendData = getSeasonTrendData();
  const comparisonData = getTeamComparisonData();
  const availableTeams = analyticsData.topTeams?.map((t: any) => t.team.name) || [];

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Analytics & Data</h2>
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select League" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(competitions).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Season Overview */}
        {seasonTrendData.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Goals Trend - {competitions[selectedCompetition]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={seasonTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={2} name="Total Goals" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Comparison */}
        {availableTeams.length >= 2 && (
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
                      {availableTeams.map((team: string) => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Team 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team: string) => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {comparisonData.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stat" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="team1" fill="#10b981" name={selectedTeam1} />
                      <Bar dataKey="team2" fill="#3b82f6" name={selectedTeam2} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* League Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <span>League Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.leagueStats?.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.leagueStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.leagueStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Goals</p>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.totalGoals || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Avg Goals per Match</p>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.avgGoalsPerMatch || 0}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Top Scoring Team</p>
                    <p className="text-xl font-bold text-purple-600">{analyticsData.topScoringTeam}</p>
                    <p className="text-sm text-purple-500">{analyticsData.topScorerGoals} goals</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
