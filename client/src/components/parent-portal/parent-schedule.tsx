import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  X,
  CalendarPlus,
  Bell,
  Brain,
  Zap,
  Navigation,
  Phone,
  MessageSquare
} from "lucide-react";

interface ParentScheduleProps {
  childId: string;
  aiInsights: any;
}

export default function ParentSchedule({ childId, aiInsights }: ParentScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  const { toast } = useToast();

  // Mock schedule data
  const upcomingEvents = [
    {
      id: "1",
      type: "game",
      title: "Hawks vs Eagles",
      description: "Championship Quarter Final",
      date: "2024-07-27",
      time: "10:00 AM",
      endTime: "12:00 PM",
      location: "Community Sports Complex - Field 3",
      address: "123 Sports Drive, City, State 12345",
      coach: "Coach Sarah Williams",
      coachPhone: "(555) 123-4567",
      rsvpStatus: "confirmed",
      rsvpDeadline: "2024-07-25",
      attendeeCount: 18,
      teamSize: 20,
      weather: "Sunny, 75°F",
      requirements: ["Arrive 30 minutes early", "Bring water bottle", "Wear away uniform"],
      aiRecommendations: [
        "Based on traffic patterns, leave by 9:15 AM",
        "Your child performs 15% better in morning games",
        "Pack extra snacks - game may run long"
      ],
      carpoolAvailable: true,
      liveUpdates: true
    },
    {
      id: "2",
      type: "practice",
      title: "Team Practice",
      description: "Scrimmage and skill drills",
      date: "2024-07-23",
      time: "6:00 PM",
      endTime: "7:30 PM",
      location: "Roosevelt Elementary - Back Field",
      address: "456 School Lane, City, State 12345",
      coach: "Coach Mike Johnson",
      coachPhone: "(555) 234-5678",
      rsvpStatus: "pending",
      rsvpDeadline: "2024-07-22",
      attendeeCount: 16,
      teamSize: 20,
      weather: "Partly cloudy, 72°F",
      requirements: ["Bring cleats", "Water bottle", "Practice jersey"],
      aiRecommendations: [
        "Your child's best practice attendance day",
        "Suggest carpooling with the Johnson family",
        "Practice focuses on shooting - your child's improvement area"
      ],
      carpoolAvailable: true,
      liveUpdates: false
    },
    {
      id: "3",
      type: "tournament",
      title: "Summer Tournament",
      description: "All-day tournament event",
      date: "2024-08-03",
      time: "8:00 AM",
      endTime: "6:00 PM",
      location: "Regional Sports Park",
      address: "789 Tournament Way, City, State 12345",
      coach: "Coach Sarah Williams",
      coachPhone: "(555) 123-4567",
      rsvpStatus: "not_responded",
      rsvpDeadline: "2024-07-28",
      attendeeCount: 0,
      teamSize: 20,
      weather: "To be determined",
      requirements: ["Full uniform", "Lunch and snacks", "Folding chair", "Sunscreen"],
      aiRecommendations: [
        "Tournament requires full day commitment",
        "Book hotel night before for early start",
        "Your child excels in tournament pressure situations"
      ],
      carpoolAvailable: false,
      liveUpdates: true
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "game": return "bg-green-100 text-green-800";
      case "practice": return "bg-blue-100 text-blue-800";
      case "tournament": return "bg-purple-100 text-purple-800";
      case "meeting": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRSVPColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "declined": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "not_responded": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getRSVPIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "declined": return <X className="h-4 w-4 text-red-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "not_responded": return <Bell className="h-4 w-4 text-gray-600" />;
      default: return <Calendar className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleRSVP = (eventId: string, response: "confirmed" | "declined") => {
    toast({
      title: "RSVP Updated",
      description: `Your response has been recorded as ${response}.`,
    });
  };

  const handleAddToCalendar = (event: any) => {
    toast({
      title: "Calendar Event",
      description: "Event details have been prepared for your calendar app.",
    });
  };

  const handleGetDirections = (address: string) => {
    // In a real app, this would open maps with directions
    toast({
      title: "Directions",
      description: "Opening directions to the venue.",
    });
  };

  const handleContactCoach = (phone: string) => {
    toast({
      title: "Contact Coach",
      description: "Opening phone app to contact coach.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Schedule Intelligence */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Schedule Intelligence</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Scheduling:</strong> AI predicts your availability with 92% accuracy
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Reliable Notifications:</strong> 99.5% delivery rate with priority alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Navigation className="h-4 w-4" />
              <AlertDescription>
                <strong>Travel Optimization:</strong> AI suggests optimal departure times based on traffic
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Performance Insights:</strong> Track how schedule affects your child's performance
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="p-2 border rounded-md"
              >
                <option value="list">List View</option>
                <option value="calendar">Calendar View</option>
              </select>
              
              <Badge variant="outline">
                {upcomingEvents.length} upcoming events
              </Badge>
              
              <Badge className="bg-green-100 text-green-800">
                {upcomingEvents.filter(e => e.rsvpStatus === "confirmed").length} confirmed
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Sync Calendar
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                  {getRSVPIcon(event.rsvpStatus)}
                  <Badge className={getRSVPColor(event.rsvpStatus)}>
                    {event.rsvpStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{event.time} - {event.endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-gray-600">
                      <button 
                        onClick={() => handleGetDirections(event.address)}
                        className="text-blue-600 hover:underline"
                      >
                        Get directions
                      </button>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Coach {event.coach.split(' ')[1]}</p>
                    <p className="text-sm text-gray-600">
                      <button 
                        onClick={() => handleContactCoach(event.coachPhone)}
                        className="text-blue-600 hover:underline"
                      >
                        {event.coachPhone}
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* RSVP Section */}
              {event.rsvpStatus !== "confirmed" && event.rsvpStatus !== "declined" && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">RSVP Required</p>
                      <p className="text-sm text-yellow-700">
                        Please respond by {new Date(event.rsvpDeadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleRSVP(event.id, "confirmed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-200"
                        onClick={() => handleRSVP(event.id, "declined")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Weather Forecast</h4>
                  <p className="text-sm text-gray-600">{event.weather}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Recommendations */}
              {event.aiRecommendations && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">AI Recommendations</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {event.aiRecommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-purple-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Features */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{event.attendeeCount}/{event.teamSize} attending</span>
                  {event.carpoolAvailable && (
                    <Badge variant="outline" className="text-xs">
                      Carpool Available
                    </Badge>
                  )}
                  {event.liveUpdates && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Live Updates
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddToCalendar(event)}
                  >
                    <CalendarPlus className="h-4 w-4 mr-1" />
                    Add to Calendar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl" aria-describedby="event-details-description">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{selectedEvent.title}</span>
              </DialogTitle>
              <div id="event-details-description" className="sr-only">
                View detailed event information including time, location, and RSVP options.
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Event Details</h4>
                  <div className="text-sm space-y-1">
                    <div>Date: {new Date(selectedEvent.date).toLocaleDateString()}</div>
                    <div>Time: {selectedEvent.time} - {selectedEvent.endTime}</div>
                    <div>Type: {selectedEvent.type}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="text-sm space-y-1">
                    <div>{selectedEvent.location}</div>
                    <div className="text-gray-600">{selectedEvent.address}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Coach Information</h4>
                <div className="flex items-center space-x-4">
                  <span>{selectedEvent.coach}</span>
                  <Button variant="outline" size="sm" onClick={() => handleContactCoach(selectedEvent.coachPhone)}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">What to Bring</h4>
                <ul className="text-sm space-y-1">
                  {selectedEvent.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => handleGetDirections(selectedEvent.address)}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button className="flex-1" onClick={() => handleAddToCalendar(selectedEvent)}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}