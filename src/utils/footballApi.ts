
class FootballAPI {
  public baseURL: string;
  public apiKey: string;
  public cache: Map<string, any>;
  public cacheExpiry: number;

  constructor() {
    this.baseURL = 'https://www.thesportsdb.com/api/v1/json';
    this.apiKey = '123'; // Free API key
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

    console.log('Fetching from TheSportsDB API:', `${this.baseURL}/${this.apiKey}${endpoint}`);
    
    try {
      const response = await fetch(`${this.baseURL}/${this.apiKey}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched data from TheSportsDB:', endpoint);
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } else {
        console.log('TheSportsDB API failed with status:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('TheSportsDB API request failed, using mock data for:', endpoint, error);
      return this.getMockData(endpoint);
    }
  }

  private getMockData(endpoint: string): any {
    console.log('Providing mock data for endpoint:', endpoint);
    
    // Mock data for teams
    if (endpoint.includes('search_all_teams') || endpoint.includes('teams')) {
      return {
        teams: [
          {
            idTeam: "133604",
            strTeam: "Arsenal",
            strShort: "ARS",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/arsenal.png",
            intFormedYear: "1886",
            strStadium: "Emirates Stadium"
          },
          {
            idTeam: "133612", 
            strTeam: "Chelsea",
            strShort: "CHE", 
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/chelsea.png",
            intFormedYear: "1905",
            strStadium: "Stamford Bridge"
          },
          {
            idTeam: "133602",
            strTeam: "Liverpool",
            strShort: "LIV",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/liverpool.png", 
            intFormedYear: "1892",
            strStadium: "Anfield"
          },
          {
            idTeam: "133613",
            strTeam: "Manchester City",
            strShort: "MCI",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/manchester_city.png",
            intFormedYear: "1880", 
            strStadium: "Etihad Stadium"
          }
        ]
      };
    }
    
    // Mock data for matches/events
    if (endpoint.includes('events') || endpoint.includes('matches')) {
      return {
        events: [
          {
            idEvent: "1",
            strEvent: "Arsenal vs Chelsea",
            strHomeTeam: "Arsenal",
            strAwayTeam: "Chelsea", 
            intHomeScore: "2",
            intAwayScore: "1",
            dateEvent: "2024-12-14",
            strTime: "17:30:00",
            strStatus: "Match Finished",
            strThumb: "https://www.thesportsdb.com/images/media/event/thumb/arsenal_vs_chelsea.jpg"
          },
          {
            idEvent: "2", 
            strEvent: "Manchester City vs Liverpool",
            strHomeTeam: "Manchester City",
            strAwayTeam: "Liverpool",
            intHomeScore: null,
            intAwayScore: null,
            dateEvent: "2024-12-15",
            strTime: "15:00:00", 
            strStatus: "Not Started",
            strThumb: "https://www.thesportsdb.com/images/media/event/thumb/man_city_vs_liverpool.jpg"
          }
        ]
      };
    }
    
    // Mock data for league table
    if (endpoint.includes('lookuptable') || endpoint.includes('table')) {
      return {
        table: [
          {
            name: "Liverpool",
            teamid: "133602",
            played: 15,
            goalsfor: 29,
            goalsagainst: 8,
            goalsdifference: 21,
            win: 11,
            draw: 3,
            loss: 1,
            total: 36
          },
          {
            name: "Arsenal", 
            teamid: "133604",
            played: 15,
            goalsfor: 26,
            goalsagainst: 12,
            goalsdifference: 14,
            win: 9,
            draw: 5,
            loss: 1,
            total: 32
          },
          {
            name: "Manchester City",
            teamid: "133613", 
            played: 15,
            goalsfor: 31,
            goalsagainst: 15,
            goalsdifference: 16,
            win: 9,
            draw: 4,
            loss: 2,
            total: 31
          }
        ]
      };
    }
    
    return { message: 'Mock data not available for this endpoint' };
  }

  async fetchMatches(season?: string): Promise<any> {
    // Fetch recent matches for Premier League
    const endpoint = '/eventspastleague.php?id=4328';
    const data = await this.fetchData(endpoint);
    
    // Transform TheSportsDB format to our expected format
    if (data.events) {
      const matches = data.events.map((event: any) => ({
        id: event.idEvent,
        homeTeam: {
          id: event.idHomeTeam,
          name: event.strHomeTeam,
          shortName: event.strHomeTeam,
          tla: event.strHomeTeam?.substring(0, 3).toUpperCase(),
          crest: event.strHomeTeamBadge || `https://www.thesportsdb.com/images/media/team/badge/default.png`
        },
        awayTeam: {
          id: event.idAwayTeam,
          name: event.strAwayTeam,
          shortName: event.strAwayTeam,
          tla: event.strAwayTeam?.substring(0, 3).toUpperCase(),
          crest: event.strAwayTeamBadge || `https://www.thesportsdb.com/images/media/team/badge/default.png`
        },
        utcDate: `${event.dateEvent}T${event.strTime || '15:00:00'}Z`,
        status: event.strStatus === 'Match Finished' ? 'FINISHED' : event.strStatus === 'Not Started' ? 'SCHEDULED' : 'IN_PLAY',
        score: {
          fullTime: {
            home: event.intHomeScore ? parseInt(event.intHomeScore) : null,
            away: event.intAwayScore ? parseInt(event.intAwayScore) : null
          }
        },
        competition: { name: "Premier League" }
      }));
      
      return { matches, count: matches.length };
    }
    
    return data;
  }

  async fetchStandings(competition = 'PL', season?: string): Promise<any> {
    // Premier League ID in TheSportsDB is 4328
    const endpoint = '/lookuptable.php?l=4328';
    const data = await this.fetchData(endpoint);
    
    // Transform TheSportsDB format to our expected format
    if (data.table) {
      const table = data.table.map((team: any, index: number) => ({
        position: index + 1,
        team: {
          id: team.teamid,
          name: team.name,
          shortName: team.name,
          tla: team.name?.substring(0, 3).toUpperCase(),
          crest: `https://www.thesportsdb.com/images/media/team/badge/default.png`
        },
        playedGames: parseInt(team.played) || 0,
        won: parseInt(team.win) || 0,
        draw: parseInt(team.draw) || 0,
        lost: parseInt(team.loss) || 0,
        points: parseInt(team.total) || 0,
        goalsFor: parseInt(team.goalsfor) || 0,
        goalsAgainst: parseInt(team.goalsagainst) || 0,
        goalDifference: parseInt(team.goalsdifference) || 0
      }));
      
      return {
        standings: [{
          stage: "REGULAR_SEASON",
          type: "TOTAL",
          table: table
        }],
        competition: { name: "Premier League", code: "PL" }
      };
    }
    
    return data;
  }

  async fetchTeams(competition = 'PL', season?: string): Promise<any> {
    // Get Premier League teams
    const endpoint = '/search_all_teams.php?l=English_Premier_League';
    const data = await this.fetchData(endpoint);
    
    // Transform TheSportsDB format to our expected format
    if (data.teams) {
      const teams = data.teams.map((team: any) => ({
        id: team.idTeam,
        name: team.strTeam,
        shortName: team.strShort || team.strTeam,
        tla: team.strShort || team.strTeam?.substring(0, 3).toUpperCase(),
        crest: team.strBadge || `https://www.thesportsdb.com/images/media/team/badge/default.png`,
        founded: parseInt(team.intFormedYear) || null,
        venue: team.strStadium || 'Unknown Stadium'
      }));
      
      return { teams, count: teams.length };
    }
    
    return data;
  }

  async fetchCompetitionMatches(competition = 'PL', season?: string): Promise<any> {
    // Same as fetchMatches for now
    return this.fetchMatches(season);
  }
}

export default FootballAPI;
