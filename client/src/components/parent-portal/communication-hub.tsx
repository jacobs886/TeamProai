import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  Bell,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  CheckCircle,
  Brain,
  Zap,
  Users,
  Megaphone,
  Bot,
  Star
} from "lucide-react";

interface CommunicationHubProps {
  childId: string;
  aiInsights: any;
}

export default function CommunicationHub({ childId, aiInsights }: CommunicationHubProps) {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showAiChatbot, setShowAiChatbot] = useState(false);
  const [aiChatInput, setAiChatInput] = useState("");

  const { toast } = useToast();

  // Mock conversation data
  const conversations = [
    {
      id: "conv_001",
      type: "coach",
      name: "Coach Sarah Williams",
      role: "Head Coach",
      lastMessage: "Great practice today! Alex showed excellent improvement in ball control.",
      timestamp: "2024-07-22T18:30:00Z",
      unread: false,
      priority: "normal",
      avatar: "SW"
    },
    {
      id: "conv_002",
      type: "team_admin",
      name: "Team Administration",
      role: "Team Manager",
      lastMessage: "Reminder: Tournament registration due by Friday. Please confirm attendance.",
      timestamp: "2024-07-22T14:15:00Z",
      unread: true,
      priority: "high",
      avatar: "TA"
    },
    {
      id: "conv_003",
      type: "parent_group",
      name: "Team Parents Group",
      role: "Parent Chat",
      lastMessage: "Emma Johnson: Can anyone help with carpool for Saturday's game?",
      timestamp: "2024-07-22T12:45:00Z",
      unread: true,
      priority: "normal",
      avatar: "PG"
    },
    {
      id: "conv_004",
      type: "urgent",
      name: "Weather Alert System",
      role: "Automated Alerts",
      lastMessage: "URGENT: Saturday's game postponed due to severe weather conditions.",
      timestamp: "2024-07-21T20:30:00Z",
      unread: false,
      priority: "urgent",
      avatar: "WX"
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: "msg_001",
      senderId: "coach_sarah",
      senderName: "Coach Sarah",
      content: "Great practice today! Alex showed excellent improvement in ball control.",
      timestamp: "2024-07-22T18:30:00Z",
      type: "text",
      isFromParent: false
    },
    {
      id: "msg_002",
      senderId: "parent_current",
      senderName: "You",
      content: "Thank you for the feedback! We've been practicing at home too.",
      timestamp: "2024-07-22T18:45:00Z",
      type: "text",
      isFromParent: true
    },
    {
      id: "msg_003",
      senderId: "coach_sarah",
      senderName: "Coach Sarah",
      content: "That's wonderful to hear! Keep encouraging the extra practice. Next week we'll focus on shooting techniques.",
      timestamp: "2024-07-22T19:00:00Z",
      type: "text",
      isFromParent: false
    }
  ];

  // Mock announcements
  const announcements = [
    {
      id: "ann_001",
      title: "Tournament Schedule Released",
      content: "The summer tournament schedule is now available. Please check the schedule tab for details.",
      priority: "high",
      timestamp: "2024-07-22T10:00:00Z",
      author: "Team Administration",
      category: "tournament",
      urgent: false
    },
    {
      id: "ann_002",
      title: "Practice Field Change",
      content: "Tuesday's practice moved to Roosevelt Elementary back field due to field maintenance.",
      priority: "urgent",
      timestamp: "2024-07-21T16:30:00Z",
      author: "Coach Sarah",
      category: "schedule",
      urgent: true
    },
    {
      id: "ann_003",
      title: "Team Photo Day",
      content: "Team and individual photos will be taken this Saturday before the game. Arrive 30 minutes early.",
      priority: "normal",
      timestamp: "2024-07-20T09:15:00Z",
      author: "Team Manager",
      category: "event",
      urgent: false
    }
  ];

  // Mock AI chatbot responses
  const handleAiChatSubmit = (question: string) => {
    const aiResponses = {
      "next game": "Your next game is this Saturday, July 27th at 10:00 AM against the Eagles at Community Sports Complex.",
      "practice schedule": "Practices are Tuesdays and Thursdays at 6:00 PM at Roosevelt Elementary back field.",
      "coach contact": "Coach Sarah Williams can be reached at (555) 123-4567 or sarah.williams@teammail.com",
      "payment due": "Your next payment of $45.00 is due August 1st for monthly team fees. Auto-pay is enabled.",
      "equipment needed": "For this week, make sure Alex brings cleats, shin guards, water bottle, and practice jersey."
    };

    const response = Object.entries(aiResponses).find(([key]) => 
      question.toLowerCase().includes(key)
    )?.[1] || "I can help you with schedule, payment, coach contact, and equipment questions. What would you like to know?";

    return response;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high": return <Bell className="h-4 w-4 text-orange-600" />;
      case "normal": return <MessageCircle className="h-4 w-4 text-blue-600" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been delivered successfully.",
    });
    setNewMessage("");
  };

  const handleAiChat = () => {
    if (!aiChatInput.trim()) return;
    
    const response = handleAiChatSubmit(aiChatInput);
    toast({
      title: "AI Assistant",
      description: response,
    });
    setAiChatInput("");
  };

  const handleMarkAsRead = (conversationId: string) => {
    toast({
      title: "Marked as Read",
      description: "Conversation has been marked as read.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Communication Intelligence */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Communication Intelligence</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Chatbot:</strong> Get instant answers to common questions 24/7
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Alerts:</strong> AI prioritizes urgent messages with 99.5% delivery rate
              </AlertDescription>
            </Alert>
            
            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sentiment Analysis:</strong> AI detects urgent messages and escalates appropriately
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto-Response:</strong> AI suggests quick replies and reduces coach query time
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Communication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{conversations.filter(c => c.unread).length}</p>
                <p className="text-xs text-gray-600">Unread Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Megaphone className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{announcements.filter(a => a.urgent).length}</p>
                <p className="text-xs text-gray-600">Urgent Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-xs text-gray-600">AI Assistant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">99.5%</p>
                <p className="text-xs text-gray-600">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chatbot Quick Access */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>AI Assistant</span>
            <Badge className="bg-purple-100 text-purple-800">Ask Me Anything</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about schedules, payments, contacts, or equipment..."
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
              className="flex-1"
            />
            <Button onClick={handleAiChat} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Next game?", "Practice schedule?", "Coach contact?", "Payment due?"].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setAiChatInput(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>Team Announcements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`p-4 border rounded-lg ${getPriorityColor(announcement.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPriorityIcon(announcement.priority)}
                      <h4 className="font-medium">{announcement.title}</h4>
                      {announcement.urgent && (
                        <Badge className="bg-red-100 text-red-800 text-xs">URGENT</Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{announcement.content}</p>
                    <div className="flex items-center space-x-3 text-xs opacity-75">
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{new Date(announcement.timestamp).toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {announcement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                    conversation.unread ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      conversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {conversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <div className="flex items-center space-x-2">
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{conversation.role}</p>
                      <p className="text-sm text-gray-800 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Coach Sarah: (555) 123-4567
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Team Manager
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Parent Group Chat
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Emergency
              </Button>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Communication Tips</span>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Use AI chatbot for quick questions</li>
                <li>• Check announcements for urgent updates</li>
                <li>• Coach responds within 4 hours typically</li>
                <li>• Emergency contacts available 24/7</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="conversation-details-description">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>{selectedConversation.name}</span>
                {selectedConversation.unread && (
                  <Badge className="bg-blue-100 text-blue-800">Unread</Badge>
                )}
              </DialogTitle>
              <div id="conversation-details-description" className="sr-only">
                View conversation details and message history with coaches and team administrators.
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Messages */}
              <div className="max-h-60 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromParent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.isFromParent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isFromParent ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Conversation Actions */}
              <div className="flex space-x-3 pt-3 border-t">
                {selectedConversation.unread && (
                  <Button variant="outline" onClick={() => handleMarkAsRead(selectedConversation.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}