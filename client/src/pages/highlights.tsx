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
  X,
  User,
  Trophy,
  Heart,
  MessageCircle,
  Grid3X3,
  List,
  Search
} from "lucide-react";

interface HighlightClip {
  id: string;
  playerId: string;
  playerName: string;
  eventId: string;
  eventTitle: string;
  title: string;
  description: string;
  sport: string;
  ageGroup: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  timestamp: string;
  createdAt: string;
  momentType: 'goal' | 'save' | 'assist' | 'tackle' | 'shot' | 'pass' | 'dribble' | 'header';
  aiConfidence: number;
  metrics: PerformanceMetric[];
  tags: string[];
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  drillRecommendations?: DrillRecommendation[];
  translations: { [key: string]: string };
}

interface PerformanceMetric {
  name: string;
  value: string;
  benchmark: string;
  timestamp: string;
  improvement?: string;
}

interface DrillRecommendation {
  id: string;
  name: string;
  description: string;
  technique: string;
  videoUrl?: string;
}

interface PlayerProfile {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  profileImageUrl: string;
  highlightCount: number;
  totalViews: number;
  avgRating: number;
}

export default function Highlights() {
  const [selectedClip, setSelectedClip] = useState<HighlightClip | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'players'>('grid');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedMoment, setSelectedMoment] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState<PlayerProfile | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch highlight clips
  const { data: clips = [], isLoading: clipsLoading } = useQuery({
    queryKey: ['/api/highlights/clips'],
    retry: false,
  });

  // Fetch player profiles
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['/api/highlights/players'],
    retry: false,
  });

  // Fetch highlight stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/highlights/stats'],
    retry: false,
  });

  // Generate highlight mutation
  const generateHighlightMutation = useMutation({
    mutationFn: async (clipData: any) => {
      return await apiRequest("POST", "/api/highlights/generate", clipData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/highlights/clips'] });
      toast({ title: "Highlight Generated", description: "AI-powered clip created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Generation Failed", 
        description: error.message || "Failed to generate highlight",
        variant: "destructive" 
      });
    },
  });

  // Like clip mutation
  const likeClipMutation = useMutation({
    mutationFn: async (clipId: string) => {
      return await apiRequest("POST", `/api/highlights/clips/${clipId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/highlights/clips'] });
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

  const getMomentTypeColor = (type: string) => {
    switch (type) {
      case 'goal': return 'text-green-600 bg-green-50 border-green-200';
      case 'save': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assist': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'tackle': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'shot': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Mock data for development
  const mockClips: HighlightClip[] = [
    {
      id: "clip-1",
      playerId: "player-1",
      playerName: "Alex Johnson",
      eventId: "event-1",
      eventTitle: "Eagles FC vs Lions United",
      title: "Amazing Goal - 25-yard Strike",
      description: "Spectacular long-range goal with perfect technique and power",
      sport: "Soccer",
      ageGroup: "U16",
      thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
      videoUrl: "https://demo.video.url/highlight1.mp4",
      duration: 15,
      timestamp: "78:23",
      createdAt: new Date().toISOString(),
      momentType: "goal",
      aiConfidence: 0.94,
      metrics: [
        { name: "Sprint Speed", value: "7.2 m/s", benchmark: "Excellent", timestamp: "78:20" },
        { name: "Shot Power", value: "95 km/h", benchmark: "Above Average", timestamp: "78:23" },
        { name: "Shot Accuracy", value: "Top Corner", benchmark: "Perfect", timestamp: "78:23" }
      ],
      tags: ["goal", "long-range", "power"],
      engagement: {
        views: 1247,
        likes: 89,
        shares: 23,
        comments: 12
      },
      drillRecommendations: [
        {
          id: "drill-1",
          name: "Long Range Shooting",
          description: "Practice shots from 25+ yards",
          technique: "Shooting Power",
          videoUrl: "https://demo.drill.url/shooting.mp4"
        }
      ],
      translations: {
        es: "Gol Increíble - Disparo de 25 yardas",
        fr: "But Incroyable - Frappe de 25 mètres"
      }
    },
    {
      id: "clip-2",
      playerId: "player-2",
      playerName: "Maria Garcia",
      eventId: "event-1",
      eventTitle: "Eagles FC vs Lions United",
      title: "Brilliant Save - Point Blank",
      description: "Lightning-fast reflexes to deny a certain goal",
      sport: "Soccer",
      ageGroup: "U16",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      videoUrl: "https://demo.video.url/highlight2.mp4",
      duration: 8,
      timestamp: "45:12",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      momentType: "save",
      aiConfidence: 0.91,
      metrics: [
        { name: "Reaction Time", value: "0.18s", benchmark: "Elite", timestamp: "45:12" },
        { name: "Dive Distance", value: "2.1m", benchmark: "Excellent", timestamp: "45:12" }
      ],
      tags: ["save", "reflexes", "point-blank"],
      engagement: {
        views: 892,
        likes: 67,
        shares: 15,
        comments: 8
      },
      translations: {
        es: "Parada Brillante - A Quemarropa",
        fr: "Arrêt Brillant - À Bout Portant"
      }
    },
    {
      id: "clip-3",
      playerId: "player-3",
      playerName: "Jordan Smith",
      eventId: "event-2",
      eventTitle: "Thunder Basketball vs Lightning",
      title: "Perfect Assist - No-Look Pass",
      description: "Incredible court vision leads to easy score",
      sport: "Basketball",
      ageGroup: "U14",
      thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
      videoUrl: "https://demo.video.url/highlight3.mp4",
      duration: 12,
      timestamp: "23:45",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      momentType: "assist",
      aiConfidence: 0.88,
      metrics: [
        { name: "Pass Speed", value: "18 mph", benchmark: "Good", timestamp: "23:44" },
        { name: "Court Vision", value: "95%", benchmark: "Excellent", timestamp: "23:45" }
      ],
      tags: ["assist", "no-look", "vision"],
      engagement: {
        views: 634,
        likes: 45,
        shares: 11,
        comments: 5
      },
      translations: {
        es: "Asistencia Perfecta - Pase Sin Mirar",
        fr: "Passe Parfaite - Sans Regarder"
      }
    }
  ];

  const mockPlayers: PlayerProfile[] = [
    {
      id: "player-1",
      name: "Alex Johnson",
      jerseyNumber: 10,
      position: "Forward",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      highlightCount: 12,
      totalViews: 5420,
      avgRating: 4.7
    },
    {
      id: "player-2",
      name: "Maria Garcia",
      jerseyNumber: 1,
      position: "Goalkeeper",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332c8bd?w=150",
      highlightCount: 8,
      totalViews: 3210,
      avgRating: 4.5
    },
    {
      id: "player-3",
      name: "Jordan Smith",
      jerseyNumber: 23,
      position: "Guard",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      highlightCount: 15,
      totalViews: 7890,
      avgRating: 4.8
    }
  ];

  const filteredClips = mockClips.filter(clip => {
    const sportMatch = selectedSport === 'all' || clip.sport.toLowerCase() === selectedSport;
    const momentMatch = selectedMoment === 'all' || clip.momentType === selectedMoment;
    const playerMatch = selectedPlayer === 'all' || clip.playerId === selectedPlayer;
    const searchMatch = searchQuery === '' || 
      clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return sportMatch && momentMatch && playerMatch && searchMatch;
  });

  const sports = ['all', ...Array.from(new Set(mockClips.map(c => c.sport.toLowerCase())))];
  const momentTypes = ['all', 'goal', 'save', 'assist', 'tackle', 'shot', 'pass', 'dribble', 'header'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AiPromptHeader 
        title="AI-Powered Highlight Clips"
        subtitle="Automated highlight generation with player profile integration and performance analytics"
      />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clips</p>
                <p className="text-2xl font-bold text-blue-600">{mockClips.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-green-600">{formatViews(mockClips.reduce((sum, c) => sum + c.engagement.views, 0))}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">91%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-orange-600">87%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clips, players, moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
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

          <select 
            value={selectedMoment}
            onChange={(e) => setSelectedMoment(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {momentTypes.map(moment => (
              <option key={moment} value={moment}>
                {moment === 'all' ? 'All Moments' : moment.charAt(0).toUpperCase() + moment.slice(1)}
              </option>
            ))}
          </select>

          <select 
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Players</option>
            {mockPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button 
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={currentView === 'players' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('players')}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>

          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Clips
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {currentView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map((clip) => (
            <Card key={clip.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img 
                  src={clip.thumbnailUrl} 
                  alt={clip.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getMomentTypeColor(clip.momentType)}`}>
                    {clip.momentType}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-purple-600 text-white">
                    <Brain className="h-3 w-3 mr-1" />
                    AI: {Math.round(clip.aiConfidence * 100)}%
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {formatDuration(clip.duration)}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    onClick={() => setSelectedClip(clip)}
                    className="bg-white/90 text-black hover:bg-white"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch
                  </Button>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src={mockPlayers.find(p => p.id === clip.playerId)?.profileImageUrl} 
                    alt={clip.playerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setShowPlayerProfile(mockPlayers.find(p => p.id === clip.playerId) || null)}>
                    {clip.playerName}
                  </span>
                  <Badge variant="outline" className="text-xs">{clip.sport}</Badge>
                </div>
                
                <h4 className="font-semibold mb-1">
                  {clip.translations[selectedLanguage] || clip.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{clip.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{formatViews(clip.engagement.views)} views</span>
                  <span>@ {clip.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <button 
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      onClick={() => likeClipMutation.mutate(clip.id)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{clip.engagement.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{clip.engagement.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>{clip.engagement.shares}</span>
                    </button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div className="space-y-4">
          {filteredClips.map((clip) => (
            <Card key={clip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={clip.thumbnailUrl} 
                      alt={clip.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{clip.translations[selectedLanguage] || clip.title}</h4>
                      <Badge className={`${getMomentTypeColor(clip.momentType)} text-xs`}>
                        {clip.momentType}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <img 
                        src={mockPlayers.find(p => p.id === clip.playerId)?.profileImageUrl} 
                        alt={clip.playerName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-sm text-blue-600">{clip.playerName}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatViews(clip.engagement.views)} views</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatDuration(clip.duration)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{clip.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button 
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                        onClick={() => likeClipMutation.mutate(clip.id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{clip.engagement.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{clip.engagement.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>{clip.engagement.shares}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm"
                      onClick={() => setSelectedClip(clip)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Players View */}
      {currentView === 'players' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlayers.map((player) => (
            <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setShowPlayerProfile(player)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <img 
                    src={player.profileImageUrl} 
                    alt={player.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h4 className="font-semibold text-lg mb-1">{player.name}</h4>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Badge variant="outline">#{player.jerseyNumber}</Badge>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{player.highlightCount}</div>
                      <div className="text-xs text-gray-500">Highlights</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatViews(player.totalViews)}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{player.avgRating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredClips.length === 0 && currentView !== 'players' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Highlights Found</h3>
              <p className="text-gray-600 mb-4">No clips match your current filters. Try adjusting your search criteria.</p>
              <Button onClick={() => {
                setSelectedSport('all');
                setSelectedMoment('all');
                setSelectedPlayer('all');
                setSearchQuery('');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clip Player Modal */}
      {selectedClip && (
        <Dialog open={!!selectedClip} onOpenChange={() => setSelectedClip(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col" aria-describedby="clip-player-description">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{selectedClip.title}</DialogTitle>
              <div id="clip-player-description" className="text-sm text-gray-600">
                AI-generated highlight clip with performance metrics and drill recommendations.
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden flex gap-6">
              {/* Video Player */}
              <div className="flex-1">
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <video 
                    ref={videoRef}
                    className="w-full h-64 md:h-96 object-cover"
                    poster={selectedClip.thumbnailUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={selectedClip.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button size="sm" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Badge className={`${getMomentTypeColor(selectedClip.momentType)}`}>
                        {selectedClip.momentType}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-600 text-white">
                        <Brain className="h-3 w-3 mr-1" />
                        AI: {Math.round(selectedClip.aiConfidence * 100)}%
                      </Badge>
                      <Button size="sm" variant="secondary">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                      onClick={() => likeClipMutation.mutate(selectedClip.id)}
                    >
                      <Heart className="h-5 w-5" />
                      <span>{selectedClip.engagement.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{selectedClip.engagement.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>{selectedClip.engagement.shares}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedClip.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">{metric.name}</div>
                          <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                          <Badge variant="outline" className="text-xs mt-1">{metric.benchmark}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clip Details */}
              <div className="w-80 overflow-y-auto">
                {/* Player Info */}
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={mockPlayers.find(p => p.id === selectedClip.playerId)?.profileImageUrl} 
                        alt={selectedClip.playerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedClip.playerName}</h4>
                        <p className="text-sm text-gray-600">{selectedClip.eventTitle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{selectedClip.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>@ {selectedClip.timestamp}</span>
                      <span>{formatViews(selectedClip.engagement.views)} views</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Drill Recommendations */}
                {selectedClip.drillRecommendations && selectedClip.drillRecommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Target className="h-5 w-5 mr-2 text-green-600" />
                        Recommended Drills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedClip.drillRecommendations.map((drill) => (
                        <div key={drill.id} className="border rounded-lg p-3">
                          <h5 className="font-medium mb-1">{drill.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{drill.description}</p>
                          <Button size="sm" variant="outline" className="w-full">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            View Drill
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Player Profile Modal */}
      {showPlayerProfile && (
        <Dialog open={!!showPlayerProfile} onOpenChange={() => setShowPlayerProfile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" aria-describedby="player-profile-description">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{showPlayerProfile.name} - Highlight Reel</DialogTitle>
              <div id="player-profile-description" className="text-sm text-gray-600">
                Complete collection of AI-generated highlights and performance analytics for this player.
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Player Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <img 
                  src={showPlayerProfile.profileImageUrl} 
                  alt={showPlayerProfile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{showPlayerProfile.name}</h3>
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge variant="outline">#{showPlayerProfile.jerseyNumber}</Badge>
                    <Badge variant="outline">{showPlayerProfile.position}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{showPlayerProfile.highlightCount}</div>
                      <div className="text-xs text-gray-500">Highlights</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{formatViews(showPlayerProfile.totalViews)}</div>
                      <div className="text-xs text-gray-500">Total Views</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{showPlayerProfile.avgRating}</div>
                      <div className="text-xs text-gray-500">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player's Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {mockClips.filter(clip => clip.playerId === showPlayerProfile.id).map((clip) => (
                  <Card key={clip.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedClip(clip)}>
                    <div className="relative">
                      <img 
                        src={clip.thumbnailUrl} 
                        alt={clip.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${getMomentTypeColor(clip.momentType)} text-xs`}>
                          {clip.momentType}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                          {formatDuration(clip.duration)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-3">
                      <h5 className="font-medium text-sm mb-1">{clip.title}</h5>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatViews(clip.engagement.views)} views</span>
                        <span>{clip.engagement.likes} likes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}