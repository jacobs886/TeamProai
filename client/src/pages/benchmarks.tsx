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
  Target, 
  TrendingUp,
  BarChart3,
  Users,
  Award,
  Brain,
  Zap,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Calendar,
  Timer,
  Activity,
  Gauge,
  LineChart,
  PieChart,
  Sparkles,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Medal,
  Trophy,
  Crown,
  Shield,
  Flag
} from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface PlayerBenchmark {
  playerId: string;
  playerName: string;
  position: string;
  sport: string;
  ageGroup: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  teamId: string;
  teamName: string;
  metrics: {
    physical: {
      sprintSpeed: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      endurance: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      agility: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      strength: { value: number; percentile: number; ageGroupAvg: number; rank: number };
    };
    technical: {
      ballControl: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      passing: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      shooting: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      defending: { value: number; percentile: number; ageGroupAvg: number; rank: number };
    };
    tactical: {
      positioning: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      decisionMaking: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      gameAwareness: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      teamwork: { value: number; percentile: number; ageGroupAvg: number; rank: number };
    };
    mental: {
      confidence: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      focus: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      resilience: { value: number; percentile: number; ageGroupAvg: number; rank: number };
      leadership: { value: number; percentile: number; ageGroupAvg: number; rank: number };
    };
  };
  overallRating: number;
  overallPercentile: number;
  strengths: string[];
  improvements: string[];
  lastUpdated: Date;
}

interface TeamBenchmark {
  teamId: string;
  teamName: string;
  sport: string;
  ageGroup: string;
  league: string;
  coach: string;
  playerCount: number;
  teamMetrics: {
    offense: { value: number; percentile: number; leagueAvg: number; rank: number };
    defense: { value: number; percentile: number; leagueAvg: number; rank: number };
    possession: { value: number; percentile: number; leagueAvg: number; rank: number };
    fitness: { value: number; percentile: number; leagueAvg: number; rank: number };
    discipline: { value: number; percentile: number; leagueAvg: number; rank: number };
    teamwork: { value: number; percentile: number; leagueAvg: number; rank: number };
  };
  seasonRecord: {
    wins: number;
    losses: number;
    draws: number;
    points: number;
    rank: number;
    totalTeams: number;
  };
  trends: {
    performance: "improving" | "declining" | "stable";
    momentum: number;
    formGuide: Array<"W" | "L" | "D">;
  };
  lastUpdated: Date;
}

interface BenchmarkInsight {
  id: string;
  playerId?: string;
  teamId?: string;
  targetName: string;
  type: "strength" | "improvement" | "prediction" | "comparison" | "goal";
  category: "physical" | "technical" | "tactical" | "mental" | "team";
  insight: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "critical";
  metricData: {
    currentValue: number;
    targetValue: number;
    percentileGap: number;
    timeToTarget: number; // weeks
  };
  recommendations: string[];
  aiGenerated: boolean;
  timestamp: Date;
  addressed: boolean;
}

interface AgeGroupStandards {
  ageGroup: string;
  sport: string;
  totalPlayers: number;
  standards: {
    elite: Record<string, number>; // 95th percentile
    excellent: Record<string, number>; // 80th percentile
    good: Record<string, number>; // 60th percentile
    average: Record<string, number>; // 50th percentile
    needsWork: Record<string, number>; // 25th percentile
  };
  researchBased: boolean;
  lastUpdated: Date;
}

interface BenchmarkAnalytics {
  totalPlayers: number;
  totalTeams: number;
  avgPercentile: number;
  topPerformers: Array<{
    playerId: string;
    name: string;
    metric: string;
    percentile: number;
    improvement: number;
  }>;
  teamRankings: Array<{
    teamId: string;
    name: string;
    rank: number;
    percentile: number;
    change: number;
  }>;
  insights: Array<{
    category: string;
    insight: string;
    impact: string;
    confidence: number;
  }>;
  trends: {
    skillDevelopment: "improving" | "declining" | "stable";
    teamPerformance: "improving" | "declining" | "stable";
    competitiveness: "increasing" | "decreasing" | "stable";
  };
}

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];
const AGE_GROUPS = ["U8", "U10", "U12", "U14", "U16", "U18"];
const METRIC_CATEGORIES = ["Physical", "Technical", "Tactical", "Mental"];
const COMPARISON_TYPES = ["Age Group", "Team", "League", "National"];

