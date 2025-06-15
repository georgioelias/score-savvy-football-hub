
import React from 'react';
import { LineupPlayer } from '@/types/football';

const LineupView = ({ lineup, homeTeamId, awayTeamId }: { lineup: LineupPlayer[], homeTeamId: string, awayTeamId: string }) => {
  const homeLineup = lineup.filter(p => p.idTeam === homeTeamId);
  const awayLineup = lineup.filter(p => p.idTeam === awayTeamId);

  if (lineup.length === 0) {
    return <p className="text-gray-500 text-center py-4">No lineup information available.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      <div>
        <h4 className="font-bold text-lg mb-2 text-center">Home</h4>
        <ul className="space-y-2">
          {homeLineup.map(player => (
            <li key={player.idPlayer} className="text-sm flex justify-between">
              <span>{player.strPlayer}</span>
              <span className="text-gray-500">{player.strPosition}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 text-center">Away</h4>
        <ul className="space-y-2">
          {awayLineup.map(player => (
            <li key={player.idPlayer} className="text-sm flex justify-between">
              <span>{player.strPlayer}</span>
              <span className="text-gray-500">{player.strPosition}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LineupView;
