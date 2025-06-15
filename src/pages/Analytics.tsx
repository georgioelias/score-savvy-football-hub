import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
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
  winRate: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
}

interface AnalyticsData {
  topScorers: Array<{ name: string; goals: number; team: string }>;
  formAnalysis: Array<{ team: string; form: string; points: number; winRate: number }>;
  goalStats: Array<{ team: string; scored: number; conceded: number; difference: number }>;
  teamStats: TeamStats[];
  defensiveStats: Array<{ team: string; cleanSheets: number; goalsAgainst: number; avgConceded: number }>;
  offensiveStats: Array<{ team: string; goalsFor: number; avgScored: number; efficiency: number }>;
  performanceRadar: Array<{ team: string; attack: number; defense: number; consistency: number }>;
  leagueOverview: {
    totalGoals: number;
    avgGoalsPerGame: number;
    topTeam: string;
    mostGoals: string;
    bestDefense: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

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

  // Fetch top scorers from API
  const fetchTopScorers = async (competition: string, season: string): Promise<Array<{ name: string; goals: number; team: string }>> => {
    try {
      console.log('Fetching top scorers for:', competition, season);
      const response = await api.fetchTopScorers(competition, season);
      console.log('Top scorers response:', response);
      
      if (response && response.scorers && response.scorers.length > 0) {
        return response.scorers.slice(0, 8).map((scorer: any) => ({
          name: scorer.player?.name || 'Unknown Player',
          goals: scorer.goals || 0,
          team: scorer.team?.name?.length > 12 ? scorer.team.name.substring(0, 12) + '...' : scorer.team?.name || 'Unknown Team'
        }));
      }
      
      throw new Error('No top scorers data available');
    } catch (error) {
      console.error('Error fetching top scorers:', error);
      // Return empty array if API fails
      return [];
    }
  };

  // Generate mock top scorers only as fallback
  const generateMockTopScorers = (teamStats: TeamStats[]): Array<{ name: string; goals: number; team: string }> => {
    const topTeams = teamStats.slice(0, 6);
    return topTeams.map((team, index) => ({
      name: `Top Scorer ${index + 1}`,
      goals: Math.max(15, Math.floor(team.goalsFor * 0.4) + Math.floor(Math.random() * 10)),
      team: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name
    }));
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
          fetchTopScorers(selectedCompetition, selectedSeason)
        ]);
        
        console.log('Standings response:', standingsResponse);
        console.log('Top scorers data:', topScorersData);
        
        if (!standingsResponse || !standingsResponse.standings || !standingsResponse.standings[0]) {
          throw new Error('No standings data available');
        }

        const standings = standingsResponse.standings[0].table;
        console.log('Processing standings:', standings);

        // Process team statistics with enhanced metrics
        const teamStats: TeamStats[] = standings.map((team: any) => {
          const winRate = team.playedGames > 0 ? (team.won / team.playedGames) * 100 : 0;
          const avgGoalsFor = team.playedGames > 0 ? team.goalsFor / team.playedGames : 0;
          const avgGoalsAgainst = team.playedGames > 0 ? team.goalsAgainst / team.playedGames : 0;
          
          return {
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
            position: team.position,
            winRate: Math.round(winRate * 10) / 10,
            avgGoalsFor: Math.round(avgGoalsFor * 100) / 100,
            avgGoalsAgainst: Math.round(avgGoalsAgainst * 100) / 100
          };
        });

        // Use API data if available, otherwise use mock data
        const topScorers = topScorersData.length > 0 ? topScorersData : generateMockTopScorers(teamStats);

        // Enhanced form analysis
        const formAnalysis = teamStats
          .slice(0, 8)
          .map(team => ({
            team: team.name.length > 15 ? team.name.substring(0, 15) + '...' : team.name,
            form: team.form,
            points: team.points,
            winRate: team.winRate
          }));