export default function Benchmarks() {
  const [activeTab, setActiveTab] = useState<"individual" | "team" | "insights" | "standards" | "analytics">("individual");
  const [selectedSport, setSelectedSport] = useState<string>("soccer");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("u14");
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>("all");
  const [selectedComparison, setSelectedComparison] = useState<string>("age-group");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerBenchmark | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamBenchmark | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<BenchmarkInsight | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch player benchmarks
  const { data: playerBenchmarks = [], isLoading: playersLoading } = useQuery({
    queryKey: ["/api/benchmarks/players", { sport: selectedSport, ageGroup: selectedAgeGroup, category: selectedMetricCategory }],
  });

  // Fetch team benchmarks
  const { data: teamBenchmarks = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/benchmarks/teams", { sport: selectedSport, ageGroup: selectedAgeGroup }],
  });

  // Fetch benchmark insights
  const { data: benchmarkInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/benchmarks/insights", { sport: selectedSport }],
  });

  // Fetch age group standards
  const { data: ageGroupStandards = [], isLoading: standardsLoading } = useQuery({
    queryKey: ["/api/benchmarks/standards", { sport: selectedSport, ageGroup: selectedAgeGroup }],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/benchmarks/analytics"],
  });

  // Recalculate benchmarks mutation
  const recalculateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/benchmarks/recalculate", { sport: selectedSport, ageGroup: selectedAgeGroup });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/benchmarks"] });
      toast({
        title: "Benchmarks Updated",
        description: "Age-appropriate benchmarks have been recalculated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to recalculate benchmarks",
        variant: "destructive",
      });
    }
  });

  // Address insight mutation
  const addressInsightMutation = useMutation({
    mutationFn: async (insightId: string) => {
      const response = await apiRequest("POST", `/api/benchmarks/address-insight/${insightId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/benchmarks/insights"] });
      toast({
        title: "Insight Addressed",
        description: "Benchmark insight has been marked as addressed",
      });
    },
    onError: () => {
      toast({
        title: "Address Failed",
        description: "Unable to address insight",
        variant: "destructive",
      });
    }
  });

  const handleRecalculate = () => {
    recalculateMutation.mutate();
  };

  const handleAddressInsight = (insightId: string) => {
    addressInsightMutation.mutate(insightId);
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return "text-green-600";
    if (percentile >= 75) return "text-blue-600";
    if (percentile >= 50) return "text-yellow-600";
    if (percentile >= 25) return "text-orange-600";
    return "text-red-600";
  };

  const getPercentileBadge = (percentile: number) => {
    if (percentile >= 95) return { label: "Elite", color: "bg-purple-100 text-purple-800", icon: Crown };
    if (percentile >= 80) return { label: "Excellent", color: "bg-green-100 text-green-800", icon: Trophy };
    if (percentile >= 60) return { label: "Good", color: "bg-blue-100 text-blue-800", icon: Medal };
    if (percentile >= 40) return { label: "Average", color: "bg-yellow-100 text-yellow-800", icon: Star };
    return { label: "Needs Work", color: "bg-red-100 text-red-800", icon: Target };
  };

  const getRankSuffix = (rank: number) => {
    if (rank % 100 >= 11 && rank % 100 <= 13) return "th";
    switch (rank % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "declining": return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "stable": return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high": return <Flag className="h-4 w-4 text-orange-600" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "low": return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPlayers = playerBenchmarks.filter((player: PlayerBenchmark) => 
    selectedMetricCategory === "all" || 
    Object.keys(player.metrics).some(category => 
      category.toLowerCase().includes(selectedMetricCategory.toLowerCase())
    )
  );

  const filteredTeams = teamBenchmarks.filter((team: TeamBenchmark) => 
    selectedAgeGroup === "all" || team.ageGroup.toLowerCase() === selectedAgeGroup.toLowerCase()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            Performance Benchmarks
          </h1>
          <p className="text-gray-600">Age-appropriate performance comparisons and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Enhanced
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            Research-Based
          </Badge>
          <Button onClick={handleRecalculate} disabled={recalculateMutation.isPending}>
            {recalculateMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Benchmarks
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{filteredPlayers.length}</p>
                <p className="text-xs text-gray-600">Players Benchmarked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{filteredTeams.length}</p>
                <p className="text-xs text-gray-600">Teams Ranked</p>
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
                  {analytics?.avgPercentile || 0}%
                </p>
                <p className="text-xs text-gray-600">Avg Percentile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPlayers.filter((p: PlayerBenchmark) => p.overallPercentile >= 90).length}
                </p>
                <p className="text-xs text-gray-600">Elite Performers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Benchmark Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="sport-filter">Sport</Label>
              <select
                id="sport-filter"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {SPORTS.map(sport => (
                  <option key={sport} value={sport.toLowerCase()}>{sport}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="age-filter">Age Group</Label>
              <select
                id="age-filter"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {AGE_GROUPS.map(age => (
                  <option key={age} value={age.toLowerCase()}>{age}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="metric-filter">Metric Category</Label>
              <select
                id="metric-filter"
                value={selectedMetricCategory}
                onChange={(e) => setSelectedMetricCategory(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="all">All Categories</option>
                {METRIC_CATEGORIES.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="comparison-filter">Comparison Type</Label>
              <select
                id="comparison-filter"
                value={selectedComparison}
                onChange={(e) => setSelectedComparison(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {COMPARISON_TYPES.map(type => (
                  <option key={type} value={type.toLowerCase().replace(' ', '-')}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="individual" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Individual</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="standards" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Standards</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Individual Benchmarks Tab */}
        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Individual Player Benchmarks
                <Badge className="bg-blue-100 text-blue-800">
                  <Target className="h-3 w-3 mr-1" />
                  Age-Normalized
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {playersLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredPlayers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No benchmark data available</p>
                      <p className="text-sm">Benchmarks will appear as performance data is collected</p>
                    </div>
                  ) : (
                    filteredPlayers.map((player: PlayerBenchmark) => (
                      <div key={player.playerId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedPlayer(player)}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-blue-600">{player.playerName.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-lg">{player.playerName}</p>
                                {(() => {
                                  const badge = getPercentileBadge(player.overallPercentile);
                                  const Icon = badge.icon;
                                  return (
                                    <Badge className={badge.color}>
                                      <Icon className="h-3 w-3 mr-1" />
                                      {badge.label}
                                    </Badge>
                                  );
                                })()}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{player.position} • {player.teamName} • {player.ageGroup}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-600">Overall:</span>
                                  <span className={`font-bold ${getPercentileColor(player.overallPercentile)}`}>
                                    {player.overallPercentile}th percentile
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-600">Rating:</span>
                                  <span className="font-bold text-blue-600">{player.overallRating.toFixed(1)}/10</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Updated: {format(player.lastUpdated, "MMM d")}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {Object.entries(player.metrics).map(([category, metrics]) => {
                            const avgPercentile = Object.values(metrics).reduce((acc: number, metric: any) => acc + metric.percentile, 0) / Object.values(metrics).length;
                            return (
                              <div key={category} className="text-center p-3 bg-gray-50 rounded">
                                <p className="font-medium text-sm capitalize text-gray-700">{category}</p>
                                <p className={`text-lg font-bold ${getPercentileColor(avgPercentile)}`}>
                                  {Math.round(avgPercentile)}%
                                </p>
                                <p className="text-xs text-gray-600">percentile</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 mb-2">Top Strengths:</p>
                            <div className="flex flex-wrap gap-1">
                              {player.strengths.slice(0, 3).map((strength, index) => (
                                <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-2">Areas for Improvement:</p>
                            <div className="flex flex-wrap gap-1">
                              {player.improvements.slice(0, 3).map((improvement, index) => (
                                <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
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

        {/* Team Benchmarks Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {teamsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No team benchmark data available</p>
                      <p className="text-sm">Team rankings will appear as season progresses</p>
                    </div>
                  ) : (
                    filteredTeams.map((team: TeamBenchmark, index: number) => (
                      <div key={team.teamId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedTeam(team)}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              team.seasonRecord.rank <= 3 ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {team.seasonRecord.rank <= 3 ? (
                                <Trophy className={`h-6 w-6 ${
                                  team.seasonRecord.rank === 1 ? 'text-yellow-600' :
                                  team.seasonRecord.rank === 2 ? 'text-gray-600' :
                                  'text-orange-600'
                                }`} />
                              ) : (
                                <span className="font-bold text-blue-600">#{team.seasonRecord.rank}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-lg">{team.teamName}</p>
                                <Badge variant="outline" className="text-xs">
                                  {team.seasonRecord.rank}{getRankSuffix(team.seasonRecord.rank)} / {team.seasonRecord.totalTeams}
                                </Badge>
                                {getTrendIcon(team.trends.performance)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{team.coach} • {team.ageGroup} • {team.league}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-600">Record:</span>
                                  <span className="font-medium">{team.seasonRecord.wins}W-{team.seasonRecord.losses}L-{team.seasonRecord.draws}D</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-600">Points:</span>
                                  <span className="font-bold text-blue-600">{team.seasonRecord.points}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Players: {team.playerCount}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="h-3 w-3 mr-1" />
                              View Team
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                          {Object.entries(team.teamMetrics).map(([metric, data]) => (
                            <div key={metric} className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-medium text-xs capitalize text-gray-700">{metric}</p>
                              <p className={`text-sm font-bold ${getPercentileColor(data.percentile)}`}>
                                {data.percentile}%
                              </p>
                              <p className="text-xs text-gray-600">#{data.rank}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-600">Form:</span>
                              {team.trends.formGuide.slice(-5).map((result, idx) => (
                                <span key={idx} className={`w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold ${
                                  result === 'W' ? 'bg-green-500' : 
                                  result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}>
                                  {result}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-600">Momentum:</span>
                              <span className={`font-medium ${
                                team.trends.momentum > 0 ? 'text-green-600' : 
                                team.trends.momentum < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {team.trends.momentum > 0 ? '+' : ''}{team.trends.momentum}%
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-500">Updated: {format(team.lastUpdated, "MMM d")}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Benchmark Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {insightsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : benchmarkInsights.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No benchmark insights available</p>
                      <p className="text-sm">AI insights will appear as performance data is analyzed</p>
                    </div>
                  ) : (
                    benchmarkInsights.map((insight: BenchmarkInsight) => (
                      <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedInsight(insight)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            {getPriorityIcon(insight.priority)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{insight.targetName}</p>
                                <Badge className={`text-xs ${
                                  insight.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                                  insight.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {Math.round(insight.confidence * 100)}% confidence
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {insight.type}
                                </Badge>
                                <Badge className={`text-xs capitalize ${
                                  insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                  insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {insight.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-800 mb-2">{insight.insight}</p>
                              <p className="text-xs text-gray-600">
                                Category: <span className="capitalize">{insight.category}</span> • 
                                Generated: {format(insight.timestamp, "MMM d, HH:mm")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!insight.addressed && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddressInsight(insight.id);
                                }}
                                disabled={addressInsightMutation.isPending}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Address
                              </Button>
                            )}
                            {insight.addressed && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Addressed
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="font-bold text-blue-600">{insight.metricData.currentValue}</p>
                            <p className="text-xs text-gray-600">Current</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="font-bold text-green-600">{insight.metricData.targetValue}</p>
                            <p className="text-xs text-gray-600">Target</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="font-bold text-purple-600">{insight.metricData.percentileGap}%</p>
                            <p className="text-xs text-gray-600">Gap</p>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <p className="font-bold text-orange-600">{insight.metricData.timeToTarget}w</p>
                            <p className="text-xs text-gray-600">Est. Time</p>
                          </div>
                        </div>

                        {insight.recommendations.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">AI Recommendations:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {insight.recommendations.slice(0, 2).map((rec, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
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

        {/* Age Group Standards Tab */}
        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Age Group Performance Standards
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Research-Based
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {standardsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : ageGroupStandards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No standards data available</p>
                  <p className="text-sm">Age group standards will be loaded from research databases</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ageGroupStandards.map((standard: AgeGroupStandards, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{standard.ageGroup} {standard.sport}</h3>
                          <p className="text-sm text-gray-600">
                            Based on {standard.totalPlayers.toLocaleString()} players • 
                            Updated: {format(standard.lastUpdated, "MMM d, yyyy")}
                          </p>
                        </div>
                        {standard.researchBased && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Research Validated
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-4">
                        {Object.entries(standard.standards).map(([level, metrics]) => (
                          <div key={level} className="border rounded p-3">
                            <h4 className="font-medium mb-3 capitalize flex items-center space-x-2">
                              {(() => {
                                const badge = getPercentileBadge(
                                  level === 'elite' ? 95 :
                                  level === 'excellent' ? 80 :
                                  level === 'good' ? 60 :
                                  level === 'average' ? 50 : 25
                                );
                                const Icon = badge.icon;
                                return (
                                  <>
                                    <Icon className="h-4 w-4" />
                                    <span>{level === 'needsWork' ? 'Needs Work' : level}</span>
                                  </>
                                );
                              })()}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(metrics).map(([metric, value]) => (
                                <div key={metric} className="text-center p-2 bg-gray-50 rounded">
                                  <p className="font-bold text-blue-600">{value}</p>
                                  <p className="text-xs text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {/* Overview Metrics */}
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
                      <Target className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgPercentile || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Percentile</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Crown className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.topPerformers?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Elite Athletes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Benchmark Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topPerformers?.map((performer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index < 3 ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            {index < 3 ? (
                              <Crown className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <span className="font-bold text-blue-600">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{performer.name}</p>
                            <p className="text-sm text-gray-600">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">{performer.percentile}th</p>
                          <div className="flex items-center space-x-1">
                            <ArrowUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">+{performer.improvement}%</span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No top performer data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Team Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.teamRankings?.map((team: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            team.rank <= 3 ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <span className="font-bold">{team.rank}</span>
                          </div>
                          <p className="font-medium">{team.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-bold text-lg">{team.percentile}%</p>
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
                      <p className="text-gray-500 text-center py-4">No team ranking data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Benchmark Insights Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Benchmark Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.insights?.map((insight: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="font-medium capitalize">{insight.category.replace('_', ' ')}</span>
                          </div>
                          <Badge className={`text-xs ${
                            insight.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                            insight.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-800 mb-1">{insight.insight}</p>
                        <p className="text-xs text-gray-600">Impact: <span className="font-medium">{insight.impact}</span></p>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No benchmark insights available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Player Benchmark Details Dialog */}
      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="player-benchmark-description">
          <DialogHeader>
            <DialogTitle>Player Benchmark Details</DialogTitle>
          </DialogHeader>
          <div id="player-benchmark-description" className="space-y-6">
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
                      <p className="text-sm text-gray-500">{selectedPlayer.ageGroup} • {selectedPlayer.sport}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const badge = getPercentileBadge(selectedPlayer.overallPercentile);
                      const Icon = badge.icon;
                      return (
                        <div className="flex items-center space-x-2">
                          <Badge className={badge.color}>
                            <Icon className="h-4 w-4 mr-1" />
                            {badge.label}
                          </Badge>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getPercentileColor(selectedPlayer.overallPercentile)}`}>
                              {selectedPlayer.overallPercentile}th
                            </p>
                            <p className="text-sm text-gray-600">Percentile</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Object.entries(selectedPlayer.metrics).map(([category, metrics]) => (
                    <div key={category}>
                      <h4 className="font-bold mb-3 capitalize text-gray-700">{category} Metrics</h4>
                      <div className="space-y-3">
                        {Object.entries(metrics).map(([metric, data]) => (
                          <div key={metric} className="p-3 border rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <Badge className={`text-xs ${getPercentileBadge(data.percentile).color}`}>
                                {data.percentile}th
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <p className="font-bold text-blue-600">{data.value}</p>
                                <p className="text-gray-600">Current</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-gray-600">{data.ageGroupAvg}</p>
                                <p className="text-gray-600">Age Avg</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-purple-600">#{data.rank}</p>
                                <p className="text-gray-600">Rank</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-green-700">Top Strengths</h4>
                    <div className="space-y-2">
                      {selectedPlayer.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-orange-700">Areas for Improvement</h4>
                    <div className="space-y-2">
                      {selectedPlayer.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                          <Target className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}