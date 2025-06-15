
import React from 'react';
import { EventStat } from '@/types/football';

const StatsView = ({ stats }: { stats: EventStat[] }) => {
  if (stats.length === 0) {
    return <p className="text-gray-500 text-center py-4">No statistics available for this match.</p>;
  }

  return (
    <div className="space-y-3 p-4">
      {stats.map(stat => (
        <div key={stat.strStat}>
          <div className="flex justify-between items-center mb-1 text-sm font-medium">
            <span className="text-gray-800">{stat.intHome}</span>
            <span className="text-gray-600">{stat.strStat}</span>
            <span className="text-gray-800">{stat.intAway}</span>
          </div>
          <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-green-500" 
              style={{ width: `${(parseInt(stat.intHome) / (parseInt(stat.intHome) + parseInt(stat.intAway))) * 100 || 0}%` }}
            ></div>
            <div 
              className="bg-blue-500" 
              style={{ width: `${(parseInt(stat.intAway) / (parseInt(stat.intHome) + parseInt(stat.intAway))) * 100 || 0}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsView;
