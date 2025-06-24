import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Send, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  Mail,
  Smartphone,
  Globe,
  Zap,
  Brain,
  Settings,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface NotificationRule {
  id: number;
  name: string;
  triggerEvent: string;
  channels: string[];
  recipients: string[];
  template: string;
  isActive: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  conditions: any;
}

interface NotificationHistory {
  id: number;
  title: string;
  message: string;
  channels: string[];
  recipients: number;
  deliveryRate: number;
  sentAt: Date;
  status: string;
  priority: string;
}

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<"compose" | "rules" | "history" | "analytics">("compose");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["app"]);
  const [selectedRecipients, setSelectedRecipients] = useState<string>("all");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [urgentMode, setUrgentMode] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch notification rules
  const { data: rules = [] } = useQuery({
    queryKey: ["/api/notifications/rules"],
  });

  // Fetch notification history
  const { data: history = [] } = useQuery({
    queryKey: ["/api/notifications/history"],
  });

  // Fetch teams for recipient selection
  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      return apiRequest("POST", "/api/notifications/send", notificationData);
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Your message has been delivered successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/history"] });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send notification.",
        variant: "destructive",
      });
    },
  });

  const channels = [
    { id: "app", label: "In-App", icon: Bell, description: "Push notifications within the app" },
    { id: "email", label: "Email", icon: Mail, description: "Email notifications" },
    { id: "sms", label: "SMS", icon: Smartphone, description: "Text message alerts" },
    { id: "push", label: "Push", icon: Zap, description: "Mobile push notifications" },
  ];

  const recipientOptions = [
    { value: "all", label: "All Users", description: "Send to everyone" },
    { value: "teams", label: "Specific Teams", description: "Select teams" },
    { value: "coaches", label: "Coaches Only", description: "Team coaches" },
    { value: "parents", label: "Parents/Guardians", description: "Player guardians" },
    { value: "players", label: "Players Only", description: "Team players" },
    { value: "admins", label: "Administrators", description: "System admins" },
  ];

  const handleSendNotification = (formData: FormData) => {
    const data = {
      title: formData.get("title"),
      message: formData.get("message"),
      channels: selectedChannels,
      recipients: selectedRecipients,
      priority: urgentMode ? "urgent" : "medium",
      aiEnhanced: aiAssistEnabled,
      translateToPreferredLanguages: true,
      scheduledFor: formData.get("scheduledFor") || null,
    };
    
    sendNotificationMutation.mutate(data);
  };

  const getChannelIcon = (channel: string) => {
    const channelData = channels.find(c => c.id === channel);
    return channelData?.icon || Bell;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-600">Automated communication system with AI enhancement</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="outline">
            99.5% Delivery Rate
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "compose", label: "Compose", icon: Send },
            { id: "rules", label: "Automation Rules", icon: Settings },
            { id: "history", label: "History", icon: Clock },
            { id: "analytics", label: "Analytics", icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "compose" && (
        <ComposeNotification
          channels={channels}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
          recipientOptions={recipientOptions}
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
          teams={teams}
          aiAssistEnabled={aiAssistEnabled}
          setAiAssistEnabled={setAiAssistEnabled}
          urgentMode={urgentMode}
          setUrgentMode={setUrgentMode}
          onSend={handleSendNotification}
          isLoading={sendNotificationMutation.isPending}
        />
      )}

      {activeTab === "rules" && (
        <AutomationRules rules={rules} />
      )}

      {activeTab === "history" && (
        <NotificationHistory 
          history={history} 
          getChannelIcon={getChannelIcon}
          getPriorityColor={getPriorityColor}
        />
      )}

      {activeTab === "analytics" && (
        <NotificationAnalytics />
      )}
    </div>
  );
}

// Compose Notification Component
function ComposeNotification({ 
  channels, 
  selectedChannels, 
  setSelectedChannels, 
  recipientOptions,
  selectedRecipients,
  setSelectedRecipients,
  teams,
  aiAssistEnabled,
  setAiAssistEnabled,
  urgentMode,
  setUrgentMode,
  onSend,
  isLoading 
}: any) {
  const [message, setMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // AI-powered message suggestions
  useEffect(() => {
    if (aiAssistEnabled && message.length > 10) {
      // Simulate AI suggestions
      const suggestions = [
        "Add emoji for better engagement 🎉",
        "Consider mentioning the event date",
        "Include a call-to-action button",
        "Translate to Spanish for better reach",
      ];
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  }, [message, aiAssistEnabled]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSend(new FormData(e.currentTarget));
    }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Compose Message</span>
                {urgentMode && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    URGENT
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Subject *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Important team update..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  required
                />
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">AI Suggestions:</div>
                    <ul className="text-sm space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="scheduledFor">Schedule for Later (Optional)</Label>
                <Input
                  id="scheduledFor"
                  name="scheduledFor"
                  type="datetime-local"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Delivery Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {channels.map((channel: any) => (
                <div key={channel.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={channel.id}
                    checked={selectedChannels.includes(channel.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChannels([...selectedChannels, channel.id]);
                      } else {
                        setSelectedChannels(selectedChannels.filter(c => c !== channel.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <div className="flex items-center space-x-2">
                    <channel.icon className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{channel.label}</div>
                      <div className="text-xs text-gray-500">{channel.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedRecipients} onValueChange={setSelectedRecipients}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recipientOptions.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* AI & Priority Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">AI Enhancement</div>
                  <div className="text-xs text-gray-500">Auto-translate & optimize</div>
                </div>
                <Switch
                  checked={aiAssistEnabled}
                  onCheckedChange={setAiAssistEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Urgent Priority</div>
                  <div className="text-xs text-gray-500">High-priority delivery</div>
                </div>
                <Switch
                  checked={urgentMode}
                  onCheckedChange={setUrgentMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Automation Rules Component
function AutomationRules({ rules }: { rules: NotificationRule[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Automation Rules</h3>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-500">
                      Trigger: {rule.triggerEvent} • Priority: {rule.priority}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{rule.channels.length} channels</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Notification History Component
function NotificationHistory({ 
  history, 
  getChannelIcon, 
  getPriorityColor 
}: { 
  history: NotificationHistory[];
  getChannelIcon: (channel: string) => any;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notification History</h3>
        <div className="flex items-center space-x-2">
          <Input placeholder="Search notifications..." className="w-64" />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{item.title}</span>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      <Users className="h-3 w-3 inline mr-1" />
                      {item.recipients} recipients
                    </span>
                    <span>
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                      {item.deliveryRate}% delivered
                    </span>
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDistanceToNow(item.sentAt)} ago
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.channels.map((channel, index) => {
                    const ChannelIcon = getChannelIcon(channel);
                    return (
                      <ChannelIcon key={index} className="h-4 w-4 text-gray-400" />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Notification Analytics Component
function NotificationAnalytics() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Communication Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">99.5%</div>
            <div className="text-sm text-gray-600">Delivery Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg. Delivery Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">87%</div>
            <div className="text-sm text-gray-600">Open Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-600">Languages Supported</div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          AI-powered sentiment analysis shows 94% positive response rate to recent notifications.
          Recommended: Continue using friendly, concise messaging with clear call-to-actions.
        </AlertDescription>
      </Alert>
    </div>
  );
}