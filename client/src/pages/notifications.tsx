import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Check,
  Clock,
  AlertTriangle,
  Info
} from "lucide-react";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch notifications data
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/notifications"],
  });

  // Create notification mutation
  const createNotificationMutation = useMutation({
    mutationFn: (notificationData: any) => apiRequest("POST", "/api/notifications", notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Notification Sent",
        description: "Notification has been successfully sent.",
      });
      setShowNotificationForm(false);
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const filteredNotifications = notifications.filter((notification: any) => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "read" && notification.isRead) ||
                         (statusFilter === "unread" && !notification.isRead);
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateNotification = (notificationData: any) => {
    createNotificationMutation.mutate(notificationData);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "info": return "bg-blue-100 text-blue-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "urgent": return "bg-red-100 text-red-800";
      case "success": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "info": return <Info className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "urgent": return <AlertTriangle className="h-4 w-4" />;
      case "success": return <Check className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Manage team communications and alerts</p>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} unread
              </Badge>
            )}
            <Button onClick={() => setShowNotificationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                  <option value="success">Success</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">Email Blast</h3>
                  <p className="text-xs text-gray-600">Send to all parents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium">Team Message</h3>
                  <p className="text-xs text-gray-600">Notify team members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-medium">SMS Alert</h3>
                  <p className="text-xs text-gray-600">Emergency notification</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-medium">Urgent Alert</h3>
                  <p className="text-xs text-gray-600">Critical announcement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Found</h3>
                <p className="text-gray-600 mb-4">Send your first notification to get started.</p>
                <Button onClick={() => setShowNotificationForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Send First Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification: any) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-lg transition-shadow ${!notification.isRead ? 'border-l-4 border-blue-500 bg-blue-50' : ''}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Sent: {new Date(notification.createdAt).toLocaleString()}</span>
                          <span>To: {notification.recipient || "All team members"}</span>
                          {notification.deliveryMethod && (
                            <span>Via: {notification.deliveryMethod}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Notification Form Modal */}
      <Dialog open={showNotificationForm} onOpenChange={setShowNotificationForm}>
        <DialogContent aria-describedby="notification-form-description" className="max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Send Notification</DialogTitle>
            <div id="notification-form-description" className="text-sm text-gray-600">
              Send notifications to team members via multiple channels including email, SMS, and push notifications.
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const notificationData = {
                  title: formData.get("title"),
                  message: formData.get("message"),
                  type: formData.get("type"),
                  recipient: formData.get("recipient"),
                  deliveryMethod: formData.get("deliveryMethod"),
                };
                handleCreateNotification(notificationData);
              }}
              className="space-y-4"
            >
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" placeholder="Notification title" required />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                name="message"
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Your notification message..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select name="type" className="w-full p-2 border rounded-md" required>
                  <option value="">Select Type</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Method</label>
                <select name="deliveryMethod" className="w-full p-2 border rounded-md" required>
                  <option value="">Select Method</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="all">All Methods</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Recipients</label>
              <select name="recipient" className="w-full p-2 border rounded-md" required>
                <option value="">Select Recipients</option>
                <option value="all">All Team Members</option>
                <option value="parents">Parents Only</option>
                <option value="players">Players Only</option>
                <option value="coaches">Coaches Only</option>
              </select>
            </div>
              <div className="flex space-x-3 pt-4 border-t bg-white sticky bottom-0">
                <Button type="button" variant="outline" onClick={() => setShowNotificationForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Notification</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}