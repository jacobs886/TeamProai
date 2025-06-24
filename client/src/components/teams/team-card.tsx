import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { Team } from "@shared/schema";

interface TeamCardProps {
  team: Team;
  isDashboard?: boolean;
}

export default function TeamCard({ team, isDashboard = false }: TeamCardProps) {
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'volleyball':
        return '🏐';
      case 'basketball':
        return '🏀';
      case 'baseball':
        return '⚾';
      default:
        return '🏃';
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'volleyball':
        return 'bg-primary text-white';
      case 'basketball':
        return 'bg-secondary text-white';
      case 'baseball':
        return 'bg-accent text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Mock data for demonstration - in real app this would come from API
  const mockPlayerCount = Math.floor(Math.random() * 10) + 10;
  const mockNextGame = `Mar ${Math.floor(Math.random() * 15) + 15}`;
  const mockRecord = `${Math.floor(Math.random() * 8) + 3}-${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 3)}`;

  // Mock player avatars
  const mockPlayers = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256',
  ];

  const getRecordColor = (record: string) => {
    const [wins] = record.split('-').map(Number);
    if (wins >= 7) return 'text-green-600';
    if (wins >= 5) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${getSportColor(team.sport)}`}>
              <span className="text-lg">{getSportIcon(team.sport)}</span>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">{team.name}</h4>
              {team.category && (
                <p className="text-xs text-gray-500">{team.category}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Players:</span>
            <span className="font-medium">{mockPlayerCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Next Game:</span>
            <span className="font-medium">{mockNextGame}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Record:</span>
            <span className={`font-medium ${getRecordColor(mockRecord)}`}>{mockRecord}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <div className="flex -space-x-2 overflow-hidden">
            {mockPlayers.map((avatar, index) => (
              <Avatar key={index} className="inline-block h-6 w-6 ring-2 ring-white">
                <AvatarImage src={avatar} alt={`Team member ${index + 1}`} />
                <AvatarFallback className="text-xs">
                  {String.fromCharCode(65 + index)}
                </AvatarFallback>
              </Avatar>
            ))}
            {mockPlayerCount > 3 && (
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-500 text-xs font-medium text-white">
                +{mockPlayerCount - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
