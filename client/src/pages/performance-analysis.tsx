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
  Brain, 
  Activity, 
  Heart,
  Target,
  Zap,
  Eye,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Clock,
  Gauge,
  LineChart,
  BarChart3,
  MapPin,
  Video,
  Camera,
  Smartphone,
  Wifi,
  WifiOff,
  Sparkles,
  Star,
  Award,
  Timer,
  Thermometer,
  Battery,
  Shield,
  MessageSquare,
  Bell
} from "lucide-react";
import { format, subMinutes } from "date-fns";

interface RealTimeMetrics {
  playerId: string;
  playerName: string;
  position: string;
  teamId: string;
  timestamp: Date;
  metrics: {
    physical: {
      sprintSpeed: number; // m/s
      distanceCovered: number; // km
      highIntensityRuns: number;
      maxSpeed: number;
      acceleration: number;
    };
    biometric: {
      heartRate: number; // bpm
      heartRateVariability: number;
      fatigueIndex: number; // 0-1
      loadIndex: number;
      recoveryRate: number;
    };
    technical: {
      passCompletion: number; // %
      shotAccuracy: number; // %
      touchesPerMinute: number;
      dribbleSuccess: number; // %
      tackleSuccess: number; // %
    };
    tactical: {
      positionAccuracy: number; // %
      zoneCoverage: number; // %
      pressureApplication: number;
      teamworkScore: number;
      decisionMaking: number;
    };
    youthSpecific: {
      effortScore: number; // age-adjusted
      improvementRate: number;
      confidenceLevel: number;
      learningProgress: number;
      socialEngagement: number;
    };
  };
  alerts: Array<{
    type: "warning" | "info" | "success" | "danger";
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    timestamp: Date;
  }>;
}

interface PredictiveInsight {
  id: string;
  playerId: string;
  playerName: string;
  type: "substitution" | "tactical" | "health" | "performance";
  recommendation: string;
  confidence: number;
  impact: "low" | "medium" | "high";
  reasoning: string[];
  dataPoints: Record<string, number>;
  timestamp: Date;
  actionTaken?: boolean;
}

interface TacticalAnalysis {
  teamId: string;
  teamName: string;
  formation: string;
  possession: number;
  heatMap: Array<{
    playerId: string;
    x: number;
    y: number;
    intensity: number;
  }>;
  zoneCoverage: Record<string, number>;
  passingNetworks: Array<{
    from: string;
    to: string;
    frequency: number;
    accuracy: number;
  }>;
  pressureZones: Array<{
    zone: string;
    intensity: number;
    effectiveness: number;
  }>;
  realTimeScore: number;
}

interface BiometricAlert {
  id: string;
  playerId: string;
  playerName: string;
  alertType: "fatigue" | "injury_risk" | "overexertion" | "dehydration" | "recovery_needed";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  recommendations: string[];
  vitals: {
    heartRate: number;
    fatigueLevel: number;
    hydrationLevel: number;
    temperatureIndex: number;
  };
  timestamp: Date;
  acknowledged?: boolean;
}

interface PerformanceAnalytics {
  totalPlayers: number;
  activeSession: boolean;
  sessionDuration: number;
  averageMetrics: {
    heartRate: number;
    fatigueLevel: number;
    performanceScore: number;
    engagementLevel: number;
  };
  topPerformers: Array<{
    playerId: string;
    name: string;
    metric: string;
    value: number;
    percentile: number;
  }>;
  insights: Array<{
    category: string;
    insight: string;
    confidence: number;
    impact: string;
  }>;
  trends: {
    performance: "improving" | "declining" | "stable";
    fatigue: "increasing" | "decreasing" | "stable";
    engagement: "high" | "medium" | "low";
  };
}

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];
const METRIC_CATEGORIES = ["Physical", "Biometric", "Technical", "Tactical", "Youth-Specific"];
const ALERT_TYPES = ["All", "Performance", "Health", "Tactical", "Critical"];

