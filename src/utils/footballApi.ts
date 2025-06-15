
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

  // League mappings for different competitions
  private getLeagueId(competition: string): string {
    const leagueMap: { [key: string]: string } = {
      'PL': '4328', // Premier League
      'PD': '4335', // La Liga
      'SA': '4332', // Serie A
      'BL1': '4331', // Bundesliga
      'FL1': '4334', // Ligue 1
      'CL': '4480', // Champions League
      'EL': '4481', // Europa League
    };
    return leagueMap[competition] || '4328'; // Default to Premier League
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
        console.log('Successfully fetched data from TheSportsDB:', endpoint, data);
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
            strTeamShort: "ARS",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/arsenal.png",
            intFormedYear: "1886",
            strStadium: "Emirates Stadium",
            strWebsite: "www.arsenal.com",
            strLocation: "London, England"
          },
          {
            idTeam: "133612", 
            strTeam: "Chelsea",
            strTeamShort: "CHE", 
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/chelsea.png",
            intFormedYear: "1905",
            strStadium: "Stamford Bridge",
            strWebsite: "www.chelseafc.com",
            strLocation: "London, England"
          },
          {
            idTeam: "133602",
            strTeam: "Liverpool",
            strTeamShort: "LIV",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/liverpool.png", 
            intFormedYear: "1892",
            strStadium: "Anfield",
            strWebsite: "www.liverpoolfc.com",
            strLocation: "Liverpool, England"
          },
          {
            idTeam: "133613",
            strTeam: "Manchester City",
            strTeamShort: "MCI",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/manchester_city.png",
            intFormedYear: "1880", 
            strStadium: "Etihad Stadium",
            strWebsite: "www.mancity.com",
            strLocation: "Manchester, England"
          }
        ]
      };
    }
    
    // Enhanced mock data for league table with more teams
    if (endpoint.includes('lookuptable') || endpoint.includes('table')) {
      return {
        table: [
          {
            intRank: "1",
            idTeam: "133602",
            strTeam: "Liverpool",
            intPlayed: "15",
            intWin: "11",
            intDraw: "3",
            intLoss: "1",
            intGoalsFor: "29",
            intGoalsAgainst: "8",
            intGoalDifference: "21",
            intPoints: "36",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/liverpool.png"
          },
          {
            intRank: "2",
            idTeam: "133604", 
            strTeam: "Arsenal",
            intPlayed: "15",
            intWin: "9",
            intDraw: "5", 
            intLoss: "1",
            intGoalsFor: "26",
            intGoalsAgainst: "12",
            intGoalDifference: "14",
            intPoints: "32",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/arsenal.png"
          },
          {
            intRank: "3",
            idTeam: "133613",
            strTeam: "Manchester City", 
            intPlayed: "15",
            intWin: "9",
            intDraw: "4",
            intLoss: "2",
            intGoalsFor: "31",
            intGoalsAgainst: "15",
            intGoalDifference: "16",
            intPoints: "31",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/manchester_city.png"
          },
          {
            intRank: "4",
            idTeam: "133612",
            strTeam: "Chelsea", 
            intPlayed: "15",
            intWin: "8",
            intDraw: "4",
            intLoss: "3",
            intGoalsFor: "25",
            intGoalsAgainst: "18",
            intGoalDifference: "7",
            intPoints: "28",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/chelsea.png"
          },
          {
            intRank: "5",
            idTeam: "133615",
            strTeam: "Tottenham Hotspur", 
            intPlayed: "15",
            intWin: "7",
            intDraw: "3",
            intLoss: "5",
            intGoalsFor: "22",
            intGoalsAgainst: "15",
            intGoalDifference: "7",
            intPoints: "24",
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/tottenham.png"
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
            strThumb: "https://www.thesportsdb.com/images/media/event/thumb/arsenal_vs_chelsea.jpg",
            strSeason: "2024-2025"
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
            strThumb: "https://www.thesportsdb.com/images/media/event/thumb/man_city_vs_liverpool.jpg",
            strSeason: "2024-2025"
          }
        ]
      };
    }
    
    return { message: 'Mock data not available for this endpoint' };
  }

  async fetchMatches(season?: string): Promise<any> {
    const endpoint = '/eventspastleague.php?id=4328';
    const data = await this.fetchData(endpoint);
    
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
        competition: { name: "Premier League" },
        season: event.strSeason || season || "2024-2025"
      }));
      
      return { matches, count: matches.length };
    }
    
    return data;
  }

  async fetchStandings(competition = 'PL', season?: string): Promise<any> {
    const leagueId = this.getLeagueId(competition);
    
    // Try to get standings for specific season if provided
    let endpoint = `/lookuptable.php?l=${leagueId}`;
    if (season && season !== '2024') {
      // Convert season format (2023 -> 2023-2024)
      const seasonStr = season === '2024' ? '2024-2025' : `${season}-${parseInt(season) + 1}`;
      endpoint += `&s=${seasonStr}`;
    }
    
    const data = await this.fetchData(endpoint);
    
    console.log('Raw standings data from API:', data);
    
    if (data.table && Array.isArray(data.table)) {
      const table = data.table.map((team: any, index: number) => ({
        position: parseInt(team.intRank) || (index + 1),
        team: {
          id: team.idTeam,
          name: team.strTeam,
          shortName: team.strTeam,
          tla: team.strTeam?.substring(0, 3).toUpperCase(),
          crest: team.strBadge || `https://www.thesportsdb.com/images/media/team/badge/default.png`
        },
        playedGames: parseInt(team.intPlayed) || 0,
        won: parseInt(team.intWin) || 0,
        draw: parseInt(team.intDraw) || 0,
        lost: parseInt(team.intLoss) || 0,
        points: parseInt(team.intPoints) || 0,
        goalsFor: parseInt(team.intGoalsFor) || 0,
        goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
        goalDifference: parseInt(team.intGoalDifference) || (parseInt(team.intGoalsFor) || 0) - (parseInt(team.intGoalsAgainst) || 0),
        form: team.strForm || 'N/A'
      }));
      
      console.log('Transformed standings data:', table);
      
      return {
        standings: [{
          stage: "REGULAR_SEASON",
          type: "TOTAL",
          table: table
        }],
        competition: { 
          name: this.getCompetitionName(competition), 
          code: competition 
        },
        season: season || "2024-2025"
      };
    }
    
    return data;
  }

  private getCompetitionName(code: string): string {
    const competitionNames: { [key: string]: string } = {
      'PL': 'Premier League',
      'PD': 'La Liga',
      'SA': 'Serie A',
      'BL1': 'Bundesliga',
      'FL1': 'Ligue 1',
      'CL': 'Champions League',
      'EL': 'Europa League'
    };
    return competitionNames[code] || 'Football League';
  }

  async fetchTeams(competition = 'PL', season?: string): Promise<any> {
    const leagueId = this.getLeagueId(competition);
    const endpoint = `/search_all_teams.php?l=${this.getLeagueName(competition)}`;
    const data = await this.fetchData(endpoint);
    
    if (data.teams) {
      const teams = data.teams.map((team: any) => ({
        id: team.idTeam,
        name: team.strTeam,
        shortName: team.strTeamShort || team.strTeam,
        tla: team.strTeamShort || team.strTeam?.substring(0, 3).toUpperCase(),
        crest: team.strBadge || `https://www.thesportsdb.com/images/media/team/badge/default.png`,
        founded: parseInt(team.intFormedYear) || null,
        venue: team.strStadium || 'Unknown Stadium',
        website: team.strWebsite || '',
        location: team.strLocation || team.strCountry || ''
      }));
      
      return { teams, count: teams.length };
    }
    
    return data;
  }

  private getLeagueName(competition: string): string {
    const leagueNames: { [key: string]: string } = {
      'PL': 'English_Premier_League',
      'PD': 'Spanish_La_Liga',
      'SA': 'Italian_Serie_A',
      'BL1': 'German_Bundesliga',
      'FL1': 'French_Ligue_1'
    };
    return leagueNames[competition] || 'English_Premier_League';
  }

  async fetchCompetitionMatches(competition = 'PL', season?: string): Promise<any> {
    const leagueId = this.getLeagueId(competition);
    const endpoint = `/eventspastleague.php?id=${leagueId}`;
    const data = await this.fetchData(endpoint);
    
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
        competition: { name: this.getCompetitionName(competition) },
        season: event.strSeason || season || "2024-2025"
      }));
      
      return { matches, count: matches.length };
    }
    
    return data;
  }
}

export default FootballAPI;
