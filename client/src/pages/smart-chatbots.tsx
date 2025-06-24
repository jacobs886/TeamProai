import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Bot, 
  Upload, 
  FileText, 
  Image, 
  Link, 
  Send, 
  Sparkles,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Download,
  Trash2
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: string[];
}

interface TrainingData {
  id: string;
  type: "document" | "webpage" | "image";
  name: string;
  status: "processing" | "completed" | "failed";
  uploadedAt: Date;
  size?: string;
  url?: string;
}

interface ChatbotAnalytics {
  totalQueries: number;
  avgResponseTime: number;
  satisfactionRate: number;
  topQueries: Array<{ query: string; count: number }>;
  monthlyUsage: Array<{ month: string; queries: number }>;
}

export default function SmartChatbots() {
  const [activeTab, setActiveTab] = useState<"chat" | "training" | "analytics" | "settings">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm your AI-powered team assistant. I can help you with schedules, payments, player information, and much more. I've been trained on your team's specific documents and guidelines. What would you like to know?",
      timestamp: new Date(),
      confidence: 0.95
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [trainingUrl, setTrainingUrl] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch training data
  const { data: trainingData = [], isLoading: trainingLoading } = useQuery({
    queryKey: ["/api/chatbots/training-data"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/chatbots/analytics"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chatbots/query", { 
        query: message,
        context: { timestamp: new Date() }
      });
      return response.json();
    },
    onSuccess: (data) => {
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date(),
        confidence: data.confidence,
        sources: data.sources
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get response from chatbot",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  });

  // Upload training data mutation
  const uploadTrainingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/chatbots/upload-training", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training data uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots/training-data"] });
      setSelectedFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload training data",
        variant: "destructive",
      });
    }
  });

  // Add webpage training mutation
  const addWebpageMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/chatbots/add-webpage", { url });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webpage added for training",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots/training-data"] });
      setTrainingUrl("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add webpage",
        variant: "destructive",
      });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendMessageMutation.mutate(currentMessage);
    setCurrentMessage("");
  };

  const handleFileUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    uploadTrainingMutation.mutate(formData);
  };

  const handleAddWebpage = () => {
    if (!trainingUrl.trim()) return;
    addWebpageMutation.mutate(trainingUrl);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return FileText;
      case "image": return Image;
      case "webpage": return Link;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "processing": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Smart Chatbots
          </h1>
          <p className="text-gray-600">AI-powered team assistant with custom training capabilities</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Training</span>
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

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">TeamPro AI Assistant</span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Trained on {trainingData.length} sources
                </Badge>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[80%] rounded-lg p-3 
                        ${message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                        }
                      `}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.confidence && (
                            <span className="flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>{Math.round(message.confidence * 100)}% confident</span>
                            </span>
                          )}
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask about schedules, payments, players, or anything else..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Documents & Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select Files</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    ref={fileInputRef}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                  </p>
                </div>
                <Button 
                  onClick={handleFileUpload}
                  disabled={!selectedFiles || uploadTrainingMutation.isPending}
                  className="w-full"
                >
                  {uploadTrainingMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5" />
                  <span>Add Web Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webpage-url">Website URL</Label>
                  <Input
                    id="webpage-url"
                    type="url"
                    placeholder="https://example.com/team-rules"
                    value={trainingUrl}
                    onChange={(e) => setTrainingUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add team websites, league rules, or any relevant web content
                  </p>
                </div>
                <Button 
                  onClick={handleAddWebpage}
                  disabled={!trainingUrl.trim() || addWebpageMutation.isPending}
                  className="w-full"
                >
                  {addWebpageMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Webpage
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Training Data List */}
          <Card>
            <CardHeader>
              <CardTitle>Training Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {trainingLoading ? (
                <div className="flex justify-center py-8">
                  <Clock className="h-6 w-6 animate-spin" />
                </div>
              ) : trainingData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No training data uploaded yet</p>
                  <p className="text-sm">Upload documents, images, or add web pages to train the chatbot</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainingData.map((item: TrainingData) => {
                    const IconComponent = getFileIcon(item.type);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className={getStatusColor(item.status)}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                              {item.size && <span>• {item.size}</span>}
                              <span>• {item.uploadedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {item.status === "processing" && (
                            <Clock className="h-5 w-5 text-yellow-600 animate-spin" />
                          )}
                          {item.status === "failed" && (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalQueries || 0}</p>
                        <p className="text-xs text-gray-600">Total Queries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgResponseTime || 0}ms</p>
                        <p className="text-xs text-gray-600">Avg Response Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.satisfactionRate || 0}%</p>
                        <p className="text-xs text-gray-600">Satisfaction Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{trainingData.length}</p>
                        <p className="text-xs text-gray-600">Training Sources</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Queries */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topQueries?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.query}</span>
                        <Badge variant="outline">{item.count} times</Badge>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No query data available yet</p>
                    )}
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
              <CardTitle>Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Response Tone</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="friendly">Friendly & Casual</option>
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
              
              <div>
                <Label>Confidence Threshold</Label>
                <div className="mt-2">
                  <Progress value={75} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">
                    Responses below 75% confidence will suggest contacting a human
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Integration Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="schedule-integration" defaultChecked />
                    <Label htmlFor="schedule-integration" className="text-sm">Schedule Integration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="payment-integration" defaultChecked />
                    <Label htmlFor="payment-integration" className="text-sm">Payment Integration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="player-info" defaultChecked />
                    <Label htmlFor="player-info" className="text-sm">Player Information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="volunteer-coordination" defaultChecked />
                    <Label htmlFor="volunteer-coordination" className="text-sm">Volunteer Coordination</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}