
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
      // Try with a more reliable CORS proxy
      async () => {
        const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(`${this.baseURL}${endpoint}`)}`;
        return fetch(proxyUrl, {
          headers: {
            'X-Auth-Token': this.apiKey
          }
        });
      },
      // Try with another CORS proxy
      async () => {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${this.baseURL}${endpoint}`;
        return fetch(proxyUrl, {
          headers: {
            'X-Auth-Token': this.apiKey,
            'X-Requested-With': 'XMLHttpRequest'
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
          const data = await response.json();
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

    // All attempts failed - throw error with helpful message
    console.error('All API access attempts failed for:', endpoint);
    throw new Error('Football data is currently unavailable due to API access restrictions. This is a common issue with external APIs in browser environments.');
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
