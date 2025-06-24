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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  MessageSquare, 
  Send, 
  Sparkles,
  BarChart3,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
  Frown,
  Smile,
  Meh,
  Zap,
  Target,
  Filter,
  ArrowUp,
  ArrowDown,
  Search,
  Bell,
  Users,
  PieChart,
  Activity,
  Lightbulb
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  intent: "urgent" | "informational" | "request" | "complaint" | "question";
  sentiment: "positive" | "negative" | "neutral";
  tone: string;
  confidence: number;
  priority: "high" | "medium" | "low";
  suggestedResponse?: string;
  team?: string;
}

interface IntentAnalytics {
  totalMessages: number;
  intentDistribution: Record<string, number>;
  sentimentTrends: Array<{ date: string; positive: number; negative: number; neutral: number }>;
  responseTime: number;
  urgentMessages: number;
  averageConfidence: number;
}

export default function MessageAnalysis() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "insights" | "training" | "settings">("analyzer");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>("all");
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch message analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/message-analysis/analytics"],
  });

  // Fetch recent analyzed messages
  const { data: recentMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/message-analysis/messages"],
  });

  // Analyze message mutation
  const analyzeMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/message-analysis/analyze", { 
        message,
        context: { timestamp: new Date() }
      });
      return response.json();
    },
    onSuccess: (data) => {
      const analyzedMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "Current User",
        timestamp: new Date(),
        intent: data.intent,
        sentiment: data.sentiment,
        tone: data.tone,
        confidence: data.confidence,
        priority: data.priority,
        suggestedResponse: data.suggestedResponse
      };
      setMessages(prev => [...prev, analyzedMessage]);
      setNewMessage("");
      setIsAnalyzing(false);
      toast({
        title: "Message Analyzed",
        description: `Intent: ${data.intent}, Sentiment: ${data.sentiment}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze message",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  });

  const handleAnalyzeMessage = () => {
    if (!newMessage.trim()) return;
    setIsAnalyzing(true);
    analyzeMessageMutation.mutate(newMessage);
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
      case "positive": return <Smile className="h-4 w-4 text-green-600" />;
      case "negative": return <Frown className="h-4 w-4 text-red-600" />;
      default: return <Meh className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <ArrowUp className="h-4 w-4 text-red-600" />;
      case "medium": return <ArrowUp className="h-4 w-4 text-yellow-600" />;
      default: return <ArrowDown className="h-4 w-4 text-green-600" />;
    }
  };

  const filteredMessages = messages.filter(msg => {
    const intentMatch = selectedIntentFilter === "all" || msg.intent === selectedIntentFilter;
    const sentimentMatch = selectedSentimentFilter === "all" || msg.sentiment === selectedSentimentFilter;
    return intentMatch && sentimentMatch;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            Message Analysis
          </h1>
          <p className="text-gray-600">AI-powered intent and sentiment analysis for team communications</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Enhanced
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analyzer" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Training</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Analyzer Tab */}
        <TabsContent value="analyzer" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Input */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Message Analyzer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message-input">Enter Message for Analysis</Label>
                  <Textarea
                    id="message-input"
                    placeholder="Type a team message here to analyze its intent, sentiment, and tone..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleAnalyzeMessage}
                  disabled={!newMessage.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Real-time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Analysis Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages Analyzed</span>
                  <Badge variant="outline">{messages.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Urgent Messages</span>
                  <Badge className="bg-red-100 text-red-800">
                    {messages.filter(m => m.intent === "urgent").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Confidence</span>
                  <span className="text-sm font-medium">
                    {messages.length > 0 
                      ? Math.round(messages.reduce((acc, m) => acc + m.confidence, 0) / messages.length * 100)
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Message Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div>
                  <Label htmlFor="intent-filter">Intent Filter</Label>
                  <select
                    id="intent-filter"
                    value={selectedIntentFilter}
                    onChange={(e) => setSelectedIntentFilter(e.target.value)}
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
                  <Label htmlFor="sentiment-filter">Sentiment Filter</Label>
                  <select
                    id="sentiment-filter"
                    value={selectedSentimentFilter}
                    onChange={(e) => setSelectedSentimentFilter(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyzed Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Messages ({filteredMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No analyzed messages yet</p>
                      <p className="text-sm">Enter a message above to see AI analysis results</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-2">{message.content}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{message.sender}</span>
                              <span>•</span>
                              <span>{format(message.timestamp, "MMM d, h:mm a")}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(message.priority)}
                            {getSentimentIcon(message.sentiment)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getIntentColor(message.intent)}>
                            {message.intent}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {message.tone}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(message.confidence * 100)}% confident
                          </Badge>
                        </div>

                        {message.suggestedResponse && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Suggested Response</span>
                            </div>
                            <p className="text-sm text-blue-800">{message.suggestedResponse}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
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
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.urgentMessages || 0}</p>
                        <p className="text-xs text-gray-600">Urgent Messages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.responseTime || 0}s</p>
                        <p className="text-xs text-gray-600">Avg Response Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.averageConfidence || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Confidence</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Intent Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Intent Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.intentDistribution || {}).map(([intent, count]) => (
                      <div key={intent} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getIntentColor(intent)}>{intent}</Badge>
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

              {/* Sentiment Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Communication Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Patterns</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>95% of urgent messages properly prioritized</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Parent satisfaction increased by 40%</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>Response time improved by 60%</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <span>Use empathetic responses for negative sentiment messages</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <span>Automate responses for common informational requests</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <span>Flag sarcastic tone for manual review</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Training & Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sport-Specific Training</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="general">General Sports</option>
                  <option value="soccer">Soccer/Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="baseball">Baseball</option>
                  <option value="hockey">Hockey</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Customize intent detection for sport-specific terminology
                </p>
              </div>
              
              <div>
                <Label>Team Communication Style</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="formal">Formal & Professional</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="enthusiastic">Enthusiastic & Motivational</option>
                </select>
              </div>

              <div>
                <Label>Priority Thresholds</Label>
                <div className="space-y-3 mt-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Urgent Intent Confidence</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Negative Sentiment Alert</span>
                      <span>70%</span>
                    </div>
                    <Progress value={70} className="w-full" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Update Training Model
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Analysis Features</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="intent-analysis" defaultChecked />
                    <Label htmlFor="intent-analysis" className="text-sm">Intent Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sentiment-analysis" defaultChecked />
                    <Label htmlFor="sentiment-analysis" className="text-sm">Sentiment Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tone-detection" defaultChecked />
                    <Label htmlFor="tone-detection" className="text-sm">Tone Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-responses" defaultChecked />
                    <Label htmlFor="auto-responses" className="text-sm">Response Suggestions</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="urgent-alerts" defaultChecked />
                    <Label htmlFor="urgent-alerts" className="text-sm">Urgent Message Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sentiment-alerts" defaultChecked />
                    <Label htmlFor="sentiment-alerts" className="text-sm">Negative Sentiment Alerts</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}