
import { mockFootballData } from './mockFootballData';

class FootballAPI {
  public baseURL: string;
  public apiKey: string;
  public cache: Map<string, any>;
  public cacheExpiry: number;

  constructor() {
    this.baseURL = 'https://api.football-data.org/v4';
    this.apiKey = 'a190c805c6844acab2e22d433d92e402';
    this.cache = new Map();
    this.cacheExpiry = 600000; // 10 minutes
  }

  async fetchData(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      console.log('Returning cached data for:', endpoint);
      return cached.data;
    }

    console.log('Attempting to fetch from API:', `${this.baseURL}${endpoint}`);
    
    // Try different approaches to access the API
    const attempts = [
      // Try with JSONProxy
      async () => {
        const proxyUrl = `https://jsonp.afeld.me/?url=${encodeURIComponent(`${this.baseURL}${endpoint}`)}`;
        return fetch(proxyUrl, {
          headers: {
            'X-Auth-Token': this.apiKey
          }
        });
      },
      // Try with AllOrigins proxy
      async () => {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${this.baseURL}${endpoint}`)}`;
        return fetch(proxyUrl, {
          headers: {
            'X-Auth-Token': this.apiKey
          }
        });
      },
      // Try direct call (will likely fail due to CORS)
      async () => {
        return fetch(`${this.baseURL}${endpoint}`, {
          headers: {
            'X-Auth-Token': this.apiKey
          }
        });
      }
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        console.log(`Trying API access method ${i + 1}...`);
        const response = await attempts[i]();
        
        if (response.ok) {
          let data = await response.json();
          
          // Handle AllOrigins proxy response format
          if (data.contents) {
            data = JSON.parse(data.contents);
          }
          
          console.log('Successfully fetched data:', endpoint);
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        } else {
          console.log(`Method ${i + 1} failed with status:`, response.status, response.statusText);
        }
      } catch (error) {
        console.log(`Method ${i + 1} failed with error:`, error);
      }
    }

    // All attempts failed - return mock data with notification
    console.warn('All API access attempts failed, using mock data for:', endpoint);
    return this.getMockData(endpoint);
  }

  private getMockData(endpoint: string): any {
    console.log('Providing mock data for endpoint:', endpoint);
    
    if (endpoint.includes('/matches')) {
      return { 
        matches: mockFootballData.matches,
        count: mockFootballData.matches.length,
        filters: {},
        competition: { name: "Premier League", code: "PL" }
      };
    }
    
    if (endpoint.includes('/standings')) {
      return { 
        standings: mockFootballData.standings,
        competition: { name: "Premier League", code: "PL" }
      };
    }
    
    if (endpoint.includes('/teams')) {
      return { 
        teams: mockFootballData.teams,
        count: mockFootballData.teams.length,
        competition: { name: "Premier League", code: "PL" }
      };
    }
    
    return { message: 'Mock data not available for this endpoint' };
  }

  async fetchMatches(season?: string): Promise<any> {
    const seasonParam = season ? `?season=${season}` : '';
    return await this.fetchData(`/matches${seasonParam}`);
  }

  async fetchStandings(competition = 'PL', season?: string): Promise<any> {
    const seasonParam = season ? `?season=${season}` : '';
    return await this.fetchData(`/competitions/${competition}/standings${seasonParam}`);
  }

  async fetchTeams(competition = 'PL', season?: string): Promise<any> {
    const seasonParam = season ? `?season=${season}` : '';
    return await this.fetchData(`/competitions/${competition}/teams${seasonParam}`);
  }

  async fetchCompetitionMatches(competition = 'PL', season?: string): Promise<any> {
    const seasonParam = season ? `?season=${season}` : '';
    return await this.fetchData(`/competitions/${competition}/matches${seasonParam}`);
  }
}

export default FootballAPI;
