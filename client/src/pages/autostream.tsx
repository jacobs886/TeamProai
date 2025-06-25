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
  Activity
} from "lucide-react";

interface Stream {
  id: string;
  title: string;
  eventId: string;
  status: 'live' | 'scheduled' | 'ended' | 'processing';
  streamUrl?: string;
  thumbnailUrl: string;
  viewerCount: number;
  startTime: string;
  endTime?: string;
  sport: string;
  team: string;
  metrics: {
    quality: string;
    bandwidth: string;
    latency: number;
  };
  aiFeatures: {
    autoHighlights: boolean;
    performanceOverlay: boolean;
    youthMode: boolean;
    multilingualCaptions: boolean;
  };
}

interface Highlight {
  id: string;
  streamId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  timestamp: string;
  aiConfidence: number;
  metrics: any[];
  tags: string[];
  translations: { [key: string]: string };
}

export default function AutoStream() {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStreamForm, setShowStreamForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState<'live' | 'highlights' | 'analytics'>('live');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch streams data
  const { data: streams = [], isLoading: streamsLoading } = useQuery({
    queryKey: ['/api/autostream/streams'],
    retry: false,
  });

  // Fetch highlights data
  const { data: highlights = [], isLoading: highlightsLoading } = useQuery({
    queryKey: ['/api/autostream/highlights'],
    retry: false,
  });

  // Fetch analytics data
  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/autostream/analytics'],
    retry: false,
  });

  // Start stream mutation
  const startStreamMutation = useMutation({
    mutationFn: async (streamData: any) => {
      return await apiRequest("POST", "/api/autostream/start", streamData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/autostream/streams'] });
      toast({ title: "Stream Started", description: "AI-powered streaming has begun" });
      setShowStreamForm(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Stream Failed", 
        description: error.message || "Failed to start stream",
        variant: "destructive" 
      });
    },
  });

  // Stop stream mutation
  const stopStreamMutation = useMutation({
    mutationFn: async (streamId: string) => {
      return await apiRequest("POST", `/api/autostream/stop/${streamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/autostream/streams'] });
      toast({ title: "Stream Stopped", description: "Stream ended and highlights are being generated" });
    },
  });

  // Generate highlight mutation
  const generateHighlightMutation = useMutation({
    mutationFn: async (highlightData: any) => {
      return await apiRequest("POST", "/api/autostream/generate-highlight", highlightData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/autostream/highlights'] });
      toast({ title: "Highlight Generated", description: "AI has created a new highlight clip" });
    },
  });

  const handleStartStream = (streamData: any) => {
    startStreamMutation.mutate(streamData);
  };

  const handleStopStream = (streamId: string) => {
    stopStreamMutation.mutate(streamId);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data for development
  const mockStreams: Stream[] = [
    {
      id: "stream-1",
      title: "Eagles FC U16 vs Lions United",
      eventId: "event-1",
      status: "live",
      streamUrl: "https://demo.stream.url/live1",
      thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      viewerCount: 47,
      startTime: new Date().toISOString(),
      sport: "Soccer",
      team: "Eagles FC U16",
      metrics: {
        quality: "1080p",
        bandwidth: "2.5 Mbps",
        latency: 2.1
      },
      aiFeatures: {
        autoHighlights: true,
        performanceOverlay: true,
        youthMode: true,
        multilingualCaptions: true
      }
    },
    {
      id: "stream-2",
      title: "Thunder Volleyball Practice",
      eventId: "event-2",
      status: "scheduled",
      thumbnailUrl: "https://images.unsplash.com/photo-1544337151-6e4e999de2a7?w=400",
      viewerCount: 0,
      startTime: new Date(Date.now() + 3600000).toISOString(),
      sport: "Volleyball",
      team: "Thunder Volleyball Club",
      metrics: {
        quality: "720p",
        bandwidth: "1.5 Mbps",
        latency: 0
      },
      aiFeatures: {
        autoHighlights: true,
        performanceOverlay: false,
        youthMode: true,
        multilingualCaptions: false
      }
    }
  ];

  const mockHighlights: Highlight[] = [
    {
      id: "highlight-1",
      streamId: "stream-1",
      title: "Amazing Goal by Player #10",
      description: "Lightning-fast sprint at 7.2 m/s followed by perfect shot placement",
      thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300",
      videoUrl: "https://demo.video.url/highlight1.mp4",
      duration: 15,
      timestamp: "12:34",
      aiConfidence: 0.94,
      metrics: [
        { name: "Sprint Speed", value: "7.2 m/s", benchmark: "Above Average" },
        { name: "Shot Accuracy", value: "95%", benchmark: "Excellent" },
        { name: "xG Value", value: "0.78", benchmark: "High Quality" }
      ],
      tags: ["goal", "sprint", "accuracy"],
      translations: {
        es: "Gol increíble del Jugador #10",
        fr: "But incroyable du Joueur #10"
      }
    },
    {
      id: "highlight-2",
      streamId: "stream-1",
      title: "Defensive Save",
      description: "Quick reflexes and positioning prevented a sure goal",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      videoUrl: "https://demo.video.url/highlight2.mp4",
      duration: 8,
      timestamp: "23:15",
      aiConfidence: 0.87,
      metrics: [
        { name: "Reaction Time", value: "0.21s", benchmark: "Elite" },
        { name: "Save Percentage", value: "89%", benchmark: "Excellent" }
      ],
      tags: ["save", "defense", "reflexes"],
      translations: {
        es: "Parada defensiva",
        fr: "Arrêt défensif"
      }
    }
  ];

  const activeStreams = mockStreams.filter(s => s.status === 'live');
  const scheduledStreams = mockStreams.filter(s => s.status === 'scheduled');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AiPromptHeader 
        title="AI-Powered AutoStream"
        subtitle="Automated live streaming with intelligent highlights and real-time performance analytics"
      />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Streams</p>
                <p className="text-2xl font-bold text-red-600">{activeStreams.length}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Viewers</p>
                <p className="text-2xl font-bold text-blue-600">{activeStreams.reduce((sum, s) => sum + s.viewerCount, 0)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Highlights</p>
                <p className="text-2xl font-bold text-purple-600">{mockHighlights.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Avg AI Confidence</p>
                <p className="text-2xl font-bold text-green-600">91%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={currentView === 'live' ? 'default' : 'outline'}
            onClick={() => setCurrentView('live')}
          >
            <Video className="h-4 w-4 mr-2" />
            Live Streams
          </Button>
          <Button 
            variant={currentView === 'highlights' ? 'default' : 'outline'}
            onClick={() => setCurrentView('highlights')}
          >
            <Star className="h-4 w-4 mr-2" />
            AI Highlights
          </Button>
          <Button 
            variant={currentView === 'analytics' ? 'default' : 'outline'}
            onClick={() => setCurrentView('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        <div className="flex space-x-2">
          {isOfflineMode && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline Mode
            </Badge>
          )}
          <Button onClick={() => setShowStreamForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Start Stream
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Live Streams View */}
      {currentView === 'live' && (
        <div className="space-y-6">
          {/* Active Streams */}
          {activeStreams.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live Now
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeStreams.map((stream) => (
                  <Card key={stream.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-600 text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          <Eye className="h-3 w-3 mr-1" />
                          {stream.viewerCount}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button 
                          size="lg"
                          onClick={() => setSelectedStream(stream)}
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <Play className="h-6 w-6 mr-2" />
                          Watch Live
                        </Button>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-lg mb-2">{stream.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {stream.team}
                        </span>
                        <span className="flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          {stream.sport}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {stream.aiFeatures.autoHighlights && (
                            <Badge variant="outline" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Highlights
                            </Badge>
                          )}
                          {stream.aiFeatures.youthMode && (
                            <Badge variant="outline" className="text-xs">
                              Youth Mode
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stream.metrics.quality} • {stream.metrics.latency}s delay
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Streams */}
          {scheduledStreams.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Scheduled Streams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledStreams.map((stream) => (
                  <Card key={stream.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{stream.title}</h4>
                          <p className="text-sm text-gray-600">{stream.team}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(stream.startTime).toLocaleString()}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(stream.status)}>
                            {stream.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeStreams.length === 0 && scheduledStreams.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Streams</h3>
                  <p className="text-gray-600 mb-4">Start your first AI-powered stream to engage your audience.</p>
                  <Button onClick={() => setShowStreamForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Stream
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* AI Highlights View */}
      {currentView === 'highlights' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Generated Highlights</h3>
            <div className="flex space-x-2">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHighlights.map((highlight) => (
              <Card key={highlight.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={highlight.thumbnailUrl} 
                    alt={highlight.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-purple-600 text-white">
                      <Brain className="h-3 w-3 mr-1" />
                      AI: {Math.round(highlight.aiConfidence * 100)}%
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {formatDuration(highlight.duration)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button className="bg-white/90 text-black hover:bg-white">
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">
                    {highlight.translations[selectedLanguage] || highlight.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-2 mb-3">
                    {highlight.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{metric.name}:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{metric.value}</span>
                          <Badge variant="outline" className="text-xs">
                            {metric.benchmark}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {highlight.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
        </div>
      )}

      {/* Analytics View */}
      {currentView === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Stream Engagement</h4>
                  <p className="text-3xl font-bold text-blue-600">78%</p>
                  <p className="text-xs text-gray-500 mt-1">+12% vs last week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Avg Watch Time</h4>
                  <p className="text-3xl font-bold text-green-600">24m</p>
                  <p className="text-xs text-gray-500 mt-1">+8% vs last week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Highlight Accuracy</h4>
                  <p className="text-3xl font-bold text-purple-600">91%</p>
                  <p className="text-xs text-gray-500 mt-1">AI confidence score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Languages Served</h4>
                  <p className="text-3xl font-bold text-orange-600">12</p>
                  <p className="text-xs text-gray-500 mt-1">Real-time translation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stream Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Analytics visualization will be rendered here</p>
                  <p className="text-sm">Integration with performance metrics and viewer data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stream Form Modal */}
      <Dialog open={showStreamForm} onOpenChange={setShowStreamForm}>
        <DialogContent aria-describedby="stream-form-description" className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Start AI-Powered Stream</DialogTitle>
            <div id="stream-form-description" className="text-sm text-gray-600">
              Configure automated streaming with AI features including highlight generation, performance overlays, and multilingual support.
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const streamData = {
                  title: formData.get("title"),
                  eventId: formData.get("eventId"),
                  sport: formData.get("sport"),
                  quality: formData.get("quality"),
                  autoHighlights: formData.get("autoHighlights") === "on",
                  performanceOverlay: formData.get("performanceOverlay") === "on",
                  youthMode: formData.get("youthMode") === "on",
                  multilingualCaptions: formData.get("multilingualCaptions") === "on",
                };
                handleStartStream(streamData);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stream Title</label>
                  <Input name="title" placeholder="e.g., Eagles FC vs Lions United" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Event</label>
                  <select name="eventId" className="w-full p-2 border rounded-md" required>
                    <option value="">Select Event</option>
                    <option value="event-1">Eagles FC vs Lions United</option>
                    <option value="event-2">Thunder Volleyball Practice</option>
                    <option value="event-3">Lions Basketball Championship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sport</label>
                  <select name="sport" className="w-full p-2 border rounded-md" required>
                    <option value="">Select Sport</option>
                    <option value="soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="baseball">Baseball</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Stream Quality</label>
                  <select name="quality" className="w-full p-2 border rounded-md" required>
                    <option value="720p">720p (Recommended)</option>
                    <option value="1080p">1080p (High Bandwidth)</option>
                    <option value="480p">480p (Low Bandwidth)</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-600" />
                  AI Features
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="autoHighlights" 
                      name="autoHighlights" 
                      defaultChecked 
                      className="rounded"
                    />
                    <label htmlFor="autoHighlights" className="text-sm">
                      Auto Highlight Generation
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="performanceOverlay" 
                      name="performanceOverlay" 
                      defaultChecked 
                      className="rounded"
                    />
                    <label htmlFor="performanceOverlay" className="text-sm">
                      Performance Overlay
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="youthMode" 
                      name="youthMode" 
                      defaultChecked 
                      className="rounded"
                    />
                    <label htmlFor="youthMode" className="text-sm">
                      Youth-Focused Content
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="multilingualCaptions" 
                      name="multilingualCaptions" 
                      className="rounded"
                    />
                    <label htmlFor="multilingualCaptions" className="text-sm">
                      Multilingual Captions
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t bg-white sticky bottom-0">
                <Button type="button" variant="outline" onClick={() => setShowStreamForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={startStreamMutation.isPending}>
                  {startStreamMutation.isPending ? "Starting..." : "Start Stream"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stream Player Modal */}
      {selectedStream && (
        <Dialog open={!!selectedStream} onOpenChange={() => setSelectedStream(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]" aria-describedby="stream-player-description">
            <DialogHeader>
              <DialogTitle>{selectedStream.title}</DialogTitle>
              <div id="stream-player-description" className="text-sm text-gray-600">
                Live stream with AI-powered features and real-time performance analytics.
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  className="w-full h-64 md:h-96 object-cover"
                  poster={selectedStream.thumbnailUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={selectedStream.streamUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Badge className="bg-red-600 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      LIVE
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      {selectedStream.viewerCount}
                    </Badge>
                    <Button size="sm" variant="secondary">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Quality</p>
                  <p className="font-semibold">{selectedStream.metrics.quality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Latency</p>
                  <p className="font-semibold">{selectedStream.metrics.latency}s</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bandwidth</p>
                  <p className="font-semibold">{selectedStream.metrics.bandwidth}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}