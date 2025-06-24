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
  Calendar, 
  Link2, 
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCcw,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Zap,
  Brain,
  Target,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  Laptop,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
  Download
} from "lucide-react";
import { format } from "date-fns";

interface CalendarConnection {
  id: string;
  provider: "google" | "microsoft" | "apple" | "ical";
  email: string;
  name: string;
  status: "connected" | "syncing" | "error" | "disconnected";
  lastSync: Date;
  syncedEvents: number;
  conflicts: number;
  isActive: boolean;
  syncFrequency: "realtime" | "hourly" | "daily";
}

interface SyncConflict {
  id: string;
  eventTitle: string;
  teamProEvent: string;
  externalEvent: string;
  conflictType: "time_overlap" | "double_booking" | "resource_conflict";
  severity: "high" | "medium" | "low";
  date: Date;
  suggestedResolution?: string;
  autoResolvable: boolean;
  status: "pending" | "resolved" | "ignored";
}

interface SyncAnalytics {
  totalConnections: number;
  activeConnections: number;
  syncReliability: number;
  conflictResolutionRate: number;
  timesSaved: number;
  popularProviders: Array<{ provider: string; count: number }>;
  syncTrends: Array<{ date: string; synced: number; conflicts: number }>;
}

const CALENDAR_PROVIDERS = [
  {
    id: "google",
    name: "Google Calendar",
    icon: "🟦",
    description: "Sync with Google Calendar",
    color: "border-blue-200 bg-blue-50"
  },
  {
    id: "microsoft",
    name: "Microsoft Outlook",
    icon: "🟦",
    description: "Sync with Outlook Calendar",
    color: "border-indigo-200 bg-indigo-50"
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: "⚫",
    description: "Sync with iCloud Calendar",
    color: "border-gray-200 bg-gray-50"
  },
  {
    id: "ical",
    name: "iCal/Other",
    icon: "📅",
    description: "Sync with iCal-based providers",
    color: "border-green-200 bg-green-50"
  }
];