        // Enhanced goal statistics
        const goalStats = teamStats
          .slice(0, 10)
          .map(team => ({
            team: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
            scored: team.goalsFor,
            conceded: team.goalsAgainst,
            difference: team.goalDifference
          }));

        // Defensive statistics
        const defensiveStats = teamStats
          .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
          .slice(0, 8)
          .map(team => ({
            team: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
            cleanSheets: Math.max(0, team.played - Math.floor(team.goalsAgainst * 0.7)),
            goalsAgainst: team.goalsAgainst,
            avgConceded: team.avgGoalsAgainst
          }));

        // Offensive statistics
        const offensiveStats = teamStats
          .sort((a, b) => b.goalsFor - a.goalsFor)
          .slice(0, 8)
          .map(team => ({
            team: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
            goalsFor: team.goalsFor,
            avgScored: team.avgGoalsFor,
            efficiency: team.played > 0 ? Math.round((team.points / (team.played * 3)) * 100) : 0
          }));

        // Performance radar for top 6 teams
        const performanceRadar = teamStats
          .slice(0, 6)
          .map(team => ({
            team: team.name.length > 10 ? team.name.substring(0, 10) + '...' : team.name,
            attack: Math.round((team.avgGoalsFor / 3) * 100),
            defense: Math.round(((3 - team.avgGoalsAgainst) / 3) * 100),
            consistency: Math.round(team.winRate)
          }));

        // League overview statistics
        const totalGoals = teamStats.reduce((sum, team) => sum + team.goalsFor, 0);
        const totalGames = teamStats.reduce((sum, team) => sum + team.played, 0);
        const topTeam = teamStats[0];
        const mostGoalsTeam = teamStats.reduce((prev, current) => 
          prev.goalsFor > current.goalsFor ? prev : current
        );
        const bestDefenseTeam = teamStats.reduce((prev, current) => 
          prev.goalsAgainst < current.goalsAgainst ? prev : current
        );

        const leagueOverview = {
          totalGoals,
          avgGoalsPerGame: totalGames > 0 ? Math.round((totalGoals / (totalGames / 2)) * 100) / 100 : 0,
          topTeam: topTeam.name,
          mostGoals: mostGoalsTeam.name,
          bestDefense: bestDefenseTeam.name
        };

        const analytics: AnalyticsData = {
          topScorers,
          formAnalysis,
          goalStats,
          teamStats,
          defensiveStats,
          offensiveStats,
          performanceRadar,
          leagueOverview
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Football Analytics Dashboard</h2>
          
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
          <>
            {/* League Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.leagueOverview.totalGoals}</div>
                  <div className="text-sm text-gray-600">Total Goals</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.leagueOverview.avgGoalsPerGame}</div>
                  <div className="text-sm text-gray-600">Goals per Game</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.leagueOverview.topTeam}</div>
                  <div className="text-sm text-gray-600">League Leader</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{analyticsData.leagueOverview.bestDefense}</div>
                  <div className="text-sm text-gray-600">Best Defense</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Scorers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Scorers (Estimated)</CardTitle>
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

              {/* Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={analyticsData.performanceRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="team" fontSize={12} />
                      <PolarRadiusAxis angle={0} domain={[0, 100]} />
                      <Radar name="Attack" dataKey="attack" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                      <Radar name="Defense" dataKey="defense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      <Radar name="Consistency" dataKey="consistency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Offensive Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Offensive Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.offensiveStats}>
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
                      <Bar dataKey="goalsFor" fill="#22c55e" name="Total Goals" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Defensive Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Defensive Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.defensiveStats}>
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
                      <Bar dataKey="goalsAgainst" fill="#ef4444" name="Goals Conceded" />
                      <Bar dataKey="cleanSheets" fill="#3b82f6" name="Clean Sheets (Est.)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Goals Scored vs Conceded */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Goals Scored vs Conceded Analysis</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Detailed League Performance</CardTitle>
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
                        <th className="text-center p-2">Win%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.teamStats.slice(0, 15).map((team) => (
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
                          <td className="p-2 text-center">{team.winRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
