import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, BarChart3, PieChart, Users, Target, Award, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RechartsPieChart, RadialBarChart, RadialBar } from 'recharts';
import FootballAPI from '../utils/footballApi';

const Analytics = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('PL');
  const [selectedSeason, setSelectedSeason] = useState<string | undefined>(undefined);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [allSeasonsData, setAllSeasonsData] = useState<any>({});
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
    loadSeasons();
  }, [selectedCompetition]);

  useEffect(() => {
    if (selectedSeason) {
      loadAnalyticsData();
    }
  }, [selectedSeason]);

  const loadSeasons = async () => {
    setLoading(true);
    try {
      const seasonsData = await api.fetchSeasons(selectedCompetition);
      setSeasons(seasonsData);
      const newSeason = seasonsData.length > 0 ? seasonsData[0] : undefined;
      setSelectedSeason(newSeason);
      if (!newSeason) {
        setAnalyticsData({});
        setAllSeasonsData({});
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading seasons:', error);
      const fallbackSeasons = ['2024-2025', '2023-2024', '2022-2023'];
      setSeasons(fallbackSeasons);
      setSelectedSeason(fallbackSeasons[0]);
    }
  };

  const loadAnalyticsData = async () => {
    if (!selectedSeason) return;
    setLoading(true);
    try {
      // Load current season data
      const data = await api.fetchAnalyticsData(selectedCompetition, selectedSeason);
      setAnalyticsData(data);
      
      // Load all seasons data for comprehensive team stats
      const allSeasons = await Promise.all(
        seasons.map(season => api.fetchAnalyticsData(selectedCompetition, season))
      );
      setAllSeasonsData({
        seasons: seasons,
        data: allSeasons
      });
      
      // Set default teams for comparison
      if (data.topTeams?.length >= 2) {
        setSelectedTeam1(data.topTeams[0]?.team?.name || '');
        setSelectedTeam2(data.topTeams[1]?.team?.name || '');
      } else {
        setSelectedTeam1('');
        setSelectedTeam2('');
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTeamsAcrossSeasons = () => {
    if (!allSeasonsData.data || !allSeasonsData.seasons) return [];
    
    const teamStats: { [key: string]: any } = {};
    
    allSeasonsData.data.forEach((seasonData: any, index: number) => {
      const season = allSeasonsData.seasons[index];
      const teams = seasonData.topTeams || [];
      
      teams.forEach((team: any) => {
        const teamName = team.team.name;
        if (!teamStats[teamName]) {
          teamStats[teamName] = {
            name: teamName,
            seasons: [],
            totalPoints: 0,
            totalGoals: 0,
            totalWins: 0,
            avgPosition: 0,
            bestPosition: Number.MAX_SAFE_INTEGER,
            seasonsPlayed: 0
          };
        }
        
        teamStats[teamName].seasons.push({
          season,
          position: team.position,
          points: team.points,
          goals: team.goalsFor,
          wins: team.won
        });
        
        teamStats[teamName].totalPoints += team.points;
        teamStats[teamName].totalGoals += team.goalsFor;
        teamStats[teamName].totalWins += team.won;
        teamStats[teamName].bestPosition = Math.min(teamStats[teamName].bestPosition, team.position);
        teamStats[teamName].seasonsPlayed += 1;
      });
    });

    // Calculate averages
    Object.values(teamStats).forEach((team: any) => {
      team.avgPosition = Math.round(team.seasons.reduce((sum: number, s: any) => sum + s.position, 0) / team.seasonsPlayed);
      team.avgPoints = Math.round(team.totalPoints / team.seasonsPlayed);
      team.avgGoals = Math.round(team.totalGoals / team.seasonsPlayed);
    });

    return Object.values(teamStats).sort((a: any, b: any) => a.avgPosition - b.avgPosition);
  };

  const getDataInsightsTrends = () => {
    if (!allSeasonsData.data || !allSeasonsData.seasons) return [];
    
    return allSeasonsData.seasons.map((season: string, index: number) => {
      const seasonData = allSeasonsData.data[index];
      const teams = seasonData.topTeams || [];
      
      // Safe calculation with proper type checking
      const totalTeams = teams.length;
      const competitiveness = totalTeams > 0 ? teams.reduce((sum: number, team: any) => {
        const points = typeof team.points === 'number' ? team.points : 0;
        return sum + points;
      }, 0) / totalTeams : 0;
      
      const topTeamPoints = teams.length > 0 && typeof teams[0]?.points === 'number' ? teams[0].points : 0;
      const lastTeamPoints = teams.length > 0 && typeof teams[teams.length - 1]?.points === 'number' ? teams[teams.length - 1].points : 0;
      const pointsGap = topTeamPoints - lastTeamPoints;
      
      return {
        season: season.replace('-', '/'),
        competitiveness: Math.round(competitiveness),
        pointsGap,
        totalTeams,
        avgGoalsPerTeam: seasonData.avgGoalsPerMatch * (totalTeams * 2) || 0
      };
    }).reverse();
  };

  const getTeamComparisonData = () => {
    const team1Data = analyticsData.topTeams?.find((t: any) => t.team.name === selectedTeam1);
    const team2Data = analyticsData.topTeams?.find((t: any) => t.team.name === selectedTeam2);

    if (!team1Data || !team2Data) return [];

    return [
      { stat: 'Points', team1: team1Data.points, team2: team2Data.points },
      { stat: 'Wins', team1: team1Data.won, team2: team2Data.won },
      { stat: 'Draws', team1: team1Data.draw, team2: team2Data.draw },
      { stat: 'Losses', team1: team1Data.lost, team2: team2Data.lost },
      { stat: 'Goals For', team1: team1Data.goalsFor, team2: team2Data.goalsFor },
      { stat: 'Goals Against', team1: team1Data.goalsAgainst, team2: team2Data.goalsAgainst },
      { stat: 'Goal Diff', team1: team1Data.goalDifference, team2: team2Data.goalDifference }
    ];
  };

  const getDefensiveStats = () => {
    const teams = analyticsData.topTeams || [];
    return teams.slice(0, 5).map((team: any) => ({
      name: team.team.name.length > 10 ? team.team.name.substring(0, 10) + '...' : team.team.name,
      cleanSheets: Math.max(0, team.playedGames - Math.ceil(team.goalsAgainst / 2)),
      goalsAgainst: team.goalsAgainst,
      defensive: Math.max(0, 100 - (team.goalsAgainst * 5))
    }));
  };

  const getWinRateData = () => {
    const teams = analyticsData.topTeams || [];
    return teams.slice(0, 8).map((team: any) => ({
      name: team.team.name.length > 8 ? team.team.name.substring(0, 8) + '...' : team.team.name,
      winRate: team.playedGames > 0 ? Math.round((team.won / team.playedGames) * 100) : 0,
      wins: team.won,
      played: team.playedGames
    }));
  };

  const getRecentMatches = () => {
    const matches = analyticsData.recentMatches || [];
    const matchdays = [...new Set(matches.map((m: any) => m.matchday))].filter(Boolean);
    
    // Show all matches without filter if only one matchday or fewer
    if (matchdays.length <= 1) {
      return matches.slice(0, 10);
    }
    
    // Otherwise show matches from the latest matchday
    const latestMatchday = Math.max(...matchdays.map(md => Number(md)).filter(md => !isNaN(md)));
    return matches.filter((m: any) => m.matchday === latestMatchday).slice(0, 10);
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

  const allTeamsData = getAllTeamsAcrossSeasons();
  const dataInsightsTrends = getDataInsightsTrends();
  const defensiveStats = getDefensiveStats();
  const winRateData = getWinRateData();
  const recentMatches = getRecentMatches();
  const comparisonData = getTeamComparisonData();
  const availableTeams = analyticsData.topTeams?.map((t: any) => t.team.name) || [];
  const hasMultipleMatchdays = [...new Set(analyticsData.recentMatches?.map((m: any) => m.matchday))].filter(Boolean).length > 1;

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Analytics & Data - {selectedSeason}</h2>
          <div className="flex flex-wrap items-center gap-4 mb-6">
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
            {seasons.length > 0 && selectedSeason && (
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-full sm:w-[200px]">
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

        {/* Data Insights Trends */}
        {dataInsightsTrends.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>League Insights - {competitions[selectedCompetition]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataInsightsTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="competitiveness" stroke="#8b5cf6" strokeWidth={2} name="Avg Points" />
                    <Line type="monotone" dataKey="pointsGap" stroke="#06b6d4" strokeWidth={2} name="Points Gap" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Statistics Across All Seasons */}
        {allTeamsData.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Team Statistics Across All Seasons</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTeamsData.slice(0, 12).map((team: any) => (
                    <Card key={team.name} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{team.name}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {team.seasonsPlayed} seasons
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Best Position</p>
                          <p className="font-bold text-green-600">#{team.bestPosition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Position</p>
                          <p className="font-bold">#{team.avgPosition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Points</p>
                          <p className="font-bold">{team.avgPoints}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Goals</p>
                          <p className="font-bold">{team.avgGoals}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Team Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Top Performers Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topTeams?.slice(0, 5).map((team: any, index: number) => (
                  <div key={team.team.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' : 
                        index === 2 ? 'bg-orange-400 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{team.team.name}</p>
                        <p className="text-xs text-gray-600">{team.points} pts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{team.goalDifference}</p>
                      <p className="text-xs text-gray-500">{team.won}W {team.draw}D {team.lost}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Defensive Excellence Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Defensive Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={defensiveStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="defensive" fill="#3b82f6" name="Defensive Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Win Rate Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Win Rates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart data={winRateData} innerRadius="10%" outerRadius="80%">
                  <RadialBar dataKey="winRate" cornerRadius={10} fill="#10b981" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Win Rate']} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {winRateData.slice(0, 4).map((team: any) => (
                  <div key={team.name} className="text-center p-2 bg-green-50 rounded">
                    <p className="font-semibold text-xs">{team.name}</p>
                    <p className="text-lg font-bold text-green-600">{team.winRate}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results - No filter if only one matchday */}
        {recentMatches.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>Recent Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentMatches.map((match: any) => (
                    <div key={match.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{match.homeTeam.name}</span>
                        <span className="text-lg font-bold">{match.score.fullTime.home}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{match.awayTeam.name}</span>
                        <span className="text-lg font-bold">{match.score.fullTime.away}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(match.utcDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
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
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>League Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.leagueStats?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.leagueStats} layout="vertical" margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: 'rgba(238, 242, 255, 0.5)'}}/>
                    <Bar dataKey="value" name="Value">
                      {analyticsData.leagueStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-10">No league statistics available.</p>
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
