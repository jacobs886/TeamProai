import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Plus,
  Edit,
  RefreshCw,
  Send
} from "lucide-react";

interface VolunteerSchedulingProps {
  volunteers: any[];
  tasks: any[];
  aiInsights: any;
}

export default function VolunteerScheduling({ volunteers, tasks, aiInsights }: VolunteerSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const { toast } = useToast();

  // Mock volunteer availability data
  const volunteerAvailability = [
    {
      id: "v1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      availability: {
        "2024-07-20": { morning: true, afternoon: true, evening: false },
        "2024-07-21": { morning: false, afternoon: true, evening: true },
        "2024-07-22": { morning: true, afternoon: false, evening: true }
      },
      preferences: ["Weekends", "Mornings"],
      conflicts: [],
      reliability: 95,
      pastPerformance: "excellent"
    },
    {
      id: "v2", 
      name: "Mike Thompson",
      email: "mike@example.com",
      availability: {
        "2024-07-20": { morning: true, afternoon: false, evening: true },
        "2024-07-21": { morning: true, afternoon: true, evening: false },
        "2024-07-22": { morning: false, afternoon: true, evening: true }
      },
      preferences: ["Evenings", "Weekdays"],
      conflicts: ["Out of town 7/25-7/27"],
      reliability: 88,
      pastPerformance: "good"
    },
    {
      id: "v3",
      name: "Jennifer Adams",
      email: "jennifer@example.com", 
      availability: {
        "2024-07-20": { morning: false, afternoon: true, evening: true },
        "2024-07-21": { morning: true, afternoon: true, evening: true },
        "2024-07-22": { morning: true, afternoon: true, evening: false }
      },
      preferences: ["Flexible", "Last minute"],
      conflicts: [],
      reliability: 92,
      pastPerformance: "excellent"
    }
  ];

  // Mock scheduling conflicts
  const schedulingConflicts = [
    {
      id: "c1",
      type: "volunteer_conflict",
      severity: "medium",
      description: "Sarah Johnson has overlapping commitments on 7/21 afternoon",
      affectedTasks: ["Tournament Setup", "Scorekeeper"],
      aiSuggestion: "Reassign Tournament Setup to Mike Thompson (94% skill match)",
      resolved: false
    },
    {
      id: "c2",
      type: "understaffed",
      severity: "high", 
      description: "Championship game needs 2 more volunteers",
      affectedTasks: ["Photography", "Concessions"],
      aiSuggestion: "Send targeted recruitment to photography-skilled volunteers",
      resolved: false
    },
    {
      id: "c3",
      type: "overstaffed",
      severity: "low",
      description: "Practice session has 3 volunteers for 1 needed role",
      affectedTasks: ["Equipment Setup"],
      aiSuggestion: "Redistribute to upcoming understaffed events",
      resolved: true
    }
  ];

  // Mock upcoming schedule
  const upcomingSchedule = [
    {
      date: "2024-07-20",
      events: [
        {
          id: "e1",
          name: "U12 Championship Game",
          time: "10:00 AM",
          location: "Field 3",
          assignments: [
            { volunteer: "Sarah Johnson", role: "Scorekeeper", status: "confirmed" },
            { volunteer: "Mike Thompson", role: "Equipment", status: "pending" }
          ],
          aiOptimized: true
        },
        {
          id: "e2", 
          name: "Tournament Setup",
          time: "7:00 AM",
          location: "Main Fields",
          assignments: [
            { volunteer: "Jennifer Adams", role: "Coordinator", status: "confirmed" },
            { volunteer: "David Wilson", role: "Setup Crew", status: "confirmed" }
          ],
          aiOptimized: false
        }
      ]
    },
    {
      date: "2024-07-21",
      events: [
        {
          id: "e3",
          name: "Team Practice",
          time: "6:00 PM", 
          location: "Practice Field",
          assignments: [
            { volunteer: "Mike Thompson", role: "Assistant Coach", status: "confirmed" }
          ],
          aiOptimized: true
        }
      ]
    }
  ];

  const getConflictColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConflictIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "low": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAutoSchedule = () => {
    toast({
      title: "AI Auto-Scheduling",
      description: "AI has optimized volunteer assignments based on availability and skills.",
    });
  };

  const handleResolveConflict = (conflictId: string) => {
    toast({
      title: "Conflict Resolved", 
      description: "Scheduling conflict has been resolved using AI recommendations.",
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: "Schedule reminders have been sent to all assigned volunteers.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Scheduling Intelligence */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Scheduling Intelligence</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Predictive Availability:</strong> AI predicts volunteer availability with 92% accuracy
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Conflict Prevention:</strong> Automated detection and resolution of scheduling conflicts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Optimal Matching:</strong> Smart assignment based on skills, location, and preferences
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reliability Tracking:</strong> Performance-based scheduling with 95% attendance rate
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">Calendar View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded-md"
              />
              
              <Badge variant="outline">
                {upcomingSchedule.reduce((total, day) => total + day.events.length, 0)} events
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSendReminders}>
                <Send className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>
              <Button 
                variant="outline"
                className="text-purple-600 border-purple-200"
                onClick={handleAutoSchedule}
              >
                <Zap className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Conflicts */}
      {schedulingConflicts.filter(c => !c.resolved).length > 0 && (
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Scheduling Conflicts</span>
              <Badge className="bg-red-100 text-red-800">
                {schedulingConflicts.filter(c => !c.resolved).length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedulingConflicts.filter(c => !c.resolved).map((conflict) => (
                <div key={conflict.id} className={`p-4 border rounded-lg ${getConflictColor(conflict.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getConflictIcon(conflict.severity)}
                        <span className="font-medium">{conflict.description}</span>
                      </div>
                      
                      <div className="text-sm mb-3">
                        <strong>Affected Tasks:</strong> {conflict.affectedTasks.join(", ")}
                      </div>
                      
                      <div className="flex items-start space-x-2 p-3 bg-white bg-opacity-50 rounded">
                        <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-purple-900">AI Suggestion:</span>
                          <p className="text-sm text-purple-800">{conflict.aiSuggestion}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolveConflict(conflict.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Apply AI Fix
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Manual Fix
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule View */}
      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedule.map((day) => (
                  <div key={day.date} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    
                    <div className="space-y-2">
                      {day.events.map((event) => (
                        <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{event.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{event.time}</span>
                              {event.aiOptimized && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">{event.location}</div>
                          
                          <div className="space-y-1">
                            {event.assignments.map((assignment, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{assignment.volunteer} - {assignment.role}</span>
                                <Badge className={getStatusColor(assignment.status)}>
                                  {assignment.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volunteerAvailability.map((volunteer) => (
                  <div key={volunteer.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">{volunteer.name}</span>
                        <div className="text-sm text-gray-600">{volunteer.email}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={volunteer.reliability >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {volunteer.reliability}% reliable
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{volunteer.pastPerformance}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div className="text-center">
                        <div className="font-medium">Morning</div>
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          volunteer.availability[selectedDate]?.morning ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Afternoon</div>
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          volunteer.availability[selectedDate]?.afternoon ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Evening</div>
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          volunteer.availability[selectedDate]?.evening ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-gray-600">Preferences: {volunteer.preferences.join(", ")}</div>
                      {volunteer.conflicts.length > 0 && (
                        <div className="text-red-600">Conflicts: {volunteer.conflicts.join(", ")}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle>Schedule List View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedule.flatMap(day => 
                day.events.map(event => ({
                  ...event,
                  date: day.date
                }))
              ).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      {event.assignments.length} volunteers assigned
                    </div>
                    {event.aiOptimized && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedSchedule(event)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{selectedSchedule.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Event Details</h4>
                  <div className="text-sm space-y-1">
                    <div>Time: {selectedSchedule.time}</div>
                    <div>Location: {selectedSchedule.location}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Optimization</h4>
                  <Badge className={selectedSchedule.aiOptimized ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}>
                    {selectedSchedule.aiOptimized ? "AI Optimized" : "Manual Assignment"}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Volunteer Assignments</h4>
                <div className="space-y-2">
                  {selectedSchedule.assignments.map((assignment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{assignment.volunteer} - {assignment.role}</span>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-optimize
                </Button>
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}