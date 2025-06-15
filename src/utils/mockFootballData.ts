
export const mockFootballData = {
  matches: [
    {
      id: 1,
      homeTeam: {
        id: 65,
        name: "Manchester City FC",
        shortName: "Man City",
        tla: "MCI",
        crest: "https://crests.football-data.org/65.png"
      },
      awayTeam: {
        id: 64,
        name: "Liverpool FC",
        shortName: "Liverpool", 
        tla: "LIV",
        crest: "https://crests.football-data.org/64.png"
      },
      utcDate: "2024-12-15T15:00:00Z",
      status: "SCHEDULED",
      score: {
        fullTime: { home: null, away: null }
      },
      competition: { name: "Premier League" }
    },
    {
      id: 2,
      homeTeam: {
        id: 57,
        name: "Arsenal FC",
        shortName: "Arsenal",
        tla: "ARS", 
        crest: "https://crests.football-data.org/57.png"
      },
      awayTeam: {
        id: 61,
        name: "Chelsea FC",
        shortName: "Chelsea",
        tla: "CHE",
        crest: "https://crests.football-data.org/61.png"
      },
      utcDate: "2024-12-14T17:30:00Z",
      status: "FINISHED",
      score: {
        fullTime: { home: 2, away: 1 }
      },
      competition: { name: "Premier League" }
    }
  ],
  standings: [
    {
      stage: "REGULAR_SEASON",
      type: "TOTAL",
      table: [
        {
          position: 1,
          team: {
            id: 64,
            name: "Liverpool FC",
            shortName: "Liverpool",
            tla: "LIV",
            crest: "https://crests.football-data.org/64.png"
          },
          playedGames: 15,
          won: 11,
          draw: 3,
          lost: 1,
          points: 36,
          goalsFor: 29,
          goalsAgainst: 8,
          goalDifference: 21
        },
        {
          position: 2,
          team: {
            id: 57,
            name: "Arsenal FC", 
            shortName: "Arsenal",
            tla: "ARS",
            crest: "https://crests.football-data.org/57.png"
          },
          playedGames: 15,
          won: 9,
          draw: 5,
          lost: 1,
          points: 32,
          goalsFor: 26,
          goalsAgainst: 12,
          goalDifference: 14
        },
        {
          position: 3,
          team: {
            id: 65,
            name: "Manchester City FC",
            shortName: "Man City", 
            tla: "MCI",
            crest: "https://crests.football-data.org/65.png"
          },
          playedGames: 15,
          won: 9,
          draw: 4,
          lost: 2,
          points: 31,
          goalsFor: 31,
          goalsAgainst: 15,
          goalDifference: 16
        }
      ]
    }
  ],
  teams: [
    {
      id: 57,
      name: "Arsenal FC",
      shortName: "Arsenal",
      tla: "ARS",
      crest: "https://crests.football-data.org/57.png",
      founded: 1886,
      venue: "Emirates Stadium"
    },
    {
      id: 61,
      name: "Chelsea FC", 
      shortName: "Chelsea",
      tla: "CHE",
      crest: "https://crests.football-data.org/61.png",
      founded: 1905,
      venue: "Stamford Bridge"
    },
    {
      id: 64,
      name: "Liverpool FC",
      shortName: "Liverpool",
      tla: "LIV", 
      crest: "https://crests.football-data.org/64.png",
      founded: 1892,
      venue: "Anfield"
    },
    {
      id: 65,
      name: "Manchester City FC",
      shortName: "Man City",
      tla: "MCI",
      crest: "https://crests.football-data.org/65.png", 
      founded: 1880,
      venue: "Etihad Stadium"
    }
  ]
};
