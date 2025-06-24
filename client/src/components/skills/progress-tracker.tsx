import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Target, Calendar, Download, Share2, Eye } from "lucide-react";

interface ProgressTrackerProps {
  assessments: any[];
  players: any[];
  skillCategories: any[];
}

export default function ProgressTracker({ assessments, players, skillCategories }: ProgressTrackerProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("6months");
  const [viewType, setViewType] = useState<"individual" | "comparison" | "team">("individual");

  // Mock progress data for demonstration
  const progressData = [
    { date: "Jan", ballControl: 3, passing: 4, shooting: 2, speed: 3, teamwork: 4 },
    { date: "Feb", ballControl: 3.2, passing: 4.1, shooting: 2.3, speed: 3.1, teamwork: 4.2 },
    { date: "Mar", ballControl: 3.5, passing: 4.2, shooting: 2.8, speed: 3.3, teamwork: 4.1 },
    { date: "Apr", ballControl: 3.8, passing: 4.3, shooting: 3.1, speed: 3.5, teamwork: 4.3 },
    { date: "May", ballControl: 4.0, passing: 4.4, shooting: 3.4, speed: 3.7, teamwork: 4.4 },
    { date: "Jun", ballControl: 4.2, passing: 4.5, shooting: 3.6, speed: 3.8, teamwork: 4.5 },
  ];

  const radarData = [
    { skill: "Ball Control", current: 4.2, previous: 3.0, league: 3.5 },
    { skill: "Passing", current: 4.5, previous: 4.0, league: 3.8 },
    { skill: "Shooting", current: 3.6, previous: 2.0, league: 3.2 },
    { skill: "Speed", current: 3.8, previous: 3.0, league: 3.6 },
    { skill: "Teamwork", current: 4.5, previous: 4.0, league: 4.0 },
    { skill: "Defense", current: 3.2, previous: 2.8, league: 3.4 },
  ];

  const improvementData = [
    { skill: "Shooting", improvement: 80, sessions: 12 },
    { skill: "Ball Control", improvement: 40, sessions: 8 },
    { skill: "Speed", improvement: 27, sessions: 6 },
    { skill: "Passing", improvement: 13, sessions: 4 },
    { skill: "Defense", improvement: 14, sessions: 5 },
    { skill: "Teamwork", improvement: 13, sessions: 3 },
  ];

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 20) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 20) return "text-green-600";
    if (improvement > 0) return "text-blue-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Player" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Players</SelectItem>
                  {players.map((player: any) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewType} onValueChange={(value) => setViewType(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="team">Team View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewType === "individual" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Skill Progress Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ballControl" stroke="#3b82f6" strokeWidth={2} name="Ball Control" />
                  <Line type="monotone" dataKey="passing" stroke="#10b981" strokeWidth={2} name="Passing" />
                  <Line type="monotone" dataKey="shooting" stroke="#f59e0b" strokeWidth={2} name="Shooting" />
                  <Line type="monotone" dataKey="speed" stroke="#ef4444" strokeWidth={2} name="Speed" />
                  <Line type="monotone" dataKey="teamwork" stroke="#8b5cf6" strokeWidth={2} name="Teamwork" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skill Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Current Skill Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Radar name="Previous" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                  <Radar name="League Avg" dataKey="league" stroke="#f59e0b" fill="none" strokeDasharray="5 5" />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Improvement Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Improvement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {improvementData.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.skill}</span>
                  <div className="flex items-center space-x-1">
                    {getImprovementIcon(item.improvement)}
                    <span className={`text-sm font-medium ${getImprovementColor(item.improvement)}`}>
                      +{item.improvement}%
                    </span>
                  </div>
                </div>
                <Progress value={item.improvement} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.sessions} training sessions</span>
                  <span>6 months</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={improvementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="improvement" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: "Shooting", milestone: "First 4+ rating achieved", date: "2 days ago", type: "achievement" },
                { skill: "Ball Control", milestone: "Consistent improvement streak", date: "1 week ago", type: "streak" },
                { skill: "Teamwork", milestone: "Above league average", date: "2 weeks ago", type: "benchmark" },
                { skill: "Speed", milestone: "Personal best recorded", date: "3 weeks ago", type: "personal" },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{milestone.milestone}</p>
                    <p className="text-xs text-gray-600">{milestone.skill} • {milestone.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {milestone.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parent/Guardian View */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-green-600" />
            <span>Parent Progress Summary</span>
            <Badge variant="outline" className="border-green-200 text-green-800">
              Family Access
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Overall Improvement</div>
              <div className="text-xs text-gray-500">vs. last quarter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.2</div>
              <div className="text-sm text-gray-600">Average Skill Level</div>
              <div className="text-xs text-gray-500">out of 5.0</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Training Sessions</div>
              <div className="text-xs text-gray-500">this month</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Coach Notes:</strong> Excellent progress this quarter! Focus areas for next month: 
              shooting accuracy and tactical positioning. Keep up the great work!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}