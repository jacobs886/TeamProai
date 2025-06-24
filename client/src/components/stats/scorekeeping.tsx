import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Target, 
  Timer, 
  Trophy,
  Plus,
  Minus,
  Save
} from "lucide-react";

interface ScorekeepingProps {
  eventId: number;
  sport: string;
  players: any[];
}

export default function Scorekeeping({ eventId, sport, players }: ScorekeepingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [gameStats, setGameStats] = useState<any>({});

  const { data: existingStats } = useQuery({
    queryKey: ["/api/events", eventId, "stats"],
  });

  const saveStatsMutation = useMutation({
    mutationFn: async (statsData: any) => {
      await apiRequest("POST", `/api/events/${eventId}/stats`, statsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events", eventId, "stats"] });
      toast({
        title: "Stats saved",
        description: "Game statistics have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save statistics",
        variant: "destructive",
      });
    },
  });

  const updateStat = (playerId: string, statName: string, value: number) => {
    setGameStats((prev: any) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [statName]: (prev[playerId]?.[statName] || 0) + value
      }
    }));
  };

  const renderVolleyballStats = () => (
    <div className="space-y-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                {player.jerseyNumber || player.name[0]}
              </div>
              <div>
                <h4 className="font-medium">{player.name}</h4>
                <p className="text-sm text-gray-500">{player.position}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Kills</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'kills', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.kills || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'kills', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Aces</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'aces', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.aces || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'aces', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Blocks</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'blocks', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.blocks || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'blocks', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Digs</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'digs', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.digs || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'digs', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderBasketballStats = () => (
    <div className="space-y-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center">
                {player.jerseyNumber || player.name[0]}
              </div>
              <div>
                <h4 className="font-medium">{player.name}</h4>
                <p className="text-sm text-gray-500">{player.position}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Points</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'points', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.points || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'points', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Rebounds</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'rebounds', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.rebounds || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'rebounds', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Assists</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'assists', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.assists || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'assists', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">3-Pointers</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'threePointers', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.threePointers || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'threePointers', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderBaseballStats = () => (
    <div className="space-y-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center">
                {player.jerseyNumber || player.name[0]}
              </div>
              <div>
                <h4 className="font-medium">{player.name}</h4>
                <p className="text-sm text-gray-500">{player.position}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Hits</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'hits', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.hits || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'hits', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">RBIs</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'rbis', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.rbis || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'rbis', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Home Runs</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'homeRuns', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.homeRuns || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'homeRuns', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Strikeouts</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'strikeouts', -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">
                  {gameStats[player.id]?.strikeouts || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStat(player.id, 'strikeouts', 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStatsForSport = () => {
    switch (sport) {
      case 'volleyball':
        return renderVolleyballStats();
      case 'basketball':
        return renderBasketballStats();
      case 'baseball':
        return renderBaseballStats();
      default:
        return <div>Sport not supported for scorekeeping yet.</div>;
    }
  };

  const handleSaveStats = () => {
    const statsToSave = Object.entries(gameStats).map(([playerId, stats]) => ({
      playerId,
      sport,
      stats
    }));

    saveStatsMutation.mutate(statsToSave);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Live Scorekeeping - {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </CardTitle>
          <Button 
            onClick={handleSaveStats}
            disabled={saveStatsMutation.isPending || Object.keys(gameStats).length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Stats
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Scoring</TabsTrigger>
            <TabsTrigger value="summary">Game Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="mt-4">
            {renderStatsForSport()}
          </TabsContent>
          
          <TabsContent value="summary" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-medium">Top Performer</h4>
                  <p className="text-sm text-gray-500">Most points/kills</p>
                </Card>
                
                <Card className="p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium">Team Total</h4>
                  <p className="text-sm text-gray-500">Combined stats</p>
                </Card>
                
                <Card className="p-4 text-center">
                  <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium">Game Time</h4>
                  <p className="text-sm text-gray-500">Duration tracking</p>
                </Card>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Game summary will appear here after stats are recorded</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}