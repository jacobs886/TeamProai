import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  BarChart3,
  Star,
  Brain,
  Zap,
  BookOpen,
  Users,
  Trophy,
  Clock
} from "lucide-react";

interface PlayerProgressProps {
  childId: string;
  aiInsights: any;
}

export default function PlayerProgress({ childId, aiInsights }: PlayerProgressProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "goals" | "benchmarks">("overview");

  const { toast } = useToast();

  // Mock player data
  const playerData = {
    name: "Alex Johnson",
    position: "Midfielder",
    jerseyNumber: 12,
    overallRating: 87,
    ratingChange: 5,
    gamesPlayed: 18,
    attendance: 94,
    achievements: [
      { id: "1", name: "Team Player", description: "Excellent teamwork and cooperation", date: "2024-07-15", icon: "👥" },
      { id: "2", name: "Most Improved", description: "15% skill improvement this month", date: "2024-07-01", icon: "📈" },
      { id: "3", name: "Perfect Attendance", description: "100% practice attendance", date: "2024-06-30", icon: "🎯" }
    ]
  };

  // Mock skill data
  const skillData = [
    {
      category: "Technical Skills",
      skills: [
        { name: "Ball Control", current: 85, previous: 78, target: 90, trend: "up" },
        { name: "Passing Accuracy", current: 82, previous: 79, target: 88, trend: "up" },
        { name: "Shooting", current: 76, previous: 72, target: 82, trend: "up" },
        { name: "Dribbling", current: 88, previous: 85, target: 92, trend: "up" }
      ]
    },
    {
      category: "Physical Attributes",
      skills: [
        { name: "Speed", current: 79, previous: 77, target: 85, trend: "up" },
        { name: "Endurance", current: 91, previous: 89, target: 94, trend: "up" },
        { name: "Agility", current: 83, previous: 81, target: 88, trend: "up" },
        { name: "Strength", current: 74, previous: 74, target: 80, trend: "stable" }
      ]
    },
    {
      category: "Mental & Tactical",
      skills: [
        { name: "Game Awareness", current: 86, previous: 82, target: 90, trend: "up" },
        { name: "Decision Making", current: 80, previous: 78, target: 85, trend: "up" },
        { name: "Leadership", current: 75, previous: 70, target: 82, trend: "up" },
        { name: "Composure", current: 88, previous: 85, target: 92, trend: "up" }
      ]
    }
  ];

  // Mock goals data
  const personalGoals = [
    {
      id: "1",
      title: "Improve Shooting Accuracy",
      description: "Increase shooting accuracy from 65% to 80%",
      progress: 75,
      targetDate: "2024-08-15",
      status: "on_track",
      aiRecommendations: [
        "Practice shooting drills 15 minutes before each practice",
        "Focus on follow-through technique",
        "Work with coach on 1-on-1 finishing"
      ]
    },
    {
      id: "2", 
      title: "Enhanced Leadership Skills",
      description: "Develop leadership qualities as team captain candidate",
      progress: 60,
      targetDate: "2024-09-01",
      status: "on_track",
      aiRecommendations: [
        "Encourage teammates during practices",
        "Study game footage to improve tactical awareness",
        "Communicate more actively during games"
      ]
    },
    {
      id: "3",
      title: "Perfect Attendance Goal",
      description: "Maintain 100% practice and game attendance",
      progress: 94,
      targetDate: "2024-12-31",
      status: "at_risk",
      aiRecommendations: [
        "Current streak: 15 sessions in a row",
        "Schedule conflicts identified for 3 upcoming practices",
        "Consider makeup sessions for missed practices"
      ]
    }
  ];

  // Mock benchmark data
  const benchmarkData = {
    teamComparison: {
      position: "3rd out of 8 midfielders",
      percentile: 75,
      topSkills: ["Ball Control", "Game Awareness", "Endurance"],
      improvementAreas: ["Shooting", "Strength"]
    },
    leagueComparison: {
      position: "Top 25%",
      percentile: 78,
      ranking: "Above Average",
      comparison: [
        { skill: "Technical Skills", playerScore: 83, leagueAverage: 75, percentile: 82 },
        { skill: "Physical", playerScore: 82, leagueAverage: 78, percentile: 71 },
        { skill: "Mental/Tactical", playerScore: 82, leagueAverage: 73, percentile: 85 }
      ]
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "bg-green-100 text-green-800";
      case "at_risk": return "bg-yellow-100 text-yellow-800";
      case "behind": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Progress Intelligence */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-600" />
            <span>AI Progress Intelligence</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                <strong>Personalized Analytics:</strong> AI tracks 50+ performance metrics tailored to your child
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Goals:</strong> AI suggests achievable targets based on skill progression patterns
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Peer Benchmarking:</strong> Compare progress against anonymized league averages
              </AlertDescription>
            </Alert>
            
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                <strong>Training Plans:</strong> AI generates personalized practice recommendations
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Player Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">#{playerData.jerseyNumber}</span>
              </div>
              <div>
                <CardTitle className="text-xl">{playerData.name}</CardTitle>
                <p className="text-gray-600">{playerData.position}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">{playerData.overallRating}</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">+{playerData.ratingChange}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{playerData.gamesPlayed}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{playerData.attendance}%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{playerData.achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15%</div>
              <div className="text-sm text-gray-600">Improvement Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playerData.achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium text-yellow-900">{achievement.name}</h4>
                    <p className="text-xs text-yellow-700">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm text-yellow-800">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Details Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Benchmarks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillData.map((category) => {
                    const avgScore = Math.round(category.skills.reduce((sum, skill) => sum + skill.current, 0) / category.skills.length);
                    const avgImprovement = Math.round(category.skills.reduce((sum, skill) => sum + (skill.current - skill.previous), 0) / category.skills.length);
                    
                    return (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{avgScore}</span>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-green-600 text-sm">+{avgImprovement}</span>
                            </div>
                          </div>
                        </div>
                        <Progress value={avgScore} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Progress Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Ball Control Improvement</span>
                    </div>
                    <p className="text-sm text-green-800">Improved from 78 to 85 points (+9% this month)</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Leadership Growth</span>
                    </div>
                    <p className="text-sm text-blue-800">Showing increased confidence and team communication</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Goal Achievement</span>
                    </div>
                    <p className="text-sm text-purple-800">2 of 3 monthly goals completed ahead of schedule</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            {skillData.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{skill.current}</span>
                            {getTrendIcon(skill.trend)}
                            <span className={`text-sm font-medium ${getTrendColor(skill.trend)}`}>
                              {skill.current > skill.previous ? '+' : ''}{skill.current - skill.previous}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current</span>
                            <span>Target: {skill.target}</span>
                          </div>
                          <Progress value={skill.current} className="h-2" />
                          <Progress value={(skill.current / skill.target) * 100} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-4">
            {personalGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <Badge className={getGoalStatusColor(goal.status)}>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Started</span>
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {goal.aiRecommendations && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">AI Recommendations</span>
                      </div>
                      <div className="text-xs space-y-1">
                        {goal.aiRecommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-purple-800">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benchmarks">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Team Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{benchmarkData.teamComparison.percentile}th</div>
                  <div className="text-sm text-gray-600">Percentile in team</div>
                  <div className="text-xs text-gray-500 mt-1">{benchmarkData.teamComparison.position}</div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {benchmarkData.teamComparison.topSkills.map((skill) => (
                      <Badge key={skill} className="bg-green-100 text-green-800">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Improvement Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {benchmarkData.teamComparison.improvementAreas.map((skill) => (
                      <Badge key={skill} className="bg-orange-100 text-orange-800">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* League Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>League Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{benchmarkData.leagueComparison.percentile}th</div>
                  <div className="text-sm text-gray-600">Percentile in league</div>
                  <div className="text-xs text-gray-500 mt-1">{benchmarkData.leagueComparison.ranking}</div>
                </div>

                <div className="space-y-3">
                  {benchmarkData.leagueComparison.comparison.map((comp) => (
                    <div key={comp.skill} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{comp.skill}</span>
                        <span>{comp.playerScore} vs {comp.leagueAverage} avg</span>
                      </div>
                      <div className="relative">
                        <Progress value={(comp.leagueAverage / 100) * 100} className="h-2 bg-gray-200" />
                        <Progress value={(comp.playerScore / 100) * 100} className="h-2 absolute top-0" />
                      </div>
                      <div className="text-xs text-gray-500 text-right">{comp.percentile}th percentile</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}