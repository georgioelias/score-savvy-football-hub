
import React from 'react';
import { TimelineEvent } from '@/types/football';
import { Clock } from 'lucide-react';

const TimelineView = ({ timeline, homeTeamName, awayTeamName }: { timeline: TimelineEvent[], homeTeamName: string, awayTeamName: string }) => {
  if (timeline.length === 0) {
    return <p className="text-gray-500 text-center py-4">No timeline events available for this match.</p>;
  }

  return (
    <div className="space-y-4 py-4">
      {timeline.map(event => (
        <div key={event.idTimeline} className="flex items-center space-x-4">
          <div className="w-16 text-right font-mono text-gray-600">{event.strTimeline}'</div>
          <div className="relative w-full">
            <div className="border-l-2 border-gray-200 absolute h-full left-2.5"></div>
            <div className="flex items-center space-x-4">
              <div className="bg-white border-2 border-gray-200 rounded-full h-5 w-5 z-10"></div>
              <div className="flex-1 text-sm">
                <p className="font-semibold">{event.strTimelineDetail}</p>
                <p className="text-gray-500">{event.strTimelineDescription}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
