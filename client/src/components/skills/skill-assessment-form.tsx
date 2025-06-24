import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Target,
  Star,
  Brain,
  Wand2,
  Save,
  Eye,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface SkillAssessmentFormProps {
  players: any[];
  skillCategories: any[];
  onAssessmentComplete: () => void;
}

interface AssessmentData {
  playerId: string;
  skillId: string;
  score: number;
  notes: string;
  category: string;
}

export default function SkillAssessmentForm({ 
  players, 
  skillCategories, 
  onAssessmentComplete 
}: SkillAssessmentFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData>({
    playerId: "",
    skillId: "",
    score: 3,
    notes: "",
    category: ""
  });
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAiInsights, setShowAiInsights] = useState(false);

  const { toast } = useToast();

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/skills/assessments", data);
    },
    onSuccess: () => {
      toast({
        title: "Assessment Saved",
        description: "Skill assessment has been recorded successfully.",
      });
      onAssessmentComplete();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save assessment.",
        variant: "destructive",
      });
    },
  });

  // AI analysis mutation
  const aiAnalysisMutation = useMutation({
    mutationFn: async (notes: string) => {
      return apiRequest("POST", "/api/skills/ai-analysis", { notes, playerId: selectedPlayer });
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
      setShowAiInsights(true);
    },
  });

  const resetForm = () => {
    setCurrentAssessment({
      playerId: "",
      skillId: "",
      score: 3,
      notes: "",
      category: ""
    });
    setSelectedPlayer("");
    setSelectedCategory("");
    setAssessments([]);
    setAiAnalysis(null);
    setShowAiInsights(false);
  };

  const handleScoreChange = (value: number[]) => {
    setCurrentAssessment(prev => ({ ...prev, score: value[0] }));
  };

  const handleNotesChange = (notes: string) => {
    setCurrentAssessment(prev => ({ ...prev, notes }));
    
    // Trigger AI analysis if notes are substantial
    if (notes.length > 20) {
      aiAnalysisMutation.mutate(notes);
    }
  };

  const addAssessment = () => {
    if (!currentAssessment.skillId || !selectedPlayer) {
      toast({
        title: "Missing Information",
        description: "Please select a player and skill before adding assessment.",
        variant: "destructive",
      });
      return;
    }

    const newAssessment = {
      ...currentAssessment,
      playerId: selectedPlayer,
      category: selectedCategory
    };

    setAssessments(prev => [...prev, newAssessment]);
    setCurrentAssessment(prev => ({ ...prev, skillId: "", score: 3, notes: "" }));
  };

  const submitAllAssessments = () => {
    if (assessments.length === 0) {
      toast({
        title: "No Assessments",
        description: "Please add at least one skill assessment.",
        variant: "destructive",
      });
      return;
    }

    submitAssessmentMutation.mutate({
      assessments,
      aiInsights: aiAnalysis
    });
  };

  const categorySkills = selectedCategory 
    ? skillCategories.find(cat => cat.id === selectedCategory)?.skills || []
    : [];

  const getScoreDescription = (score: number) => {
    const descriptions = {
      1: "Needs Significant Development",
      2: "Below Average",
      3: "Average",
      4: "Above Average", 
      5: "Excellent"
    };
    return descriptions[score as keyof typeof descriptions];
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-red-600";
    if (score === 3) return "text-yellow-600";
    return "text-green-600";
  };

  // Mock skill categories for demo
  const mockSkills = {
    "technical": [
      { id: "dribbling", name: "Ball Control/Dribbling", description: "Ability to control and move with the ball" },
      { id: "passing", name: "Passing Accuracy", description: "Precision and technique in passing" },
      { id: "shooting", name: "Shooting", description: "Goal scoring ability and shot accuracy" },
      { id: "firstTouch", name: "First Touch", description: "Initial ball control upon receiving" }
    ],
    "physical": [
      { id: "speed", name: "Speed", description: "Running pace and acceleration" },
      { id: "agility", name: "Agility", description: "Quick directional changes" },
      { id: "stamina", name: "Stamina", description: "Endurance and fitness level" },
      { id: "strength", name: "Strength", description: "Physical power and body strength" }
    ],
    "tactical": [
      { id: "positioning", name: "Positioning", description: "Understanding of field position" },
      { id: "decisionMaking", name: "Decision Making", description: "Game awareness and choices" },
      { id: "teamwork", name: "Teamwork", description: "Collaboration with teammates" },
      { id: "communication", name: "Communication", description: "On-field verbal and non-verbal communication" }
    ]
  };

  const availableSkills = selectedCategory ? mockSkills[selectedCategory as keyof typeof mockSkills] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Assessment Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Skill Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Select Player</Label>
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
                <Label>Skill Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="physical">Physical Attributes</SelectItem>
                    <SelectItem value="tactical">Tactical Understanding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skill Selection */}
            {selectedCategory && (
              <div>
                <Label>Select Skill</Label>
                <Select 
                  value={currentAssessment.skillId} 
                  onValueChange={(value) => setCurrentAssessment(prev => ({ ...prev, skillId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose skill to assess" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorySkills.map((skill: any) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        <div>
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-xs text-gray-500">{skill.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Score Assessment */}
            {currentAssessment.skillId && (
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center justify-between">
                    <span>Skill Level (1-5)</span>
                    <Badge className={getScoreColor(currentAssessment.score)}>
                      {currentAssessment.score} - {getScoreDescription(currentAssessment.score)}
                    </Badge>
                  </Label>
                  <div className="mt-3">
                    <Slider
                      value={[currentAssessment.score]}
                      onValueChange={handleScoreChange}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 - Needs Development</span>
                      <span>3 - Average</span>
                      <span>5 - Excellent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Assessment Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Detailed observations about the player's performance in this skill..."
                    value={currentAssessment.notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={4}
                  />
                  {aiAnalysisMutation.isPending && (
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                      <Brain className="h-4 w-4 animate-pulse" />
                      <span>AI analyzing your notes...</span>
                    </div>
                  )}
                </div>

                <Button onClick={addAssessment} className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Add Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Session Assessments */}
        {assessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Session Assessments ({assessments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {categorySkills.find(s => s.id === assessment.skillId)?.name}
                        </p>
                        <p className="text-xs text-gray-500">{assessment.notes.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <Badge className={getScoreColor(assessment.score)}>
                      {assessment.score}/5
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={submitAllAssessments} 
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={submitAssessmentMutation.isPending}
              >
                {submitAssessmentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Assessments
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Insights Panel */}
      <div className="space-y-6">
        {showAiInsights && aiAnalysis && (
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Analysis</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                  BETA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Suggested Score:</strong> {aiAnalysis.suggestedScore}/5
                  <br />
                  <span className="text-sm text-gray-600">{aiAnalysis.reasoning}</span>
                </AlertDescription>
              </Alert>

              {aiAnalysis.recommendations && (
                <div>
                  <Label className="text-sm font-medium">Training Recommendations</Label>
                  <div className="space-y-2 mt-2">
                    {aiAnalysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiAnalysis.strengths && (
                <div>
                  <Label className="text-sm font-medium text-green-600">Identified Strengths</Label>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {aiAnalysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Award className="h-3 w-3 text-green-600" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysis.improvementAreas && (
                <div>
                  <Label className="text-sm font-medium text-orange-600">Areas for Improvement</Label>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {aiAnalysis.improvementAreas.map((area: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assessment Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">1</span>
                </div>
                <span>Significant development needed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-600">2</span>
                </div>
                <span>Below age-group average</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-600">3</span>
                </div>
                <span>Meets age-group expectations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">4</span>
                </div>
                <span>Above age-group average</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">5</span>
                </div>
                <span>Exceptional for age group</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Observe players in game-like situations</span>
              </li>
              <li className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Focus on technique over results</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Consider improvement over time</span>
              </li>
              <li className="flex items-start space-x-2">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Use detailed notes for AI insights</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}