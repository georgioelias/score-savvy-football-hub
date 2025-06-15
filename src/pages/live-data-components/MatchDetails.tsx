
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import FootballAPI from '@/utils/footballApi';
import { Match, EventStat } from '@/types/football';
import { Skeleton } from '@/components/ui/skeleton';
import StatsView from './StatsView';

const api = new FootballAPI();

const MatchDetails = ({ match }: { match: Match }) => {
  const { data: details, isLoading, isError } = useQuery<{
    stats: EventStat[];
  }>({
    queryKey: ['matchDetails', match.id],
    queryFn: async () => {
      const statsData = await api.fetchEventStats(match.id);

      return {
        stats: statsData.eventstats || [],
      };
    },
    enabled: !!match.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !details) {
    return <div className="p-4 text-center text-red-500">Could not load match details.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-b-lg border-t">
      <div className="mb-4">
        <h4 className="font-bold text-lg text-center">Match Statistics</h4>
      </div>
      <StatsView stats={details.stats} />
    </div>
  );
};

export default MatchDetails;
