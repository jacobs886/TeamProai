import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Award,
  Star,
  Trophy,
  Medal,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Gift,
  Send,
  Download,
  Brain,
  Zap
} from "lucide-react";

interface VolunteerRecognitionProps {
  volunteers: any[];
  aiInsights: any;
}

export default function VolunteerRecognition({ volunteers, aiInsights }: VolunteerRecognitionProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const { toast } = useToast();

  // Mock volunteer performance data
  const topVolunteers = [
    {
      id: "v1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      totalHours: 45,
      tasksCompleted: 12,
      reliability: 98,
      averageRating: 4.9,
      badges: ["Reliable Volunteer", "Event Champion", "Team Player"],
      achievements: [
        { type: "Hours Milestone", description: "Completed 40+ hours this month", date: "2024-07-15" },
        { type: "Perfect Attendance", description: "100% attendance last quarter", date: "2024-07-01" }
      ],
      contributions: {
        scorekeeper: 8,
        equipment: 3,
        coordinator: 1
      },
      feedback: [
        { from: "Coach Mike", rating: 5, comment: "Always reliable and enthusiastic" },
        { from: "Event Coordinator", rating: 5, comment: "Excellent attention to detail" }
      ],
      nextReward: "Volunteer of the Month",
      progressToNext: 85
    },
    {
      id: "v2",
      name: "Mike Thompson", 
      email: "mike@example.com",
      totalHours: 38,
      tasksCompleted: 10,
      reliability: 92,
      averageRating: 4.7,
      badges: ["Equipment Expert", "Early Bird", "Community Helper"],
      achievements: [
        { type: "Skill Mastery", description: "Expert level equipment setup", date: "2024-07-10" },
        { type: "Leadership", description: "Led volunteer training session", date: "2024-06-28" }
      ],
      contributions: {
        equipment: 7,
        setup: 2,
        training: 1
      },
      feedback: [
        { from: "Equipment Manager", rating: 5, comment: "Knows equipment inside and out" },
        { from: "Team Parent", rating: 4, comment: "Very helpful and patient" }
      ],
      nextReward: "Equipment Expert Badge",
      progressToNext: 60
    },
    {
      id: "v3",
      name: "Jennifer Adams",
      email: "jennifer@example.com",
      totalHours: 42,
      tasksCompleted: 15,
      reliability: 95,
      averageRating: 4.8,
      badges: ["Flexible Helper", "Communication Star", "Rising Star"],
      achievements: [
        { type: "Versatility", description: "Completed tasks in 5 different roles", date: "2024-07-12" },
        { type: "Quick Response", description: "Accepted 95% of last-minute requests", date: "2024-07-05" }
      ],
      contributions: {
        coordinator: 6,
        communication: 5,
        support: 4
      },
      feedback: [
        { from: "Parent Coordinator", rating: 5, comment: "Amazing communication skills" },
        { from: "Coach Sarah", rating: 5, comment: "Always willing to help" }
      ],
      nextReward: "Communication Champion",
      progressToNext: 75
    }
  ];

  // Mock recognition programs
  const recognitionPrograms = [
    {
      id: "program1",
      name: "Volunteer of the Month",
      description: "Recognizing outstanding dedication and service",
      criteria: "40+ hours, 95%+ reliability, positive feedback",
      reward: "Certificate, $50 gift card, parking spot",
      currentNominee: "Sarah Johnson",
      status: "active",
      deadline: "2024-07-31"
    },
    {
      id: "program2", 
      name: "Team Spirit Award",
      description: "For volunteers who go above and beyond",
      criteria: "Leadership, teamwork, positive attitude",
      reward: "Trophy, team dinner invitation, recognition ceremony",
      currentNominee: "Mike Thompson",
      status: "voting",
      deadline: "2024-07-25"
    },
    {
      id: "program3",
      name: "Rising Star Recognition",
      description: "New volunteers making a big impact",
      criteria: "New volunteer (<6 months), high engagement",
      reward: "Badge, mentorship opportunity, skill development",
      currentNominee: "Jennifer Adams",
      status: "pending",
      deadline: "2024-08-05"
    }
  ];

  // Mock milestone tracking
  const milestones = [
    { hours: 10, name: "Getting Started", reward: "Welcome Badge", completed: true },
    { hours: 25, name: "Committed Helper", reward: "Team T-Shirt", completed: true },
    { hours: 50, name: "Dedicated Volunteer", reward: "Recognition Certificate", completed: false },
    { hours: 100, name: "Champion Volunteer", reward: "Trophy + Dinner", completed: false },
    { hours: 200, name: "Legend Status", reward: "Hall of Fame + Scholarship", completed: false }
  ];

  // Mock leaderboard
  const monthlyLeaderboard = [
    { rank: 1, name: "Sarah Johnson", hours: 45, points: 950, change: 2 },
    { rank: 2, name: "Jennifer Adams", hours: 42, points: 890, change: 1 },
    { rank: 3, name: "Mike Thompson", hours: 38, points: 820, change: -2 },
    { rank: 4, name: "David Wilson", hours: 35, points: 750, change: 3 },
    { rank: 5, name: "Lisa Chen", hours: 32, points: 680, change: -1 }
  ];

  const getBadgeColor = (badge: string) => {
    const colors = {
      "Reliable Volunteer": "bg-blue-100 text-blue-800",
      "Event Champion": "bg-purple-100 text-purple-800", 
      "Team Player": "bg-green-100 text-green-800",
      "Equipment Expert": "bg-orange-100 text-orange-800",
      "Early Bird": "bg-yellow-100 text-yellow-800",
      "Community Helper": "bg-pink-100 text-pink-800",
      "Flexible Helper": "bg-cyan-100 text-cyan-800",
      "Communication Star": "bg-indigo-100 text-indigo-800",
      "Rising Star": "bg-amber-100 text-amber-800"
    };
    return colors[badge as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRankChange = (change: number) => {
    if (change > 0) return { icon: <TrendingUp className="h-3 w-3 text-green-600" />, color: "text-green-600" };
    if (change < 0) return { icon: <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />, color: "text-red-600" };
    return { icon: <span className="w-3 h-3">-</span>, color: "text-gray-600" };
  };

  const handleSendRecognition = (volunteerId: string, type: string) => {
    toast({
      title: "Recognition Sent",
      description: `${type} recognition has been sent to the volunteer.`,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Volunteer recognition report has been created.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Recognition Intelligence */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-yellow-600" />
            <span>AI Recognition Intelligence</span>
            <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Recognition:</strong> AI identifies top performers and suggests personalized rewards
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Engagement Boost:</strong> Recognition programs increase volunteer retention by 60%
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                <strong>Achievement Tracking:</strong> Automated milestone detection and reward distribution
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Gift className="h-4 w-4" />
              <AlertDescription>
                <strong>Personalized Rewards:</strong> AI customizes recognition based on volunteer preferences
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Recognition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-xs text-gray-600">Awards Given</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-xs text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-xs text-gray-600">Hours This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Performers This Month</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowRewardModal(true)}>
                <Gift className="h-4 w-4 mr-2" />
                Send Rewards
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVolunteers.slice(0, 3).map((volunteer, index) => (
                <div key={volunteer.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedVolunteer(volunteer)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                      }`}>
                        {index === 0 ? <Trophy className="h-5 w-5 text-yellow-600" /> :
                         index === 1 ? <Medal className="h-5 w-5 text-gray-600" /> :
                         <Award className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div>
                        <span className="font-medium">{volunteer.name}</span>
                        <div className="text-sm text-gray-600">{volunteer.totalHours} hours • {volunteer.tasksCompleted} tasks</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{volunteer.averageRating}</span>
                      </div>
                      <div className="text-sm text-gray-600">{volunteer.reliability}% reliable</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {volunteer.badges.slice(0, 2).map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} className={getBadgeColor(badge)} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                    {volunteer.badges.length > 2 && (
                      <Badge variant="outline" className="text-gray-600">
                        +{volunteer.badges.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {volunteer.nextReward}</span>
                      <span>{volunteer.progressToNext}%</span>
                    </div>
                    <Progress value={volunteer.progressToNext} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyLeaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <span className="font-medium">{entry.name}</span>
                      <div className="text-sm text-gray-600">{entry.hours} hours</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">{entry.points} pts</div>
                      <div className={`flex items-center space-x-1 text-xs ${getRankChange(entry.change).color}`}>
                        {getRankChange(entry.change).icon}
                        <span>{Math.abs(entry.change)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recognition Programs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Recognition Programs</CardTitle>
            <Button variant="outline" size="sm" onClick={handleGenerateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recognitionPrograms.map((program) => (
              <div key={program.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{program.name}</h4>
                  <Badge variant={program.status === "active" ? "default" : program.status === "voting" ? "secondary" : "outline"}>
                    {program.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Criteria:</strong> {program.criteria}
                  </div>
                  <div>
                    <strong>Reward:</strong> {program.reward}
                  </div>
                  <div>
                    <strong>Leading Nominee:</strong> {program.currentNominee}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {new Date(program.deadline).toLocaleDateString()}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => handleSendRecognition(program.currentNominee, program.name)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {program.status === "voting" ? "Cast Vote" : "Nominate"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {milestone.completed ? <Trophy className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{milestone.name}</span>
                    <span className="text-sm text-gray-600">{milestone.hours} hours</span>
                  </div>
                  <div className="text-sm text-gray-600">{milestone.reward}</div>
                </div>
                
                <Badge variant={milestone.completed ? "default" : "outline"}>
                  {milestone.completed ? "Earned" : "Locked"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <Dialog open={!!selectedVolunteer} onOpenChange={() => setSelectedVolunteer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>{selectedVolunteer.name} - Performance Profile</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Performance Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedVolunteer.totalHours}</div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{selectedVolunteer.tasksCompleted}</div>
                      <div className="text-sm text-gray-600">Tasks Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{selectedVolunteer.averageRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{selectedVolunteer.reliability}%</div>
                      <div className="text-sm text-gray-600">Reliability</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Earned Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.badges.map((badge: string, index: number) => (
                        <Badge key={index} className={getBadgeColor(badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedVolunteer.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-900">{achievement.type}</span>
                        </div>
                        <p className="text-sm text-yellow-800">{achievement.description}</p>
                        <p className="text-xs text-yellow-700 mt-1">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contributions Breakdown */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Role Contributions & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Role Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedVolunteer.contributions).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between">
                            <span className="capitalize">{role}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(count as number / selectedVolunteer.tasksCompleted) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Recent Feedback</h4>
                      <div className="space-y-3">
                        {selectedVolunteer.feedback.map((feedback: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{feedback.from}</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{feedback.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Personal Thank You
              </Button>
              <Button className="flex-1" onClick={() => handleSendRecognition(selectedVolunteer.id, "Special Recognition")}>
                <Gift className="h-4 w-4 mr-2" />
                Send Reward
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reward Modal */}
      <Dialog open={showRewardModal} onOpenChange={setShowRewardModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Recognition Rewards</DialogTitle>
          </DialogHeader>
          <RewardForm 
            volunteers={topVolunteers}
            onSubmit={(data) => {
              toast({
                title: "Rewards Sent",
                description: "Recognition rewards have been distributed to selected volunteers.",
              });
              setShowRewardModal(false);
            }}
            onCancel={() => setShowRewardModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reward Form Component
function RewardForm({
  volunteers,
  onSubmit,
  onCancel
}: {
  volunteers: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    selectedVolunteers: [] as string[],
    rewardType: "",
    message: "",
    deliveryMethod: "email"
  });

  const rewardTypes = [
    "Certificate of Appreciation",
    "Gift Card",
    "Team Merchandise",
    "Special Recognition Badge",
    "Volunteer of the Month",
    "Custom Thank You Note"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleVolunteer = (volunteerId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedVolunteers: prev.selectedVolunteers.includes(volunteerId)
        ? prev.selectedVolunteers.filter(id => id !== volunteerId)
        : [...prev.selectedVolunteers, volunteerId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Volunteers</label>
        <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
          {volunteers.map((volunteer) => (
            <label key={volunteer.id} className="flex items-center space-x-3 p-2 border rounded">
              <input
                type="checkbox"
                checked={formData.selectedVolunteers.includes(volunteer.id)}
                onChange={() => toggleVolunteer(volunteer.id)}
                className="rounded"
              />
              <div className="flex-1">
                <span className="font-medium">{volunteer.name}</span>
                <div className="text-sm text-gray-600">{volunteer.totalHours} hours • {volunteer.averageRating} rating</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Reward Type</label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.rewardType}
          onChange={(e) => setFormData(prev => ({ ...prev, rewardType: e.target.value }))}
        >
          <option value="">Select reward type</option>
          {rewardTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Personal Message</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Write a personalized thank you message..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Delivery Method</label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.deliveryMethod}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryMethod: e.target.value }))}
        >
          <option value="email">Email</option>
          <option value="mail">Physical Mail</option>
          <option value="in_person">In Person</option>
          <option value="team_app">Team App Notification</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Send Rewards
        </Button>
      </div>
    </form>
  );
}