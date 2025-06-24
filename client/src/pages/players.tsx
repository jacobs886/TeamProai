import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import PlayerRosterList from "@/components/players/player-roster-list";
import PlayerForm from "@/components/players/player-form";
import PlayerImportExport from "@/components/players/player-import-export";
import GuardianManagement from "@/components/players/guardian-management";
import SkillsTracking from "@/components/players/skills-tracking";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  Brain,
  Zap,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Shield,
  FileText
} from "lucide-react";

export default function Players() {
  const [activeTab, setActiveTab] = useState<"roster" | "skills" | "guardians" | "import">("roster");
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("all");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch players data
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  // Fetch teams for filtering
  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Fetch AI insights
  const { data: aiInsights = {} } = useQuery({
    queryKey: ["/api/players/ai-insights"],
  });

  // Player creation mutation
  const createPlayerMutation = useMutation({
    mutationFn: (playerData: any) => apiRequest("POST", "/api/players", playerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Player Added",
        description: "New player has been successfully added to the roster.",
      });
      setShowPlayerForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPlayers = players.filter((player: any) => {
    const matchesSearch = player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.jerseyNumber?.toString().includes(searchTerm);
    const matchesTeam = filterTeam === "all" || player.teamId === filterTeam;
    return matchesSearch && matchesTeam;
  });

  const handleCreatePlayer = (playerData: any) => {
    createPlayerMutation.mutate(playerData);
  };

  const handleEditPlayer = (player: any) => {
    setSelectedPlayer(player);
    setShowPlayerForm(true);
  };

  const handleBulkAction = (action: string, selectedPlayerIds: string[]) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedPlayerIds.length} players.`,
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Player Roster Management</h1>
            <p className="text-gray-600">Manage player profiles, skills, and guardian information</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              {players.length} Players
            </Badge>
          </div>
        </div>

        {/* AI Insights Banner */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">AI Roster Intelligence</h3>
                  <p className="text-sm text-blue-700">Smart team balancing and performance insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">{aiInsights.teamBalance || "85%"}</div>
                  <div className="text-gray-600">Team Balance</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{aiInsights.avgSkillLevel || "7.2"}</div>
                  <div className="text-gray-600">Avg Skill Level</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{aiInsights.completionRate || "94%"}</div>
                  <div className="text-gray-600">Profile Completion</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search players by name or jersey number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">All Teams</option>
                  {teams.map((team: any) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button onClick={() => setShowPlayerForm(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{players.length}</p>
                  <p className="text-xs text-gray-600">Total Players</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                  <p className="text-xs text-gray-600">Active Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{players.filter((p: any) => p.position === 'Captain').length}</p>
                  <p className="text-xs text-gray-600">Team Captains</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">12%</p>
                  <p className="text-xs text-gray-600">Avg Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roster" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Roster</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Skills Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="guardians" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Guardians</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Import/Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roster">
            <PlayerRosterList
              players={filteredPlayers}
              isLoading={isLoading}
              onEditPlayer={handleEditPlayer}
              onBulkAction={handleBulkAction}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsTracking
              players={players}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="guardians">
            <GuardianManagement
              players={players}
            />
          </TabsContent>

          <TabsContent value="import">
            <PlayerImportExport
              onImportComplete={() => queryClient.invalidateQueries({ queryKey: ["/api/players"] })}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Form Modal */}
      <Dialog open={showPlayerForm} onOpenChange={setShowPlayerForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlayer ? "Edit Player" : "Add New Player"}
            </DialogTitle>
          </DialogHeader>
          <PlayerForm
            player={selectedPlayer}
            teams={teams}
            onSubmit={handleCreatePlayer}
            onCancel={() => {
              setShowPlayerForm(false);
              setSelectedPlayer(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}