
export interface Team {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  founded?: number | null;
  venue?: string;
  website?: string;
  location?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  status: 'FINISHED' | 'SCHEDULED' | 'IN_PLAY' | 'LIVE';
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    name: string;
  };
  season: string;
  matchday: number | null;
  goalscorers?: any[];
}

export interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string;
}

