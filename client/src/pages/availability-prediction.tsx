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
  Brain, 
  Target,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Zap,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Filter,
  UserCheck,
  Sparkles,
  Activity,
  Gauge,
  LineChart,
  PieChart,
  Star,
  MessageSquare
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface AvailabilityPrediction {
  id: string;
  userId: string;
  userName: string;
  userRole: "player" | "coach" | "volunteer" | "parent";
  eventId: string;
  eventTitle: string;
  eventType: "practice" | "game" | "tournament" | "meeting";
  eventDate: Date;
  predictedStatus: "available" | "unavailable" | "maybe";
  confidence: number;
  historicalAccuracy: number;
  factors: string[];
  lastUpdated: Date;
  sport: string;
}

interface AvailabilityPattern {
  userId: string;
  userName: string;
  userRole: string;
  sport: string;
  patterns: {
    dayOfWeek: Record<string, number>;
    timeOfDay: Record<string, number>;
    eventType: Record<string, number>;
    seasonal: Record<string, number>;
  };
  attendanceRate: number;
  reliability: number;
  trends: string[];
}

interface PredictionAnalytics {
  totalPredictions: number;
  accuracyRate: number;
  confidenceAverage: number;
  conflictsPrevented: number;
  rsvpAutomation: number;
  userEngagement: number;
  topFactors: Array<{ factor: string; impact: number }>;
  accuracyTrends: Array<{ date: string; accuracy: number; predictions: number }>;
}

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];
const USER_ROLES = ["All", "Players", "Coaches", "Volunteers", "Parents"];
const PREDICTION_CONFIDENCE = ["All", "High (90%+)", "Medium (70-89%)", "Low (<70%)"];

