
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
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
              <TableHead>Founded</TableHead>
              <TableHead>Stadium</TableHead>
              <TableHead>Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id} className="hover:bg-gray-50">
                <TableCell>
                  {team.crest && (
                    <img
                      src={team.crest}
                      alt={team.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://www.thesportsdb.com/images/media/team/badge/default.png';
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.tla}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{team.founded || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{team.venue}</div>
                </TableCell>
                <TableCell>
                  {team.website ? (
                    <a
                      href={team.website.startsWith('http') ? team.website : `https://${team.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
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
