
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
    
    // Try different CORS proxy approaches
    const proxies = [
      // Try with cors-anywhere (needs to be requested first)
      () => fetch(`https://cors-anywhere.herokuapp.com/${this.baseURL}${endpoint}`, {
        headers: {
          'X-Auth-Token': this.apiKey,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }),
      // Try with allorigins
      () => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`${this.baseURL}${endpoint}`)}`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      }),
      // Try with corsproxy.io
      () => fetch(`https://corsproxy.io/?${encodeURIComponent(`${this.baseURL}${endpoint}`)}`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      }),
      // Try direct call (will likely fail due to CORS)
      () => fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      })
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        console.log(`Trying proxy method ${i + 1}...`);
        const response = await proxies[i]();
        
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully fetched real data:', endpoint, data);
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        } else {
          console.log(`Proxy ${i + 1} failed with status:`, response.status, response.statusText);
        }
      } catch (error) {
        console.log(`Proxy ${i + 1} failed with error:`, error);
      }
    }

    console.error('All API attempts failed for:', endpoint);
    throw new Error(`Failed to fetch data from ${endpoint}. API may be unavailable or CORS blocked.`);
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
