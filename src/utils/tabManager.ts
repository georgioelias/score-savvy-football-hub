
import FootballAPI from './footballApi';
import { toast } from '@/hooks/use-toast';

class TabManager {
  public activeTab: string;
  public setActiveTab: (tab: string) => void;
  public setTabData: (data: any) => void;
  public setLoading: (loading: boolean) => void;
  public api: FootballAPI;

  constructor(activeTab: string, setActiveTab: (tab: string) => void, setTabData: (data: any) => void, setLoading: (loading: boolean) => void) {
    this.activeTab = activeTab;
    this.setActiveTab = setActiveTab;
    this.setTabData = setTabData;
    this.setLoading = setLoading;
    this.api = new FootballAPI();
  }

  async switchTab(tabId: string, competition = 'PL', season?: string): Promise<void> {
    console.log('Switching to tab:', tabId, 'Competition:', competition, 'Season:', season);
    this.setActiveTab(tabId);
    this.setLoading(true);
    
    try {
      let data;
      switch (tabId) {
        case 'live-matches':
          console.log('Fetching live matches...');
          data = await this.api.fetchMatches(season);
          // Filter for live matches only
          if (data.matches) {
            const liveMatches = data.matches.filter((match: any) => 
              match.status === 'IN_PLAY' || match.status === 'LIVE'
            );
            if (liveMatches.length === 0) {
              data = { matches: data.matches || [], message: 'No live matches at the moment - showing recent matches' };
            } else {
              data = { ...data, matches: liveMatches };
            }
          } else {
            data = { matches: [], message: 'No live matches at the moment' };
          }
          break;
        case 'league-tables':
          console.log('Fetching league standings for:', competition, 'season:', season);
          data = await this.api.fetchStandings(competition, season);
          break;
        case 'team-stats':
          console.log('Fetching team stats for:', competition, 'season:', season);
          data = await this.api.fetchTeams(competition, season);
          break;
        case 'recent-results':
          console.log('Fetching recent results for competition:', competition, 'season:', season);
          data = await this.api.fetchCompetitionMatches(competition, season);
          // Filter for finished matches only
          if (data.matches) {
            const finishedMatches = data.matches.filter((match: any) => match.status === 'FINISHED');
            data = { ...data, matches: finishedMatches };
          }
          break;
        default:
          data = {};
      }
      
      console.log('Tab data loaded successfully');
      this.setTabData(data);
      
      // Show success notification
      toast({
        title: "Data Loaded Successfully",
        description: `${this.getTabDisplayName(tabId)} loaded from TheSportsDB API.`,
      });
      
    } catch (error) {
      console.error('Error switching tab:', error);
      
      // Show error toast
      toast({
        title: "Unable to load sports data", 
        description: "There was an issue loading data from the sports API. Please try again.",
        variant: "destructive",
      });
      
      this.setTabData({ 
        error: true,
        errorMessage: 'Failed to load data from TheSportsDB API',
        userFriendlyMessage: 'Unable to connect to sports data service. This may be due to API access restrictions or network issues.',
        matches: [],
        teams: [],
        standings: []
      });
    } finally {
      this.setLoading(false);
    }
  }

  private getTabDisplayName(tabId: string): string {
    switch (tabId) {
      case 'live-matches': return 'Live matches';
      case 'league-tables': return 'League standings';
      case 'team-stats': return 'Team statistics';
      case 'recent-results': return 'Recent results';
      default: return 'Data';
    }
  }
}

export default TabManager;
