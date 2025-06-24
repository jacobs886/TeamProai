import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Trophy,
  Users,
  Clock,
  Activity,
  Award,
  Zap,
  Brain,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Calendar,
  Gauge,
  LineChart,
  PieChart,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  SkipForward,
  MapPin,
  Timer,
  Percent
} from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface PlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  sport: string;
  teamId: string;
  teamName: string;
  stats: {
    gamesPlayed: number;
    totalMinutes: number;
    goals: number;
    assists: number;
    saves: number;
    shots: number;
    passes: number;
    tackles: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
    rating: number;
  };
  trends: {
    performance: "improving" | "declining" | "stable";
    attendance: number;
    effort: number;
    teamwork: number;
  };
  milestones: Array<{
    achievement: string;
    date: Date;
    type: "goal" | "assist" | "save" | "game" | "award";
  }>;
}

interface TeamStats {
  teamId: string;
  teamName: string;
  sport: string;
  coach: string;
  season: string;
  record: {
    wins: number;
    losses: number;
    draws: number;
    points: number;
  };
  stats: {
    goalsFor: number;
    goalsAgainst: number;
    possession: number;
    passAccuracy: number;
    shots: number;
    saves: number;
    fouls: number;
    cards: number;
  };
  trends: {
    form: Array<"W" | "L" | "D">;
    momentum: "positive" | "negative" | "neutral";
    improvement: number;
  };
  playerCount: number;
  averageAge: number;
}

interface GameStats {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  date: Date;
  venue: string;
  sport: string;
  duration: number;
  highlights: Array<{
    type: "goal" | "assist" | "save" | "card" | "substitution";
    player: string;
    time: number;
    description: string;
  }>;
  teamStats: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  keyMoments: Array<{
    time: number;
    event: string;
    impact: "high" | "medium" | "low";
  }>;
}

interface StatsAnalytics {
  totalPlayers: number;
  totalTeams: number;
  totalGames: number;
  averageRating: number;
  topPerformers: Array<{
    playerId: string;
    name: string;
    metric: string;
    value: number;
    improvement: number;
  }>;
  teamRankings: Array<{
    teamId: string;
    name: string;
    points: number;
    rank: number;
    change: number;
  }>;
  trends: {
    playerDevelopment: number;
    teamPerformance: number;
    gameQuality: number;
  };
}

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];
const TIME_PERIODS = ["This Week", "This Month", "This Season", "All Time"];
const STAT_CATEGORIES = ["All", "Offense", "Defense", "General", "Advanced"];

