
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

  const tabManager = new TabManager(activeTab, setActiveTab, setTabData, setLoading);

  const competitions = {
    'PL': 'Premier League',
    'PD': 'La Liga',
    'SA': 'Serie A',
    'BL1': 'Bundesliga'
  };

  const seasons = {
    '2024': '2024/25',
    '2023': '2023/24',
    '2022': '2022/23',
    '2021': '2021/22',
    '2020': '2020/21'
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
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
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
            {standings.map((team: any) => (
              <tr key={team.position} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">{team.position}</td>
                <td className="p-2">
                  <div className="flex items-center space-x-2">
                    {team.team.crest && (
                      <img src={team.team.crest} alt={team.team.name} className="w-6 h-6" />
                    )}
                    <span className="font-medium">{team.team.name}</span>
                  </div>
                </td>
                <td className="text-center p-2">{team.playedGames}</td>
                <td className="text-center p-2">{team.won}</td>
                <td className="text-center p-2">{team.draw}</td>
                <td className="text-center p-2">{team.lost}</td>
                <td className="text-center p-2">{team.goalsFor}</td>
                <td className="text-center p-2">{team.goalsAgainst}</td>
                <td className="text-center p-2">{team.goalsFor - team.goalsAgainst}</td>
                <td className="text-center p-2 font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team: any) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                {team.crest && (
                  <img src={team.crest} alt={team.name} className="w-8 h-8" />
                )}
                <span>{team.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Founded:</span> {team.founded}</p>
                <p><span className="font-medium">Venue:</span> {team.venue}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRecentResults = () => {
    const matches = tabData.matches?.filter((match: any) => match.status === 'FINISHED') || [];
    console.log('Rendering recent results:', matches);
    
    return (
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No recent results available</p>
          </div>
        ) : (
          matches.slice(0, 10).map((match: any) => (
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
