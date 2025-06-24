import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  AlertTriangle, 
  Reply, 
  MoreVertical,
  Users,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TeamChatProps {
  teamId: number;
  teamName: string;
}

export default function TeamChat({ teamId, teamName }: TeamChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [replyTo, setReplyTo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/teams", teamId, "messages"],
    refetchInterval: 3000, // Refresh every 3 seconds for real-time feel
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/teams", teamId, "members"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      await apiRequest("POST", `/api/teams/${teamId}/messages`, messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", teamId, "messages"] });
      setMessage("");
      setIsUrgent(false);
      setReplyTo(null);
      toast({
        title: "Message sent",
        description: isUrgent ? "Urgent message delivered to all team members" : "Message sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      message: message.trim(),
      isUrgent,
      replyToId: replyTo?.id || null,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onlineMembers = teamMembers?.length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Team Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            {teamName} Chat
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {onlineMembers} members
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
        {replyTo && (
          <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Replying to {replyTo.senderName}:</span>
                <p className="text-gray-600 truncate">{replyTo.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(null)}
                className="text-gray-400"
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <div key={msg.id} className="group">
                  <div className={cn(
                    "flex items-start space-x-3",
                    msg.senderId === user?.id && "flex-row-reverse space-x-reverse"
                  )}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={msg.senderImage} alt={msg.senderName} />
                      <AvatarFallback>
                        {msg.senderName?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={cn(
                      "flex-1 max-w-xs lg:max-w-md",
                      msg.senderId === user?.id && "text-right"
                    )}>
                      <div className="flex items-center space-x-2 mb-1">
                        {msg.senderId !== user?.id && (
                          <span className="text-sm font-medium text-gray-900">
                            {msg.senderName}
                          </span>
                        )}
                        {msg.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                      
                      {msg.replyTo && (
                        <div className="bg-gray-100 p-2 rounded mb-2 text-xs border-l-2 border-gray-300">
                          <span className="font-medium">{msg.replyTo.senderName}:</span>
                          <p className="text-gray-600">{msg.replyTo.message}</p>
                        </div>
                      )}
                      
                      <div className={cn(
                        "p-3 rounded-lg",
                        msg.senderId === user?.id
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900",
                        msg.isUrgent && "ring-2 ring-red-400"
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      
                      <div className="flex items-center mt-1 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo({
                            id: msg.id,
                            senderName: msg.senderName,
                            message: msg.message
                          })}
                          className="text-xs h-6 px-2"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation!</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              maxLength={500}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant={isUrgent ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsUrgent(!isUrgent)}
              className="text-xs"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {isUrgent ? "Urgent Message" : "Mark Urgent"}
            </Button>
            <span className="text-xs text-gray-400">
              {message.length}/500 characters
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}