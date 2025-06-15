
import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { Standing } from '@/types/football';

interface StandingsTableProps {
  standings: Standing[];
  competitionName: string;
  seasonName: string;
}

const getPositionColor = (position: number, isGroupStage: boolean = false) => {
  if (isGroupStage) {
    if (position <= 2) return 'text-green-600 font-bold bg-green-50'; // Qualification
    if (position <= 4) return 'text-blue-600 font-bold bg-blue-50'; // Europa League
    return 'text-gray-600 bg-gray-50'; // Elimination
  }
  
  if (position <= 4) return 'text-green-600 font-bold bg-green-50'; // Champions League
  if (position <= 6) return 'text-blue-600 font-bold bg-blue-50'; // Europa League
  if (position >= 18) return 'text-red-600 font-bold bg-red-50'; // Relegation
  return '';
};

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, competitionName, seasonName }) => {
  if (standings.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No standings data available for this season.</p>
        <p className="text-gray-400 text-sm mt-2">This might be due to limited API data for {seasonName}</p>
      </div>
    );
  }

  // Safe check for competitionName - default to empty string if undefined
  const safeCompetitionName = competitionName || '';
  const isGroupStage = false; // Since we removed CL and EL, always false
  const tableTitle = 'League Table';

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {safeCompetitionName} - {seasonName}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Complete league table with {standings.length} teams
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-600 text-left">Pos</th>
              <th className="p-3 font-semibold text-gray-600 text-left">Team</th>
              <th className="p-3 font-semibold text-gray-600 text-center">P</th>
              <th className="p-3 font-semibold text-gray-600 text-center">W</th>
              <th className="p-3 font-semibold text-gray-600 text-center">D</th>
              <th className="p-3 font-semibold text-gray-600 text-center">L</th>
              <th className="p-3 font-semibold text-gray-600 text-center">GF</th>
              <th className="p-3 font-semibold text-gray-600 text-center">GA</th>
              <th className="p-3 font-semibold text-gray-600 text-center">GD</th>
              <th className="p-3 font-semibold text-gray-600 text-center">Pts</th>
              <th className="p-3 font-semibold text-gray-600 text-center">Form</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.position} className="border-b hover:bg-gray-50 transition-colors">
                <td className={`p-3 font-medium ${getPositionColor(team.position, isGroupStage)}`}>{team.position}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    {team.team.crest && (
                      <img
                        src={team.team.crest}
                        alt={team.team.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://www.thesportsdb.com/images/media/team/badge/default.png';
                        }}
                      />
                    )}
                    <span className="font-semibold text-gray-800">{team.team.name}</span>
                  </div>
                </td>
                <td className="text-center p-3">{team.playedGames}</td>
                <td className="text-center p-3 text-green-600">{team.won}</td>
                <td className="text-center p-3 text-yellow-600">{team.draw}</td>
                <td className="text-center p-3 text-red-600">{team.lost}</td>
                <td className="text-center p-3">{team.goalsFor}</td>
                <td className="text-center p-3">{team.goalsAgainst}</td>
                <td className={`text-center p-3 font-medium ${team.goalDifference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="text-center p-3 font-bold text-gray-900">{team.points}</td>
                <td className="text-center p-3">
                  <div className="flex justify-center items-center space-x-0.5">
                    {(team.form || '-----').split('').map((result, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 text-xs inline-flex items-center justify-center rounded-full ${
                          result === 'W' ? 'bg-green-500 text-white' : result === 'D' ? 'bg-yellow-500 text-white' : result === 'L' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div><span>Champions League</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div><span>Europa League</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div><span>Relegation</span></div>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
