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
  MessageSquare, 
  Search, 
  Filter,
  Calendar,
  User,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  Globe,
  Brain,
  Target,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Zap,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";

interface CommunicationLog {
  id: string;
  content: string;
  sender: string;
  recipient: string;
  channel: "app" | "email" | "sms" | "web";
  status: "sent" | "delivered" | "read" | "responded";
  intent: "urgent" | "informational" | "request" | "complaint" | "question";
  sentiment: "positive" | "negative" | "neutral";
  language: string;
  translatedContent?: string;
  sportCategory: string;
  timestamp: Date;
  deliveryTime?: Date;
  readTime?: Date;
  responseTime?: Date;
  teamId: string;
  confidence: number;
}

interface LogAnalytics {
  totalMessages: number;
  deliveryRate: number;
  readRate: number;
  responseRate: number;
  avgResponseTime: number;
  channelBreakdown: Record<string, number>;
  intentDistribution: Record<string, number>;
  engagementTrends: Array<{ date: string; sent: number; read: number; responded: number }>;
}

export default function CommunicationLogs() {
  const [activeTab, setActiveTab] = useState<"logs" | "analytics" | "search" | "settings">("logs");
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedIntent, setSelectedIntent] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("week");
  const [selectedLog, setSelectedLog] = useState<CommunicationLog | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch communication logs
  const { data: communicationLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/communication-logs", { channel: selectedChannel, status: selectedStatus, intent: selectedIntent, sport: selectedSport, range: dateRange }],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/communication-logs/analytics"],
  });

  // Search logs mutation
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/communication-logs/search", { query });
      return response.json();
    },
    onSuccess: (data) => {
      setLogs(data.results);
      toast({
        title: "Search Complete",
        description: `Found ${data.results.length} matching messages`,
      });
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Unable to search logs. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Export logs mutation
  const exportMutation = useMutation({
    mutationFn: async (format: "csv" | "pdf") => {
      const response = await apiRequest("POST", "/api/communication-logs/export", { format, filters: { channel: selectedChannel, status: selectedStatus, intent: selectedIntent } });
      return response.blob();
    },
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `communication-logs.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export Complete",
        description: `Communication logs exported as ${format.toUpperCase()}`,
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Unable to export logs. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const handleExport = (format: "csv" | "pdf") => {
    exportMutation.mutate(format);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Clock className="h-4 w-4 text-gray-500" />;
      case "delivered": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "read": return <Eye className="h-4 w-4 text-green-500" />;
      case "responded": return <MessageCircle className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <Phone className="h-4 w-4" />;
      case "app": return <MessageSquare className="h-4 w-4" />;
      case "web": return <Globe className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "urgent": return "bg-red-100 text-red-800";
      case "complaint": return "bg-orange-100 text-orange-800";
      case "request": return "bg-blue-100 text-blue-800";
      case "question": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const filteredLogs = communicationLogs.filter((log: CommunicationLog) => {
    const channelMatch = selectedChannel === "all" || log.channel === selectedChannel;
    const statusMatch = selectedStatus === "all" || log.status === selectedStatus;
    const intentMatch = selectedIntent === "all" || log.intent === selectedIntent;
    const sportMatch = selectedSport === "all" || log.sportCategory === selectedSport;
    return channelMatch && statusMatch && intentMatch && sportMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-green-600" />
            Communication Logs
          </h1>
          <p className="text-gray-600">Comprehensive message tracking and analytics</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <BarChart3 className="h-3 w-3 mr-1" />
          AI-Tracked
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Message Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Advanced Search</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="channel-filter">Channel</Label>
                  <select
                    id="channel-filter"
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="all">All Channels</option>
                    <option value="app">App</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="web">Web</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="intent-filter">Intent</Label>
                  <select
                    id="intent-filter"
                    value={selectedIntent}
                    onChange={(e) => setSelectedIntent(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="all">All Intents</option>
                    <option value="urgent">Urgent</option>
                    <option value="informational">Informational</option>
                    <option value="request">Request</option>
                    <option value="complaint">Complaint</option>
                    <option value="question">Question</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="sport-filter">Sport</Label>
                  <select
                    id="sport-filter"
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="all">All Sports</option>
                    <option value="soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                    <option value="baseball">Baseball</option>
                    <option value="hockey">Hockey</option>
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
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => handleExport("csv")}
                    variant="outline"
                    className="w-full"
                    disabled={exportMutation.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle>Messages ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {logsLoading ? (
                    <div className="flex justify-center py-8">
                      <Clock className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages found</p>
                      <p className="text-sm">Adjust filters to see more results</p>
                    </div>
                  ) : (
                    filteredLogs.map((log: CommunicationLog) => (
                      <div key={log.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedLog(log)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getChannelIcon(log.channel)}
                              <span className="font-medium text-sm">{log.sender}</span>
                              <ArrowUp className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{log.recipient}</span>
                              <Badge className={getIntentColor(log.intent)}>
                                {log.intent}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-900 mb-2 line-clamp-2">{log.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{format(log.timestamp, "MMM d, h:mm a")}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Globe className="h-3 w-3" />
                                <span>{log.language}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>{Math.round(log.confidence * 100)}%</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <span className={`text-xs font-medium ${getSentimentIcon(log.sentiment)}`}>
                              {log.sentiment}
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading ? (
            <div className="flex justify-center py-12">
              <Clock className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalMessages || 0}</p>
                        <p className="text-xs text-gray-600">Total Messages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.deliveryRate || 0}%</p>
                        <p className="text-xs text-gray-600">Delivery Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Eye className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.readRate || 0}%</p>
                        <p className="text-xs text-gray-600">Read Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgResponseTime || 0}h</p>
                        <p className="text-xs text-gray-600">Avg Response Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Channel Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.channelBreakdown || {}).map(([channel, count]) => (
                      <div key={channel} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(channel)}
                          <span className="font-medium capitalize">{channel}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / (analytics?.totalMessages || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Communication Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Highlights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>99.2% message delivery success rate</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>85% read rate across all channels</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span>Average response time: 2.3 hours</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">AI-Driven Insights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span>Urgent messages have 95% higher open rates</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>SMS preferred for time-sensitive communications</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Globe className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span>Multilingual support increases engagement by 40%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Smart Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-input">Natural Language Search</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="search-input"
                    placeholder="e.g., 'urgent messages about practice from last week'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || searchMutation.isPending}
                  >
                    {searchMutation.isPending ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Search using natural language or specific keywords
                </p>
              </div>

              <div>
                <Label>Quick Searches</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    "urgent messages today",
                    "unread notifications",
                    "payment reminders",
                    "practice cancellations",
                    "parent complaints",
                    "coach announcements"
                  ].map((query) => (
                    <Button
                      key={query}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(query)}
                      className="text-xs"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>

              {logs.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Search Results ({logs.length})</h4>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <div key={log.id} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{log.sender}</span>
                            <span className="text-xs text-gray-500">
                              {format(log.timestamp, "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{log.content}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getIntentColor(log.intent)}>
                              {log.intent}
                            </Badge>
                            {getStatusIcon(log.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Data Retention</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              <div>
                <Label>Auto-categorization</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="intent-detection" defaultChecked />
                    <Label htmlFor="intent-detection" className="text-sm">Intent Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sentiment-tracking" defaultChecked />
                    <Label htmlFor="sentiment-tracking" className="text-sm">Sentiment Tracking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sport-categorization" defaultChecked />
                    <Label htmlFor="sport-categorization" className="text-sm">Sport Categorization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="translation-logging" defaultChecked />
                    <Label htmlFor="translation-logging" className="text-sm">Translation Logging</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Export Format Preferences</Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="csv-format" name="export-format" defaultChecked />
                    <Label htmlFor="csv-format" className="text-sm">CSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="pdf-format" name="export-format" />
                    <Label htmlFor="pdf-format" className="text-sm">PDF</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="log-detail-description">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          <div id="log-detail-description" className="space-y-4">
            {selectedLog && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Sender</Label>
                    <p className="text-sm text-gray-900">{selectedLog.sender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Recipient</Label>
                    <p className="text-sm text-gray-900">{selectedLog.recipient}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Channel</Label>
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(selectedLog.channel)}
                      <span className="text-sm capitalize">{selectedLog.channel}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedLog.status)}
                      <span className="text-sm capitalize">{selectedLog.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Content</Label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{selectedLog.content}</p>
                </div>

                {selectedLog.translatedContent && (
                  <div>
                    <Label className="text-sm font-medium">Translation ({selectedLog.language})</Label>
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-blue-50 rounded">{selectedLog.translatedContent}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Intent</Label>
                    <Badge className={getIntentColor(selectedLog.intent)}>
                      {selectedLog.intent}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Sentiment</Label>
                    <span className={`text-sm font-medium ${getSentimentIcon(selectedLog.sentiment)}`}>
                      {selectedLog.sentiment}
                    </span>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Confidence</Label>
                    <span className="text-sm">{Math.round(selectedLog.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <Label className="text-sm font-medium">Sent</Label>
                    <p>{format(selectedLog.timestamp, "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                  {selectedLog.readTime && (
                    <div>
                      <Label className="text-sm font-medium">Read</Label>
                      <p>{format(selectedLog.readTime, "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
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