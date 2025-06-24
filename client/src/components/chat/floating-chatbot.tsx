import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  X, 
  Brain, 
  Minimize2, 
  Maximize2,
  Sparkles,
  Clock,
  User,
  Bot,
  Zap,
  Calendar,
  Users,
  MapPin,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
}

const QUICK_ACTIONS = [
  { label: "Schedule Practice", action: "/schedule-practice", icon: Calendar },
  { label: "Team Stats", action: "/team-stats", icon: BarChart3 },
  { label: "Book Facility", action: "/book-facility", icon: MapPin },
  { label: "Send Update", action: "/send-update", icon: Send },
];

const SUGGESTED_QUERIES = [
  "Show me today's schedule",
  "Who's playing this weekend?",
  "Book the main gym for tomorrow",
  "Send practice reminder to team",
  "Show team performance stats",
  "Check facility availability",
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hi! I'm your AI assistant for TeamPro.ai. I can help you manage teams, schedule events, analyze performance, and much more. What would you like to do today?",
      timestamp: new Date(),
      suggestions: SUGGESTED_QUERIES.slice(0, 3),
      actionButtons: QUICK_ACTIONS.slice(0, 2),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const simulateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let suggestions: string[] = [];
    let actionButtons: any[] = [];

    if (lowerMessage.includes("schedule") || lowerMessage.includes("practice")) {
      response = "I can help you schedule practices and events. I see you have the main gym available tomorrow from 3-5 PM. Would you like me to book it for your team practice?";
      actionButtons = [
        { label: "Book Main Gym", action: "/book-main-gym", icon: MapPin },
        { label: "View Full Schedule", action: "/schedule", icon: Calendar },
      ];
      suggestions = ["Show other available times", "Send practice reminder", "Check team availability"];
    } else if (lowerMessage.includes("team") || lowerMessage.includes("player")) {
      response = "I can provide team insights and player information. Your team has 15 active players with an average attendance rate of 87%. Would you like to see detailed performance analytics?";
      actionButtons = [
        { label: "View Team Stats", action: "/team-stats", icon: BarChart3 },
        { label: "Player Profiles", action: "/players", icon: Users },
      ];
      suggestions = ["Show attendance trends", "Compare with other teams", "Export team roster"];
    } else if (lowerMessage.includes("facility") || lowerMessage.includes("book")) {
      response = "I can help you book facilities. Currently, we have 3 available venues this week. The basketball court has the highest availability. Would you like me to show you the booking calendar?";
      actionButtons = [
        { label: "Open Booking Calendar", action: "/facilities", icon: Calendar },
        { label: "Check Real-time Availability", action: "/availability", icon: Zap },
      ];
      suggestions = ["Show facility prices", "Book recurring sessions", "Set availability alerts"];
    } else if (lowerMessage.includes("stats") || lowerMessage.includes("performance")) {
      response = "Your team's performance is looking great! Win rate is up 23% this season. Key metrics: 89% attendance, 4.2/5 player satisfaction, and 92% parent engagement. Want to dive deeper into specific areas?";
      actionButtons = [
        { label: "Detailed Analytics", action: "/analytics", icon: BarChart3 },
        { label: "Export Report", action: "/export-stats", icon: Send },
      ];
      suggestions = ["Compare with last season", "Individual player stats", "Opponent analysis"];
    } else if (lowerMessage.includes("notification") || lowerMessage.includes("send") || lowerMessage.includes("message")) {
      response = "I can help you send notifications to your team. With our AI-powered system, we achieve 99.5% delivery rate across all channels. What type of message would you like to send?";
      actionButtons = [
        { label: "Send Team Update", action: "/notifications", icon: Send },
        { label: "Emergency Alert", action: "/emergency", icon: Zap },
      ];
      suggestions = ["Schedule reminder for tomorrow", "Send practice cancellation", "Announce tournament results"];
    } else {
      response = "I understand you're looking for help with team management. I can assist with scheduling, player management, facility booking, performance analytics, and communication. What specific area would you like to explore?";
      suggestions = SUGGESTED_QUERIES.slice(0, 3);
      actionButtons = QUICK_ACTIONS.slice(0, 2);
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      suggestions,
      actionButtons,
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    try {
      const botResponse = await simulateAIResponse(currentMessage);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Sorry, I'm having trouble right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleActionClick = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `Navigating to ${action}`,
    });
    // In a real implementation, this would navigate to the appropriate page
    window.location.hash = action;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simulate periodic notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        setHasUnread(true);
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className={`
            relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg 
            transition-all duration-300 hover:scale-105
            ${hasUnread ? 'animate-pulse' : ''}
          `}
        >
          <MessageCircle className="h-4 w-4 text-white" />
          {hasUnread && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className={`
        w-80 shadow-xl border-0 transition-all duration-300
        ${isMinimized ? 'h-12' : 'h-[400px]'}
      `}>
        {/* Header */}
        <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="w-6 h-6 bg-white/20">
                  <AvatarFallback className="bg-white/20 text-white">
                    <Brain className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div>
                <span className="font-medium text-sm">AI Assistant</span>
                {!isMinimized && (
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by TeamPro.ai</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {messages.map((message) => (
                <div key={message.id} className={`flex mb-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[80%] rounded-lg p-3 space-y-2
                    ${message.type === "user" 
                      ? "bg-blue-500 text-white ml-4" 
                      : "bg-gray-100 text-gray-900 mr-4"
                    }
                  `}>
                    <div className="flex items-start space-x-2">
                      {message.type === "bot" && (
                        <Brain className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {format(message.timestamp, "HH:mm")}
                          </span>
                          {message.type === "user" && (
                            <User className="h-3 w-3 text-blue-100" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {message.actionButtons && message.actionButtons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actionButtons.map((button, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionClick(button.action)}
                            className="text-xs h-7 bg-white hover:bg-gray-50"
                          >
                            {button.icon && <button.icon className="h-3 w-3 mr-1" />}
                            {button.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <div className="text-xs text-gray-600 font-medium">Suggested questions:</div>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3 mr-4">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your team..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Press Enter to send</span>
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}