import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Trophy, RefreshCw, Clock, Users, Calendar, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import TabManager from '../utils/tabManager';

const LiveData = () => {
  const [activeTab, setActiveTab] = useState('live-matches');
  const [tabData, setTabData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState('PL');
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedMatchday, setSelectedMatchday] = useState<string>('all');

  const tabManager = new TabManager(activeTab, setActiveTab, setTabData, setLoading);

  const competitions = {
    'PL': 'Premier League',
    'PD': 'La Liga',
    'SA': 'Serie A',
    'BL1': 'Bundesliga',
    'FL1': 'Ligue 1',
    'CL': 'Champions League',
    'EL': 'Europa League'
  };

  const seasons = {
    '2024': '2024/25',
    '2023': '2023/24',
    '2022': '2022/23',
    '2021': '2021/22',
    '2020': '2020/21',
    '2019': '2019/20',
    '2018': '2018/19'
  };

  useEffect(() => {
    console.log('Effect triggered - switching tab:', activeTab, 'competition:', selectedCompetition, 'season:', selectedSeason);
    tabManager.switchTab(activeTab, selectedCompetition, selectedSeason);
  }, [activeTab, selectedCompetition, selectedSeason]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      console.log('Auto-refresh enabled');
      interval = setInterval(() => {
        console.log('Auto-refreshing data...');
        tabManager.switchTab(activeTab, selectedCompetition, selectedSeason);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, activeTab, selectedCompetition, selectedSeason]);

  const getAvailableMatchdays = (): number[] => {
    const matches = tabData.matches || [];
    const matchdays = [...new Set(matches.map((match: any) => match.matchday).filter((md: any) => md !== null && md !== undefined))];
    return matchdays.sort((a: number, b: number) => b - a); // Latest first
  };

  const getFilteredMatches = () => {
    const matches = tabData.matches || [];
    if (selectedMatchday === 'all') return matches;
    return matches.filter((match: any) => match.matchday?.toString() === selectedMatchday);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      );
    }

    // Show error state if there's an error
    if (tabData.error) {
      return (
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-50 rounded-full p-4">
              <WifiOff className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Connection Issue</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {tabData.userFriendlyMessage || 'Unable to load football data at the moment.'}
            </p>
            <p className="text-sm text-gray-500">
              This is typically due to API access restrictions in browser environments.
            </p>
          </div>
          <Button 
            onClick={() => tabManager.switchTab(activeTab, selectedCompetition, selectedSeason)}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'live-matches':
        return renderMatches();
      case 'league-tables':
        return renderStandings();
      case 'team-stats':
        return renderTeams();
      case 'recent-results':
        return renderRecentResults();
      default:
        return <div>Select a tab to view data</div>;
    }
  };

  const renderMatches = () => {
    const matches = tabData.matches || [];
    console.log('Rendering matches:', matches);
    
    if (tabData.message) {
      return (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{tabData.message}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No live matches at the moment</p>
          </div>
        ) : (
          matches.map((match: any) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-right flex items-center space-x-2">
                      {match.homeTeam.crest && (
                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-6 h-6" />
                      )}
                      <p className="font-semibold">{match.homeTeam.name}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {match.score?.fullTime?.home !== null ? 
                          `${match.score.fullTime.home} - ${match.score.fullTime.away}` : 
                          'vs'
                        }
                      </div>
                      {match.matchday && (
                        <div className="text-xs text-gray-500">MD {match.matchday}</div>
                      )}
                    </div>
                    <div className="text-left flex items-center space-x-2">
                      <p className="font-semibold">{match.awayTeam.name}</p>
                      {match.awayTeam.crest && (
                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={match.status === 'IN_PLAY' ? 'destructive' : match.status === 'FINISHED' ? 'secondary' : 'default'}>
                      {match.status === 'IN_PLAY' ? 'LIVE' : match.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(match.utcDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {match.competition?.name || 'Football'}
                    </p>
                  </div>
                </div>
                {match.goalscorers && match.goalscorers.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-1">Goalscorers:</p>
                    <div className="text-sm text-gray-600">
                      {match.goalscorers.map((scorer: any, index: number) => (
                        <span key={index} className="mr-3">
                          {scorer.player} {scorer.minute}'
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  const renderStandings = () => {
    const standings = tabData.standings?.[0]?.table || [];
    console.log('Rendering standings:', standings);
    
    if (standings.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No standings data available</p>
        </div>
      );
    }

    const getPositionColor = (position: number) => {
      if (position <= 4) return 'text-green-600 bg-green-50'; // Champions League
      if (position <= 6) return 'text-blue-600 bg-blue-50'; // Europa League
      if (position >= 18) return 'text-red-600 bg-red-50'; // Relegation
      return 'text-gray-700';
    };
    
    return (
      <div className="space-y-4">
        {/* Competition and Season Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            {tabData.competition?.name || competitions[selectedCompetition]} - {seasons[selectedSeason]}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Complete league table with {standings.length} teams
          </p>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Pos</th>
                <th className="text-left p-3 font-semibold text-gray-700">Team</th>
                <th className="text-center p-3 font-semibold text-gray-700">P</th>
                <th className="text-center p-3 font-semibold text-gray-700">W</th>
                <th className="text-center p-3 font-semibold text-gray-700">D</th>
                <th className="text-center p-3 font-semibold text-gray-700">L</th>
                <th className="text-center p-3 font-semibold text-gray-700">GF</th>
                <th className="text-center p-3 font-semibold text-gray-700">GA</th>
                <th className="text-center p-3 font-semibold text-gray-700">GD</th>
                <th className="text-center p-3 font-semibold text-gray-700">Pts</th>
                <th className="text-center p-3 font-semibold text-gray-700">Form</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team: any) => (
                <tr key={team.position} className="border-b hover:bg-gray-50 transition-colors">
                  <td className={`p-3 font-bold rounded-l ${getPositionColor(team.position)}`}>
                    {team.position}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      {team.team.crest && (
                        <img 
                          src={team.team.crest} 
                          alt={team.team.name} 
                          className="w-8 h-8 object-contain" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://www.thesportsdb.com/images/media/team/badge/default.png';
                          }}
                        />
                      )}
                      <div>
                        <span className="font-semibold text-gray-900">{team.team.name}</span>
                        <div className="text-xs text-gray-500">{team.team.tla}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-3 text-gray-700">{team.playedGames}</td>
                  <td className="text-center p-3 text-green-600 font-medium">{team.won}</td>
                  <td className="text-center p-3 text-yellow-600 font-medium">{team.draw}</td>
                  <td className="text-center p-3 text-red-600 font-medium">{team.lost}</td>
                  <td className="text-center p-3 text-gray-700">{team.goalsFor}</td>
                  <td className="text-center p-3 text-gray-700">{team.goalsAgainst}</td>
                  <td className={`text-center p-3 font-medium ${team.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {team.goalDifference >= 0 ? '+' : ''}{team.goalDifference}
                  </td>
                  <td className="text-center p-3 font-bold text-gray-900">{team.points}</td>
                  <td className="text-center p-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{team.form}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Position Legend</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>1-4: Champions League</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>5-6: Europa League</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>18-20: Relegation</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTeams = () => {
    const teams = tabData.teams || [];
    console.log('Rendering teams:', teams);
    
    if (teams.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No team data available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Competition Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            {competitions[selectedCompetition]} Teams - {seasons[selectedSeason]}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {teams.length} teams in the competition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-3">
                  {team.crest && (
                    <img 
                      src={team.crest} 
                      alt={team.name} 
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://www.thesportsdb.com/images/media/team/badge/default.png';
                      }}
                    />
                  )}
                  <div>
                    <span className="text-gray-900">{team.name}</span>
                    <div className="text-sm text-gray-500 font-normal">{team.tla}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Founded:</span>
                    <span className="text-gray-900">{team.founded || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Stadium:</span>
                    <span className="text-gray-900 text-right">{team.venue}</span>
                  </div>
                  {team.location && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Location:</span>
                      <span className="text-gray-900 text-right">{team.location}</span>
                    </div>
                  )}
                  {team.website && (
                    <div className="pt-2">
                      <a 
                        href={`https://${team.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        Official Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderRecentResults = () => {
    const filteredMatches = getFilteredMatches().filter((match: any) => match.status === 'FINISHED');
    const availableMatchdays = getAvailableMatchdays();
    
    console.log('Rendering recent results:', filteredMatches);
    
    return (
      <div className="space-y-4">
        {/* Matchday Filter */}
        {availableMatchdays.length > 0 && (
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Filter by Matchday:</span>
            <Select value={selectedMatchday} onValueChange={setSelectedMatchday}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Matchdays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matchdays</SelectItem>
                {availableMatchdays.map((md: number) => (
                  <SelectItem key={md} value={md.toString()}>Matchday {md}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No recent results available</p>
          </div>
        ) : (
          filteredMatches.slice(0, 20).map((match: any) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-right flex items-center space-x-2">
                      {match.homeTeam.crest && (
                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-6 h-6" />
                      )}
                      <p className="font-semibold">{match.homeTeam.name}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {match.score.fullTime.home} - {match.score.fullTime.away}
                      </div>
                      {match.matchday && (
                        <div className="text-xs text-gray-500">MD {match.matchday}</div>
                      )}
                    </div>
                    <div className="text-left flex items-center space-x-2">
                      <p className="font-semibold">{match.awayTeam.name}</p>
                      {match.awayTeam.crest && (
                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">FINISHED</Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(match.utcDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {match.competition?.name || 'Football'}
                    </p>
                  </div>
                </div>
                {match.goalscorers && match.goalscorers.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-1">Goalscorers:</p>
                    <div className="text-sm text-gray-600">
                      {match.goalscorers.map((scorer: any, index: number) => (
                        <span key={index} className="mr-3">
                          {scorer.player} {scorer.minute}'
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

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
              <Link to="/live" className="text-green-600 font-medium">Live Data</Link>
              <Link to="/analytics" className="text-gray-600 hover:text-green-600 transition-colors">Analytics</Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Scores & Standings</h2>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(seasons).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => tabManager.switchTab(activeTab, selectedCompetition, selectedSeason)}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Now</span>
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'live-matches', label: 'Live Matches', icon: Clock },
                { id: 'league-tables', label: 'League Tables', icon: Trophy },
                { id: 'team-stats', label: 'Team Stats', icon: Users },
                { id: 'recent-results', label: 'Recent Results', icon: RefreshCw }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LiveData;
