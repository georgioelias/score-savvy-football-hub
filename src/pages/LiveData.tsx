
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Clock, Users, Calendar, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import TabManager from '../utils/tabManager';
import FootballAPI from '../utils/footballApi';

// Import new components
import LoadingSkeleton from './live-data-components/LoadingSkeleton';
import ApiError from './live-data-components/ApiError';
import MatchesView from './live-data-components/MatchesView';
import StandingsTable from './live-data-components/StandingsTable';
import TeamsList from './live-data-components/TeamsList';

// Import types
import { Match, Standing, Team } from '@/types/football';

const LiveData = () => {
  const [activeTab, setActiveTab] = useState('league-tables');
  const [tabData, setTabData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState('PL');
  const [selectedSeason, setSelectedSeason] = useState<string | undefined>(undefined);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedMatchday, setSelectedMatchday] = useState<string>('all');

  const tabManager = useMemo(() => new TabManager(activeTab, setActiveTab, setTabData, setLoading), []);
  const api = useMemo(() => new FootballAPI(), []);

  const competitions: Record<string, string> = {
    'PL': 'Premier League',
    'PD': 'La Liga',
    'SA': 'Serie A',
    'BL1': 'Bundesliga',
    'FL1': 'Ligue 1'
  };

  useEffect(() => {
    const loadSeasonsForLive = async () => {
      setLoading(true);
      try {
        const seasonsData = await api.fetchSeasons(selectedCompetition);
        setSeasons(seasonsData);
        if (seasonsData.length > 0) {
          setSelectedSeason(seasonsData[0]);
        } else {
          setSelectedSeason(undefined);
          setTabData({});
        }
      } catch (error) {
        console.error('Error loading seasons for live data:', error);
        const fallbackSeasons = ['2024-2025', '2023-2024', '2022-2023'];
        setSeasons(fallbackSeasons);
        setSelectedSeason(fallbackSeasons[0]);
      }
    };
    loadSeasonsForLive();
  }, [selectedCompetition, api]);

  useEffect(() => {
    console.log('Effect triggered - switching tab:', activeTab, 'competition:', selectedCompetition, 'season:', selectedSeason);
    if (selectedSeason) {
      tabManager.switchTab(activeTab, selectedCompetition, selectedSeason);
    }
  }, [activeTab, selectedCompetition, selectedSeason, tabManager]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && selectedSeason) {
      console.log('Auto-refresh enabled');
      interval = setInterval(() => {
        console.log('Auto-refreshing data...');
        tabManager.switchTab(activeTab, selectedCompetition, selectedSeason);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, activeTab, selectedCompetition, selectedSeason, tabManager]);

  const getAvailableMatchdays = (): number[] => {
    const matches = (tabData.matches || []) as Match[];
    const matchdays = [...new Set(matches
      .map((match: any) => match.matchday)
      .filter((md: any) => typeof md === 'number' && md !== null && md !== undefined)
    )] as number[];
    return matchdays.sort((a: number, b: number) => a - b);
  };

  const getFilteredMatches = (): Match[] => {
    const matches = (tabData.matches || []) as Match[];
    if (selectedMatchday === 'all') return matches;
    return matches.filter((match: any) => match.matchday?.toString() === selectedMatchday);
  };

  const renderTabContent = () => {
    if (loading && !tabData.standings) {
      return <LoadingSkeleton />;
    }

    if (tabData.error) {
      return (
        <ApiError
          message={tabData.userFriendlyMessage || 'Unable to load football data at the moment.'}
          onRetry={() => selectedSeason && tabManager.switchTab(activeTab, selectedCompetition, selectedSeason)}
        />
      );
    }
    
    if (!selectedSeason) {
        return <div className="text-center py-12 text-gray-500">Select a season to view data.</div>
    }

    const competitionName = competitions[selectedCompetition];
    const seasonName = selectedSeason;

    switch (activeTab) {
      case 'live-matches': {
        const matches: Match[] = getFilteredMatches().filter(m => m.status === "IN_PLAY" || m.status === "LIVE");
        return <MatchesView matches={matches} type="live" message={matches.length === 0 ? 'No live matches right now.' : tabData.message} />;
      }
      case 'league-tables': {
        const standings: Standing[] = tabData.standings?.[0]?.table || [];
        return <StandingsTable standings={standings} competitionName={competitionName} seasonName={seasonName} />;
      }
      case 'team-stats': {
        const teams: Team[] = tabData.teams || [];
        return <TeamsList teams={teams} competitionName={competitionName} seasonName={seasonName} />;
      }
      case 'recent-results': {
        const matches: Match[] = getFilteredMatches().filter(m => m.status === "FINISHED");
        return <MatchesView matches={matches} type="recent" />;
      }
      default:
        return <div>Select a tab to view data</div>;
    }
  };

  const availableMatchdays = useMemo(() => getAvailableMatchdays(), [tabData.matches]);
  const hasMultipleMatchdays = availableMatchdays.length > 1;
  const showMatchdayFilter = (activeTab === 'recent-results' || activeTab === 'live-matches') && hasMultipleMatchdays;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Data</h2>
          
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

            {seasons.length > 0 && selectedSeason ? (
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
            ) : <div className="w-full sm:w-[150px]"></div>}
            
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
              onClick={() => selectedSeason && tabManager.switchTab(activeTab, selectedCompetition, selectedSeason)}
              disabled={!selectedSeason || loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Now</span>
            </Button>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto pb-2">
              {[
                { id: 'league-tables', label: 'League Tables', icon: Trophy },
                { id: 'recent-results', label: 'Recent Results', icon: Calendar },
                { id: 'live-matches', label: 'Live Matches', icon: Clock },
                { id: 'team-stats', label: 'Teams Info', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {showMatchdayFilter && (
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Filter by Matchday:</span>
              <Select value={selectedMatchday} onValueChange={setSelectedMatchday}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Matchdays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Matchdays</SelectItem>
                  {availableMatchdays.map((md) => (
                    <SelectItem key={md} value={md.toString()}>Matchday {md}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LiveData;
