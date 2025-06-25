import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Trophy,
  Edit,
  Filter,
  Mountain
} from "lucide-react";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch events data
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (eventData: any) => apiRequest("POST", "/api/events", eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Created",
        description: "New event has been successfully scheduled.",
      });
      setShowEventForm(false);
    },
  });

  const handleCreateEvent = (eventData: any) => {
    createEventMutation.mutate(eventData);
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "game": return "bg-green-100 text-green-800";
      case "practice": return "bg-blue-100 text-blue-800";
      case "tournament": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule & Events</h1>
            <p className="text-gray-600">Manage games, practices, and tournaments</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
              <Calendar className="h-4 w-4 mr-2" />
              {viewMode === "list" ? "Calendar View" : "List View"}
            </Button>
            <Button onClick={() => setShowEventForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                All Events
              </Button>
              <Button variant="outline" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Games Only
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Practices Only
              </Button>
              <Button variant="outline" size="sm">
                <Mountain className="h-4 w-4 mr-2" />
                Camps Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
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
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Scheduled</h3>
                <p className="text-gray-600 mb-4">Schedule your first event to get started.</p>
                <Button onClick={() => setShowEventForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Event
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event: any) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {event.type === "game" ? (
                          <Trophy className="h-6 w-6 text-blue-600" />
                        ) : event.type === "camp" ? (
                          <Mountain className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Users className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.startTime)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="mt-3 text-gray-600">{event.description}</p>
                  )}
                  
                  {event.opponent && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium">vs. {event.opponent}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const eventData = {
                title: formData.get("title"),
                type: formData.get("type"),
                date: formData.get("date"),
                startTime: formData.get("startTime"),
                location: formData.get("location"),
                description: formData.get("description"),
              };
              handleCreateEvent(eventData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Event Title</label>
              <input name="title" className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium">Event Type</label>
              <select name="type" className="w-full p-2 border rounded-md" required>
                <option value="">Select Type</option>
                <option value="game">Game</option>
                <option value="practice">Practice</option>
                <option value="tournament">Tournament</option>
                <option value="camp">Camp</option>
                <option value="meeting">Team Meeting</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <input name="date" type="date" className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input name="startTime" type="time" className="w-full p-2 border rounded-md" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <input name="location" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowEventForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}