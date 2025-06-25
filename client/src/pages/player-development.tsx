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
  TrendingUp, 
  Target,
  Play,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  Star,
  Video,
  Brain,
  Zap,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Upload,
  Calendar,
  Timer,
  Activity,
  Heart,
  Gauge,
  BarChart3,
  LineChart,
  PieChart,
  Sparkles,
  FileText,
  Camera,
  Shield,
  Wifi,
  WifiOff,
  MessageSquare,
  Bell,
  Plus,
  Edit,
  Trash2,
  Share,
  Save
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface TrainingPlan {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  sport: string;
  teamId: string;
  coachId: string;
  title: string;
  description: string;
  goals: string[];
  drills: Array<{
    id: string;
    name: string;
    type: "skill" | "fitness" | "tactical" | "mental";
    duration: number; // minutes
    intensity: "low" | "medium" | "high";
    description: string;
    videoUrl?: string;
    equipment: string[];
    targetMetrics: string[];
  }>;
  protocols: Array<{
    id: string;
    name: string;
    category: "strength" | "endurance" | "agility" | "recovery";
    researchBacked: boolean;
    vetted: boolean;
    instructions: string[];
    safetyNotes: string[];
    references: string[];
  }>;
  personalizedFor: {
    weakAreas: string[];
    strengths: string[];
    targetMetrics: Record<string, number>;
    ageGroup: string;
    skillLevel: "beginner" | "intermediate" | "advanced";
  };
  schedule: {
    frequency: number; // sessions per week
    duration: number; // weeks
    sessionLength: number; // minutes
    preferredDays: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  aiGenerated: boolean;
  vetted: boolean;
  active: boolean;
}

interface TrainingProgress {
  id: string;
  playerId: string;
  planId: string;
  sessionDate: Date;
  completedDrills: string[];
  metrics: Record<string, number>;
  feedback: string;
  rating: number; // 1-5
  adherence: number; // percentage
  improvements: Array<{
    metric: string;
    before: number;
    after: number;
    improvement: number;
  }>;
  coachNotes: string;
  nextSession: Date;
}

interface DevelopmentInsight {
  id: string;
  playerId: string;
  playerName: string;
  type: "skill_improvement" | "injury_risk" | "performance_prediction" | "training_adjustment";
  insight: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "critical";
  recommendedActions: string[];
  dataPoints: Record<string, number>;
  aiGenerated: boolean;
  timestamp: Date;
  addressed: boolean;
}

interface CoachProtocol {
  id: string;
  coachId: string;
  coachName: string;
  name: string;
  category: "strength" | "endurance" | "agility" | "recovery" | "skill" | "tactical";
  sport: string;
  ageGroup: string;
  description: string;
  instructions: string[];
  equipment: string[];
  safetyGuidelines: string[];
  researchReferences: string[];
  videoUrl?: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  vetted: boolean;
  vettedBy?: string;
  vettedDate?: Date;
  usageCount: number;
  rating: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DevelopmentAnalytics {
  totalPlayers: number;
  activePlans: number;
  averageAdherence: number;
  averageImprovement: number;
  topImprovements: Array<{
    playerId: string;
    name: string;
    metric: string;
    improvement: number;
    timeframe: string;
  }>;
  protocolUsage: Array<{
    protocolId: string;
    name: string;
    usageCount: number;
    effectiveness: number;
  }>;
  insights: Array<{
    category: string;
    insight: string;
    impact: string;
    confidence: number;
  }>;
  trends: {
    skillDevelopment: "improving" | "declining" | "stable";
    adherence: "increasing" | "decreasing" | "stable";
    engagement: "high" | "medium" | "low";
  };
}

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];
const AGE_GROUPS = ["U8", "U10", "U12", "U14", "U16", "U18", "Adult"];
const DRILL_TYPES = ["Skill", "Fitness", "Tactical", "Mental"];
const PROTOCOL_CATEGORIES = ["Strength", "Endurance", "Agility", "Recovery", "Skill", "Tactical"];
const INTENSITY_LEVELS = ["Low", "Medium", "High"];

export default function PlayerDevelopment() {
  const [activeTab, setActiveTab] = useState<"plans" | "progress" | "insights" | "protocols" | "analytics">("plans");
  const [selectedSport, setSelectedSport] = useState<string>("soccer");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<TrainingProgress | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<DevelopmentInsight | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<CoachProtocol | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState<boolean>(false);
  const [showCreateProtocol, setShowCreateProtocol] = useState<boolean>(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch training plans
  const { data: trainingPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["/api/player-development/plans", { sport: selectedSport, ageGroup: selectedAgeGroup, player: selectedPlayer }],
  });

  // Fetch training progress
  const { data: trainingProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["/api/player-development/progress", { sport: selectedSport, player: selectedPlayer }],
  });

  // Fetch development insights
  const { data: developmentInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/player-development/insights", { sport: selectedSport }],
  });

  // Fetch coach protocols
  const { data: coachProtocols = [], isLoading: protocolsLoading } = useQuery({
    queryKey: ["/api/player-development/protocols", { sport: selectedSport, category: "all" }],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/player-development/analytics"],
  });

  // Generate AI training plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (data: { playerId: string; sport: string; goals: string[] }) => {
      const response = await apiRequest("POST", "/api/player-development/generate-plan", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player-development/plans"] });
      toast({
        title: "Training Plan Generated",
        description: "AI-powered personalized training plan has been created",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate training plan",
        variant: "destructive",
      });
    }
  });

  // Create protocol mutation
  const createProtocolMutation = useMutation({
    mutationFn: async (protocol: Partial<CoachProtocol>) => {
      const response = await apiRequest("POST", "/api/player-development/create-protocol", protocol);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player-development/protocols"] });
      setShowCreateProtocol(false);
      toast({
        title: "Protocol Created",
        description: "New training protocol has been added for review",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Unable to create protocol",
        variant: "destructive",
      });
    }
  });

  // Vet protocol mutation
  const vetProtocolMutation = useMutation({
    mutationFn: async (protocolId: string) => {
      const response = await apiRequest("POST", `/api/player-development/vet-protocol/${protocolId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player-development/protocols"] });
      toast({
        title: "Protocol Vetted",
        description: "Training protocol has been approved",
      });
    },
    onError: () => {
      toast({
        title: "Vetting Failed",
        description: "Unable to vet protocol",
        variant: "destructive",
      });
    }
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { progressId: string; updates: Partial<TrainingProgress> }) => {
      const response = await apiRequest("POST", `/api/player-development/update-progress/${data.progressId}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player-development/progress"] });
      toast({
        title: "Progress Updated",
        description: "Training progress has been recorded",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to update progress",
        variant: "destructive",
      });
    }
  });

  const handleGeneratePlan = (playerId: string, goals: string[]) => {
    generatePlanMutation.mutate({ playerId, sport: selectedSport, goals });
  };

  const handleCreateProtocol = (protocol: Partial<CoachProtocol>) => {
    createProtocolMutation.mutate(protocol);
  };

  const handleVetProtocol = (protocolId: string) => {
    vetProtocolMutation.mutate(protocolId);
  };

  const handleUpdateProgress = (progressId: string, updates: Partial<TrainingProgress>) => {
    updateProgressMutation.mutate({ progressId, updates });
  };

  const getDrillTypeColor = (type: string) => {
    switch (type) {
      case "skill": return "bg-blue-100 text-blue-800";
      case "fitness": return "bg-green-100 text-green-800";
      case "tactical": return "bg-purple-100 text-purple-800";
      case "mental": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical": return <Bell className="h-4 w-4 text-red-600" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "low": return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPlans = trainingPlans.filter((plan: TrainingPlan) => {
    const sportMatch = selectedSport === "all" || plan.sport.toLowerCase() === selectedSport.toLowerCase();
    const ageMatch = selectedAgeGroup === "all" || plan.personalizedFor.ageGroup === selectedAgeGroup;
    const playerMatch = selectedPlayer === "all" || plan.playerId === selectedPlayer;
    return sportMatch && ageMatch && playerMatch;
  });

  const filteredProgress = trainingProgress.filter((progress: TrainingProgress) => 
    selectedPlayer === "all" || progress.playerId === selectedPlayer
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Player Development
          </h1>
          <p className="text-gray-600">AI-driven personalized training and progress tracking</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button onClick={() => setShowCreatePlan(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
          <Button variant="outline" onClick={() => setShowCreateProtocol(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Protocol
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
                <p className="text-2xl font-bold text-gray-900">{filteredPlans.length}</p>
                <p className="text-xs text-gray-600">Active Plans</p>
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
                  {analytics?.averageAdherence || 0}%
                </p>
                <p className="text-xs text-gray-600">Avg Adherence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.averageImprovement || 0}%
                </p>
                <p className="text-xs text-gray-600">Avg Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {coachProtocols.filter((p: CoachProtocol) => p.vetted).length}
                </p>
                <p className="text-xs text-gray-600">Vetted Protocols</p>
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
            <span>Development Filters</span>
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
              <Label htmlFor="age-filter">Age Group</Label>
              <select
                id="age-filter"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="all">All Ages</option>
                {AGE_GROUPS.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="player-filter">Player</Label>
              <select
                id="player-filter"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="all">All Players</option>
                <option value="player-1">Alex Johnson</option>
                <option value="player-2">Sarah Wilson</option>
                <option value="player-3">Mike Rodriguez</option>
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
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Training Plans</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Protocols</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Training Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Personalized Training Plans
                <Badge className="bg-blue-100 text-blue-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Generated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {plansLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredPlans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No training plans available</p>
                      <p className="text-sm">Generate AI-powered plans based on player performance</p>
                    </div>
                  ) : (
                    filteredPlans.map((plan: TrainingPlan) => (
                      <div key={plan.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedPlan(plan)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-lg">{plan.title}</p>
                                {plan.aiGenerated && (
                                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                                {plan.vetted && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Vetted
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{plan.playerName} • {plan.position}</p>
                              <p className="text-sm text-gray-800 mb-3">{plan.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {plan.drills.length} drills
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {plan.schedule.frequency}x/week
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {plan.schedule.duration} weeks
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Created: {format(plan.createdAt, "MMM d")}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm">
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="p-2 bg-blue-50 rounded">
                            <p className="font-medium text-blue-800">Target Areas</p>
                            <p className="text-xs text-blue-600">{plan.personalizedFor.weakAreas.slice(0, 2).join(", ")}</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <p className="font-medium text-green-800">Strengths</p>
                            <p className="text-xs text-green-600">{plan.personalizedFor.strengths.slice(0, 2).join(", ")}</p>
                          </div>
                          <div className="p-2 bg-purple-50 rounded">
                            <p className="font-medium text-purple-800">Age Group</p>
                            <p className="text-xs text-purple-600">{plan.personalizedFor.ageGroup}</p>
                          </div>
                          <div className="p-2 bg-orange-50 rounded">
                            <p className="font-medium text-orange-800">Level</p>
                            <p className="text-xs text-orange-600 capitalize">{plan.personalizedFor.skillLevel}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-medium text-gray-700 mb-2">Drill Types:</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.drills.slice(0, 4).map((drill, index) => (
                              <Badge key={index} className={`text-xs ${getDrillTypeColor(drill.type)}`}>
                                {drill.name}
                              </Badge>
                            ))}
                            {plan.drills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{plan.drills.length - 4} more
                              </Badge>
                            )}
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

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {progressLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredProgress.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No progress data available</p>
                      <p className="text-sm">Progress will appear as players complete training sessions</p>
                    </div>
                  ) : (
                    filteredProgress.map((progress: TrainingProgress) => (
                      <div key={progress.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedProgress(progress)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Activity className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-lg">Session Progress</p>
                              <p className="text-sm text-gray-600">{format(progress.sessionDate, "MMM d, yyyy")}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{progress.completedDrills.length} drills completed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Star className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm">{progress.rating}/5 rating</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-2">
                              <p className="text-2xl font-bold text-green-600">{progress.adherence}%</p>
                              <p className="text-xs text-gray-600">Adherence</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          </div>
                        </div>

                        {progress.improvements.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            {progress.improvements.slice(0, 3).map((improvement, index) => (
                              <div key={index} className="p-2 bg-blue-50 rounded">
                                <p className="font-medium text-sm text-blue-800 capitalize">{improvement.metric}</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">{improvement.before}</span>
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-bold text-green-600">{improvement.after}</span>
                                  <span className="text-xs text-green-600">(+{improvement.improvement}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {progress.feedback && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-1">Player Feedback:</p>
                            <p className="text-sm text-gray-600 italic">"{progress.feedback}"</p>
                          </div>
                        )}

                        {progress.coachNotes && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Coach Notes:</p>
                            <p className="text-sm text-gray-600">{progress.coachNotes}</p>
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

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Development Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {insightsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : developmentInsights.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No development insights available</p>
                      <p className="text-sm">Insights will appear as AI analyzes player progress</p>
                    </div>
                  ) : (
                    developmentInsights.map((insight: DevelopmentInsight) => (
                      <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedInsight(insight)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            {getPriorityIcon(insight.priority)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{insight.playerName}</p>
                                <Badge className={`text-xs ${
                                  insight.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                                  insight.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {Math.round(insight.confidence * 100)}% confidence
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {insight.type.replace('_', ' ')}
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
                                Generated: {format(insight.timestamp, "MMM d, HH:mm")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!insight.addressed && (
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Address
                              </Button>
                            )}
                            {insight.addressed && (
                              <Badge className="bg-green-100 text-green-800">
                                Addressed
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                          {Object.entries(insight.dataPoints).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-bold text-blue-600">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                              <p className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                          ))}
                        </div>

                        {insight.recommendedActions.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">Recommended Actions:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {insight.recommendedActions.slice(0, 2).map((action, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{action}</span>
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

        {/* Protocols Tab */}
        <TabsContent value="protocols" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Coach-Vetted Training Protocols
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Research-Backed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {protocolsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : coachProtocols.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No protocols available</p>
                      <p className="text-sm">Add research-backed training protocols for review</p>
                    </div>
                  ) : (
                    coachProtocols.map((protocol: CoachProtocol) => (
                      <div key={protocol.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedProtocol(protocol)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-lg">{protocol.name}</p>
                                {protocol.vetted ? (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Vetted
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Review
                                  </Badge>
                                )}
                                <Badge className={`text-xs ${getIntensityColor(protocol.intensity)}`}>
                                  {protocol.intensity} intensity
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">by {protocol.coachName} • {protocol.sport}</p>
                              <p className="text-sm text-gray-800 mb-3">{protocol.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {protocol.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {protocol.duration} min
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {protocol.ageGroup}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Used {protocol.usageCount} times
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${
                                    i < Math.floor(protocol.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`} />
                                ))}
                                <span className="text-xs text-gray-600 ml-1">({protocol.rating})</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!protocol.vetted && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVetProtocol(protocol.id);
                                  }}
                                  disabled={vetProtocolMutation.isPending}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Vet
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div className="p-2 bg-blue-50 rounded">
                            <p className="font-medium text-blue-800">Equipment</p>
                            <p className="text-xs text-blue-600">{protocol.equipment.slice(0, 2).join(", ")}</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <p className="font-medium text-green-800">Safety</p>
                            <p className="text-xs text-green-600">{protocol.safetyGuidelines.length} guidelines</p>
                          </div>
                          <div className="p-2 bg-purple-50 rounded">
                            <p className="font-medium text-purple-800">Research</p>
                            <p className="text-xs text-purple-600">{protocol.researchReferences.length} references</p>
                          </div>
                        </div>

                        {protocol.tags.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">Tags:</p>
                            <div className="flex flex-wrap gap-1">
                              {protocol.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
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
              {/* Overview Stats */}
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
                      <BookOpen className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.activePlans || 0}</p>
                        <p className="text-xs text-gray-600">Active Plans</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageAdherence || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Adherence</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageImprovement || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Improvement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Player Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topImprovements?.map((improvement: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{improvement.name}</p>
                            <p className="text-sm text-gray-600">{improvement.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">+{improvement.improvement}%</p>
                          <p className="text-xs text-gray-600">{improvement.timeframe}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No improvement data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Protocol Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Effective Protocols</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.protocolUsage?.map((protocol: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">{protocol.name}</p>
                            <p className="text-sm text-gray-600">Used {protocol.usageCount} times</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${protocol.effectiveness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{protocol.effectiveness}%</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No protocol usage data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Development Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Development Analysis</CardTitle>
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
                      <p className="text-gray-500 text-center py-4">No development insights available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Training Plan Details Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="training-plan-description">
          <DialogHeader>
            <DialogTitle>Training Plan Details</DialogTitle>
          </DialogHeader>
          <div id="training-plan-description" className="space-y-6">
            {selectedPlan && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedPlan.title}</h3>
                    <p className="text-gray-600">{selectedPlan.playerName} • {selectedPlan.position}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedPlan.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedPlan.aiGenerated && (
                      <Badge className="bg-purple-100 text-purple-800">AI-Generated</Badge>
                    )}
                    {selectedPlan.vetted && (
                      <Badge className="bg-green-100 text-green-800">Vetted</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="font-bold text-2xl text-blue-600">{selectedPlan.drills.length}</p>
                    <p className="text-sm text-gray-600">Total Drills</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="font-bold text-2xl text-green-600">{selectedPlan.schedule.frequency}</p>
                    <p className="text-sm text-gray-600">Sessions/Week</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="font-bold text-2xl text-purple-600">{selectedPlan.schedule.duration}</p>
                    <p className="text-sm text-gray-600">Weeks</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="font-bold text-2xl text-orange-600">{selectedPlan.schedule.sessionLength}</p>
                    <p className="text-sm text-gray-600">Minutes/Session</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Training Drills</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedPlan.drills.map((drill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{drill.name}</p>
                            <p className="text-sm text-gray-600">{drill.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getDrillTypeColor(drill.type)} variant="outline">
                                {drill.type}
                              </Badge>
                              <Badge className={getIntensityColor(drill.intensity)} variant="outline">
                                {drill.intensity}
                              </Badge>
                              <span className="text-xs text-gray-500">{drill.duration} min</span>
                            </div>
                          </div>
                        </div>
                        {drill.videoUrl && (
                          <Button variant="outline" size="sm">
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Personalization Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Target Areas for Improvement</Label>
                      <ul className="text-sm text-gray-600 mt-1">
                        {selectedPlan.personalizedFor.weakAreas.map((area, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Target className="h-3 w-3 text-red-600" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Existing Strengths</Label>
                      <ul className="text-sm text-gray-600 mt-1">
                        {selectedPlan.personalizedFor.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Training Plan Dialog */}
      <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
        <DialogContent className="max-w-2xl" aria-describedby="create-plan-description">
          <DialogHeader>
            <DialogTitle>Generate AI Training Plan</DialogTitle>
          </DialogHeader>
          <div id="create-plan-description" className="space-y-4">
            <div>
              <Label htmlFor="player-select">Select Player</Label>
              <select id="player-select" className="w-full p-2 border rounded-md mt-1">
                <option value="player-1">Alex Johnson - Forward</option>
                <option value="player-2">Sarah Wilson - Midfielder</option>
                <option value="player-3">Mike Rodriguez - Goalkeeper</option>
              </select>
            </div>

            <div>
              <Label htmlFor="training-goals">Training Goals</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="speed" />
                  <Label htmlFor="speed" className="text-sm">Improve Speed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="passing" />
                  <Label htmlFor="passing" className="text-sm">Enhance Passing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="endurance" />
                  <Label htmlFor="endurance" className="text-sm">Build Endurance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="agility" />
                  <Label htmlFor="agility" className="text-sm">Increase Agility</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreatePlan(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  handleGeneratePlan("player-1", ["speed", "passing"]);
                  setShowCreatePlan(false);
                }}
                disabled={generatePlanMutation.isPending}
              >
                {generatePlanMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}