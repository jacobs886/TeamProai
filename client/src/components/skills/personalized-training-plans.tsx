import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  PlayCircle,
  Brain,
  Clock,
  Target,
  Users,
  Calendar,
  Download,
  Share2,
  CheckCircle,
  Star,
  Wand2,
  Video,
  Trophy,
  Zap,
  Repeat
} from "lucide-react";

interface PersonalizedTrainingPlansProps {
  players: any[];
  assessments: any[];
  aiRecommendations: any;
}

interface DrillPlan {
  id: string;
  name: string;
  description: string;
  skill: string;
  difficulty: string;
  duration: number;
  equipment: string[];
  videoUrl?: string;
  instructions: string[];
  variations: string[];
  aiGenerated: boolean;
}

export default function PersonalizedTrainingPlans({ 
  players, 
  assessments, 
  aiRecommendations 
}: PersonalizedTrainingPlansProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedWeakness, setSelectedWeakness] = useState<string>("");
  const [planType, setPlanType] = useState<"individual" | "group" | "team">("individual");
  const [selectedDrill, setSelectedDrill] = useState<DrillPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const { toast } = useToast();

  // Generate AI training plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (params: any) => {
      return apiRequest("POST", "/api/skills/generate-training-plan", params);
    },
    onSuccess: (data) => {
      toast({
        title: "Training Plan Generated",
        description: "AI has created a personalized training plan based on skill assessments.",
      });
      setGeneratingPlan(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate training plan.",
        variant: "destructive",
      });
      setGeneratingPlan(false);
    },
  });

  // Mock training plans for demonstration
  const trainingPlans = [
    {
      id: "1",
      playerId: "player1",
      playerName: "John Smith",
      weakAreas: ["Shooting", "Ball Control"],
      strongAreas: ["Passing", "Teamwork"],
      totalDrills: 8,
      estimatedTime: 45,
      difficulty: "Intermediate",
      aiGenerated: true,
      drills: [
        {
          id: "drill1",
          name: "Cone Dribbling Circuit",
          description: "Improve ball control through cone weaving exercises",
          skill: "Ball Control",
          difficulty: "Beginner",
          duration: 10,
          equipment: ["Cones", "Soccer Ball"],
          instructions: [
            "Set up 6 cones in a straight line, 2 yards apart",
            "Dribble through cones using only right foot",
            "Return using only left foot",
            "Repeat 5 times, focus on close control"
          ],
          variations: [
            "Use different parts of the foot",
            "Increase speed gradually",
            "Add a shot at the end"
          ],
          aiGenerated: true
        },
        {
          id: "drill2",
          name: "Target Shooting Practice",
          description: "Improve shooting accuracy with targeted practice",
          skill: "Shooting",
          difficulty: "Intermediate",
          duration: 15,
          equipment: ["Cones", "Soccer Ball", "Goal"],
          instructions: [
            "Place 4 cones in goal corners",
            "Take 10 shots aiming for each corner",
            "Start 12 yards from goal",
            "Focus on technique over power"
          ],
          variations: [
            "Move further back",
            "Add a defender",
            "Use weaker foot only"
          ],
          aiGenerated: true
        }
      ]
    }
  ];

  const handleGeneratePlan = () => {
    if (!selectedPlayer) {
      toast({
        title: "Select Player",
        description: "Please select a player to generate a training plan.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingPlan(true);
    generatePlanMutation.mutate({
      playerId: selectedPlayer,
      planType,
      weakAreas: selectedWeakness ? [selectedWeakness] : [],
      duration: 45
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Generation Controls */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Training Plan Generator</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Select Player</label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player: any) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Plan Type</label>
              <Select value={planType} onValueChange={(value) => setPlanType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Small Group</SelectItem>
                  <SelectItem value="team">Full Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Focus Area</label>
              <Select value={selectedWeakness} onValueChange={setSelectedWeakness}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto-detect from assessments</SelectItem>
                  <SelectItem value="shooting">Shooting</SelectItem>
                  <SelectItem value="passing">Passing</SelectItem>
                  <SelectItem value="dribbling">Ball Control</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="fitness">Physical Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGeneratePlan}
            disabled={generatingPlan || !selectedPlayer}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {generatingPlan ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Skills & Generating Plan...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Training Plan
              </>
            )}
          </Button>

          {selectedPlayer && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                AI will analyze {players.find((p: any) => p.id === selectedPlayer)?.firstName}'s recent assessments 
                and create a personalized training plan targeting weak areas while building on strengths.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Existing Training Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainingPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{plan.playerName} Training Plan</span>
                </CardTitle>
                {plan.aiGenerated && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Weak Areas</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plan.weakAreas.map((area, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Strong Areas</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plan.strongAreas.map((area, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <PlayCircle className="h-4 w-4 text-gray-500" />
                    <span>{plan.totalDrills} drills</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{plan.estimatedTime} min</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(plan.difficulty)}>
                  {plan.difficulty}
                </Badge>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Drill Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlayCircle className="h-5 w-5" />
            <span>Training Drill Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingPlans[0]?.drills.map((drill) => (
              <Card key={drill.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedDrill(drill)}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{drill.name}</h4>
                      {drill.aiGenerated && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{drill.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <Badge className={getDifficultyColor(drill.difficulty)}>
                        {drill.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{drill.duration} min</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs text-blue-600">{drill.skill}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drill Detail Modal */}
      {selectedDrill && (
        <Dialog open={!!selectedDrill} onOpenChange={() => setSelectedDrill(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5" />
                <span>{selectedDrill.name}</span>
                {selectedDrill.aiGenerated && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="instructions" className="mt-4">
              <TabsList>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedDrill.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getDifficultyColor(selectedDrill.difficulty)} variant="outline">
                      {selectedDrill.difficulty}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{selectedDrill.skill}</div>
                    <div className="text-sm text-gray-600">Target Skill</div>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    {selectedDrill.description}
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-3">Step-by-Step Instructions</h4>
                  <ol className="space-y-2">
                    {selectedDrill.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="variations" className="space-y-4">
                <h4 className="font-medium">Drill Variations</h4>
                <div className="space-y-3">
                  {selectedDrill.variations.map((variation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Repeat className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{variation}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="space-y-4">
                <h4 className="font-medium">Required Equipment</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDrill.equipment.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Video demonstration available</p>
                    <Button variant="outline" className="mt-2">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Save to Library
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Drill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}