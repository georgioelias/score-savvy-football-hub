
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import FootballAPI from '@/utils/footballApi';
import { Match, LineupPlayer, EventStat, TimelineEvent } from '@/types/football';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton';
import LineupView from './LineupView';
import StatsView from './StatsView';
import TimelineView from './TimelineView';

const api = new FootballAPI();

const MatchDetails = ({ match }: { match: Match }) => {
  const { data: details, isLoading, isError } = useQuery<{
    lineup: LineupPlayer[];
    stats: EventStat[];
    timeline: TimelineEvent[];
  }>({
    queryKey: ['matchDetails', match.id],
    queryFn: async () => {
      const [lineupData, statsData, timelineData] = await Promise.all([
        api.fetchLineup(match.id),
        api.fetchEventStats(match.id),
        api.fetchTimeline(match.id),
      ]);

      return {
        lineup: lineupData.lineup || [],
        stats: statsData.eventstats || [],
        timeline: timelineData.timeline || [],
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
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="lineups">Lineups</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <StatsView stats={details.stats} />
        </TabsContent>
        <TabsContent value="lineups">
          <LineupView lineup={details.lineup} homeTeamId={match.homeTeam.id} awayTeamId={match.awayTeam.id} />
        </TabsContent>
        <TabsContent value="timeline">
          <TimelineView timeline={details.timeline} homeTeamName={match.homeTeam.name} awayTeamName={match.awayTeam.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchDetails;