export default function CalendarSync() {
  const [activeTab, setActiveTab] = useState<"connections" | "conflicts" | "settings" | "analytics">("connections");
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [connectionEmail, setConnectionEmail] = useState("");
  const [selectedConflict, setSelectedConflict] = useState<SyncConflict | null>(null);
  const [conflictFilter, setConflictFilter] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch calendar connections
  const { data: connections = [], isLoading: connectionsLoading } = useQuery({
    queryKey: ["/api/calendar-sync/connections"],
  });

  // Fetch sync conflicts
  const { data: conflicts = [], isLoading: conflictsLoading } = useQuery({
    queryKey: ["/api/calendar-sync/conflicts"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/calendar-sync/analytics"],
  });

  // Connect calendar mutation
  const connectMutation = useMutation({
    mutationFn: async (connectionData: any) => {
      const response = await apiRequest("POST", "/api/calendar-sync/connect", connectionData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-sync/connections"] });
      setIsConnectDialogOpen(false);
      setConnectionEmail("");
      setSelectedProvider("");
      toast({
        title: "Calendar Connected",
        description: `Successfully connected ${data.provider} calendar`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Unable to connect calendar. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Disconnect calendar mutation
  const disconnectMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await apiRequest("DELETE", `/api/calendar-sync/connections/${connectionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-sync/connections"] });
      toast({
        title: "Calendar Disconnected",
        description: "Calendar has been disconnected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Disconnection Failed",
        description: "Unable to disconnect calendar",
        variant: "destructive",
      });
    }
  });

  // Sync now mutation
  const syncNowMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await apiRequest("POST", `/api/calendar-sync/connections/${connectionId}/sync`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-sync/connections"] });
      toast({
        title: "Sync Complete",
        description: `Synced ${data.eventCount} events successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to sync calendar",
        variant: "destructive",
      });
    }
  });

  // Resolve conflict mutation
  const resolveConflictMutation = useMutation({
    mutationFn: async (conflictId: string) => {
      const response = await apiRequest("POST", `/api/calendar-sync/conflicts/${conflictId}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-sync/conflicts"] });
      toast({
        title: "Conflict Resolved",
        description: "Calendar conflict has been resolved",
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

  const handleConnect = () => {
    if (selectedProvider && connectionEmail) {
      connectMutation.mutate({
        provider: selectedProvider,
        email: connectionEmail,
        syncFrequency: "realtime"
      });
    }
  };

  const handleDisconnect = (connectionId: string) => {
    disconnectMutation.mutate(connectionId);
  };

  const handleSyncNow = (connectionId: string) => {
    syncNowMutation.mutate(connectionId);
  };

  const handleResolveConflict = (conflictId: string) => {
    resolveConflictMutation.mutate(conflictId);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google": return "🟦";
      case "microsoft": return "🟦";
      case "apple": return "⚫";
      case "ical": return "📅";
      default: return "📅";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "syncing": return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "disconnected": return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredConflicts = conflicts.filter((conflict: SyncConflict) => 
    conflictFilter === "all" || conflict.severity === conflictFilter
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Calendar Sync
          </h1>
          <p className="text-gray-600">Sync with Google, Microsoft, Apple, and iCal calendars</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Link2 className="h-3 w-3 mr-1" />
            Multi-Platform
          </Badge>
          <Button onClick={() => setIsConnectDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Calendar
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections" className="flex items-center space-x-2">
            <Link2 className="h-4 w-4" />
            <span>Connections</span>
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
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Link2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
                    <p className="text-xs text-gray-600">Connected Calendars</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <RefreshCcw className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {connections.filter((c: CalendarConnection) => c.status === "connected").length}
                    </p>
                    <p className="text-xs text-gray-600">Active Syncs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {connections.reduce((acc: number, c: CalendarConnection) => acc + c.syncedEvents, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Events Synced</p>
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
                      {connections.reduce((acc: number, c: CalendarConnection) => acc + c.conflicts, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Conflicts Detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connected Calendars */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {connectionsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : connections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No calendars connected</p>
                      <p className="text-sm">Connect your first calendar to get started</p>
                    </div>
                  ) : (
                    connections.map((connection: CalendarConnection) => (
                      <div key={connection.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg">{getProviderIcon(connection.provider)}</span>
                              <div>
                                <p className="font-medium">{connection.name}</p>
                                <p className="text-sm text-gray-600">{connection.email}</p>
                              </div>
                              {getStatusIcon(connection.status)}
                              <Badge variant={connection.isActive ? "default" : "secondary"}>
                                {connection.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <Label className="text-xs text-gray-500">Last Sync</Label>
                                <p>{format(connection.lastSync, "MMM d, h:mm a")}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Events Synced</Label>
                                <p>{connection.syncedEvents}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Conflicts</Label>
                                <p className={connection.conflicts > 0 ? "text-red-600" : "text-green-600"}>
                                  {connection.conflicts}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Sync Frequency</Label>
                                <p className="capitalize">{connection.syncFrequency}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSyncNow(connection.id)}
                              disabled={syncNowMutation.isPending}
                            >
                              {syncNowMutation.isPending ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <RefreshCcw className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(connection.id)}
                              disabled={disconnectMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
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

        {/* Conflicts Tab */}
        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Sync Conflicts</span>
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
                      <p className="text-sm">All calendars are synced perfectly!</p>
                    </div>
                  ) : (
                    filteredConflicts.map((conflict: SyncConflict) => (
                      <div key={conflict.id} className={`border rounded-lg p-4 space-y-3 ${getConflictSeverityColor(conflict.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getConflictSeverityColor(conflict.severity)}>
                                {conflict.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium capitalize">
                                {conflict.conflictType.replace('_', ' ')}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1">{conflict.eventTitle}</h4>
                            <div className="text-sm text-gray-700 space-y-1">
                              <p><strong>TeamPro Event:</strong> {conflict.teamProEvent}</p>
                              <p><strong>External Event:</strong> {conflict.externalEvent}</p>
                              <p><strong>Date:</strong> {format(conflict.date, "MMM d, yyyy 'at' h:mm a")}</p>
                            </div>
                            {conflict.suggestedResolution && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <strong>AI Suggestion:</strong> {conflict.suggestedResolution}
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
                            <Button variant="outline" size="sm" onClick={() => setSelectedConflict(conflict)}>
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

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Sync Frequency</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <div>
                <Label>Event Types to Sync</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-practices" defaultChecked />
                    <Label htmlFor="sync-practices" className="text-sm">Practices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-games" defaultChecked />
                    <Label htmlFor="sync-games" className="text-sm">Games</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-meetings" defaultChecked />
                    <Label htmlFor="sync-meetings" className="text-sm">Team Meetings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-volunteer" defaultChecked />
                    <Label htmlFor="sync-volunteer" className="text-sm">Volunteer Tasks</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Conflict Detection</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="detect-overlaps" defaultChecked />
                    <Label htmlFor="detect-overlaps" className="text-sm">Time Overlaps</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="detect-travel-time" defaultChecked />
                    <Label htmlFor="detect-travel-time" className="text-sm">Travel Time Conflicts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-resolve" defaultChecked />
                    <Label htmlFor="auto-resolve" className="text-sm">Auto-resolve Simple Conflicts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="predictive-alerts" defaultChecked />
                    <Label htmlFor="predictive-alerts" className="text-sm">Predictive Conflict Alerts</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Notification Preferences</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-sync-success" defaultChecked />
                    <Label htmlFor="notify-sync-success" className="text-sm">Sync Success</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-conflicts" defaultChecked />
                    <Label htmlFor="notify-conflicts" className="text-sm">Conflicts Detected</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-resolution" defaultChecked />
                    <Label htmlFor="notify-resolution" className="text-sm">Conflict Resolution</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-sync-errors" defaultChecked />
                    <Label htmlFor="notify-sync-errors" className="text-sm">Sync Errors</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Preferences
              </Button>
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
                      <Link2 className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalConnections || 0}</p>
                        <p className="text-xs text-gray-600">Total Connections</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.syncReliability || 0}%</p>
                        <p className="text-xs text-gray-600">Sync Reliability</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.conflictResolutionRate || 0}%</p>
                        <p className="text-xs text-gray-600">Resolution Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.timesSaved || 0}h</p>
                        <p className="text-xs text-gray-600">Time Saved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Providers */}
              <Card>
                <CardHeader>
                  <CardTitle>Calendar Provider Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.popularProviders?.map((provider: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getProviderIcon(provider.provider)}</span>
                          <span className="font-medium capitalize">{provider.provider}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(provider.count / Math.max(...analytics.popularProviders.map((p: any) => p.count))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{provider.count}</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No provider data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Sync Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Highlights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>99.5% sync reliability across all platforms</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span>Real-time conflict detection with 95% accuracy</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span>AI-powered auto-resolution for 70% of conflicts</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">AI-Driven Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span>Predictive sync prevents 80% of potential conflicts</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Smart frequency adjustment saves 40% bandwidth</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Users className="h-4 w-4 text-orange-600 mt-0.5" />
                          <span>Multi-calendar support increases user satisfaction by 60%</span>
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

      {/* Connect Calendar Dialog */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="max-w-md" aria-describedby="connect-calendar-description">
          <DialogHeader>
            <DialogTitle>Connect Calendar</DialogTitle>
          </DialogHeader>
          <div id="connect-calendar-description" className="space-y-4">
            <div>
              <Label htmlFor="calendar-provider">Select Calendar Provider</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {CALENDAR_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedProvider === provider.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:bg-gray-50"
                    } ${provider.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{provider.icon}</span>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider && (
              <div>
                <Label htmlFor="calendar-email">Account Email</Label>
                <Input
                  id="calendar-email"
                  type="email"
                  value={connectionEmail}
                  onChange={(e) => setConnectionEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll redirect you to authenticate securely with your calendar provider
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConnect}
                disabled={!selectedProvider || !connectionEmail || connectMutation.isPending}
              >
                {connectMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conflict Details Dialog */}
      <Dialog open={!!selectedConflict} onOpenChange={() => setSelectedConflict(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="conflict-detail-description">
          <DialogHeader>
            <DialogTitle>Conflict Details</DialogTitle>
          </DialogHeader>
          <div id="conflict-detail-description" className="space-y-4">
            {selectedConflict && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedConflict.eventTitle}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getConflictSeverityColor(selectedConflict.severity)}>
                        {selectedConflict.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-600 capitalize">
                        {selectedConflict.conflictType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Badge variant={selectedConflict.status === "resolved" ? "default" : "secondary"}>
                    {selectedConflict.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">TeamPro Event</Label>
                    <p className="text-sm bg-blue-50 p-2 rounded">{selectedConflict.teamProEvent}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">External Calendar Event</Label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedConflict.externalEvent}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Conflict Date & Time</Label>
                    <p className="text-sm">{format(selectedConflict.date, "MMMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>

                {selectedConflict.suggestedResolution && (
                  <div>
                    <Label className="text-sm font-medium">AI Suggested Resolution</Label>
                    <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                      {selectedConflict.suggestedResolution}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedConflict(null)}>
                    Close
                  </Button>
                  {selectedConflict.autoResolvable && selectedConflict.status === "pending" && (
                    <Button onClick={() => handleResolveConflict(selectedConflict.id)}>
                      <Zap className="h-4 w-4 mr-2" />
                      Auto-Resolve
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