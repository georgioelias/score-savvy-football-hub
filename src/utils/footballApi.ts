
import { Match, Standing, Team } from '@/types/football';

class FootballAPI {
  private baseUrl = 'https://www.thesportsdb.com/api/v1/json/3';

  constructor() {
  }

  async fetchMatches(season?: string): Promise<{ matches: any[] }> {
    console.log(`Fetching live matches for season: ${season}`);
    try {
      const url = `${this.baseUrl}/sports.php`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Returning all matches for now, filter on the client side
      return { matches: data.sports || [] };
    } catch (error) {
      console.error('Error fetching matches:', error);
      return { matches: [] };
    }
  }

  async fetchCompetitionMatches(competition: string, season?: string): Promise<{ matches: any[] }> {
    console.log(`Fetching competition matches for ${competition} season ${season}`);
    try {
      // Fetch the competition ID based on the provided competition code
      const competitionId = this.getCompetitionId(competition);
      if (!competitionId) {
        console.warn(`Competition ID not found for ${competition}`);
        return { matches: [] };
      }
  
      // Fetch all matches for the competition
      const url = `${this.baseUrl}/eventspastleague.php?id=${competitionId}`;
      const response = await fetch(url);
      const data = await response.json();
  
      // Ensure that the events array exists and is an array before proceeding
      const matches = Array.isArray(data.events) ? data.events : [];
  
      return { matches: matches };
    } catch (error) {
      console.error('Error fetching competition matches:', error);
      return { matches: [] };
    }
  }

