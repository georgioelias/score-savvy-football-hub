
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Match } from '@/types/football';
import MatchCard from './MatchCard';
import MatchDetails from './MatchDetails';
import { AnimatePresence, motion } from 'framer-motion';

interface MatchesViewProps {
  matches: Match[];
  message?: string;
  type: 'live' | 'recent';
}

const MatchesView: React.FC<MatchesViewProps> = ({ matches, message }) => {
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const handleMatchClick = (matchId: string) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

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
    <div className="space-y-2">
      {matches.map((match) => (
        <div key={match.id}>
          <MatchCard 
            match={match} 
            onClick={() => handleMatchClick(match.id)}
            isExpanded={expandedMatchId === match.id}
          />
          <AnimatePresence>
            {expandedMatchId === match.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <MatchDetails match={match} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default MatchesView;
