
class FootballAPI {
  public baseURL: string;
  public apiKey: string;
  public cache: Map<string, any>;
  public cacheExpiry: number;
  public proxyURL: string;

  constructor() {
    this.baseURL = 'https://api.football-data.org/v4';
    this.apiKey = 'a190c805c6844acab2e22d433d92e402';
    this.cache = new Map();
    this.cacheExpiry = 600000; // 10 minutes
    this.proxyURL = 'https://api.allorigins.win/raw?url=';
  }

  async fetchData(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      console.log('Returning cached data for:', endpoint);
      return cached.data;
    }

    try {
      // Use CORS proxy for the API call
      const encodedURL = encodeURIComponent(`${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.proxyURL}${encodedURL}`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      });
      
      if (!response.ok) {
        console.warn(`API Error: ${response.status} for ${endpoint}`);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched data from API:', endpoint, data);
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('API fetch error for', endpoint, ':', error);
      console.log('Falling back to mock data');
      return this.getFallbackData(endpoint);
    }
  }

  async fetchMatches(): Promise<any> {
    return await this.fetchData('/matches');
  }

  async fetchStandings(competition = 'PL'): Promise<any> {
    return await this.fetchData(`/competitions/${competition}/standings`);
  }

  async fetchTeams(competition = 'PL'): Promise<any> {
    return await this.fetchData(`/competitions/${competition}/teams`);
  }

  getFallbackData(endpoint: string): any {
    console.log('Using fallback data for:', endpoint);
    
    if (endpoint.includes('standings')) {
      return {
        standings: [{
          table: [
            { position: 1, team: { name: 'Manchester City', crest: 'https://crests.football-data.org/65.png' }, points: 28, playedGames: 12, won: 9, draw: 1, lost: 2, goalsFor: 31, goalsAgainst: 9 },
            { position: 2, team: { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' }, points: 27, playedGames: 12, won: 8, draw: 3, lost: 1, goalsFor: 28, goalsAgainst: 12 },
            { position: 3, team: { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' }, points: 25, playedGames: 12, won: 7, draw: 4, lost: 1, goalsFor: 26, goalsAgainst: 11 },
            { position: 4, team: { name: 'Chelsea', crest: 'https://crests.football-data.org/61.png' }, points: 22, playedGames: 12, won: 6, draw: 4, lost: 2, goalsFor: 23, goalsAgainst: 14 },
            { position: 5, team: { name: 'Newcastle United', crest: 'https://crests.football-data.org/67.png' }, points: 20, playedGames: 12, won: 6, draw: 2, lost: 4, goalsFor: 22, goalsAgainst: 15 }
          ]
        }]
      };
    }
    
    if (endpoint.includes('matches')) {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      return {
        matches: [
          { 
            id: 1, 
            homeTeam: { name: 'Manchester United', crest: 'https://crests.football-data.org/66.png' }, 
            awayTeam: { name: 'Chelsea', crest: 'https://crests.football-data.org/61.png' }, 
            score: { fullTime: { home: 2, away: 1 } }, 
            status: 'FINISHED', 
            utcDate: yesterday.toISOString(),
            competition: { name: 'Premier League' }
          },
          { 
            id: 2, 
            homeTeam: { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' }, 
            awayTeam: { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' }, 
            score: { fullTime: { home: null, away: null } }, 
            status: 'SCHEDULED', 
            utcDate: tomorrow.toISOString(),
            competition: { name: 'Premier League' }
          },
          { 
            id: 3, 
            homeTeam: { name: 'Manchester City', crest: 'https://crests.football-data.org/65.png' }, 
            awayTeam: { name: 'Tottenham', crest: 'https://crests.football-data.org/73.png' }, 
            score: { fullTime: { home: 1, away: 1 } }, 
            status: 'IN_PLAY', 
            utcDate: now.toISOString(),
            competition: { name: 'Premier League' }
          }
        ]
      };
    }
    
    if (endpoint.includes('teams')) {
      return {
        teams: [
          { id: 1, name: 'Manchester City', founded: 1880, venue: 'Etihad Stadium', crest: 'https://crests.football-data.org/65.png' },
          { id: 2, name: 'Arsenal', founded: 1886, venue: 'Emirates Stadium', crest: 'https://crests.football-data.org/57.png' },
          { id: 3, name: 'Liverpool', founded: 1892, venue: 'Anfield', crest: 'https://crests.football-data.org/64.png' },
          { id: 4, name: 'Chelsea', founded: 1905, venue: 'Stamford Bridge', crest: 'https://crests.football-data.org/61.png' },
          { id: 5, name: 'Manchester United', founded: 1878, venue: 'Old Trafford', crest: 'https://crests.football-data.org/66.png' },
          { id: 6, name: 'Newcastle United', founded: 1892, venue: 'St. James\' Park', crest: 'https://crests.football-data.org/67.png' }
        ]
      };
    }
    
    return { error: 'No data available', matches: [], teams: [], standings: [] };
  }
}

export default FootballAPI;
