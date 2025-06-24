import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import SkillAssessmentForm from "@/components/skills/skill-assessment-form";
import ProgressTracker from "@/components/skills/progress-tracker";
import PersonalizedTrainingPlans from "@/components/skills/personalized-training-plans";
import TeamSkillAnalytics from "@/components/skills/team-skill-analytics";
import SkillBenchmarking from "@/components/skills/skill-benchmarking";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Brain,
  Zap,
  Plus,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PlayCircle,
  Trophy,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
  sport: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  maxScore: number;
}

interface PlayerSkillAssessment {
  id: string;
  playerId: string;
  skillId: string;
  score: number;
  notes: string;
  assessedBy: string;
  assessedAt: string;
  improvement: number;
}

export default function SkillsTracking() {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("all");
  const [activeView, setActiveView] = useState<"overview" | "assess" | "progress" | "training" | "analytics">("overview");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch skill categories and definitions
  const { data: skillCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/skills/categories"],
  });

  // Fetch players
  const { data: players = [] } = useQuery({
    queryKey: ["/api/players"],
  });

  // Fetch skill assessments
  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/skills/assessments"],
  });

  // Fetch AI recommendations
  const { data: aiRecommendations = {} } = useQuery({
    queryKey: ["/api/skills/ai-recommendations"],
  });

  const sports = ["Soccer", "Basketball", "Baseball", "Volleyball", "Tennis"];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skills Tracking & Development</h1>
            <p className="text-gray-600">AI-powered skill assessment and personalized training plans</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Development Paths
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-600">Skills Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-600">Avg Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Players Assessed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <PlayCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">342</p>
                  <p className="text-xs text-gray-600">Training Drills</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search skills or players..."
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport.toLowerCase()}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Players" />
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
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setActiveView("assess")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveView("training")}
                  className="flex items-center text-purple-600 border-purple-200"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Training Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="assess" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Assess</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <PlayCircle className="h-4 w-4" />
              <span>Training</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SkillsOverview 
              assessments={assessments}
              players={players}
              skillCategories={skillCategories}
              aiRecommendations={aiRecommendations}
            />
          </TabsContent>

          <TabsContent value="assess" className="space-y-6">
            <SkillAssessmentForm 
              players={players}
              skillCategories={skillCategories}
              onAssessmentComplete={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/skills/assessments"] });
                toast({
                  title: "Assessment Completed",
                  description: "Skill assessment has been saved successfully.",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker 
              assessments={assessments}
              players={players}
              skillCategories={skillCategories}
            />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <PersonalizedTrainingPlans 
              players={players}
              assessments={assessments}
              aiRecommendations={aiRecommendations}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeamSkillAnalytics 
                assessments={assessments}
                players={players}
                skillCategories={skillCategories}
              />
              <SkillBenchmarking 
                assessments={assessments}
                players={players}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Skills Overview Component
function SkillsOverview({ 
  assessments, 
  players, 
  skillCategories, 
  aiRecommendations 
}: { 
  assessments: any[];
  players: any[];
  skillCategories: any[];
  aiRecommendations: any;
}) {
  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Insights & Recommendations</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Team Improvement:</strong> Overall skill scores have increased by 23% this quarter. 
                Focus on defensive skills shows highest growth potential.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Priority Areas:</strong> 15 players need additional ball control training. 
                Recommended drills have been generated automatically.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                <strong>Top Performers:</strong> 8 players are above league average. 
                Consider advanced training programs for continued development.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.slice(0, 5).map((assessment: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">John Smith - Ball Control</p>
                      <p className="text-xs text-gray-500">Assessed by Coach Mike • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={assessment.score >= 4 ? "default" : "secondary"}>
                      {assessment.score}/5
                    </Badge>
                    {assessment.improvement > 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        +{assessment.improvement}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillCategories.map((category: any, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.skills?.length || 0} skills</Badge>
                  </div>
                  <Progress value={Math.random() * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Team Average</span>
                    <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}