  async fetchStandings(competition = 'PL', season?: string): Promise<{ standings: any[] }> {
    console.log(`Fetching league standings for ${competition} season ${season}`);
    try {
      const competitionId = this.getCompetitionId(competition);
      if (!competitionId) {
        console.warn(`Competition ID not found for ${competition}`);
        return { standings: [] };
      }
      
      const url = `${this.baseUrl}/lookuptable.php?l=${competitionId}&s=${season}`;
      console.log(`Fetching standings from: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Raw standings API response:', data);
      
      // TheSportsDB returns standings in data.table array
      if (!data.table || !Array.isArray(data.table)) {
        console.warn('No table data in API response, trying without season parameter');
        
        // Try without season parameter for current season
        const fallbackUrl = `${this.baseUrl}/lookuptable.php?l=${competitionId}`;
        console.log(`Trying fallback URL: ${fallbackUrl}`);
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        console.log('Fallback standings API response:', fallbackData);
        
        if (!fallbackData.table || !Array.isArray(fallbackData.table)) {
          console.warn('No standings data available from API');
          return { standings: [] };
        }
        
        // Map the fallback data to our format
        const mappedStandings = fallbackData.table.map((team: any, index: number) => ({
          position: parseInt(team.intRank) || (index + 1),
          team: {
            id: team.idTeam || `team-${index}`,
            name: team.strTeam || 'Unknown Team',
            shortName: team.strTeamShort || team.strTeam || 'Unknown',
            tla: team.strTeamShort?.substring(0, 3) || 'TLA',
            crest: team.strTeamBadge || 'https://www.thesportsdb.com/images/media/team/badge/default.png'
          },
          playedGames: parseInt(team.intPlayed) || 0,
          won: parseInt(team.intWin) || 0,
          draw: parseInt(team.intDraw) || 0,
          lost: parseInt(team.intLoss) || 0,
          points: parseInt(team.intPoints) || 0,
          goalsFor: parseInt(team.intGoalsFor) || 0,
          goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
          goalDifference: parseInt(team.intGoalDifference) || 0,
          form: team.strForm || '-----'
        }));
        
        console.log(`Mapped ${mappedStandings.length} teams from fallback data`);
        return { standings: mappedStandings };
      }
      
      // Map the TheSportsDB data to our format
      const mappedStandings = data.table.map((team: any, index: number) => ({
        position: parseInt(team.intRank) || (index + 1),
        team: {
          id: team.idTeam || `team-${index}`,
          name: team.strTeam || 'Unknown Team',
          shortName: team.strTeamShort || team.strTeam || 'Unknown',
          tla: team.strTeamShort?.substring(0, 3) || 'TLA',
          crest: team.strTeamBadge || 'https://www.thesportsdb.com/images/media/team/badge/default.png'
        },
        playedGames: parseInt(team.intPlayed) || 0,
        won: parseInt(team.intWin) || 0,
        draw: parseInt(team.intDraw) || 0,
        lost: parseInt(team.intLoss) || 0,
        points: parseInt(team.intPoints) || 0,
        goalsFor: parseInt(team.intGoalsFor) || 0,
        goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
        goalDifference: parseInt(team.intGoalDifference) || 0,
        form: team.strForm || '-----'
      }));
      
      console.log(`Successfully mapped ${mappedStandings.length} teams to standings format`);
      return { standings: mappedStandings };
      
    } catch (error) {
      console.error('Error fetching league standings:', error);
      return { standings: [] };
    }
  }

  async fetchEventStats(eventId: string): Promise<{ eventstats: any[] }> {
    console.log(`Fetching event stats for event ID: ${eventId}`);
    try {
      const url = `${this.baseUrl}/lookupeventstats.php?id=${eventId}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return { eventstats: data.eventstats || [] };
    } catch (error) {
      console.error('Error fetching event stats:', error);
      return { eventstats: [] };
    }
  }

  async fetchTeams(competition = 'PL', season?: string): Promise<{ teams: any[] }> {
    console.log(`Fetching teams for competition: ${competition}, season: ${season}`);
    
    try {
      const leagueMapping: Record<string, string> = {
        'PL': 'English Premier League',
        'PD': 'Spanish La Liga',
        'SA': 'Italian Serie A',
        'BL1': 'German Bundesliga',
        'FL1': 'French Ligue 1'
      };

      const countryMapping: Record<string, string> = {
        'PL': 'England',
        'PD': 'Spain', 
        'SA': 'Italy',
        'BL1': 'Germany',
        'FL1': 'France'
      };

      const leagueName = leagueMapping[competition];
      const countryName = countryMapping[competition];
      
      let teams: any[] = [];

      // Try league-specific endpoint first
      if (leagueName) {
        console.log(`Trying league-specific search for: ${leagueName}`);
        const leagueUrl = `${this.baseUrl}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`;
        const leagueResponse = await fetch(leagueUrl);
        const leagueData = await leagueResponse.json();
        
        if (leagueData.teams && Array.isArray(leagueData.teams)) {
          teams = [...teams, ...leagueData.teams];
          console.log(`Found ${leagueData.teams.length} teams from league search`);
        }
      }

      // Try country-specific search as fallback/supplement
      if (countryName && teams.length < 15) {
        console.log(`Trying country search for: ${countryName}`);
        const countryUrl = `${this.baseUrl}/search_all_teams.php?s=Soccer&c=${encodeURIComponent(countryName)}`;
        const countryResponse = await fetch(countryUrl);
        const countryData = await countryResponse.json();
        
        if (countryData.teams && Array.isArray(countryData.teams)) {
          // Filter for teams that might be in the competition
          const additionalTeams = countryData.teams.filter((team: any) => 
            !teams.some(existingTeam => existingTeam.idTeam === team.idTeam)
          );
          teams = [...teams, ...additionalTeams.slice(0, 20 - teams.length)];
          console.log(`Added ${additionalTeams.length} teams from country search`);
        }
      }

      // Remove duplicates based on team ID
      const uniqueTeams = teams.filter((team, index, self) => 
        index === self.findIndex(t => t.idTeam === team.idTeam)
      );

      console.log(`Total unique teams found: ${uniqueTeams.length}`);

      // Map TheSportsDB data to our format with better field mapping
      const mappedTeams = uniqueTeams.map((team: any) => ({
        id: team.idTeam || `team-${Math.random()}`,
        name: team.strTeam || team.strAlternate || 'Unknown Team',
        shortName: team.strTeamShort || team.strTeam || 'Unknown',
        tla: team.strTeamShort?.substring(0, 3) || team.strTeam?.substring(0, 3) || 'TLA',
        crest: team.strTeamBadge || team.strTeamLogo || 'https://www.thesportsdb.com/images/media/team/badge/default.png',
        founded: team.intFormedYear ? parseInt(team.intFormedYear) : null,
        venue: team.strStadium || team.strStadiumLocation || null,
        website: team.strWebsite || null,
        location: team.strStadiumLocation || team.strCountry || null
      }));

      console.log('Sample team data for debugging:', mappedTeams[0]);

      return { teams: mappedTeams };

    } catch (error) {
      console.error('Error fetching teams:', error);
      
      // Enhanced fallback data with more complete information
      const fallbackTeams = this.getFallbackTeams(competition);
      console.log(`Using ${fallbackTeams.length} fallback teams for ${competition}`);
      return { teams: fallbackTeams };
    }
  }

  private getFallbackTeams(competition: string): any[] {
    const teamData: Record<string, any[]> = {
      'PL': [
        { id: '133604', name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crest: 'https://logos.thesportsdb.com/v1/images/133604/team_badge.png', founded: 1886, venue: 'Emirates Stadium', website: 'arsenal.com' },
        { id: '133602', name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE', crest: 'https://logos.thesportsdb.com/v1/images/133602/team_badge.png', founded: 1905, venue: 'Stamford Bridge', website: 'chelseafc.com' },
        { id: '133613', name: 'Liverpool', shortName: 'Liverpool', tla: 'LIV', crest: 'https://logos.thesportsdb.com/v1/images/133613/team_badge.png', founded: 1892, venue: 'Anfield', website: 'liverpoolfc.com' },
        { id: '133612', name: 'Manchester City', shortName: 'Man City', tla: 'MCI', crest: 'https://logos.thesportsdb.com/v1/images/133612/team_badge.png', founded: 1880, venue: 'Etihad Stadium', website: 'mancity.com' },
        { id: '133611', name: 'Manchester United', shortName: 'Man United', tla: 'MUN', crest: 'https://logos.thesportsdb.com/v1/images/133611/team_badge.png', founded: 1878, venue: 'Old Trafford', website: 'manutd.com' }
      ],
      'PD': [
        { id: '133739', name: 'Real Madrid', shortName: 'Real Madrid', tla: 'RMA', crest: 'https://logos.thesportsdb.com/v1/images/133739/team_badge.png', founded: 1902, venue: 'Santiago Bernabéu', website: 'realmadrid.com' },
        { id: '133740', name: 'FC Barcelona', shortName: 'Barcelona', tla: 'BAR', crest: 'https://logos.thesportsdb.com/v1/images/133740/team_badge.png', founded: 1899, venue: 'Camp Nou', website: 'fcbarcelona.com' },
        { id: '133741', name: 'Atlético Madrid', shortName: 'Atletico', tla: 'ATM', crest: 'https://logos.thesportsdb.com/v1/images/133741/team_badge.png', founded: 1903, venue: 'Wanda Metropolitano', website: 'atleticodemadrid.com' }
      ],
      'SA': [
        { id: '133686', name: 'Juventus', shortName: 'Juventus', tla: 'JUV', crest: 'https://logos.thesportsdb.com/v1/images/133686/team_badge.png', founded: 1897, venue: 'Allianz Stadium', website: 'juventus.com' },
        { id: '133687', name: 'AC Milan', shortName: 'Milan', tla: 'MIL', crest: 'https://logos.thesportsdb.com/v1/images/133687/team_badge.png', founded: 1899, venue: 'San Siro', website: 'acmilan.com' },
        { id: '133688', name: 'Inter Milan', shortName: 'Inter', tla: 'INT', crest: 'https://logos.thesportsdb.com/v1/images/133688/team_badge.png', founded: 1908, venue: 'San Siro', website: 'inter.it' }
      ]
    };

    return teamData[competition] || [];
  }

  async fetchSeasons(competition: string): Promise<string[]> {
    console.log(`Fetching available seasons for ${competition}`);
    try {
      const competitionId = this.getCompetitionId(competition);
        if (!competitionId) {
            console.warn(`Competition ID not found for ${competition}`);
            return [];
        }
      const url = `${this.baseUrl}/lookuptable.php?l=${competitionId}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.table || !Array.isArray(data.table)) {
        console.warn(`No season data found for competition ID ${competitionId}`);
        return [];
      }
  
      // Extract unique seasons from the standings data
      const seasons = [...new Set(data.table.map((item: any) => item.strSeason))];
      
      // Filter out any undefined or null values and return the array of seasons
      return seasons.filter(Boolean) as string[];
    } catch (error) {
      console.error('Error fetching seasons:', error);
      return [];
    }
  }

  private getCompetitionId(competition: string): string | undefined {
    const competitionIds: Record<string, string> = {
      'PL': '4328', // English Premier League
      'PD': '4335', // Spanish La Liga
      'SA': '4332', // Italian Serie A
      'BL1': '4337', // German Bundesliga
      'FL1': '4334'  // French Ligue 1
    };
    return competitionIds[competition];
  }
}

export default FootballAPI;
