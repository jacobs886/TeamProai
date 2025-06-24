import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Brain,
  Zap,
  UserPlus,
  Coffee,
  Camera,
  Car
} from "lucide-react";

interface VolunteerPortalProps {
  aiInsights: any;
}

export default function VolunteerPortal({ aiInsights }: VolunteerPortalProps) {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const { toast } = useToast();

  // Mock volunteer tasks
  const availableTasks = [
    {
      id: "task_001",
      title: "Game Day Scorekeeper",
      description: "Keep official score and track statistics during the championship game",
      date: "2024-07-27",
      time: "9:30 AM - 12:00 PM",
      location: "Community Sports Complex - Field 3",
      spotsNeeded: 1,
      spotsSignedUp: 0,
      skills: ["Scorekeeping", "Basic Math"],
      benefits: ["Great view of the game", "Team recognition"],
      timeCommitment: "2.5 hours",
      difficulty: "Easy",
      aiMatch: 95,
      urgent: false
    },
    {
      id: "task_002",
      title: "Snack Coordinator",
      description: "Organize and distribute halftime snacks and drinks for the team",
      date: "2024-07-24",
      time: "5:30 PM - 7:30 PM",
      location: "Roosevelt Elementary - Back Field",
      spotsNeeded: 2,
      spotsSignedUp: 1,
      skills: ["Organization", "Food Service"],
      benefits: ["Connect with other parents", "Help team nutrition"],
      timeCommitment: "2 hours",
      difficulty: "Easy",
      aiMatch: 88,
      urgent: false
    },
    {
      id: "task_003",
      title: "Team Photographer",
      description: "Capture action shots and team moments during tournament games",
      date: "2024-08-03",
      time: "8:00 AM - 6:00 PM",
      location: "Regional Sports Park",
      spotsNeeded: 1,
      spotsSignedUp: 0,
      skills: ["Photography", "Camera Equipment"],
      benefits: ["Professional photos for team", "Tournament access"],
      timeCommitment: "Full day",
      difficulty: "Moderate",
      aiMatch: 72,
      urgent: false
    },
    {
      id: "task_004",
      title: "Carpool Coordinator",
      description: "URGENT: Help organize transportation for away game",
      date: "2024-07-25",
      time: "4:00 PM - 8:00 PM",
      location: "Away Game - Westfield Complex",
      spotsNeeded: 1,
      spotsSignedUp: 0,
      skills: ["Organization", "Communication"],
      benefits: ["Help team logistics", "Connect with families"],
      timeCommitment: "4 hours",
      difficulty: "Easy",
      aiMatch: 92,
      urgent: true
    }
  ];

  // Mock volunteer history
  const volunteerHistory = [
    {
      id: "hist_001",
      task: "Equipment Setup",
      date: "2024-07-15",
      hours: 2,
      rating: 5,
      feedback: "Great job organizing equipment! Very helpful and efficient.",
      badgeEarned: "Team Helper"
    },
    {
      id: "hist_002",
      task: "Game Day Snacks",
      date: "2024-07-08",
      hours: 1.5,
      rating: 5,
      feedback: "Parents and kids loved the healthy snack options!",
      badgeEarned: null
    },
    {
      id: "hist_003",
      task: "Field Cleanup",
      date: "2024-06-30",
      hours: 1,
      rating: 4,
      feedback: "Thanks for staying after to help clean up.",
      badgeEarned: null
    }
  ];

  // Mock recognition data
  const recognition = {
    totalHours: 15.5,
    tasksCompleted: 8,
    rating: 4.8,
    badges: ["Team Helper", "Event Champion", "Reliable Volunteer"],
    rank: "Top 10%",
    nextBadge: "Super Volunteer",
    progressToNext: 75
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskIcon = (title: string) => {
    if (title.toLowerCase().includes("score")) return <CheckCircle className="h-5 w-5 text-blue-600" />;
    if (title.toLowerCase().includes("snack")) return <Coffee className="h-5 w-5 text-orange-600" />;
    if (title.toLowerCase().includes("photo")) return <Camera className="h-5 w-5 text-purple-600" />;
    if (title.toLowerCase().includes("carpool")) return <Car className="h-5 w-5 text-green-600" />;
    return <Users className="h-5 w-5 text-gray-600" />;
  };

  const handleSignUp = (taskId: string) => {
    toast({
      title: "Volunteer Signup",
      description: "You've successfully signed up for the volunteer task!",
    });
  };

  const handleViewMore = (task: any) => {
    setSelectedTask(task);
  };

  return (
    <div className="space-y-6">
      {/* AI Volunteer Intelligence */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-600" />
            <span>AI Volunteer Intelligence</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <UserPlus className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Matching:</strong> AI suggests volunteer tasks based on your skills and availability
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Schedule Integration:</strong> AI prevents conflicts with your family calendar
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                <strong>Recognition System:</strong> Earn badges and recognition for your contributions
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Impact Tracking:</strong> See how your volunteer work benefits the team
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recognition.totalHours}</p>
                <p className="text-xs text-gray-600">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recognition.tasksCompleted}</p>
                <p className="text-xs text-gray-600">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recognition.rating}</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recognition.badges.length}</p>
                <p className="text-xs text-gray-600">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Volunteer Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Volunteer Opportunities</CardTitle>
            <Badge variant="outline">
              {availableTasks.length} opportunities
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableTasks.map((task) => (
              <Card key={task.id} className={`hover:shadow-md transition-shadow ${task.urgent ? 'border-2 border-red-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTaskIcon(task.title)}
                      <CardTitle className="text-base">{task.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.urgent && (
                        <Badge className="bg-red-100 text-red-800">URGENT</Badge>
                      )}
                      <Badge className="bg-purple-100 text-purple-800">
                        <Brain className="h-3 w-3 mr-1" />
                        {task.aiMatch}% match
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{task.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(task.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{task.time}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{task.timeCommitment}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge className={getDifficultyColor(task.difficulty)} variant="outline">
                        {task.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Location: </span>
                    <span className="text-sm font-medium">{task.location}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Volunteers Needed</span>
                    <span>{task.spotsSignedUp}/{task.spotsNeeded}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(task.spotsSignedUp / task.spotsNeeded) * 100}%` }}
                    ></div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-1">Skills Needed</h5>
                    <div className="flex flex-wrap gap-1">
                      {task.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSignUp(task.id)}
                      disabled={task.spotsSignedUp >= task.spotsNeeded}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {task.spotsSignedUp >= task.spotsNeeded ? "Full" : "Sign Up"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMore(task)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Your Recognition</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{recognition.rank}</div>
              <div className="text-sm text-gray-600">Volunteer Ranking</div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Earned Badges</h4>
              <div className="flex flex-wrap gap-2">
                {recognition.badges.map((badge, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800">
                    <Award className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {recognition.nextBadge}</span>
                <span>{recognition.progressToNext}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" 
                  style={{ width: `${recognition.progressToNext}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">2 more hours needed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Volunteer History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {volunteerHistory.map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{entry.task}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(entry.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {new Date(entry.date).toLocaleDateString()} • {entry.hours} hours
                  </div>
                  <p className="text-sm text-gray-700">{entry.feedback}</p>
                  {entry.badgeEarned && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-2">
                      <Award className="h-3 w-3 mr-1" />
                      Earned: {entry.badgeEarned}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getTaskIcon(selectedTask.title)}
                <span>{selectedTask.title}</span>
                {selectedTask.urgent && (
                  <Badge className="bg-red-100 text-red-800">URGENT</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Event Details</h4>
                  <div className="text-sm space-y-1">
                    <div>Date: {new Date(selectedTask.date).toLocaleDateString()}</div>
                    <div>Time: {selectedTask.time}</div>
                    <div>Duration: {selectedTask.timeCommitment}</div>
                    <div>Location: {selectedTask.location}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <div className="text-sm space-y-1">
                    <div>Difficulty: {selectedTask.difficulty}</div>
                    <div>AI Match: {selectedTask.aiMatch}%</div>
                    <div>Spots: {selectedTask.spotsSignedUp}/{selectedTask.spotsNeeded}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Benefits</h4>
                <ul className="text-sm space-y-1">
                  {selectedTask.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => handleSignUp(selectedTask.id)}
                  disabled={selectedTask.spotsSignedUp >= selectedTask.spotsNeeded}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {selectedTask.spotsSignedUp >= selectedTask.spotsNeeded ? "Position Filled" : "Sign Up to Volunteer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}