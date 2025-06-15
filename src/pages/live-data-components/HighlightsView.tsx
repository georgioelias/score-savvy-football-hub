
import React from 'react';
import { Youtube } from 'lucide-react';

const HighlightsView = ({ highlights }: { highlights: any[] }) => {
  if (highlights.length === 0) {
    return <p className="text-gray-500 text-center py-4">No highlights available for this match.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <h4 className="font-bold text-lg mb-2">Match Highlights</h4>
      {highlights.map((highlight: any) => (
        <a 
          key={highlight.idEvent} 
          href={highlight.strVideo} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
        >
          <Youtube className="h-8 w-8 text-red-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">{highlight.strEvent}</p>
            <p className="text-sm text-blue-600 hover:underline">Watch on YouTube</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default HighlightsView;
