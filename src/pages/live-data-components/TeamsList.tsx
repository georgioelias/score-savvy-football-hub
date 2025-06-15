
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Team } from '@/types/football';

interface TeamsListProps {
  teams: Team[];
  competitionName: string;
  seasonName: string;
}

const TeamsList: React.FC<TeamsListProps> = ({ teams, competitionName, seasonName }) => {
  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No team data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">
          {competitionName} Teams - {seasonName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{teams.length} teams in the competition.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Logo</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead className="text-center"><Calendar className="h-4 w-4 inline mr-1" />Founded</TableHead>
              <TableHead><MapPin className="h-4 w-4 inline mr-1" />Stadium</TableHead>
              <TableHead className="text-center"><ExternalLink className="h-4 w-4 inline mr-1" />Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id} className="hover:bg-gray-50">
                <TableCell>
                  <img
                    src={team.crest}
                    alt={team.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://www.thesportsdb.com/images/media/team/badge/default.png';
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.tla}</div>
                </TableCell>
                <TableCell className="text-center">
                  {team.founded ? (
                    <div className="text-sm text-gray-900 font-medium">{team.founded}</div>
                  ) : (
                    <span className="text-gray-400 text-sm">Not available</span>
                  )}
                </TableCell>
                <TableCell>
                  {team.venue ? (
                    <div className="text-sm text-gray-900">{team.venue}</div>
                  ) : (
                    <span className="text-gray-400 text-sm">Not available</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {team.website ? (
                    <a
                      href={team.website.startsWith('http') ? team.website : `https://${team.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Not available</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamsList;