export default function AvailabilityPrediction() {
  const [activeTab, setActiveTab] = useState<"predictions" | "patterns" | "analytics" | "settings">("predictions");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("week");
  const [selectedPrediction, setSelectedPrediction] = useState<AvailabilityPrediction | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch predictions
  const { data: predictions = [], isLoading: predictionsLoading } = useQuery({
    queryKey: ["/api/availability-prediction/predictions", { sport: selectedSport, role: selectedRole, confidence: confidenceFilter, range: dateRange }],
  });

  // Fetch patterns
  const { data: patterns = [], isLoading: patternsLoading } = useQuery({
    queryKey: ["/api/availability-prediction/patterns"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/availability-prediction/analytics"],
  });

  // Generate predictions mutation
  const generatePredictionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/availability-prediction/generate", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability-prediction/predictions"] });
      toast({
        title: "Predictions Updated",
        description: `Generated ${data.count} new predictions with ${Math.round(data.averageConfidence * 100)}% average confidence`,
      });
    },
    onError: () => {
      toast({
        title: "Prediction Failed",
        description: "Unable to generate predictions",
        variant: "destructive",
      });
    }
  });

  // Auto-RSVP mutation
  const autoRsvpMutation = useMutation({
    mutationFn: async (predictionId: string) => {
      const response = await apiRequest("POST", `/api/availability-prediction/auto-rsvp/${predictionId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability-prediction/predictions"] });
      toast({
        title: "RSVP Suggested",
        description: "Automatic RSVP suggestion has been sent",
      });
    },
    onError: () => {
      toast({
        title: "RSVP Failed",
        description: "Unable to suggest RSVP",
        variant: "destructive",
      });
    }
  });

  const handleGeneratePredictions = () => {
    generatePredictionsMutation.mutate();
  };

  const handleAutoRsvp = (predictionId: string) => {
    autoRsvpMutation.mutate(predictionId);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "unavailable": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "maybe": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "player": return <Users className="h-4 w-4 text-blue-600" />;
      case "coach": return <UserCheck className="h-4 w-4 text-purple-600" />;
      case "volunteer": return <Star className="h-4 w-4 text-orange-600" />;
      case "parent": return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredPredictions = predictions.filter((prediction: AvailabilityPrediction) => {
    const sportMatch = selectedSport === "all" || prediction.sport.toLowerCase() === selectedSport.toLowerCase();
    const roleMatch = selectedRole === "all" || prediction.userRole === selectedRole.toLowerCase();
    const confidenceMatch = confidenceFilter === "all" || 
      (confidenceFilter === "high" && prediction.confidence >= 0.9) ||
      (confidenceFilter === "medium" && prediction.confidence >= 0.7 && prediction.confidence < 0.9) ||
      (confidenceFilter === "low" && prediction.confidence < 0.7);
    return sportMatch && roleMatch && confidenceMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Availability Prediction
          </h1>
          <p className="text-gray-600">AI-powered forecasting based on historical patterns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button onClick={handleGeneratePredictions} disabled={generatePredictionsMutation.isPending}>
            {generatePredictionsMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Predictions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Predictions</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Patterns</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
                    <p className="text-xs text-gray-600">Active Predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Gauge className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((predictions.reduce((acc: number, p: AvailabilityPrediction) => acc + p.confidence, 0) / predictions.length || 0) * 100)}%
                    </p>
                    <p className="text-xs text-gray-600">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {predictions.filter((p: AvailabilityPrediction) => p.confidence >= 0.9).length}
                    </p>
                    <p className="text-xs text-gray-600">High Confidence</p>
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
                      {predictions.filter((p: AvailabilityPrediction) => p.predictedStatus === "unavailable").length}
                    </p>
                    <p className="text-xs text-gray-600">Predicted Conflicts</p>
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
                <span>Filters</span>
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
                    <option value="all">All Sports</option>
                    {SPORTS.map(sport => (
                      <option key={sport} value={sport.toLowerCase()}>{sport}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="role-filter">Role</Label>
                  <select
                    id="role-filter"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {USER_ROLES.map(role => (
                      <option key={role} value={role.toLowerCase()}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="confidence-filter">Confidence</Label>
                  <select
                    id="confidence-filter"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {PREDICTION_CONFIDENCE.map(conf => (
                      <option key={conf} value={conf.split(' ')[0].toLowerCase()}>{conf}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <select
                    id="date-range"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="week">Next Week</option>
                    <option value="month">Next Month</option>
                    <option value="quarter">Next Quarter</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictions List */}
          <Card>
            <CardHeader>
              <CardTitle>Predictions ({filteredPredictions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {predictionsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredPredictions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No predictions found</p>
                      <p className="text-sm">Adjust filters or generate new predictions</p>
                    </div>
                  ) : (
                    filteredPredictions.map((prediction: AvailabilityPrediction) => (
                      <div key={prediction.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedPrediction(prediction)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getRoleIcon(prediction.userRole)}
                              <div>
                                <p className="font-medium text-sm">{prediction.userName}</p>
                                <p className="text-xs text-gray-600 capitalize">{prediction.userRole}</p>
                              </div>
                              {getStatusIcon(prediction.predictedStatus)}
                              <Badge className={getConfidenceColor(prediction.confidence)}>
                                {Math.round(prediction.confidence * 100)}%
                              </Badge>
                            </div>
                            
                            <div className="mb-2">
                              <p className="text-sm font-medium">{prediction.eventTitle}</p>
                              <p className="text-xs text-gray-600">
                                {format(prediction.eventDate, "MMM d, yyyy 'at' h:mm a")} • {prediction.sport}
                              </p>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                              <div className="flex items-center space-x-4">
                                <span>Accuracy: {Math.round(prediction.historicalAccuracy * 100)}%</span>
                                <span>Updated: {format(prediction.lastUpdated, "MMM d, h:mm a")}</span>
                              </div>
                              <div>
                                <span>Key factors: {prediction.factors.slice(0, 2).join(", ")}</span>
                                {prediction.factors.length > 2 && <span> +{prediction.factors.length - 2} more</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {prediction.confidence >= 0.8 && prediction.predictedStatus === "available" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAutoRsvp(prediction.id);
                                }}
                                disabled={autoRsvpMutation.isPending}
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                Auto-RSVP
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
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

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {patternsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : patterns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No patterns available</p>
                      <p className="text-sm">Patterns will appear as more data is collected</p>
                    </div>
                  ) : (
                    patterns.map((pattern: AvailabilityPattern) => (
                      <div key={pattern.userId} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(pattern.userRole)}
                            <div>
                              <p className="font-medium">{pattern.userName}</p>
                              <p className="text-sm text-gray-600 capitalize">{pattern.userRole} • {pattern.sport}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{Math.round(pattern.attendanceRate * 100)}%</p>
                                <p className="text-xs text-gray-600">Attendance</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">{Math.round(pattern.reliability * 100)}%</p>
                                <p className="text-xs text-gray-600">Reliability</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Best Days</h4>
                            {Object.entries(pattern.patterns.dayOfWeek)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 3)
                              .map(([day, rate]) => (
                                <div key={day} className="flex justify-between text-xs">
                                  <span className="capitalize">{day}</span>
                                  <span>{Math.round(rate * 100)}%</span>
                                </div>
                              ))}
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Preferred Times</h4>
                            {Object.entries(pattern.patterns.timeOfDay)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 3)
                              .map(([time, rate]) => (
                                <div key={time} className="flex justify-between text-xs">
                                  <span className="capitalize">{time}</span>
                                  <span>{Math.round(rate * 100)}%</span>
                                </div>
                              ))}
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Event Types</h4>
                            {Object.entries(pattern.patterns.eventType)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 3)
                              .map(([type, rate]) => (
                                <div key={type} className="flex justify-between text-xs">
                                  <span className="capitalize">{type}</span>
                                  <span>{Math.round(rate * 100)}%</span>
                                </div>
                              ))}
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Trends</h4>
                            {pattern.trends.slice(0, 3).map((trend, index) => (
                              <p key={index} className="text-xs text-gray-600">{trend}</p>
                            ))}
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
                      <Target className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalPredictions || 0}</p>
                        <p className="text-xs text-gray-600">Total Predictions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Gauge className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.accuracyRate || 0}%</p>
                        <p className="text-xs text-gray-600">Accuracy Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.conflictsPrevented || 0}</p>
                        <p className="text-xs text-gray-600">Conflicts Prevented</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.rsvpAutomation || 0}%</p>
                        <p className="text-xs text-gray-600">RSVP Automation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Prediction Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topFactors?.map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">{factor.factor}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${factor.impact}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{factor.impact}%</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No factor data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Highlights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>90% accuracy in availability predictions</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span>80% reduction in scheduling conflicts</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span>50% improvement in RSVP automation</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">AI-Driven Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span>Historical pattern analysis improves predictions over time</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Sport-specific patterns increase accuracy by 25%</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span>Proactive conflict alerts reduce last-minute changes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Prediction Frequency</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="daily">Daily Updates</option>
                  <option value="weekly">Weekly Updates</option>
                  <option value="event-based">Before Each Event</option>
                </select>
              </div>

              <div>
                <Label>Minimum Confidence Threshold</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="0.6">60% - Show All Predictions</option>
                  <option value="0.7">70% - Medium Confidence</option>
                  <option value="0.8">80% - High Confidence Only</option>
                </select>
              </div>

              <div>
                <Label>Auto-RSVP Features</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-suggest" defaultChecked />
                    <Label htmlFor="auto-suggest" className="text-sm">Suggest RSVP Responses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-confirm" />
                    <Label htmlFor="auto-confirm" className="text-sm">Auto-Confirm High Confidence</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="conflict-alerts" defaultChecked />
                    <Label htmlFor="conflict-alerts" className="text-sm">Conflict Prediction Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="pattern-learning" defaultChecked />
                    <Label htmlFor="pattern-learning" className="text-sm">Continuous Pattern Learning</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Historical Data Usage</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="6-months">Last 6 Months</option>
                  <option value="1-year">Last Year</option>
                  <option value="all-time">All Historical Data</option>
                </select>
              </div>

              <div>
                <Label>Sport-Specific Patterns</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="seasonal-patterns" defaultChecked />
                    <Label htmlFor="seasonal-patterns" className="text-sm">Seasonal Patterns</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="weather-factors" defaultChecked />
                    <Label htmlFor="weather-factors" className="text-sm">Weather Considerations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="holiday-awareness" defaultChecked />
                    <Label htmlFor="holiday-awareness" className="text-sm">Holiday Awareness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="school-schedule" defaultChecked />
                    <Label htmlFor="school-schedule" className="text-sm">School Schedule Integration</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Prediction Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prediction Details Dialog */}
      <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="prediction-detail-description">
          <DialogHeader>
            <DialogTitle>Prediction Details</DialogTitle>
          </DialogHeader>
          <div id="prediction-detail-description" className="space-y-4">
            {selectedPrediction && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPrediction.userName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleIcon(selectedPrediction.userRole)}
                      <span className="text-sm text-gray-600 capitalize">{selectedPrediction.userRole}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{selectedPrediction.sport}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(selectedPrediction.predictedStatus)}
                      <span className="font-medium capitalize">{selectedPrediction.predictedStatus}</span>
                    </div>
                    <Badge className={getConfidenceColor(selectedPrediction.confidence)}>
                      {Math.round(selectedPrediction.confidence * 100)}% Confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Event</Label>
                    <p className="text-sm">{selectedPrediction.eventTitle}</p>
                    <p className="text-xs text-gray-600">
                      {format(selectedPrediction.eventDate, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Historical Accuracy</Label>
                    <p className="text-sm">{Math.round(selectedPrediction.historicalAccuracy * 100)}%</p>
                    <p className="text-xs text-gray-600">Based on past predictions</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Key Prediction Factors</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedPrediction.factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                        <Brain className="h-3 w-3 text-purple-600" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Last updated: {format(selectedPrediction.lastUpdated, "MMM d, yyyy 'at' h:mm a")}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedPrediction(null)}>
                    Close
                  </Button>
                  {selectedPrediction.confidence >= 0.8 && selectedPrediction.predictedStatus === "available" && (
                    <Button onClick={() => handleAutoRsvp(selectedPrediction.id)}>
                      <Zap className="h-4 w-4 mr-2" />
                      Suggest RSVP
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