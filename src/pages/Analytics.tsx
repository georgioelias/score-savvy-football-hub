
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Header from '@/components/Header';
import FootballAPI from '../utils/footballApi';

interface TeamStats {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  position: number;
}

interface AnalyticsData {
  topScorers: Array<{ name: string; goals: number; team: string }>;
  formAnalysis: Array<{ team: string; form: string; points: number }>;
  goalStats: Array<{ team: string; scored: number; conceded: number }>;
  teamStats: TeamStats[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Analytics = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('PL');
  const [selectedSeason, setSelectedSeason] = useState<string>('2024-2025');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = new FootballAPI();

  const competitions: Record<string, string> = {
    'PL': 'Premier League',
    'PD': 'La Liga',
    'SA': 'Serie A',
    'BL1': 'Bundesliga',
    'FL1': 'Ligue 1'
  };

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const seasonsData = await api.fetchSeasons(selectedCompetition);
        setSeasons(seasonsData);
        if (seasonsData.length > 0 && !seasonsData.includes(selectedSeason)) {
          setSelectedSeason(seasonsData[0]);
        }
      } catch (error) {
        console.error('Error loading seasons:', error);
        const fallbackSeasons = ['2024-2025', '2023-2024', '2022-2023'];
        setSeasons(fallbackSeasons);
      }
    };
    loadSeasons();
  }, [selectedCompetition]);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!selectedSeason) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading analytics data for:', selectedCompetition, selectedSeason);
        
        const [standingsResponse, topScorersData] = await Promise.all([
          api.fetchStandings(selectedCompetition, selectedSeason),
          api.fetchTopScorers(selectedCompetition, selectedSeason)
        ]);
        
        console.log('Standings response:', standingsResponse);
        console.log('Top scorers data:', topScorersData);
        
        if (!standingsResponse || !standingsResponse.standings || !standingsResponse.standings[0]) {
          throw new Error('No standings data available');
        }

        const standings = standingsResponse.standings[0].table;
        console.log('Processing standings:', standings);

        // Process team statistics
        const teamStats: TeamStats[] = standings.map((team: any, index: number) => ({
          name: team.team.name,
          played: team.playedGames,
          won: team.won,
          drawn: team.draw,
          lost: team.lost,
          goalsFor: team.goalsFor,
          goalsAgainst: team.goalsAgainst,
          goalDifference: team.goalDifference,
          points: team.points,
          form: team.form || 'N/A',
          position: team.position
        }));

        // Use real top scorers data with proper mapping
        const topScorers = topScorersData.slice(0, 6).map((scorer: any) => ({
          name: scorer.player?.name || scorer.name || 'Unknown',
          goals: scorer.goals || scorer.numberOfGoals || 0,
          team: scorer.team?.name || scorer.teamName || 'Unknown Team'
        }));

        // Form analysis
        const formAnalysis = teamStats
          .slice(0, 8)
          .map(team => ({
            team: team.name.length > 15 ? team.name.substring(0, 15) + '...' : team.name,
            form: team.form,
            points: team.points
          }));

        // Goal statistics
        const goalStats = teamStats
          .slice(0, 10)
          .map(team => ({
            team: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
            scored: team.goalsFor,
            conceded: team.goalsAgainst
          }));

        const analytics: AnalyticsData = {
          topScorers,
          formAnalysis,
          goalStats,
          teamStats
        };

        console.log('Generated analytics data:', analytics);
        setAnalyticsData(analytics);
        
      } catch (error) {
        console.error('Error loading analytics:', error);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [selectedCompetition, selectedSeason]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Football Analytics</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select League" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(competitions).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {seasons.length > 0 && (
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Scorers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Scorers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topScorers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="goals" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Team Form Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Team Points Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.formAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ team, points }) => `${team}: ${points}pts`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="points"
                    >
                      {analyticsData.formAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Goals Scored vs Conceded */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Goals Scored vs Conceded</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.goalStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="team" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scored" fill="#22c55e" name="Goals Scored" />
                    <Bar dataKey="conceded" fill="#ef4444" name="Goals Conceded" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* League Table Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>League Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Pos</th>
                        <th className="text-left p-2">Team</th>
                        <th className="text-center p-2">P</th>
                        <th className="text-center p-2">W</th>
                        <th className="text-center p-2">D</th>
                        <th className="text-center p-2">L</th>
                        <th className="text-center p-2">GF</th>
                        <th className="text-center p-2">GA</th>
                        <th className="text-center p-2">GD</th>
                        <th className="text-center p-2">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.teamStats.slice(0, 10).map((team, index) => (
                        <tr key={team.name} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{team.position}</td>
                          <td className="p-2">{team.name}</td>
                          <td className="p-2 text-center">{team.played}</td>
                          <td className="p-2 text-center">{team.won}</td>
                          <td className="p-2 text-center">{team.drawn}</td>
                          <td className="p-2 text-center">{team.lost}</td>
                          <td className="p-2 text-center">{team.goalsFor}</td>
                          <td className="p-2 text-center">{team.goalsAgainst}</td>
                          <td className="p-2 text-center">{team.goalDifference}</td>
                          <td className="p-2 text-center font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
