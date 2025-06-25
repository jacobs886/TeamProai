import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  Share2,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  Users,
  Globe,
  Brain,
  Plus,
  Calendar,
  Clock,
  Star,
  BarChart3,
  Zap,
  Target,
  Download,
  Filter,
  Settings,
  PlayCircle,
  Camera,
  Upload,
  X,
  Instagram,
  Twitter,
  Video,
  Smartphone,
  Monitor,
  Tablet,
  Edit3,
  Hash,
  Languages,
  Trophy,
  Award,
  ThumbsUp,
  Send,
  ExternalLink,
  Copy,
  Megaphone,
  Sparkles,
  ChevronRight,
  Activity,
  RefreshCw,
  CheckCircle
} from "lucide-react";

interface SocialHighlight {
  id: string;
  playerId: string;
  playerName: string;
  eventId: string;
  eventTitle: string;
  originalClipId: string;
  title: string;
  description: string;
  sport: string;
  ageGroup: string;
  platforms: SocialPlatform[];
  createdAt: string;
  status: 'pending' | 'ready' | 'published' | 'failed';
  aiCuration: {
    confidence: number;
    relevanceScore: number;
    engagementPrediction: number;
    highlightType: string;
    keyMoments: string[];
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    platformBreakdown: { [key: string]: any };
  };
  metrics: PerformanceMetric[];
  tags: string[];
}

interface SocialPlatform {
  platform: 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'youtube';
  status: 'pending' | 'ready' | 'published' | 'failed';
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  dimensions: string;
  duration: number;
  fileSize: string;
  optimizations: {
    resolution: string;
    aspectRatio: string;
    compression: string;
    captions: boolean;
    watermark: boolean;
  };
}

interface PerformanceMetric {
  name: string;
  value: string;
  timestamp: string;
  displayOverlay: boolean;
}

interface CurationRequest {
  playerId?: string;
  eventId?: string;
  teamId?: string;
  dateRange?: string;
  highlightTypes: string[];
  platforms: string[];
  language: string;
  includeMetrics: boolean;
  youthFriendly: boolean;
}

