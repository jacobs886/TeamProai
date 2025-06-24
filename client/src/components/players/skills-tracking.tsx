import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  Star,
  Award,
  Brain,
  Zap,
  BarChart3,
  Calendar
} from "lucide-react";

interface SkillsTrackingProps {
  players: any[];
  aiInsights: any;
}

export default function SkillsTracking({ players, aiInsights }: SkillsTrackingProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("overall");

  // Mock skills data
  const skillCategories = [
    {
      name: "Technical Skills",
      skills: [
        { name: "Ball Control", description: "Ability to control and manipulate the ball" },
        { name: "Passing Accuracy", description: "Precision in passing to teammates" },
        { name: "Shooting", description: "Goal scoring ability and accuracy" },
        { name: "Dribbling", description: "Ability to move with the ball under pressure" }
      ]
    },
    {
      name: "Physical Attributes", 
      skills: [
        { name: "Speed", description: "Running pace and acceleration" },
        { name: "Endurance", description: "Stamina and cardiovascular fitness" },
        { name: "Agility", description: "Quick changes of direction and movement" },
        { name: "Strength", description: "Physical power and body strength" }
      ]
    },
    {
      name: "Mental & Tactical",
      skills: [
        { name: "Game Awareness", description: "Understanding of game situations" },
        { name: "Decision Making", description: "Quality of choices made under pressure" },
        { name: "Leadership", description: "Ability to guide and motivate teammates" },
        { name: "Composure", description: "Staying calm under pressure" }
      ]
    }
  ];

  // Mock player skills data
  const playerSkills = {
    overall: 78,
    categories: {
      "Technical Skills": 82,
      "Physical Attributes": 75,
      "Mental & Tactical": 77
    },
    individual: {
      "Ball Control": { current: 85, target: 90, improvement: 8 },
      "Passing Accuracy": { current: 79, target: 85, improvement: 5 },
      "Shooting": { current: 72, target: 80, improvement: 12 },
      "Dribbling": { current: 88, target: 92, improvement: 6 },
      "Speed": { current: 77, target: 82, improvement: 4 },
      "Endurance": { current: 91, target: 94, improvement: 3 },
      "Agility": { current: 83, target: 88, improvement: 7 },
      "Strength": { current: 74, target: 80, improvement: 9 },
      "Game Awareness": { current: 86, target: 90, improvement: 5 },
      "Decision Making": { current: 80, target: 85, improvement: 8 },
      "Leadership": { current: 75, target: 82, improvement: 15 },
      "Composure": { current: 88, target: 92, improvement: 4 }
    }
  };

  const getSkillColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-blue-600 bg-blue-100";
    if (score >= 55) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 10) return "text-green-600";
    if (improvement >= 5) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* AI Skills Intelligence */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">AI Skills Assessment</h3>
                <p className="text-sm text-purple-700">Personalized training recommendations based on performance data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">87%</div>
                <div className="text-gray-600">Avg Team Skill</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">12%</div>
                <div className="text-gray-600">Monthly Growth</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">95%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Selection */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Select Player:</span>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="p-2 border rounded-md flex-1 max-w-xs"
            >
              <option value="">All Players Overview</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </select>
            {selectedPlayer && (
              <Badge className="bg-blue-100 text-blue-800">
                Individual Analysis
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Skills</TabsTrigger>
          <TabsTrigger value="team">Team Analysis</TabsTrigger>
          <TabsTrigger value="training">AI Training Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Overall Skills Rating</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-blue-600">{playerSkills.overall}</div>
                <div className="text-gray-600">Out of 100</div>
                <Progress value={playerSkills.overall} className="h-3" />
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">+8% this month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(playerSkills.categories).map(([category, score]) => (
              <Card key={category}>
                <CardContent className="pt-4">
                  <div className="text-center space-y-3">
                    <h4 className="font-medium">{category}</h4>
                    <div className="text-3xl font-bold text-blue-600">{score}</div>
                    <Progress value={score} className="h-2" />
                    <Badge className={getSkillColor(score as number)}>
                      {score >= 80 ? "Excellent" : score >= 65 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          {skillCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {category.skills.map((skill) => {
                    const skillData = playerSkills.individual[skill.name];
                    return (
                      <div key={skill.name} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-xs text-gray-500">{skill.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{skillData.current}</div>
                            <div className={`text-xs ${getImprovementColor(skillData.improvement)}`}>
                              +{skillData.improvement}% 
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current</span>
                            <span>Target: {skillData.target}</span>
                          </div>
                          <Progress value={skillData.current} className="h-2" />
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-600 h-1 rounded-full" 
                              style={{ width: `${(skillData.current / skillData.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">87.2</div>
                  <div className="text-sm text-blue-700">Team Average</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-green-700">Top Performers</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-yellow-700">Need Support</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12%</div>
                  <div className="text-sm text-purple-700">Monthly Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillCategories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{category.name}</span>
                      <span>{playerSkills.categories[category.name]}/100</span>
                    </div>
                    <Progress value={playerSkills.categories[category.name]} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI-Generated Training Plan</span>
                <Badge className="bg-purple-100 text-purple-800">Personalized</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Recommended Focus Areas</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800">Shooting Accuracy</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800">Physical Strength</span>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800">Leadership Skills</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Development</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Weekly Training Plan</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-blue-600" />
                        <span>Monday: Shooting Drills (30 min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-green-600" />
                        <span>Wednesday: Strength Training (45 min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-purple-600" />
                        <span>Friday: Leadership Exercises (20 min)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Predicted Outcomes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>4-week improvement</span>
                        <span className="text-green-600 font-medium">+15%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Target achievement</span>
                        <span className="text-blue-600 font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Team contribution</span>
                        <span className="text-purple-600 font-medium">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Training Plan
                </Button>
                <Button variant="outline" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}