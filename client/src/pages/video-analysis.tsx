import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  Play,
  Pause,
  Video,
  Camera,
  Download,
  Share2,
  Settings,
  Users,
  TrendingUp,
  Globe,
  Zap,
  Brain,
  Plus,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Star,
  BarChart3,
  Monitor,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Maximize,
  ChevronRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Target,
  PlayCircle,
  BookOpen,
  FileText,
  Award,
  Lightbulb,
  Filter,
  Upload,
  X
} from "lucide-react";

interface VideoAnalysis {
  id: string;
  videoId: string;
  playerId: string;
  playerName: string;
  title: string;
  sport: string;
  ageGroup: string;
  analysisDate: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  techniques: TechniqueAnalysis[];
  drills: DrillRecommendation[];
  metrics: PerformanceMetric[];
  coachApproval: 'pending' | 'approved' | 'needs_revision';
  confidence: number;
  translations: { [key: string]: string };
}

interface TechniqueAnalysis {
  id: string;
  technique: string;
  flaw: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  improvement: string;
  confidence: number;
  videoClipUrl?: string;
}

interface DrillRecommendation {
  id: string;
  name: string;
  description: string;
  technique: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  researchBasis: string;
  youthFriendly: boolean;
}

interface PerformanceMetric {
  name: string;
  value: string;
  benchmark: string;
  timestamp: string;
  improvement?: string;
}

