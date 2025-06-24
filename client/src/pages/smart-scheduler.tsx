import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Users,
  Plus,
  Edit,
  Trash2,
  Zap,
  Brain,
  Target,
  BarChart3,
  Filter,
  Search,
  Download,
  Settings,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Bell,
  X,
  Eye,
  UserCheck,
  Building2
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";

interface Event {
  id: string;
  title: string;
  type: "practice" | "game" | "tournament" | "meeting";
  date: Date;
  startTime: string;
  endTime: string;
  facility: string;
  facilitiyId: string;
  team: string;
  teamId: string;
  coach: string;
  coachId: string;
  sport: string;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  rsvpCount: number;
  totalPlayers: number;
  conflicts: Conflict[];
  isRecurring: boolean;
  description?: string;
}

interface Conflict {
  id: string;
  type: "double_booking" | "facility_unavailable" | "coach_conflict" | "player_conflict" | "resource_conflict";
  severity: "high" | "medium" | "low";
  description: string;
  affectedEntities: string[];
  suggestedResolution?: string;
  autoResolvable: boolean;
}

interface Availability {
  userId: string;
  name: string;
  role: "player" | "coach" | "volunteer";
  availableSlots: Array<{ day: string; startTime: string; endTime: string }>;
  preferences: string;
  constraints: string;
}

interface SchedulerAnalytics {
  totalEvents: number;
  conflictRate: number;
  resolutionRate: number;
  avgRsvpRate: number;
  facilityUtilization: number;
  topConflictTypes: Array<{ type: string; count: number }>;
  optimizationSavings: number;
}

const EVENT_TYPES = [
  { value: "practice", label: "Practice", color: "bg-blue-100 text-blue-800" },
  { value: "game", label: "Game", color: "bg-green-100 text-green-800" },
  { value: "tournament", label: "Tournament", color: "bg-purple-100 text-purple-800" },
  { value: "meeting", label: "Meeting", color: "bg-gray-100 text-gray-800" }
];

const SPORTS = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];