export default function FanEngagement() {
  const [currentView, setCurrentView] = useState<'overview' | 'curated' | 'published' | 'analytics' | 'create'>('overview');
  const [selectedHighlight, setSelectedHighlight] = useState<SocialHighlight | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCurationForm, setShowCurationForm] = useState(false);
  const [curationRequest, setCurationRequest] = useState<CurationRequest>({
    highlightTypes: ['goal', 'save', 'assist'],
    platforms: ['instagram', 'twitter'],
    language: 'en',
    includeMetrics: true,
    youthFriendly: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch social highlights
  const { data: highlights = [], isLoading: highlightsLoading } = useQuery({
    queryKey: ['/api/fan-engagement/social-highlights'],
    retry: false,
  });

  // Fetch engagement analytics
  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/fan-engagement/analytics'],
    retry: false,
  });

  // Fetch available players for selection
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['/api/highlights/players'],
    retry: false,
  });

  // Generate social highlights mutation
  const generateHighlightsMutation = useMutation({
    mutationFn: async (request: CurationRequest) => {
      return await apiRequest("POST", "/api/fan-engagement/generate", request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan-engagement/social-highlights'] });
      toast({ title: "AI Curation Started", description: "Social highlights are being generated with AI optimization" });
      setShowCurationForm(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Generation Failed", 
        description: error.message || "Failed to generate social highlights",
        variant: "destructive" 
      });
    },
  });

  // Publish to social platform mutation
  const publishMutation = useMutation({
    mutationFn: async ({ highlightId, platform }: { highlightId: string, platform: string }) => {
      return await apiRequest("POST", `/api/fan-engagement/publish/${highlightId}`, { platform });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan-engagement/social-highlights'] });
      toast({ title: "Published Successfully", description: "Content has been shared to social media" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Publish Failed", 
        description: error.message || "Failed to publish to social media",
        variant: "destructive" 
      });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'tiktok': return Video;
      case 'facebook': return Users;
      case 'youtube': return PlayCircle;
      default: return Share2;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'twitter': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tiktok': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'facebook': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'youtube': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'published': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Mock data for development
  const mockHighlights: SocialHighlight[] = [
    {
      id: "social-1",
      playerId: "player-1",
      playerName: "Alex Johnson",
      eventId: "event-1",
      eventTitle: "Eagles FC vs Lions United",
      originalClipId: "clip-1",
      title: "Amazing Goal - Perfect Strike!",
      description: "Spectacular 25-yard goal showcasing perfect technique and power placement",
      sport: "Soccer",
      ageGroup: "U16",
      platforms: [
        {
          platform: 'instagram',
          status: 'ready',
          videoUrl: "https://demo.social.url/instagram.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
          caption: "🚀 WHAT A STRIKE! Alex Johnson with an absolute thunderbolt from 25 yards! The precision, the power, the placement - PERFECTION! 💥",
          hashtags: ["#YouthSoccer", "#AmazingGoal", "#U16Football", "#FutureStars", "#TeamProAI"],
          dimensions: "1080x1080",
          duration: 15,
          fileSize: "12.3 MB",
          optimizations: {
            resolution: "1080p",
            aspectRatio: "1:1",
            compression: "H.264",
            captions: true,
            watermark: true
          }
        },
        {
          platform: 'twitter',
          status: 'ready',
          videoUrl: "https://demo.social.url/twitter.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
          caption: "🔥 ABSOLUTE ROCKET! Alex Johnson with a 25-yard screamer! Sprint speed: 7.2 m/s | Shot power: 95 km/h | Accuracy: Top corner perfection 🎯",
          hashtags: ["#YouthSoccer", "#Goal", "#U16", "#TeamProAI"],
          dimensions: "1280x720",
          duration: 15,
          fileSize: "8.7 MB",
          optimizations: {
            resolution: "720p",
            aspectRatio: "16:9",
            compression: "H.264",
            captions: true,
            watermark: true
          }
        }
      ],
      createdAt: new Date().toISOString(),
      status: 'ready',
      aiCuration: {
        confidence: 0.94,
        relevanceScore: 0.91,
        engagementPrediction: 0.87,
        highlightType: 'goal',
        keyMoments: ['25-yard strike', 'perfect placement', 'top corner finish']
      },
      engagement: {
        totalViews: 2450,
        totalLikes: 189,
        totalShares: 45,
        totalComments: 23,
        platformBreakdown: {
          instagram: { views: 1650, likes: 127, shares: 32, comments: 18 },
          twitter: { views: 800, likes: 62, shares: 13, comments: 5 }
        }
      },
      metrics: [
        { name: "Sprint Speed", value: "7.2 m/s", timestamp: "78:20", displayOverlay: true },
        { name: "Shot Power", value: "95 km/h", timestamp: "78:23", displayOverlay: true },
        { name: "Shot Accuracy", value: "Top Corner", timestamp: "78:23", displayOverlay: true }
      ],
      tags: ["goal", "long-range", "power", "youth-friendly"]
    },
    {
      id: "social-2",
      playerId: "player-2",
      playerName: "Maria Garcia",
      eventId: "event-1",
      eventTitle: "Eagles FC vs Lions United",
      originalClipId: "clip-2",
      title: "Incredible Save - Lightning Reflexes!",
      description: "Point-blank save showcasing elite goalkeeping reflexes and positioning",
      sport: "Soccer",
      ageGroup: "U16",
      platforms: [
        {
          platform: 'instagram',
          status: 'published',
          videoUrl: "https://demo.social.url/save-instagram.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          caption: "🥅 UNBELIEVABLE SAVE! Maria Garcia with LIGHTNING reflexes! Reaction time: 0.18s - That's ELITE level! 🔥⚡",
          hashtags: ["#YouthSoccer", "#IncredibleSave", "#Goalkeeper", "#FutureStars", "#TeamProAI"],
          dimensions: "1080x1080",
          duration: 8,
          fileSize: "7.2 MB",
          optimizations: {
            resolution: "1080p",
            aspectRatio: "1:1",
            compression: "H.264",
            captions: true,
            watermark: true
          }
        }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'published',
      aiCuration: {
        confidence: 0.91,
        relevanceScore: 0.88,
        engagementPrediction: 0.82,
        highlightType: 'save',
        keyMoments: ['point-blank save', 'lightning reflexes', 'diving stretch']
      },
      engagement: {
        totalViews: 1890,
        totalLikes: 143,
        totalShares: 28,
        totalComments: 16,
        platformBreakdown: {
          instagram: { views: 1890, likes: 143, shares: 28, comments: 16 }
        }
      },
      metrics: [
        { name: "Reaction Time", value: "0.18s", timestamp: "45:12", displayOverlay: true },
        { name: "Dive Distance", value: "2.1m", timestamp: "45:12", displayOverlay: true }
      ],
      tags: ["save", "reflexes", "goalkeeper", "youth-friendly"]
    }
  ];

  const mockAnalytics = {
    totalHighlights: mockHighlights.length,
    totalViews: mockHighlights.reduce((sum, h) => sum + h.engagement.totalViews, 0),
    totalEngagement: mockHighlights.reduce((sum, h) => sum + h.engagement.totalLikes + h.engagement.totalShares + h.engagement.totalComments, 0),
    avgEngagementRate: 0.087,
    topPlatforms: [
      { platform: 'instagram', views: 3540, engagement: 320 },
      { platform: 'twitter', views: 800, engagement: 80 }
    ],
    recentGrowth: {
      viewsGrowth: 15.3,
      engagementGrowth: 22.7,
      followersGrowth: 8.9
    },
    aiAccuracy: 0.92
  };

  const filteredHighlights = mockHighlights.filter(highlight => {
    const platformMatch = selectedPlatform === 'all' || highlight.platforms.some(p => p.platform === selectedPlatform);
    const sportMatch = selectedSport === 'all' || highlight.sport.toLowerCase() === selectedSport;
    const playerMatch = selectedPlayer === 'all' || highlight.playerId === selectedPlayer;
    const searchMatch = searchQuery === '' || 
      highlight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return platformMatch && sportMatch && playerMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AiPromptHeader 
        title="AI-Curated Social Highlights"
        subtitle="Automated social media content generation with platform optimization and fan engagement analytics"
      />

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <Button 
          variant={currentView === 'overview' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('overview')}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </Button>
        <Button 
          variant={currentView === 'curated' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('curated')}
          className="flex items-center space-x-2"
        >
          <Brain className="h-4 w-4" />
          <span>AI Curated</span>
        </Button>
        <Button 
          variant={currentView === 'published' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('published')}
          className="flex items-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Published</span>
        </Button>
        <Button 
          variant={currentView === 'analytics' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('analytics')}
          className="flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Analytics</span>
        </Button>
        <Button 
          variant={currentView === 'create' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('create')}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create</span>
        </Button>
      </div>

      {/* Overview Dashboard */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Highlights</p>
                    <p className="text-2xl font-bold text-blue-600">{mockAnalytics.totalHighlights}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-green-600">{formatNumber(mockAnalytics.totalViews)}</p>
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
                    <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{Math.round(mockAnalytics.avgEngagementRate * 100)}%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                    <p className="text-2xl font-bold text-orange-600">{Math.round(mockAnalytics.aiAccuracy * 100)}%</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Social Highlights</span>
                <Button onClick={() => setShowCurationForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHighlights.slice(0, 3).map((highlight) => (
                  <div key={highlight.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                       onClick={() => setSelectedHighlight(highlight)}>
                    <img 
                      src={highlight.platforms[0]?.thumbnailUrl} 
                      alt={highlight.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{highlight.title}</h4>
                      <p className="text-sm text-gray-600">{highlight.playerName} • {highlight.sport}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {formatNumber(highlight.engagement.totalViews)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {highlight.engagement.totalLikes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="h-3 w-3 mr-1" />
                          {highlight.engagement.totalShares}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {highlight.platforms.map((platform, index) => {
                        const PlatformIcon = getPlatformIcon(platform.platform);
                        return (
                          <div key={index} className={`p-2 rounded-lg border ${getPlatformColor(platform.platform)}`}>
                            <PlatformIcon className="h-4 w-4" />
                          </div>
                        );
                      })}
                      <Badge className={getStatusColor(highlight.status)}>
                        {highlight.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.topPlatforms.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getPlatformColor(platform.platform)}`}>
                          {React.createElement(getPlatformIcon(platform.platform), { className: "h-4 w-4" })}
                        </div>
                        <span className="font-medium capitalize">{platform.platform}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatNumber(platform.views)}</div>
                        <div className="text-sm text-gray-500">{platform.engagement} engagements</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Views Growth</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-semibold">+{mockAnalytics.recentGrowth.viewsGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Engagement Growth</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-semibold">+{mockAnalytics.recentGrowth.engagementGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Followers Growth</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-semibold">+{mockAnalytics.recentGrowth.followersGrowth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* AI Curated Content */}
      {currentView === 'curated' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search highlights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
              </select>

              <select 
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Sports</option>
                <option value="soccer">Soccer</option>
                <option value="basketball">Basketball</option>
                <option value="volleyball">Volleyball</option>
              </select>
            </div>

            <Button onClick={() => setShowCurationForm(true)}>
              <Brain className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
          </div>

          {/* Curated Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHighlights.map((highlight) => (
              <Card key={highlight.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img 
                    src={highlight.platforms[0]?.thumbnailUrl} 
                    alt={highlight.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getStatusColor(highlight.status)}`}>
                      {highlight.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-purple-600 text-white">
                      <Brain className="h-3 w-3 mr-1" />
                      AI: {Math.round(highlight.aiCuration.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => setSelectedHighlight(highlight)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-1">{highlight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{highlight.playerName} • {highlight.sport}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {highlight.platforms.map((platform, index) => {
                      const PlatformIcon = getPlatformIcon(platform.platform);
                      return (
                        <div key={index} className={`p-1 rounded border ${getPlatformColor(platform.platform)}`}>
                          <PlatformIcon className="h-3 w-3" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatNumber(highlight.engagement.totalViews)}
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round(highlight.aiCuration.engagementPrediction * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {highlight.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      {highlight.status === 'ready' && (
                        <Button 
                          size="sm" 
                          onClick={() => publishMutation.mutate({ 
                            highlightId: highlight.id, 
                            platform: highlight.platforms[0].platform 
                          })}
                          disabled={publishMutation.isPending}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create New Curation */}
      {currentView === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Generate AI-Curated Social Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Source</label>
                  <select 
                    value={curationRequest.playerId || ''}
                    onChange={(e) => setCurationRequest({...curationRequest, playerId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Player (Optional)</option>
                    <option value="player-1">Alex Johnson</option>
                    <option value="player-2">Maria Garcia</option>
                    <option value="player-3">Jordan Smith</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Highlight Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['goal', 'save', 'assist', 'tackle', 'shot', 'pass'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={curationRequest.highlightTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCurationRequest({
                                ...curationRequest,
                                highlightTypes: [...curationRequest.highlightTypes, type]
                              });
                            } else {
                              setCurationRequest({
                                ...curationRequest,
                                highlightTypes: curationRequest.highlightTypes.filter(t => t !== type)
                              });
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Platforms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['instagram', 'twitter', 'tiktok', 'facebook'].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={curationRequest.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCurationRequest({
                                ...curationRequest,
                                platforms: [...curationRequest.platforms, platform]
                              });
                            } else {
                              setCurationRequest({
                                ...curationRequest,
                                platforms: curationRequest.platforms.filter(p => p !== platform)
                              });
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    value={curationRequest.language}
                    onChange={(e) => setCurationRequest({...curationRequest, language: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={curationRequest.includeMetrics}
                      onChange={(e) => setCurationRequest({...curationRequest, includeMetrics: e.target.checked})}
                    />
                    <span className="text-sm">Include Performance Metrics</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={curationRequest.youthFriendly}
                      onChange={(e) => setCurationRequest({...curationRequest, youthFriendly: e.target.checked})}
                    />
                    <span className="text-sm">Youth-Friendly Content</span>
                  </label>
                </div>

                <Button 
                  onClick={() => generateHighlightsMutation.mutate(curationRequest)}
                  disabled={generateHighlightsMutation.isPending}
                  className="w-full"
                >
                  {generateHighlightsMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Highlight Details Modal */}
      {selectedHighlight && (
        <Dialog open={!!selectedHighlight} onOpenChange={() => setSelectedHighlight(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col" aria-describedby="highlight-details-description">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{selectedHighlight.title}</DialogTitle>
              <div id="highlight-details-description" className="text-sm text-gray-600">
                AI-curated social media content with platform optimization and engagement analytics.
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Variations */}
                <div className="space-y-4">
                  {selectedHighlight.platforms.map((platform, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {React.createElement(getPlatformIcon(platform.platform), { className: "h-5 w-5" })}
                            <span className="font-semibold capitalize">{platform.platform}</span>
                          </div>
                          <Badge className={getStatusColor(platform.status)}>
                            {platform.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="relative">
                            <img 
                              src={platform.thumbnailUrl} 
                              alt={selectedHighlight.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                                {platform.duration}s
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <strong>Caption:</strong>
                            <p className="mt-1">{platform.caption}</p>
                          </div>
                          
                          <div className="text-sm">
                            <strong>Hashtags:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {platform.hashtags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Dimensions:</span>
                              <span className="ml-1">{platform.dimensions}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Size:</span>
                              <span className="ml-1">{platform.fileSize}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {platform.status === 'ready' && (
                              <Button 
                                size="sm" 
                                onClick={() => publishMutation.mutate({ 
                                  highlightId: selectedHighlight.id, 
                                  platform: platform.platform 
                                })}
                                disabled={publishMutation.isPending}
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Publish
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Analytics & Details */}
                <div className="space-y-4">
                  {/* AI Curation Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-600" />
                        AI Curation Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.round(selectedHighlight.aiCuration.confidence * 100)}%
                            </div>
                            <div className="text-sm text-gray-600">Confidence</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(selectedHighlight.aiCuration.engagementPrediction * 100)}%
                            </div>
                            <div className="text-sm text-gray-600">Predicted Engagement</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Key Moments:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedHighlight.aiCuration.keyMoments.map((moment, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {moment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedHighlight.metrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{metric.name}</span>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">{metric.value}</div>
                              <div className="text-xs text-gray-500">@ {metric.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Engagement Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {formatNumber(selectedHighlight.engagement.totalViews)}
                          </div>
                          <div className="text-sm text-gray-600">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            {selectedHighlight.engagement.totalLikes}
                          </div>
                          <div className="text-sm text-gray-600">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {selectedHighlight.engagement.totalShares}
                          </div>
                          <div className="text-sm text-gray-600">Shares</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {selectedHighlight.engagement.totalComments}
                          </div>
                          <div className="text-sm text-gray-600">Comments</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}