export default function VideoAnalysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);
  const [currentView, setCurrentView] = useState<'analyses' | 'drills' | 'uploads'>('analyses');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDrillDetails, setShowDrillDetails] = useState<DrillRecommendation | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch video analyses
  const { data: analyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ['/api/video-analysis/analyses'],
    retry: false,
  });

  // Fetch drill library
  const { data: drillLibrary = [], isLoading: drillsLoading } = useQuery({
    queryKey: ['/api/video-analysis/drills'],
    retry: false,
  });

  // Fetch analysis stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/video-analysis/stats'],
    retry: false,
  });

  // Upload video mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (videoData: any) => {
      return await apiRequest("POST", "/api/video-analysis/upload", videoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/video-analysis/analyses'] });
      toast({ title: "Video Uploaded", description: "AI analysis will begin shortly" });
      setShowUploadForm(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Failed to upload video",
        variant: "destructive" 
      });
    },
  });

  // Approve analysis mutation
  const approveAnalysisMutation = useMutation({
    mutationFn: async ({ analysisId, approved }: { analysisId: string; approved: boolean }) => {
      return await apiRequest("POST", `/api/video-analysis/approve/${analysisId}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/video-analysis/analyses'] });
      toast({ title: "Analysis Updated", description: "Coach approval status changed" });
    },
  });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs_revision': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data for development
  const mockAnalyses: VideoAnalysis[] = [
    {
      id: "analysis-1",
      videoId: "video-1",
      playerId: "player-1",
      playerName: "Alex Johnson",
      title: "Soccer Dribbling Analysis - U16 Practice",
      sport: "Soccer",
      ageGroup: "U16",
      analysisDate: new Date().toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300",
      videoUrl: "https://demo.video.url/analysis1.mp4",
      duration: 180,
      coachApproval: "approved",
      confidence: 0.92,
      techniques: [
        {
          id: "tech-1",
          technique: "Dribbling",
          flaw: "Insufficient knee lift during ball control",
          severity: "medium",
          timestamp: "1:23",
          improvement: "Focus on higher knee lift to maintain better ball control",
          confidence: 0.89,
          videoClipUrl: "https://demo.video.url/clip1.mp4"
        },
        {
          id: "tech-2",
          technique: "First Touch",
          flaw: "Ball bounces too far from foot on reception",
          severity: "high",
          timestamp: "2:45",
          improvement: "Use inside of foot with more cushioning motion",
          confidence: 0.94
        }
      ],
      drills: [
        {
          id: "drill-1",
          name: "Dynamic Leg Swings",
          description: "Forward and lateral leg swings to improve knee lift and hip mobility",
          technique: "Dribbling",
          difficulty: "beginner",
          duration: 10,
          equipment: ["Cones"],
          instructions: [
            "Stand facing forward, hold onto wall or cone for balance",
            "Swing right leg forward and back 10 times",
            "Switch to left leg, repeat 10 times",
            "Perform lateral swings 10 times each leg"
          ],
          researchBasis: "ACSM Youth Movement Guidelines",
          youthFriendly: true
        },
        {
          id: "drill-2",
          name: "Cone Dribbling with High Knees",
          description: "Dribble through cones focusing on knee lift",
          technique: "Dribbling",
          difficulty: "intermediate",
          duration: 15,
          equipment: ["Ball", "5 Cones"],
          instructions: [
            "Set up 5 cones in a straight line, 2 yards apart",
            "Dribble through cones using inside of both feet",
            "Focus on lifting knees higher than normal",
            "Complete 3 sets of 5 runs"
          ],
          researchBasis: "NSCA Youth Training Guidelines",
          youthFriendly: true
        }
      ],
      metrics: [
        { name: "Sprint Speed", value: "6.8 m/s", benchmark: "Average", timestamp: "1:15", improvement: "+0.3 m/s since last analysis" },
        { name: "Ball Control", value: "78%", benchmark: "Below Average", timestamp: "1:23" },
        { name: "First Touch Success", value: "65%", benchmark: "Below Average", timestamp: "2:45" }
      ],
      translations: {
        es: "Análisis de Regate - Práctica Sub-16",
        fr: "Analyse de Dribble - Entraînement U16"
      }
    },
    {
      id: "analysis-2",
      videoId: "video-2",
      playerId: "player-2",
      playerName: "Maria Garcia",
      title: "Basketball Shooting Form - U14 Game",
      sport: "Basketball",
      ageGroup: "U14",
      analysisDate: new Date(Date.now() - 86400000).toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300",
      videoUrl: "https://demo.video.url/analysis2.mp4",
      duration: 120,
      coachApproval: "pending",
      confidence: 0.87,
      techniques: [
        {
          id: "tech-3",
          technique: "Shooting Form",
          flaw: "Inconsistent follow-through on jump shots",
          severity: "medium",
          timestamp: "0:45",
          improvement: "Keep wrist snap consistent and follow through toward basket",
          confidence: 0.91
        }
      ],
      drills: [
        {
          id: "drill-3",
          name: "Wall Shooting Form",
          description: "Practice proper shooting form against a wall",
          technique: "Shooting Form",
          difficulty: "beginner",
          duration: 10,
          equipment: ["Basketball"],
          instructions: [
            "Stand 3 feet from wall with basketball",
            "Practice shooting motion without releasing ball",
            "Focus on consistent wrist snap and follow-through",
            "Repeat 20 times"
          ],
          researchBasis: "Youth Basketball Development Standards",
          youthFriendly: true
        }
      ],
      metrics: [
        { name: "Shooting Accuracy", value: "42%", benchmark: "Average", timestamp: "0:45" },
        { name: "Release Speed", value: "4.2 m/s", benchmark: "Good", timestamp: "0:48" }
      ],
      translations: {
        es: "Forma de Tiro - Juego Sub-14",
        fr: "Forme de Tir - Match U14"
      }
    }
  ];

  const mockDrillLibrary = [
    ...mockAnalyses.flatMap(a => a.drills),
    {
      id: "drill-4",
      name: "Squat Jumps for Vertical",
      description: "Explosive squat jumps to improve vertical leap",
      technique: "Jumping",
      difficulty: "intermediate",
      duration: 12,
      equipment: ["None"],
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into squat position",
        "Explode upward jumping as high as possible",
        "Land softly and immediately repeat",
        "Complete 3 sets of 8-10 jumps"
      ],
      researchBasis: "NSCA Youth Plyometric Guidelines",
      youthFriendly: true
    }
  ];

  const filteredAnalyses = mockAnalyses.filter(analysis => {
    const sportMatch = selectedSport === 'all' || analysis.sport.toLowerCase() === selectedSport;
    const playerMatch = selectedPlayer === 'all' || analysis.playerId === selectedPlayer;
    return sportMatch && playerMatch;
  });

  const sports = ['all', ...Array.from(new Set(mockAnalyses.map(a => a.sport.toLowerCase())))];
  const players = ['all', ...Array.from(new Set(mockAnalyses.map(a => a.playerId)))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AiPromptHeader 
        title="AI-Powered Video Analysis"
        subtitle="Automated technique analysis with personalized drill recommendations and coach-vetted insights"
      />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-blue-600">{mockAnalyses.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-600">90%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drill Library</p>
                <p className="text-2xl font-bold text-purple-600">{mockDrillLibrary.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coach Approved</p>
                <p className="text-2xl font-bold text-orange-600">85%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={currentView === 'analyses' ? 'default' : 'outline'}
            onClick={() => setCurrentView('analyses')}
          >
            <Video className="h-4 w-4 mr-2" />
            Video Analyses
          </Button>
          <Button 
            variant={currentView === 'drills' ? 'default' : 'outline'}
            onClick={() => setCurrentView('drills')}
          >
            <Target className="h-4 w-4 mr-2" />
            Drill Library
          </Button>
          <Button 
            variant={currentView === 'uploads' ? 'default' : 'outline'}
            onClick={() => setCurrentView('uploads')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {currentView === 'analyses' && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {sports.map(sport => (
                <option key={sport} value={sport}>
                  {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <select 
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Players</option>
            {players.slice(1).map(playerId => {
              const analysis = mockAnalyses.find(a => a.playerId === playerId);
              return (
                <option key={playerId} value={playerId}>
                  {analysis?.playerName || `Player ${playerId}`}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Video Analyses View */}
      {currentView === 'analyses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={analysis.thumbnailUrl} 
                    alt={analysis.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getApprovalColor(analysis.coachApproval)}`}>
                      {analysis.coachApproval === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {analysis.coachApproval === 'needs_revision' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {analysis.coachApproval === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {analysis.coachApproval.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-purple-600 text-white">
                      <Brain className="h-3 w-3 mr-1" />
                      AI: {Math.round(analysis.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {formatDuration(analysis.duration)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => setSelectedAnalysis(analysis)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      View Analysis
                    </Button>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {analysis.translations[selectedLanguage] || analysis.title}
                    </h4>
                    <Badge variant="outline">{analysis.sport}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{analysis.playerName} • {analysis.ageGroup}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Techniques Analyzed:</span>
                      <span className="font-medium">{analysis.techniques.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recommended Drills:</span>
                      <span className="font-medium">{analysis.drills.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {analysis.techniques.slice(0, 2).map((tech) => (
                        <Badge key={tech.id} variant="secondary" className="text-xs">
                          {tech.technique}
                        </Badge>
                      ))}
                      {analysis.techniques.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{analysis.techniques.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAnalyses.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analyses Found</h3>
                  <p className="text-gray-600 mb-4">Upload videos to start AI-powered technique analysis.</p>
                  <Button onClick={() => setShowUploadForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Drill Library View */}
      {currentView === 'drills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDrillLibrary.map((drill) => (
            <Card key={drill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{drill.name}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={
                      drill.difficulty === 'beginner' ? 'text-green-600 border-green-200' :
                      drill.difficulty === 'intermediate' ? 'text-yellow-600 border-yellow-200' :
                      'text-red-600 border-red-200'
                    }
                  >
                    {drill.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{drill.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Technique:</span>
                    <Badge variant="secondary" className="text-xs">{drill.technique}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{drill.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium">{drill.equipment.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {drill.youthFriendly && (
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        Youth Friendly
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setShowDrillDetails(drill)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Video View */}
      {currentView === 'uploads' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Video for Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Video File</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop a video file or click to browse. Supports MP4, MOV, AVI formats.
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Analysis Details Modal */}
      {selectedAnalysis && (
        <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col" aria-describedby="analysis-details-description">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{selectedAnalysis.title}</DialogTitle>
              <div id="analysis-details-description" className="text-sm text-gray-600">
                AI-powered technique analysis with personalized drill recommendations and performance metrics.
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden flex gap-6">
              {/* Video Player */}
              <div className="flex-1">
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <video 
                    ref={videoRef}
                    className="w-full h-64 md:h-96 object-cover"
                    poster={selectedAnalysis.thumbnailUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={selectedAnalysis.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button size="sm" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Badge className="bg-purple-600 text-white">
                        <Brain className="h-3 w-3 mr-1" />
                        AI: {Math.round(selectedAnalysis.confidence * 100)}%
                      </Badge>
                    </div>
                    <Button size="sm" variant="secondary">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAnalysis.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{metric.name}</span>
                            <Badge variant="outline" className="text-xs">{metric.benchmark}</Badge>
                          </div>
                          <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                          {metric.improvement && (
                            <div className="text-xs text-green-600 mt-1">{metric.improvement}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis Details */}
              <div className="w-80 overflow-y-auto">
                {/* Technique Analysis */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Technique Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedAnalysis.techniques.map((technique) => (
                      <div key={technique.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{technique.technique}</span>
                          <Badge className={`text-xs ${getSeverityColor(technique.severity)}`}>
                            {technique.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{technique.flaw}</p>
                        <p className="text-sm text-blue-600 mb-2">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          {technique.improvement}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>@ {technique.timestamp}</span>
                          <span>{Math.round(technique.confidence * 100)}% confidence</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommended Drills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Recommended Drills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedAnalysis.drills.map((drill) => (
                      <div key={drill.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{drill.name}</span>
                          <Badge variant="outline" className="text-xs">{drill.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{drill.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{drill.duration} min</span>
                          <span>{drill.equipment.join(', ')}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setShowDrillDetails(drill)}
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          View Instructions
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Drill Details Modal */}
      {showDrillDetails && (
        <Dialog open={!!showDrillDetails} onOpenChange={() => setShowDrillDetails(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" aria-describedby="drill-details-description">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{showDrillDetails.name}</DialogTitle>
              <div id="drill-details-description" className="text-sm text-gray-600">
                Detailed instructions for this youth-friendly, research-backed training drill.
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{showDrillDetails.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{showDrillDetails.difficulty}</div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{showDrillDetails.technique}</div>
                    <div className="text-sm text-gray-600">Technique</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{showDrillDetails.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Equipment Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {showDrillDetails.equipment.map((item, index) => (
                      <Badge key={index} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <ol className="space-y-2">
                    {showDrillDetails.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Research Basis</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Award className="h-4 w-4 inline mr-2" />
                    {showDrillDetails.researchBasis}
                  </p>
                </div>

                {showDrillDetails.youthFriendly && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Youth Friendly</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      This drill is specifically designed for young athletes with age-appropriate intensity and form focus.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}