export default function PerformanceAnalysis() {
  const [activeTab, setActiveTab] = useState<"realtime" | "insights" | "tactical" | "biometric" | "analytics">("realtime");
  const [selectedSport, setSelectedSport] = useState<string>("soccer");
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>("all");
  const [alertFilter, setAlertFilter] = useState<string>("all");
  const [isLiveSession, setIsLiveSession] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<RealTimeMetrics | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<PredictiveInsight | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<BiometricAlert | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real-time metrics
  const { data: realTimeMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/performance-analysis/realtime", { sport: selectedSport, category: selectedMetricCategory }],
    refetchInterval: isLiveSession ? 5000 : false,
  });

  // Fetch predictive insights
  const { data: predictiveInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/performance-analysis/insights", { sport: selectedSport }],
    refetchInterval: isLiveSession ? 10000 : false,
  });

  // Fetch tactical analysis
  const { data: tacticalAnalysis, isLoading: tacticalLoading } = useQuery({
    queryKey: ["/api/performance-analysis/tactical", { sport: selectedSport }],
    refetchInterval: isLiveSession ? 5000 : false,
  });

  // Fetch biometric alerts
  const { data: biometricAlerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/performance-analysis/biometric-alerts", { filter: alertFilter }],
    refetchInterval: isLiveSession ? 3000 : false,
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/performance-analysis/analytics"],
    refetchInterval: isLiveSession ? 15000 : false,
  });

  // Start/Stop live session mutation
  const toggleSessionMutation = useMutation({
    mutationFn: async (action: "start" | "stop") => {
      const response = await apiRequest("POST", `/api/performance-analysis/session/${action}`, { sport: selectedSport });
      return response.json();
    },
    onSuccess: (data, action) => {
      setIsLiveSession(action === "start");
      queryClient.invalidateQueries({ queryKey: ["/api/performance-analysis"] });
      toast({
        title: action === "start" ? "Live Session Started" : "Live Session Stopped",
        description: action === "start" ? "Real-time analysis is now active" : "Session data has been saved",
      });
    },
    onError: () => {
      toast({
        title: "Session Error",
        description: "Unable to toggle live session",
        variant: "destructive",
      });
    }
  });

  // Apply insight recommendation mutation
  const applyInsightMutation = useMutation({
    mutationFn: async (insightId: string) => {
      const response = await apiRequest("POST", `/api/performance-analysis/apply-insight/${insightId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance-analysis/insights"] });
      toast({
        title: "Recommendation Applied",
        description: "AI insight has been implemented",
      });
    },
    onError: () => {
      toast({
        title: "Application Failed",
        description: "Unable to apply recommendation",
        variant: "destructive",
      });
    }
  });

  // Acknowledge alert mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("POST", `/api/performance-analysis/acknowledge-alert/${alertId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance-analysis/biometric-alerts"] });
      toast({
        title: "Alert Acknowledged",
        description: "Biometric alert has been acknowledged",
      });
    },
    onError: () => {
      toast({
        title: "Acknowledgment Failed",
        description: "Unable to acknowledge alert",
        variant: "destructive",
      });
    }
  });

  const handleToggleSession = (action: "start" | "stop") => {
    toggleSessionMutation.mutate(action);
  };

  const handleApplyInsight = (insightId: string) => {
    applyInsightMutation.mutate(insightId);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlertMutation.mutate(alertId);
  };

  const getMetricColor = (value: number, type: string) => {
    if (type === "fatigue" || type === "alertLevel") {
      if (value >= 80) return "text-red-600";
      if (value >= 60) return "text-yellow-600";
      return "text-green-600";
    }
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "low": return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "substitution": return <Users className="h-4 w-4 text-blue-600" />;
      case "tactical": return <Target className="h-4 w-4 text-purple-600" />;
      case "health": return <Heart className="h-4 w-4 text-red-600" />;
      case "performance": return <TrendingUp className="h-4 w-4 text-green-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredMetrics = realTimeMetrics.filter((metric: RealTimeMetrics) => 
    selectedMetricCategory === "all" || 
    Object.keys(metric.metrics).some(category => 
      category.toLowerCase().includes(selectedMetricCategory.toLowerCase())
    )
  );

  const filteredAlerts = biometricAlerts.filter((alert: BiometricAlert) => 
    alertFilter === "all" || alert.alertType.toLowerCase().includes(alertFilter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Performance Analysis
          </h1>
          <p className="text-gray-600">Real-time insights and predictive analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLiveSession ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">
              {isLiveSession ? 'Live' : 'Offline'}
            </span>
          </div>
          <Button 
            onClick={() => handleToggleSession(isLiveSession ? "stop" : "start")} 
            disabled={toggleSessionMutation.isPending}
            variant={isLiveSession ? "destructive" : "default"}
          >
            {toggleSessionMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {isLiveSession ? "Stopping..." : "Starting..."}
              </>
            ) : (
              <>
                {isLiveSession ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isLiveSession ? "Stop Session" : "Start Live Analysis"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{filteredMetrics.length}</p>
                <p className="text-xs text-gray-600">Active Players</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredMetrics.length > 0 ? Math.round(filteredMetrics.reduce((acc: number, m: RealTimeMetrics) => acc + m.metrics.biometric.heartRate, 0) / filteredMetrics.length) : 0}
                </p>
                <p className="text-xs text-gray-600">Avg Heart Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {predictiveInsights.filter((i: PredictiveInsight) => i.confidence >= 0.8).length}
                </p>
                <p className="text-xs text-gray-600">High Confidence Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAlerts.filter((a: BiometricAlert) => a.severity === "high" || a.severity === "critical").length}
                </p>
                <p className="text-xs text-gray-600">Critical Alerts</p>
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
                  {analytics?.averageMetrics?.performanceScore || 0}%
                </p>
                <p className="text-xs text-gray-600">Performance Score</p>
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
            <span>Analysis Filters</span>
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
                {SPORTS.map(sport => (
                  <option key={sport} value={sport.toLowerCase()}>{sport}</option>
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
              <Label htmlFor="alert-filter">Alert Type</Label>
              <select
                id="alert-filter"
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {ALERT_TYPES.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
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
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Real-Time</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="tactical" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Tactical</span>
          </TabsTrigger>
          <TabsTrigger value="biometric" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Biometric</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Real-Time Metrics Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Real-Time Player Metrics
                {isLiveSession && (
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Updates
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {metricsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredMetrics.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No real-time data available</p>
                      <p className="text-sm">Start a live session to see player metrics</p>
                    </div>
                  ) : (
                    filteredMetrics.map((player: RealTimeMetrics) => (
                      <div key={player.playerId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedPlayer(player)}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-blue-600">{player.playerName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-lg">{player.playerName}</p>
                              <p className="text-sm text-gray-600">{player.position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Updated: {format(player.timestamp, "HH:mm:ss")}</p>
                            {player.alerts.length > 0 && (
                              <Badge variant="destructive" className="mt-1">
                                {player.alerts.length} Alert{player.alerts.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="font-bold text-blue-600">{player.metrics.physical.sprintSpeed.toFixed(1)}</p>
                            <p className="text-xs text-gray-600">Speed (m/s)</p>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded">
                            <p className={`font-bold ${getMetricColor(player.metrics.biometric.heartRate, "heartRate")}`}>
                              {player.metrics.biometric.heartRate}
                            </p>
                            <p className="text-xs text-gray-600">Heart Rate</p>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded">
                            <p className={`font-bold ${getMetricColor(player.metrics.biometric.fatigueIndex * 100, "fatigue")}`}>
                              {Math.round(player.metrics.biometric.fatigueIndex * 100)}%
                            </p>
                            <p className="text-xs text-gray-600">Fatigue</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="font-bold text-green-600">{player.metrics.technical.passCompletion.toFixed(1)}%</p>
                            <p className="text-xs text-gray-600">Pass Success</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="font-bold text-purple-600">{player.metrics.youthSpecific.effortScore.toFixed(1)}</p>
                            <p className="text-xs text-gray-600">Effort Score</p>
                          </div>
                        </div>

                        {player.alerts.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">Active Alerts:</p>
                            <div className="flex flex-wrap gap-2">
                              {player.alerts.slice(0, 3).map((alert, index) => (
                                <Badge key={index} variant={alert.type === "danger" ? "destructive" : "secondary"} className="text-xs">
                                  {alert.message}
                                </Badge>
                              ))}
                              {player.alerts.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{player.alerts.length - 3} more
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

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {insightsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : predictiveInsights.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No AI insights available</p>
                      <p className="text-sm">Insights will appear during live sessions</p>
                    </div>
                  ) : (
                    predictiveInsights.map((insight: PredictiveInsight) => (
                      <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedInsight(insight)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            {getInsightIcon(insight.type)}
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
                                  {insight.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-800 mb-2">{insight.recommendation}</p>
                              <div className="text-xs text-gray-600">
                                <p>Impact: <span className="capitalize font-medium">{insight.impact}</span></p>
                                <p>Generated: {format(insight.timestamp, "HH:mm:ss")}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!insight.actionTaken && insight.confidence >= 0.7 && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApplyInsight(insight.id);
                                }}
                                disabled={applyInsightMutation.isPending}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Apply
                              </Button>
                            )}
                            {insight.actionTaken && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Applied
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {Object.entries(insight.dataPoints).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-bold text-blue-600">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                              <p className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                          ))}
                        </div>

                        {insight.reasoning.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">AI Reasoning:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {insight.reasoning.slice(0, 2).map((reason, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{reason}</span>
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

        {/* Tactical Analysis Tab */}
        <TabsContent value="tactical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Formation & Positioning</CardTitle>
              </CardHeader>
              <CardContent>
                {tacticalLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : tacticalAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="font-bold text-2xl text-blue-600">{tacticalAnalysis.possession}%</p>
                        <p className="text-sm text-gray-600">Possession</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="font-bold text-2xl text-green-600">{tacticalAnalysis.realTimeScore.toFixed(1)}</p>
                        <p className="text-sm text-gray-600">Tactical Score</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Formation: {tacticalAnalysis.formation}</h4>
                      <div className="h-64 bg-green-100 rounded-lg relative border-2 border-green-300">
                        {/* Soccer field representation */}
                        <div className="absolute inset-4 border border-white rounded">
                          {/* Center circle */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white rounded-full"></div>
                          {/* Goal areas */}
                          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-20 border border-white border-l-0"></div>
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-20 border border-white border-r-0"></div>
                          
                          {/* Player positions */}
                          {tacticalAnalysis.heatMap.map((position, index) => (
                            <div
                              key={index}
                              className="absolute w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                opacity: position.intensity
                              }}
                              title={position.playerId}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tactical data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zone Coverage & Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                {tacticalAnalysis ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Zone Coverage</h4>
                      <div className="space-y-2">
                        {Object.entries(tacticalAnalysis.zoneCoverage).map(([zone, coverage]) => (
                          <div key={zone} className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{zone}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${coverage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-10">{coverage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Pressure Zones</h4>
                      <div className="space-y-3">
                        {tacticalAnalysis.pressureZones.map((zone, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{zone.zone}</span>
                              <Badge className={zone.effectiveness >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {zone.effectiveness}% effective
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${zone.intensity}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No zone data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Biometric Alerts Tab */}
        <TabsContent value="biometric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health & Safety Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {alertsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No biometric alerts</p>
                      <p className="text-sm">All players are within safe parameters</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert: BiometricAlert) => (
                      <div key={alert.id} className={`border rounded-lg p-4 ${
                        alert.severity === "critical" ? "border-red-200 bg-red-50" :
                        alert.severity === "high" ? "border-orange-200 bg-orange-50" :
                        alert.severity === "medium" ? "border-yellow-200 bg-yellow-50" :
                        "border-blue-200 bg-blue-50"
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.severity)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{alert.playerName}</p>
                                <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"} className="text-xs capitalize">
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {alert.alertType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-800 mb-2">{alert.message}</p>
                              <p className="text-xs text-gray-600">
                                Alert time: {format(alert.timestamp, "HH:mm:ss")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant={alert.severity === "critical" ? "destructive" : "outline"}
                                onClick={() => handleAcknowledgeAlert(alert.id)}
                                disabled={acknowledgeAlertMutation.isPending}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            {alert.acknowledged && (
                              <Badge className="bg-green-100 text-green-800">
                                Acknowledged
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-2 bg-white rounded border">
                            <p className={`font-bold ${getMetricColor(alert.vitals.heartRate, "heartRate")}`}>
                              {alert.vitals.heartRate}
                            </p>
                            <p className="text-xs text-gray-600">Heart Rate</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <p className={`font-bold ${getMetricColor(alert.vitals.fatigueLevel, "fatigue")}`}>
                              {alert.vitals.fatigueLevel}%
                            </p>
                            <p className="text-xs text-gray-600">Fatigue</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <p className="font-bold text-blue-600">{alert.vitals.hydrationLevel}%</p>
                            <p className="text-xs text-gray-600">Hydration</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <p className="font-bold text-orange-600">{alert.vitals.temperatureIndex}°C</p>
                            <p className="text-xs text-gray-600">Body Temp</p>
                          </div>
                        </div>

                        {alert.recommendations.length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Recommendations:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {alert.recommendations.map((rec, index) => (
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Session Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.sessionDuration || 0}min</p>
                        <p className="text-xs text-gray-600">Session Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Heart className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageMetrics?.heartRate || 0}</p>
                        <p className="text-xs text-gray-600">Avg Heart Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Battery className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageMetrics?.fatigueLevel || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Fatigue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageMetrics?.engagementLevel || 0}%</p>
                        <p className="text-xs text-gray-600">Engagement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Top Performers</CardTitle>
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
                          <p className="text-xs text-gray-600">{performer.percentile}th percentile</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No performance data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.insights?.map((insight: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="font-medium capitalize">{insight.category}</span>
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
                      <p className="text-gray-500 text-center py-4">No insights generated yet</p>
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
        <DialogContent className="max-w-4xl" aria-describedby="player-metrics-description">
          <DialogHeader>
            <DialogTitle>Real-Time Player Metrics</DialogTitle>
          </DialogHeader>
          <div id="player-metrics-description" className="space-y-6">
            {selectedPlayer && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-2xl text-blue-600">{selectedPlayer.playerName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedPlayer.playerName}</h3>
                      <p className="text-gray-600">{selectedPlayer.position}</p>
                      <p className="text-sm text-gray-500">Last updated: {format(selectedPlayer.timestamp, "HH:mm:ss")}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-blue-600">Physical Metrics</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedPlayer.metrics.physical).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold text-blue-600">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 text-red-600">Biometric Data</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedPlayer.metrics.biometric).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className={`font-bold ${getMetricColor(typeof value === 'number' ? value : 0, key)}`}>
                            {typeof value === 'number' ? (key === 'fatigueIndex' ? (value * 100).toFixed(1) + '%' : value.toFixed(1)) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 text-green-600">Technical Skills</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedPlayer.metrics.technical).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold text-green-600">{typeof value === 'number' ? value.toFixed(1) + '%' : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedPlayer.alerts.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 text-orange-600">Active Alerts</h4>
                    <div className="space-y-2">
                      {selectedPlayer.alerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded border-l-4 ${
                          alert.type === "danger" ? "border-red-500 bg-red-50" :
                          alert.type === "warning" ? "border-yellow-500 bg-yellow-50" :
                          alert.type === "info" ? "border-blue-500 bg-blue-50" :
                          "border-green-500 bg-green-50"
                        }`}>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{alert.message}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {alert.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {format(alert.timestamp, "HH:mm:ss")}
                          </p>
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

      {/* Insight Details Dialog */}
      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-3xl" aria-describedby="insight-detail-description">
          <DialogHeader>
            <DialogTitle>AI Insight Details</DialogTitle>
          </DialogHeader>
          <div id="insight-detail-description" className="space-y-4">
            {selectedInsight && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(selectedInsight.type)}
                    <div>
                      <h3 className="text-lg font-bold">{selectedInsight.playerName}</h3>
                      <p className="text-gray-600 capitalize">{selectedInsight.type} Recommendation</p>
                      <Badge className={`mt-1 ${
                        selectedInsight.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                        selectedInsight.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(selectedInsight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Generated: {format(selectedInsight.timestamp, "HH:mm:ss")}</p>
                    <p className="text-sm font-medium capitalize">Impact: {selectedInsight.impact}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-2">Recommendation</h4>
                  <p className="text-gray-800">{selectedInsight.recommendation}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Supporting Data Points</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(selectedInsight.dataPoints).map(([key, value]) => (
                      <div key={key} className="text-center p-3 border rounded">
                        <p className="font-bold text-lg text-blue-600">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                        <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">AI Reasoning</h4>
                  <ul className="space-y-2">
                    {selectedInsight.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                        <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedInsight(null)}>
                    Close
                  </Button>
                  {!selectedInsight.actionTaken && selectedInsight.confidence >= 0.7 && (
                    <Button onClick={() => handleApplyInsight(selectedInsight.id)}>
                      Apply Recommendation
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}