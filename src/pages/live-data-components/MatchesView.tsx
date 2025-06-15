
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Match } from '@/types/football';

interface MatchesViewProps {
  matches: Match[];
  message?: string;
  type: 'live' | 'recent';
}

const MatchCard = ({ match }: { match: Match }) => (
  <Card key={match.id} className="hover:shadow-md transition-shadow animate-fade-in">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-right flex items-center space-x-2 w-2/5 justify-end">
            <p className="font-semibold text-sm md:text-base truncate">{match.homeTeam.name}</p>
            {match.homeTeam.crest && (
              <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
            )}
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold">
              {match.status === 'FINISHED' || match.status === 'IN_PLAY' || match.status === 'LIVE'
                ? `${match.score.fullTime.home ?? '?'} - ${match.score.fullTime.away ?? '?'}`
                : 'vs'}
            </div>
            {match.matchday && <div className="text-xs text-gray-500">MD {match.matchday}</div>}
          </div>
          <div className="text-left flex items-center space-x-2 w-2/5">
            {match.awayTeam.crest && (
              <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
            )}
            <p className="font-semibold text-sm md:text-base truncate">{match.awayTeam.name}</p>
          </div>
        </div>
        <div className="text-right w-24">
          <Badge
            variant={
              match.status === 'IN_PLAY' || match.status === 'LIVE'
                ? 'destructive'
                : match.status === 'FINISHED'
                ? 'secondary'
                : 'default'
            }
          >
            {match.status === 'IN_PLAY' || match.status === 'LIVE' ? 'LIVE' : match.status}
          </Badge>
          <p className="text-sm text-gray-500 mt-1">{new Date(match.utcDate).toLocaleDateString()}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MatchesView: React.FC<MatchesViewProps> = ({ matches, message }) => {
  if (message) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          No matches found for the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};

export default MatchesView;

