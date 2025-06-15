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
          }
        ]
      };
    }
    
    // Mock data for league table
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
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/liverpool.png",
            strForm: "WWWDW"
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
            strBadge: "https://www.thesportsdb.com/images/media/team/badge/arsenal.png",
            strForm: "WWDLD"
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
            strSeason: "2024-2025",
            intRound: "16"
          },
          {
            idEvent: "2", 
            strEvent: "Manchester City vs Liverpool",
            strHomeTeam: "Manchester City",
            strAwayTeam: "Liverpool",
            intHomeScore: "1",
            intAwayScore: "3",
            dateEvent: "2024-12-15",
            strTime: "15:00:00", 
            strStatus: "Match Finished",
            strSeason: "2024-2025",
            intRound: "16"
          }
        ]
      };
    }
    
    return { message: 'Mock data not available for this endpoint' };
  }

  async fetchStandings(competition = 'PL', season?: string): Promise<any> {
    const leagueId = this.getLeagueId(competition);
    
    let endpoint = `/lookuptable.php?l=${leagueId}`;
    if (season) {
      endpoint += `&s=${season}`;
    }
    
    const data = await this.fetchData(endpoint);
    
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
    
    console.log('API returned no table data, using mock data for', competition, season);
    return this.getMockStandingsData(competition, season);
  }

  private getMockStandingsData(competition: string, season?: string): any {
    const mockTables: { [key: string]: any } = {
      // La Liga 2023-2024 season data
      'PD': season === '2023-2024' ? [
        { position: 1, team: { name: 'Real Madrid', tla: 'RMA', crest: 'https://www.thesportsdb.com/images/media/team/badge/real_madrid.png' }, playedGames: 38, won: 29, draw: 6, lost: 3, points: 95, goalsFor: 87, goalsAgainst: 26, goalDifference: 61, form: 'WWWDW' },
        { position: 2, team: { name: 'Barcelona', tla: 'BAR', crest: 'https://www.thesportsdb.com/images/media/team/badge/barcelona.png' }, playedGames: 38, won: 27, draw: 7, lost: 4, points: 85, goalsFor: 79, goalsAgainst: 32, goalDifference: 47, form: 'WDWWL' },
        { position: 3, team: { name: 'Girona', tla: 'GIR', crest: 'https://www.thesportsdb.com/images/media/team/badge/girona.png' }, playedGames: 38, won: 25, draw: 8, lost: 5, points: 81, goalsFor: 85, goalsAgainst: 46, goalDifference: 39, form: 'WWLDW' },
        { position: 4, team: { name: 'Atletico Madrid', tla: 'ATM', crest: 'https://www.thesportsdb.com/images/media/team/badge/atletico_madrid.png' }, playedGames: 38, won: 24, draw: 8, lost: 6, points: 76, goalsFor: 70, goalsAgainst: 43, goalDifference: 27, form: 'WDWLW' },
        { position: 5, team: { name: 'Athletic Bilbao', tla: 'ATH', crest: 'https://www.thesportsdb.com/images/media/team/badge/athletic_bilbao.png' }, playedGames: 38, won: 19, draw: 13, lost: 6, points: 68, goalsFor: 61, goalsAgainst: 37, goalDifference: 24, form: 'DWDWW' }
      ] : [],
      // Ligue 1 2023-2024 season data  
      'FL1': season === '2023-2024' ? [
        { position: 1, team: { name: 'Paris Saint-Germain', tla: 'PSG', crest: 'https://www.thesportsdb.com/images/media/team/badge/psg.png' }, playedGames: 34, won: 26, draw: 6, lost: 2, points: 84, goalsFor: 89, goalsAgainst: 35, goalDifference: 54, form: 'WWDWW' },
        { position: 2, team: { name: 'AS Monaco', tla: 'MON', crest: 'https://www.thesportsdb.com/images/media/team/badge/monaco.png' }, playedGames: 34, won: 21, draw: 9, lost: 4, points: 72, goalsFor: 68, goalsAgainst: 34, goalDifference: 34, form: 'WDWWD' },
        { position: 3, team: { name: 'Brest', tla: 'BRE', crest: 'https://www.thesportsdb.com/images/media/team/badge/brest.png' }, playedGames: 34, won: 18, draw: 11, lost: 5, points: 65, goalsFor: 56, goalsAgainst: 38, goalDifference: 18, form: 'DWDWL' },
        { position: 4, team: { name: 'Lille', tla: 'LIL', crest: 'https://www.thesportsdb.com/images/media/team/badge/lille.png' }, playedGames: 34, won: 18, draw: 10, lost: 6, points: 64, goalsFor: 54, goalsAgainst: 35, goalDifference: 19, form: 'LWWDW' },
        { position: 5, team: { name: 'Nice', tla: 'NIC', crest: 'https://www.thesportsdb.com/images/media/team/badge/nice.png' }, playedGames: 34, won: 17, draw: 11, lost: 6, points: 62, goalsFor: 40, goalsAgainst: 25, goalDifference: 15, form: 'DDWWD' }
      ] : []
    };

    const competitionType = (competition === 'CL' || competition === 'EL') ? 'GROUP_STAGE' : 'REGULAR_SEASON';
    const table = mockTables[competition]?.[competitionType] || mockTables[competition] || [];
    
    return {
      standings: [{
        stage: competitionType,
        type: competitionType === 'GROUP_STAGE' ? 'GROUP' : 'TOTAL',
        table: table
      }],
      competition: { 
        name: this.getCompetitionName(competition), 
        code: competition 
      },
      season: season || "2024-2025"
    };
  }

  private getCompetitionName(code: string): string {
    const competitionNames: { [key: string]: string } = {
      'PL': 'Premier League',
      'PD': 'La Liga',
      'SA': 'Serie A',
      'BL1': 'Bundesliga',
      'FL1': 'Ligue 1'
    };
    return competitionNames[code] || 'Football League';
  }

  async fetchMatches(season?: string): Promise<any> {
    // For general matches, use the eventsnextleague for upcoming/live matches
    const endpoint = '/eventsnextleague.php?id=4328';
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
        season: event.strSeason || season || "2024-2025",
        matchday: event.intRound ? parseInt(event.intRound) : null
      }));
      
      return { matches, count: matches.length };
    }
    
    return { matches: [], count: 0 };
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
    
    // Use different endpoints based on what we want
    // For past matches, use eventspastleague
    // For next/upcoming matches, use eventsnextleague
    const endpoint = `/eventspastleague.php?id=${leagueId}`;
    
    const data = await this.fetchData(endpoint);
    
    if (data.events && Array.isArray(data.events)) {
      // Filter events for the specific season if provided
      let events = data.events;
      if (season) {
        events = events.filter((event: any) => event.strSeason === season);
      }
      
      const matches = events.map((event: any) => ({
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
        season: event.strSeason || season || "2024-2025",
        matchday: event.intRound ? parseInt(event.intRound) : null
      }));
      
      return { matches, count: matches.length };
    }
    
    return { matches: [], count: 0 };
  }

  async fetchLineup(eventId: string): Promise<any> {
    const endpoint = `/lookuplineup.php?id=${eventId}`;
    const data = await this.fetchData(endpoint);
    return data.lineup ? data : { lineup: [] };
  }

  async fetchEventStats(eventId: string): Promise<any> {
    const endpoint = `/lookupeventstats.php?id=${eventId}`;
    const data = await this.fetchData(endpoint);
    return data.eventstats ? data : { eventstats: [] };
  }

  async fetchTimeline(eventId: string): Promise<any> {
    const endpoint = `/lookuptimeline.php?id=${eventId}`;
    const data = await this.fetchData(endpoint);
    return data.timeline ? data : { timeline: [] };
  }

  async fetchAnalyticsData(competition = 'PL', season?: string): Promise<any> {
    try {
      const [standings, matches] = await Promise.all([
        this.fetchStandings(competition, season),
        this.fetchCompetitionMatches(competition, season)
      ]);

      const standingsTable = standings.standings?.[0]?.table || [];
      const recentMatches = matches.matches?.filter((m: any) => m.status === 'FINISHED').slice(0, 100) || [];

      const totalGoals = standingsTable.reduce((sum: number, team: any) => sum + (team.goalsFor || 0), 0);
      const totalMatchesPlayed = standingsTable.reduce((sum: number, team: any) => sum + (team.playedGames || 0), 0) / 2;
      
      const avgGoalsPerMatch = totalMatchesPlayed > 0 ? (totalGoals / totalMatchesPlayed).toFixed(1) : '0.0';

      const topScoringTeamData = standingsTable.reduce((max: any, team: any) => {
        return ((team.goalsFor || 0) > (max?.goalsFor || 0)) ? team : max;
      }, null);
      
      const totalWins = standingsTable.reduce((sum: number, team: any) => sum + (team.won || 0), 0);
      const totalDraws = standingsTable.reduce((sum: number, team: any) => sum + (team.draw || 0), 0);

      return {
        totalGoals,
        avgGoalsPerMatch: parseFloat(avgGoalsPerMatch),
        topScorerGoals: topScoringTeamData?.goalsFor || 0,
        topScoringTeam: topScoringTeamData?.team?.name || 'Unknown',
        topTeams: standingsTable,
        recentMatches: recentMatches,
        leagueStats: [
          { name: 'Goals', value: totalGoals },
          { name: 'Matches', value: Math.round(totalMatchesPlayed) },
          { name: 'Wins', value: totalWins },
          { name: 'Draws', value: totalDraws },
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return {
        totalGoals: 0,
        avgGoalsPerMatch: 0,
        topScorerGoals: 0,
        topScoringTeam: 'Unknown',
        topTeams: [],
        recentMatches: [],
        leagueStats: []
      };
    }
  }

  async fetchSeasons(competition: string): Promise<string[]> {
    // Return consistent seasons for all competitions
    return ['2024-2025', '2023-2024', '2022-2023'];
  }
}

export default FootballAPI;
