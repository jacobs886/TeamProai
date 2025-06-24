import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter } from "recharts";
import { Users, TrendingUp, Target, AlertTriangle, Trophy, Brain } from "lucide-react";

interface TeamSkillAnalyticsProps {
  assessments: any[];
  players: any[];
  skillCategories: any[];
}

export default function TeamSkillAnalytics({ assessments, players, skillCategories }: TeamSkillAnalyticsProps) {
  // Mock data for demonstration
  const teamStrengths = [
    { skill: "Teamwork", average: 4.3, total: 5, color: "#10b981" },
    { skill: "Passing", average: 4.1, total: 5, color: "#3b82f6" },
    { skill: "Defense", average: 3.8, total: 5, color: "#8b5cf6" },
    { skill: "Ball Control", average: 3.6, total: 5, color: "#f59e0b" },
    { skill: "Shooting", average: 3.2, total: 5, color: "#ef4444" },
    { skill: "Speed", average: 3.1, total: 5, color: "#06b6d4" },
  ];

  const skillDistribution = [
    { name: "Excellent (4.5-5.0)", value: 15, color: "#10b981" },
    { name: "Good (3.5-4.4)", value: 35, color: "#3b82f6" },
    { name: "Average (2.5-3.4)", value: 30, color: "#f59e0b" },
    { name: "Needs Work (1.5-2.4)", value: 15, color: "#ef4444" },
    { name: "Significant Development (1.0-1.4)", value: 5, color: "#991b1b" },
  ];

  const positionAnalysis = [
    { position: "Forward", ballControl: 3.8, shooting: 4.2, passing: 3.5, speed: 4.0 },
    { position: "Midfielder", ballControl: 4.1, shooting: 3.2, passing: 4.5, speed: 3.7 },
    { position: "Defender", ballControl: 3.4, shooting: 2.8, passing: 3.8, speed: 3.3 },
    { position: "Goalkeeper", ballControl: 3.0, shooting: 2.5, passing: 3.9, speed: 3.1 },
  ];

  const playerClusters = [
    { name: "John S.", overall: 4.2, potential: 4.8, cluster: "High Performers" },
    { name: "Emma R.", overall: 4.0, potential: 4.6, cluster: "High Performers" },
    { name: "Mike T.", overall: 3.8, potential: 4.4, cluster: "Rising Stars" },
    { name: "Sara L.", overall: 3.7, potential: 4.3, cluster: "Rising Stars" },
    { name: "Alex P.", overall: 3.2, potential: 4.0, cluster: "Development Focus" },
    { name: "Chris M.", overall: 3.1, potential: 3.9, cluster: "Development Focus" },
  ];

  const getClusterColor = (cluster: string) => {
    switch (cluster) {
      case "High Performers": return "#10b981";
      case "Rising Stars": return "#3b82f6";
      case "Development Focus": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Skill Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamStrengths.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{skill.average}/5.0</span>
                    <Badge 
                      variant={skill.average >= 4.0 ? "default" : skill.average >= 3.5 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {skill.average >= 4.0 ? "Strong" : skill.average >= 3.5 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(skill.average / skill.total) * 100} 
                  className="h-2"
                  style={{ backgroundColor: skill.color + "20" }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {skillDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="ballControl" fill="#3b82f6" name="Ball Control" />
                <Bar dataKey="shooting" fill="#ef4444" name="Shooting" />
                <Bar dataKey="passing" fill="#10b981" name="Passing" />
                <Bar dataKey="speed" fill="#f59e0b" name="Speed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Team Analysis</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">Team Strengths</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Excellent teamwork and communication</li>
                <li>• Strong passing accuracy across all positions</li>
                <li>• Good defensive positioning</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-600">Focus Areas</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Shooting accuracy needs improvement</li>
                <li>• Speed training for forwards</li>
                <li>• Ball control for defenders</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-600">Recommendations</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Increase shooting drills by 30%</li>
                <li>• Position-specific training sessions</li>
                <li>• Pair strong/developing players</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Clustering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Player Development Clusters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={playerClusters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="overall" 
                    domain={[2.5, 4.5]} 
                    name="Current Level"
                    label={{ value: 'Current Skill Level', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="potential" 
                    domain={[3.5, 5.0]} 
                    name="Potential"
                    label={{ value: 'Potential', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(value) => `Player: ${playerClusters[value]?.name}`}
                  />
                  <Scatter 
                    dataKey="potential" 
                    fill="#3b82f6"
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Development Groups</h4>
              {["High Performers", "Rising Stars", "Development Focus"].map((cluster) => (
                <div key={cluster} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cluster}</span>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getClusterColor(cluster) }}
                    ></div>
                  </div>
                  <div className="space-y-1">
                    {playerClusters
                      .filter(player => player.cluster === cluster)
                      .map((player, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{player.name}</span>
                          <span className="text-gray-600">{player.overall}/5.0</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Recommended Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                priority: "High",
                action: "Implement shooting accuracy training program",
                impact: "Improve team scoring by 25%",
                timeframe: "2 weeks"
              },
              {
                priority: "Medium",
                action: "Create position-specific skill development groups",
                impact: "Targeted improvement for each role",
                timeframe: "1 month"
              },
              {
                priority: "Medium",
                action: "Pair high performers with developing players",
                impact: "Accelerate team-wide improvement",
                timeframe: "Ongoing"
              },
              {
                priority: "Low",
                action: "Increase speed and agility training for forwards",
                impact: "Better attacking options",
                timeframe: "6 weeks"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge 
                      variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                    <span className="font-medium text-sm">{item.action}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.impact}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{item.timeframe}</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}