export default function SmartScheduler() {
  const [activeTab, setActiveTab] = useState<"calendar" | "conflicts" | "optimization" | "analytics">("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [conflictFilter, setConflictFilter] = useState<string>("all");
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "practice",
    date: "",
    startTime: "",
    endTime: "",
    facility: "",
    team: "",
    sport: "",
    description: "",
    isRecurring: false
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events
  const { data: scheduledEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/scheduler/events", { date: selectedDate, view: viewMode }],
  });

  // Fetch conflicts
  const { data: conflicts = [], isLoading: conflictsLoading } = useQuery({
    queryKey: ["/api/scheduler/conflicts"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/scheduler/analytics"],
  });

  // Fetch availability data
  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ["/api/scheduler/availability"],
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/scheduler/events", eventData);
      return response.json();
    },
    onSuccess: (data) => {
      setEvents(prev => [...prev, data]);
      setIsCreateEventOpen(false);
      setNewEvent({
        title: "",
        type: "practice",
        date: "",
        startTime: "",
        endTime: "",
        facility: "",
        team: "",
        sport: "",
        description: "",
        isRecurring: false
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/events"] });
      toast({
        title: "Event Created",
        description: data.conflicts?.length > 0 
          ? `Event created with ${data.conflicts.length} potential conflicts`
          : "Event created successfully",
        variant: data.conflicts?.length > 0 ? "destructive" : "default"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  });

  // Optimize schedule mutation
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/scheduler/optimize", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/events"] });
      toast({
        title: "Schedule Optimized",
        description: `Resolved ${data.resolvedConflicts} conflicts and improved efficiency by ${data.improvementPercentage}%`,
      });
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize schedule",
        variant: "destructive",
      });
    }
  });

  // Resolve conflict mutation
  const resolveConflictMutation = useMutation({
    mutationFn: async (conflictId: string) => {
      const response = await apiRequest("POST", `/api/scheduler/conflicts/${conflictId}/resolve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/conflicts"] });
      toast({
        title: "Conflict Resolved",
        description: "Conflict has been automatically resolved",
      });
    },
    onError: () => {
      toast({
        title: "Resolution Failed",
        description: "Unable to resolve conflict",
        variant: "destructive",
      });
    }
  });

  const handleCreateEvent = () => {
    createEventMutation.mutate(newEvent);
  };

  const handleOptimizeSchedule = () => {
    optimizeMutation.mutate();
  };

  const handleResolveConflict = (conflictId: string) => {
    resolveConflictMutation.mutate(conflictId);
  };

  const getEventTypeColor = (type: string) => {
    return EVENT_TYPES.find(et => et.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const filteredConflicts = conflicts.filter((conflict: Conflict) => 
    conflictFilter === "all" || conflict.severity === conflictFilter
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Smart Scheduler
          </h1>
          <p className="text-gray-600">AI-powered scheduling with conflict detection and optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Zap className="h-3 w-3 mr-1" />
            AI-Optimized
          </Badge>
          <Button onClick={() => setIsCreateEventOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Conflicts</span>
            {conflicts.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {conflicts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Overview</span>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={viewMode === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("month")}
                    >
                      Month
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium min-w-32 text-center">
                      {format(selectedDate, "MMM yyyy")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "week" ? (
                <div className="grid grid-cols-7 gap-4">
                  {getWeekDays().map((day) => (
                    <div key={day.toISOString()} className="space-y-2">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {format(day, "EEE")}
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {format(day, "d")}
                        </div>
                      </div>
                      <div className="space-y-1 min-h-32">
                        {scheduledEvents
                          .filter((event: Event) => 
                            format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                          )
                          .map((event: Event) => (
                            <div
                              key={event.id}
                              className="p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                              style={{ backgroundColor: getEventTypeColor(event.type).split(' ')[0] }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="text-gray-600">{event.startTime}</div>
                              {event.conflicts.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600" />
                                  <span className="text-red-600">{event.conflicts.length}</span>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Month view coming soon</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{scheduledEvents.length}</p>
                    <p className="text-xs text-gray-600">Events This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{conflicts.length}</p>
                    <p className="text-xs text-gray-600">Active Conflicts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(scheduledEvents.reduce((acc: number, event: Event) => acc + (event.rsvpCount / event.totalPlayers), 0) / scheduledEvents.length * 100) || 0}%
                    </p>
                    <p className="text-xs text-gray-600">RSVP Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{analytics?.facilityUtilization || 0}%</p>
                    <p className="text-xs text-gray-600">Facility Usage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conflicts Tab */}
        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Schedule Conflicts</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="conflict-filter">Filter by severity:</Label>
                  <select
                    id="conflict-filter"
                    value={conflictFilter}
                    onChange={(e) => setConflictFilter(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="all">All Conflicts</option>
                    <option value="high">High Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="low">Low Severity</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {conflictsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredConflicts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
                      <p>No conflicts found</p>
                      <p className="text-sm">Your schedule is optimized!</p>
                    </div>
                  ) : (
                    filteredConflicts.map((conflict: Conflict) => (
                      <div key={conflict.id} className={`border rounded-lg p-4 space-y-3 ${getConflictSeverityColor(conflict.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getConflictSeverityColor(conflict.severity)}>
                                {conflict.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium capitalize">
                                {conflict.type.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{conflict.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span>Affected: {conflict.affectedEntities.join(", ")}</span>
                            </div>
                            {conflict.suggestedResolution && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <strong>Suggested Resolution:</strong> {conflict.suggestedResolution}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {conflict.autoResolvable && (
                              <Button
                                size="sm"
                                onClick={() => handleResolveConflict(conflict.id)}
                                disabled={resolveConflictMutation.isPending}
                              >
                                {resolveConflictMutation.isPending ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Zap className="h-3 w-3" />
                                )}
                                Auto-Resolve
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

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Schedule Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleOptimizeSchedule}
                  disabled={optimizeMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {optimizeMutation.isPending ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Optimizing Schedule...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Optimize Schedule
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  AI will analyze conflicts and suggest optimal schedule arrangements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">95%</p>
                      <p className="text-xs text-gray-600">Conflict Detection Accuracy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">80%</p>
                      <p className="text-xs text-gray-600">Conflict Reduction Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">60%</p>
                      <p className="text-xs text-gray-600">Time Savings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-3">Optimization Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic conflict detection for players, coaches, and facilities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Smart facility utilization optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Sport-specific scheduling constraints</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Predictive conflict alerts based on historical data</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Availability Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Team Availability Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availability.slice(0, 5).map((person: Availability) => (
                  <div key={person.userId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{person.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{person.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{person.availableSlots.length} slots</p>
                      <p className="text-xs text-gray-600">this week</p>
                    </div>
                  </div>
                ))}
              </div>
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
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalEvents || 0}</p>
                        <p className="text-xs text-gray-600">Total Events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.conflictRate || 0}%</p>
                        <p className="text-xs text-gray-600">Conflict Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.resolutionRate || 0}%</p>
                        <p className="text-xs text-gray-600">Resolution Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgRsvpRate || 0}%</p>
                        <p className="text-xs text-gray-600">Avg RSVP Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Conflict Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Common Conflicts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topConflictTypes?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium capitalize">{item.type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / Math.max(...analytics.topConflictTypes.map((t: any) => t.count))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.count}</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No conflict data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Highlights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>AI optimization reduced conflicts by 80%</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span>95% accuracy in conflict detection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span>60% improvement in admin efficiency</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Optimization Savings</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                          <span>Save {analytics?.optimizationSavings || 0} hours per week on scheduling</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span>Predictive alerts prevent 70% of potential conflicts</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Building2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Facility utilization optimized to {analytics?.facilityUtilization || 0}%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="create-event-description">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div id="create-event-description" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Team Practice"
                />
              </div>
              <div>
                <Label htmlFor="event-type">Event Type</Label>
                <select
                  id="event-type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facility">Facility</Label>
                <select
                  id="facility"
                  value={newEvent.facility}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, facility: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Facility</option>
                  <option value="main-field">Main Field</option>
                  <option value="practice-field">Practice Field</option>
                  <option value="gym-a">Gymnasium A</option>
                  <option value="gym-b">Gymnasium B</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sport">Sport</Label>
                <select
                  id="sport"
                  value={newEvent.sport}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, sport: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Sport</option>
                  {SPORTS.map(sport => (
                    <option key={sport} value={sport.toLowerCase()}>{sport}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional event details..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={newEvent.isRecurring}
                onChange={(e) => setNewEvent(prev => ({ ...prev, isRecurring: e.target.checked }))}
              />
              <Label htmlFor="recurring" className="text-sm">Recurring Event</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEvent}
                disabled={!newEvent.title || !newEvent.date || !newEvent.startTime || createEventMutation.isPending}
              >
                {createEventMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="event-detail-description">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <div id="event-detail-description" className="space-y-4">
            {selectedEvent && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getEventTypeColor(selectedEvent.type)}>
                        {selectedEvent.type}
                      </Badge>
                      <span className="text-sm text-gray-600">{selectedEvent.sport}</span>
                    </div>
                  </div>
                  <Badge variant={selectedEvent.status === "confirmed" ? "default" : "secondary"}>
                    {selectedEvent.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date & Time</Label>
                    <p className="text-sm">{format(selectedEvent.date, "MMMM d, yyyy")}</p>
                    <p className="text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{selectedEvent.facility}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Team</Label>
                    <p className="text-sm">{selectedEvent.team}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Coach</Label>
                    <p className="text-sm">{selectedEvent.coach}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">RSVP Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(selectedEvent.rsvpCount / selectedEvent.totalPlayers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {selectedEvent.rsvpCount}/{selectedEvent.totalPlayers} players confirmed
                    </span>
                  </div>
                </div>

                {selectedEvent.conflicts.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-red-600">Conflicts Detected</Label>
                    <div className="space-y-2 mt-2">
                      {selectedEvent.conflicts.map((conflict) => (
                        <div key={conflict.id} className={`p-2 rounded border ${getConflictSeverityColor(conflict.severity)}`}>
                          <p className="text-sm">{conflict.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedEvent.description}</p>
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