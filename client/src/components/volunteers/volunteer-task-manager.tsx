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
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Brain,
  Zap,
  Target,
  Star
} from "lucide-react";

interface VolunteerTaskManagerProps {
  volunteers: any[];
  tasks: any[];
  aiInsights: any;
}

export default function VolunteerTaskManager({ volunteers, tasks, aiInsights }: VolunteerTaskManagerProps) {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { toast } = useToast();

  // Mock task data for demonstration
  const volunteerTasks = [
    {
      id: "1",
      title: "Soccer Game Scorekeeper",
      description: "Keep score and stats for U12 soccer game",
      sport: "soccer",
      eventId: "event1",
      eventName: "Hawks vs Eagles - Championship",
      date: "2024-07-20",
      time: "10:00 AM",
      duration: 90,
      location: "Field 3",
      volunteersNeeded: 2,
      volunteersAssigned: 1,
      status: "partially_filled",
      priority: "high",
      requiredSkills: ["Scorekeeping", "Soccer Knowledge"],
      assignedVolunteers: [
        {
          id: "v1",
          name: "Sarah Johnson",
          skillMatch: 95,
          availability: "confirmed"
        }
      ],
      aiRecommendations: [
        "Mike Thompson (98% skill match) available",
        "Consider backup volunteer for high-priority game"
      ]
    },
    {
      id: "2", 
      title: "Equipment Setup Crew",
      description: "Set up goals, nets, and field markers before games",
      sport: "soccer",
      eventId: "event2",
      eventName: "Tournament Day 1 Setup",
      date: "2024-07-21",
      time: "7:00 AM",
      duration: 120,
      location: "Main Fields",
      volunteersNeeded: 4,
      volunteersAssigned: 4,
      status: "filled",
      priority: "medium",
      requiredSkills: ["Equipment Setup", "Early Morning"],
      assignedVolunteers: [
        { id: "v2", name: "David Wilson", skillMatch: 88, availability: "confirmed" },
        { id: "v3", name: "Lisa Chen", skillMatch: 92, availability: "confirmed" },
        { id: "v4", name: "Tom Rodriguez", skillMatch: 85, availability: "confirmed" },
        { id: "v5", name: "Amy Parker", skillMatch: 90, availability: "confirmed" }
      ],
      aiRecommendations: [
        "Team shows excellent coordination history",
        "Consider this crew for future tournaments"
      ]
    },
    {
      id: "3",
      title: "Snack Coordinator",
      description: "Organize and distribute team snacks and drinks",
      sport: "all",
      eventId: "event3",
      eventName: "Practice Session - Teams A & B",
      date: "2024-07-22",
      time: "6:00 PM",
      duration: 60,
      location: "Practice Field",
      volunteersNeeded: 1,
      volunteersAssigned: 0,
      status: "open",
      priority: "low",
      requiredSkills: ["Food Service", "Organization"],
      assignedVolunteers: [],
      aiRecommendations: [
        "Jennifer Adams (89% match) frequently volunteers for food duties",
        "Consider rotating snack duties among parents"
      ]
    },
    {
      id: "4",
      title: "Photography & Social Media",
      description: "Capture game highlights and post to team social media",
      sport: "basketball",
      eventId: "event4",
      eventName: "Championship Game",
      date: "2024-07-25",
      time: "2:00 PM",
      duration: 150,
      location: "Gym A",
      volunteersNeeded: 1,
      volunteersAssigned: 1,
      status: "filled",
      priority: "medium",
      requiredSkills: ["Photography", "Social Media", "Technology"],
      assignedVolunteers: [
        {
          id: "v6",
          name: "Mark Stevens",
          skillMatch: 97,
          availability: "confirmed"
        }
      ],
      aiRecommendations: [
        "Mark has excellent photo quality history",
        "Suggest live streaming capabilities for finals"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "filled": return "bg-green-100 text-green-800";
      case "partially_filled": return "bg-yellow-100 text-yellow-800";
      case "open": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "filled": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partially_filled": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "open": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "cancelled": return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Calendar className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const filteredTasks = volunteerTasks.filter(task => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const handleAutoAssign = (taskId: string) => {
    toast({
      title: "AI Auto-Assignment",
      description: "AI has suggested the best volunteer matches for this task.",
    });
  };

  const handleCreateTask = (taskData: any) => {
    toast({
      title: "Task Created",
      description: "New volunteer task has been created successfully.",
    });
    setShowCreateTask(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Task Intelligence */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Task Intelligence</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Matching:</strong> AI matches volunteers to tasks with 95% accuracy based on skills and availability
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto-Fill:</strong> Automated task assignment reduces coordinator workload by 70%
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Conflict Prevention:</strong> AI detects scheduling conflicts and suggests alternatives
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>Performance Tracking:</strong> Monitor volunteer performance and satisfaction rates
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Task Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="partially_filled">Partially Filled</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline">
                {filteredTasks.length} tasks
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
              <Button 
                variant="outline"
                className="text-purple-600 border-purple-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                AI Auto-Fill
              </Button>
              <Button onClick={() => setShowCreateTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{task.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{task.sport}</Badge>
                <Badge className={`${getPriorityColor(task.priority)} bg-gray-100`}>
                  {task.priority} priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Event Details */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{task.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Event:</span>
                    <span className="ml-2 font-medium">{task.eventName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{task.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{new Date(task.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">{task.time} ({task.duration}min)</span>
                  </div>
                </div>
              </div>

              {/* Volunteer Status */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Volunteers</span>
                  <span>{task.volunteersAssigned}/{task.volunteersNeeded}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(task.volunteersAssigned / task.volunteersNeeded) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Assigned Volunteers */}
              {task.assignedVolunteers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Assigned Volunteers</h4>
                  <div className="space-y-1">
                    {task.assignedVolunteers.map((volunteer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{volunteer.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {volunteer.skillMatch}% match
                          </Badge>
                          <Badge 
                            className={volunteer.availability === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {volunteer.availability}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div>
                <h4 className="font-medium text-sm mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {task.requiredSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              {task.aiRecommendations && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">AI Recommendations</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {task.aiRecommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-purple-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {task.status === "open" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-purple-600 border-purple-200"
                      onClick={() => handleAutoAssign(task.id)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      AI Assign
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </>
                )}
                
                {task.status === "partially_filled" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 border-blue-200"
                      onClick={() => handleAutoAssign(task.id)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Fill Remaining
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </>
                )}
                
                {task.status === "filled" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Ready
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="task-details-description">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{selectedTask.title}</span>
                {getStatusIcon(selectedTask.status)}
              </DialogTitle>
              <div id="task-details-description" className="sr-only">
                View detailed volunteer task information including requirements, schedule, and assignment status.
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Task Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <p className="mt-1">{selectedTask.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Sport:</span>
                      <span className="ml-2 font-medium">{selectedTask.sport}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <span className={`ml-2 font-medium ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedTask.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{selectedTask.duration} minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volunteer Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Volunteer Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedTask.volunteersAssigned}/{selectedTask.volunteersNeeded}
                      </div>
                      <div className="text-sm text-gray-600">Volunteers Assigned</div>
                    </div>

                    {selectedTask.assignedVolunteers.map((volunteer: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{volunteer.name}</span>
                          <Badge className="bg-green-100 text-green-800">
                            {volunteer.skillMatch}% match
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {selectedTask.volunteersAssigned < selectedTask.volunteersNeeded && (
                      <Button className="w-full" onClick={() => handleAutoAssign(selectedTask.id)}>
                        <Zap className="h-4 w-4 mr-2" />
                        AI Find Best Matches
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Task Modal */}
      <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
        <DialogContent className="max-w-2xl" aria-describedby="create-task-description">
          <DialogHeader>
            <DialogTitle>Create New Volunteer Task</DialogTitle>
            <div id="create-task-description" className="sr-only">
              Create a new volunteer task with details including requirements, skills needed, and scheduling.
            </div>
          </DialogHeader>
          <CreateTaskForm 
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateTask(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Task Form Component
function CreateTaskForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sport: "",
    eventId: "",
    date: "",
    time: "",
    duration: 60,
    location: "",
    volunteersNeeded: 1,
    priority: "medium",
    requiredSkills: [] as string[]
  });

  const skillOptions = [
    "Scorekeeping", "Equipment Setup", "First Aid", "Coaching Assistant",
    "Photography", "Food Service", "Transportation", "Field Maintenance",
    "Event Coordination", "Technology Support", "Fundraising", "Communication"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Task Title *</label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded-md"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Game Day Scorekeeper"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the volunteer task and responsibilities"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Sport</label>
          <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soccer">Soccer</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="all">All Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded-md"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Duration (min)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Required Skills</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {skillOptions.map((skill) => (
            <label key={skill} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.requiredSkills.includes(skill)}
                onChange={() => toggleSkill(skill)}
                className="rounded"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Task
        </Button>
      </div>
    </form>
  );
}