export default function AdvancedStats() {
  const [activeTab, setActiveTab] = useState<"players" | "teams" | "games" | "analytics">("players");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameStats | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch player stats
  const { data: playerStats = [], isLoading: playersLoading } = useQuery({
    queryKey: ["/api/stats/players", { sport: selectedSport, period: selectedPeriod, category: selectedCategory }],
  });

  // Fetch team stats
  const { data: teamStats = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/stats/teams", { sport: selectedSport, period: selectedPeriod }],
  });

  // Fetch game stats
  const { data: gameStats = [], isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/stats/games", { sport: selectedSport, period: selectedPeriod }],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/stats/analytics"],
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (reportType: string) => {
      const response = await apiRequest("POST", "/api/stats/generate-report", { type: reportType, filters: { sport: selectedSport, period: selectedPeriod } });
      return response.blob();
    },
    onSuccess: (blob, reportType) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Report Generated",
        description: `${reportType} report has been downloaded`,
      });
    },
    onError: () => {
      toast({
        title: "Report Failed",
        description: "Unable to generate report",
        variant: "destructive",
      });
    }
  });

  const handleGenerateReport = (reportType: string) => {
    generateReportMutation.mutate(reportType);
  };

  const getPerformanceTrend = (trend: string) => {
    switch (trend) {
      case "improving": return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "declining": return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "stable": return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative": return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "neutral": return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPlayers = playerStats.filter((player: PlayerStats) => 
    selectedSport === "all" || player.sport.toLowerCase() === selectedSport.toLowerCase()
  );

  const filteredTeams = teamStats.filter((team: TeamStats) => 
    selectedSport === "all" || team.sport.toLowerCase() === selectedSport.toLowerCase()
  );

  const filteredGames = gameStats.filter((game: GameStats) => 
    selectedSport === "all" || game.sport.toLowerCase() === selectedSport.toLowerCase()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Advanced Stats
          </h1>
          <p className="text-gray-600">Comprehensive performance analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Enhanced
          </Badge>
          <Button onClick={() => handleGenerateReport("comprehensive")} disabled={generateReportMutation.isPending}>
            {generateReportMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="sport-filter">Sport</Label>
              <select
                id="sport-filter"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="all">All Sports</option>
                {SPORTS.map(sport => (
                  <option key={sport} value={sport.toLowerCase()}>{sport}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="period-filter">Time Period</Label>
              <select
                id="period-filter"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {TIME_PERIODS.map(period => (
                  <option key={period} value={period.toLowerCase().replace(' ', '-')}>{period}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {STAT_CATEGORIES.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => handleGenerateReport("filtered")}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="players" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Players</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Games</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Players Tab */}
        <TabsContent value="players" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{filteredPlayers.length}</p>
                    <p className="text-xs text-gray-600">Active Players</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredPlayers.length > 0 ? (filteredPlayers.reduce((acc: number, p: PlayerStats) => acc + p.stats.rating, 0) / filteredPlayers.length).toFixed(1) : "0.0"}
                    </p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredPlayers.reduce((acc: number, p: PlayerStats) => acc + p.stats.goals, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredPlayers.filter((p: PlayerStats) => p.trends.performance === "improving").length}
                    </p>
                    <p className="text-xs text-gray-600">Improving</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Players List */}
          <Card>
            <CardHeader>
              <CardTitle>Player Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {playersLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredPlayers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No player data available</p>
                      <p className="text-sm">Stats will appear as games are played</p>
                    </div>
                  ) : (
                    filteredPlayers.map((player: PlayerStats) => (
                      <div key={player.playerId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedPlayer(player)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-blue-600">{player.playerName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{player.playerName}</p>
                              <p className="text-sm text-gray-600">{player.position} • {player.teamName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getPerformanceTrend(player.trends.performance)}
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getRatingColor(player.stats.rating)}`}>
                                {player.stats.rating.toFixed(1)}
                              </p>
                              <p className="text-xs text-gray-600">Rating</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-blue-600">{player.stats.gamesPlayed}</p>
                            <p className="text-xs text-gray-600">Games</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-600">{player.stats.goals}</p>
                            <p className="text-xs text-gray-600">Goals</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-purple-600">{player.stats.assists}</p>
                            <p className="text-xs text-gray-600">Assists</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-orange-600">{player.stats.saves}</p>
                            <p className="text-xs text-gray-600">Saves</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-red-600">{player.stats.shots}</p>
                            <p className="text-xs text-gray-600">Shots</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-indigo-600">{player.stats.passes}</p>
                            <p className="text-xs text-gray-600">Passes</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-600">{Math.round(player.trends.attendance * 100)}%</p>
                            <p className="text-xs text-gray-600">Attendance</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-yellow-600">{player.stats.totalMinutes}</p>
                            <p className="text-xs text-gray-600">Minutes</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{filteredTeams.length}</p>
                    <p className="text-xs text-gray-600">Active Teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredTeams.reduce((acc: number, t: TeamStats) => acc + t.record.wins, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Wins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredTeams.reduce((acc: number, t: TeamStats) => acc + t.stats.goalsFor, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Goals Scored</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredTeams.reduce((acc: number, t: TeamStats) => acc + t.playerCount, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Players</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {teamsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No team data available</p>
                      <p className="text-sm">Team stats will appear as seasons progress</p>
                    </div>
                  ) : (
                    filteredTeams.map((team: TeamStats) => (
                      <div key={team.teamId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedTeam(team)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-lg">{team.teamName}</p>
                              <p className="text-sm text-gray-600">{team.coach} • {team.sport}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getMomentumIcon(team.trends.momentum)}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{team.record.points}</p>
                              <p className="text-xs text-gray-600">Points</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm mb-3">
                          <div className="text-center">
                            <p className="font-bold text-green-600">{team.record.wins}</p>
                            <p className="text-xs text-gray-600">Wins</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-red-600">{team.record.losses}</p>
                            <p className="text-xs text-gray-600">Losses</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-yellow-600">{team.record.draws}</p>
                            <p className="text-xs text-gray-600">Draws</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-blue-600">{team.stats.goalsFor}</p>
                            <p className="text-xs text-gray-600">Goals For</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-purple-600">{team.stats.goalsAgainst}</p>
                            <p className="text-xs text-gray-600">Goals Against</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-indigo-600">{team.playerCount}</p>
                            <p className="text-xs text-gray-600">Players</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Form:</span>
                            {team.trends.form.slice(-5).map((result, index) => (
                              <span key={index} className={`w-4 h-4 rounded-full text-white text-xs flex items-center justify-center ${
                                result === 'W' ? 'bg-green-500' : 
                                result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}>
                                {result}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Improvement:</span>
                            <span className={`font-medium ${team.trends.improvement > 0 ? 'text-green-600' : team.trends.improvement < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {team.trends.improvement > 0 ? '+' : ''}{team.trends.improvement}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="space-y-4">
          {/* Game Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{filteredGames.length}</p>
                    <p className="text-xs text-gray-600">Games Played</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredGames.length > 0 ? Math.round(filteredGames.reduce((acc: number, g: GameStats) => acc + g.duration, 0) / filteredGames.length) : 0}
                    </p>
                    <p className="text-xs text-gray-600">Avg Duration (min)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredGames.reduce((acc: number, g: GameStats) => acc + g.highlights.filter(h => h.type === 'goal').length, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredGames.filter((g: GameStats) => g.keyMoments.some(m => m.impact === 'high')).length}
                    </p>
                    <p className="text-xs text-gray-600">High Impact Games</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Games List */}
          <Card>
            <CardHeader>
              <CardTitle>Game Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {gamesLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredGames.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No game data available</p>
                      <p className="text-sm">Game statistics will appear after matches</p>
                    </div>
                  ) : (
                    filteredGames.map((game: GameStats) => (
                      <div key={game.gameId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedGame(game)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="font-bold text-lg">{game.homeTeam}</p>
                              <p className="text-xs text-gray-600">vs</p>
                              <p className="font-bold text-lg">{game.awayTeam}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{game.score}</p>
                              <p className="text-xs text-gray-600">Final Score</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{format(game.date, "MMM d, yyyy")}</p>
                            <p className="text-xs text-gray-600">{game.venue}</p>
                            <p className="text-xs text-gray-600">{game.duration} minutes</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-green-600">{game.highlights.filter(h => h.type === 'goal').length}</p>
                            <p className="text-xs text-gray-600">Goals</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-purple-600">{game.highlights.filter(h => h.type === 'assist').length}</p>
                            <p className="text-xs text-gray-600">Assists</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-blue-600">{game.highlights.filter(h => h.type === 'save').length}</p>
                            <p className="text-xs text-gray-600">Saves</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-yellow-600">{game.highlights.filter(h => h.type === 'card').length}</p>
                            <p className="text-xs text-gray-600">Cards</p>
                          </div>
                        </div>

                        {game.keyMoments.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">Key Moments:</p>
                            <div className="flex flex-wrap gap-2">
                              {game.keyMoments.slice(0, 3).map((moment, index) => (
                                <Badge key={index} variant={moment.impact === 'high' ? 'destructive' : moment.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                                  {moment.time}' {moment.event}
                                </Badge>
                              ))}
                              {game.keyMoments.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{game.keyMoments.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalPlayers || 0}</p>
                        <p className="text-xs text-gray-600">Total Players</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalTeams || 0}</p>
                        <p className="text-xs text-gray-600">Total Teams</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Activity className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalGames || 0}</p>
                        <p className="text-xs text-gray-600">Total Games</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Star className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageRating || 0}</p>
                        <p className="text-xs text-gray-600">Avg Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topPerformers?.map((performer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{performer.name}</p>
                            <p className="text-sm text-gray-600">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{performer.value}</p>
                          <div className="flex items-center space-x-1">
                            {performer.improvement > 0 ? (
                              <ArrowUp className="h-3 w-3 text-green-600" />
                            ) : performer.improvement < 0 ? (
                              <ArrowDown className="h-3 w-3 text-red-600" />
                            ) : (
                              <Minus className="h-3 w-3 text-gray-600" />
                            )}
                            <span className={`text-xs ${performer.improvement > 0 ? 'text-green-600' : performer.improvement < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {performer.improvement > 0 ? '+' : ''}{performer.improvement}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No performance data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Team Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.teamRankings?.map((team: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            team.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="font-bold">{team.rank}</span>
                          </div>
                          <p className="font-medium">{team.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-bold text-lg">{team.points} pts</p>
                          <div className="flex items-center space-x-1">
                            {team.change > 0 ? (
                              <ArrowUp className="h-3 w-3 text-green-600" />
                            ) : team.change < 0 ? (
                              <ArrowDown className="h-3 w-3 text-red-600" />
                            ) : (
                              <Minus className="h-3 w-3 text-gray-600" />
                            )}
                            <span className={`text-xs ${team.change > 0 ? 'text-green-600' : team.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {Math.abs(team.change)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No ranking data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Player Details Dialog */}
      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="player-detail-description">
          <DialogHeader>
            <DialogTitle>Player Statistics</DialogTitle>
          </DialogHeader>
          <div id="player-detail-description" className="space-y-4">
            {selectedPlayer && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-2xl text-blue-600">{selectedPlayer.playerName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedPlayer.playerName}</h3>
                      <p className="text-gray-600">{selectedPlayer.position} • {selectedPlayer.teamName}</p>
                      <p className="text-sm text-gray-500">{selectedPlayer.sport}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${getRatingColor(selectedPlayer.stats.rating)}`}>
                      {selectedPlayer.stats.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedPlayer.stats).map(([key, value]) => {
                    if (key === 'rating') return null;
                    return (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{value}</p>
                        <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-lg font-bold text-purple-600">{Math.round(selectedPlayer.trends.effort * 100)}%</p>
                    <p className="text-sm text-gray-600">Effort</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-lg font-bold text-green-600">{Math.round(selectedPlayer.trends.teamwork * 100)}%</p>
                    <p className="text-sm text-gray-600">Teamwork</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-lg font-bold text-blue-600">{Math.round(selectedPlayer.trends.attendance * 100)}%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                </div>

                {selectedPlayer.milestones.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3">Recent Milestones</h4>
                    <div className="space-y-2">
                      {selectedPlayer.milestones.slice(0, 5).map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                          <Award className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{milestone.achievement}</p>
                            <p className="text-xs text-gray-600">{format(milestone.date, "MMM d, yyyy")}</p>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {milestone.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Details Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="team-detail-description">
          <DialogHeader>
            <DialogTitle>Team Statistics</DialogTitle>
          </DialogHeader>
          <div id="team-detail-description" className="space-y-4">
            {selectedTeam && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedTeam.teamName}</h3>
                      <p className="text-gray-600">{selectedTeam.coach} • {selectedTeam.sport}</p>
                      <p className="text-sm text-gray-500">{selectedTeam.season} Season</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{selectedTeam.record.points}</p>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-2xl font-bold text-green-600">{selectedTeam.record.wins}</p>
                    <p className="text-sm text-gray-600">Wins</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-2xl font-bold text-red-600">{selectedTeam.record.losses}</p>
                    <p className="text-sm text-gray-600">Losses</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <p className="text-2xl font-bold text-yellow-600">{selectedTeam.record.draws}</p>
                    <p className="text-sm text-gray-600">Draws</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-2xl font-bold text-blue-600">{selectedTeam.playerCount}</p>
                    <p className="text-sm text-gray-600">Players</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedTeam.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-3 border rounded">
                      <p className="text-lg font-bold text-purple-600">{value}{key.includes('percentage') || key.includes('Accuracy') ? '%' : ''}</p>
                      <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-bold mb-3">Recent Form</h4>
                  <div className="flex items-center space-x-2">
                    {selectedTeam.trends.form.map((result, index) => (
                      <div key={index} className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold ${
                        result === 'W' ? 'bg-green-500' : 
                        result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {result}
                      </div>
                    ))}
                    <div className="ml-4 flex items-center space-x-2">
                      {getMomentumIcon(selectedTeam.trends.momentum)}
                      <span className="text-sm font-medium capitalize">{selectedTeam.trends.momentum} momentum</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Details Dialog */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="game-detail-description">
          <DialogHeader>
            <DialogTitle>Game Details</DialogTitle>
          </DialogHeader>
          <div id="game-detail-description" className="space-y-4">
            {selectedGame && (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-6 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedGame.homeTeam}</p>
                      <p className="text-sm text-gray-600">Home</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-600">{selectedGame.score}</p>
                      <p className="text-sm text-gray-600">Final</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedGame.awayTeam}</p>
                      <p className="text-sm text-gray-600">Away</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span>{format(selectedGame.date, "MMMM d, yyyy")}</span>
                    <span>•</span>
                    <span>{selectedGame.venue}</span>
                    <span>•</span>
                    <span>{selectedGame.duration} minutes</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Game Highlights</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedGame.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Timer className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{highlight.description}</p>
                          <p className="text-xs text-gray-600">{highlight.player} • {highlight.time}'</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {highlight.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedGame.keyMoments.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3">Key Moments</h4>
                    <div className="space-y-2">
                      {selectedGame.keyMoments.map((moment, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <div className="text-center">
                            <p className="font-bold text-blue-600">{moment.time}'</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{moment.event}</p>
                          </div>
                          <Badge variant={moment.impact === 'high' ? 'destructive' : moment.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {moment.impact} impact
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}