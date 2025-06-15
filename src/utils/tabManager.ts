
import FootballAPI from './footballApi';

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

  async switchTab(tabId: string, competition = 'PL'): Promise<void> {
    console.log('Switching to tab:', tabId, 'Competition:', competition);
    this.setActiveTab(tabId);
    this.setLoading(true);
    
    try {
      let data;
      switch (tabId) {
        case 'live-matches':
          console.log('Fetching live matches...');
          data = await this.api.fetchMatches();
          break;
        case 'league-tables':
          console.log('Fetching league standings for:', competition);
          data = await this.api.fetchStandings(competition);
          break;
        case 'team-stats':
          console.log('Fetching team stats for:', competition);
          data = await this.api.fetchTeams(competition);
          break;
        case 'recent-results':
          console.log('Fetching recent results...');
          data = await this.api.fetchMatches();
          break;
        default:
          data = {};
      }
      console.log('Tab data loaded:', data);
      this.setTabData(data);
    } catch (error) {
      console.error('Error switching tab:', error);
      this.setTabData({ error: 'Failed to load data' });
    } finally {
      this.setLoading(false);
    }
  }
}

export default TabManager;
