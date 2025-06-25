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
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Bell,
  TrendingUp,
  BarChart3,
  Plus,
  MessageSquare,
  Video,
  Trophy,
  DollarSign,
  Settings,
  ChevronRight,
  Activity,
  Star,
  Eye,
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Camera,
  Zap,
  Target,
  Globe,
  Smartphone,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Send,
  Edit3,
  Filter,
  Search,
  RefreshCw,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Navigation,
  CloudRain,
  Sun,
  ThermometerSun,
  Wind,
  Home,
  Calendar as CalendarIcon,
  Gamepad2,
  StreamingIcon,
  ImageIcon,
  CreditCard
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: 'coach' | 'player' | 'parent' | 'admin';
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  jerseyNumber?: number;
  position?: string;
  contact: {
    email: string;
    phone: string;
  };
  rsvpStatus?: 'yes' | 'no' | 'maybe' | 'pending';
}

interface GameScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  status: 'live' | 'final' | 'scheduled';
  startTime: string;
  location: string;
  inning?: string;
  period?: string;
  weather?: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  streamUrl?: string;
  statsEnabled: boolean;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'highlight';
  url: string;
  thumbnail: string;
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  views: number;
  likes: number;
  eventId?: string;
  privacy: 'team' | 'public' | 'private';
}

interface PaymentRecord {
  id: string;
  playerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
  method?: string;
}

export default function EnhancedDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [currentSection, setCurrentSection] = useState<'overview' | 'team' | 'schedule' | 'communication' | 'scorekeeping' | 'streaming' | 'media' | 'payments'>('overview');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showRosterImport, setShowRosterImport] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch existing dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    retry: false,
  });

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/dashboard/upcoming-events'],
    retry: false,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications/unread'],
    retry: false,
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/teams'],
    retry: false,
  });

  // Enhanced GameChanger/TeamSnap features data
  const mockTeamMembers: TeamMember[] = [
    {
      id: "member-1",
      name: "Sarah Johnson",
      role: "coach",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8bd?w=150",
      status: "active",
      lastActive: "5 minutes ago",
      contact: {
        email: "sarah.j@email.com",
        phone: "(555) 123-4567"
      },
      rsvpStatus: "yes"
    },
    {
      id: "member-2",
      name: "Alex Rodriguez",
      role: "player",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "active",
      lastActive: "2 hours ago",
      jerseyNumber: 10,
      position: "Forward",
      contact: {
        email: "alex.r@email.com",
        phone: "(555) 234-5678"
      },
      rsvpStatus: "yes"
    },
    {
      id: "member-3",
      name: "Maria Garcia",
      role: "player",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "active",
      lastActive: "1 hour ago",
      jerseyNumber: 1,
      position: "Goalkeeper",
      contact: {
        email: "maria.g@email.com",
        phone: "(555) 345-6789"
      },
      rsvpStatus: "maybe"
    },
    {
      id: "member-4",
      name: "David Kim",
      role: "parent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "active",
      lastActive: "30 minutes ago",
      contact: {
        email: "david.k@email.com",
        phone: "(555) 456-7890"
      },
      rsvpStatus: "pending"
    }
  ];

  const mockLiveGames: GameScore[] = [
    {
      id: "game-1",
      homeTeam: "Eagles FC",
      awayTeam: "Lions United",
      homeScore: 2,
      awayScore: 1,
      sport: "Soccer",
      status: "live",
      startTime: new Date().toISOString(),
      location: "Memorial Field",
      period: "2nd Half - 78'",
      weather: {
        condition: "sunny",
        temperature: 72,
        humidity: 45,
        windSpeed: 8
      },
      streamUrl: "https://stream.teampro.ai/live/game-1",
      statsEnabled: true
    },
    {
      id: "game-2",
      homeTeam: "Thunder Basketball",
      awayTeam: "Lightning Bolts",
      homeScore: 45,
      awayScore: 38,
      sport: "Basketball",
      status: "live",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      location: "Community Center",
      period: "3rd Quarter - 7:23",
      statsEnabled: true
    }
  ];

  const mockRecentMedia: MediaItem[] = [
    {
      id: "media-1",
      type: "highlight",
      url: "https://demo.video.url/highlight1.mp4",
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
      title: "Amazing Goal - Alex Rodriguez",
      uploadedBy: "Coach Sarah",
      uploadedAt: new Date(Date.now() - 1800000).toISOString(),
      tags: ["goal", "highlight", "soccer"],
      views: 127,
      likes: 23,
      eventId: "game-1",
      privacy: "team"
    },
    {
      id: "media-2",
      type: "photo",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      title: "Team Victory Celebration",
      uploadedBy: "Parent Mike",
      uploadedAt: new Date(Date.now() - 3600000).toISOString(),
      tags: ["team", "celebration", "victory"],
      views: 89,
      likes: 34,
      privacy: "public"
    },
    {
      id: "media-3",
      type: "video",
      url: "https://demo.video.url/training.mp4",
      thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
      title: "Skills Training Session",
      uploadedBy: "Coach Sarah",
      uploadedAt: new Date(Date.now() - 7200000).toISOString(),
      tags: ["training", "skills", "practice"],
      views: 156,
      likes: 41,
      privacy: "team"
    }
  ];

  const mockPayments: PaymentRecord[] = [
    {
      id: "pay-1",
      playerName: "Alex Rodriguez",
      amount: 75,
      status: "paid",
      dueDate: "2025-06-20",
      description: "Registration Fee - Summer Season",
      method: "Credit Card"
    },
    {
      id: "pay-2",
      playerName: "Maria Garcia",
      amount: 75,
      status: "pending",
      dueDate: "2025-06-25",
      description: "Registration Fee - Summer Season"
    },
    {
      id: "pay-3",
      playerName: "Jordan Smith",
      amount: 50,
      status: "overdue",
      dueDate: "2025-06-15",
      description: "Equipment Fee"
    }
  ];

  const dashboardSections = [
    { id: 'overview', title: 'Overview', icon: Home, description: 'Dashboard summary and key metrics' },
    { id: 'team', title: 'Team Management', icon: Users, description: 'Roster, profiles, and RSVPs' },
    { id: 'schedule', title: 'Scheduling', icon: Calendar, description: 'Games, practices, and events' },
    { id: 'communication', title: 'Communication', icon: MessageSquare, description: 'Messages and notifications' },
    { id: 'scorekeeping', title: 'Scorekeeping', icon: Trophy, description: 'Live scoring and statistics' },
    { id: 'streaming', title: 'Live Streaming', icon: Video, description: 'Game broadcasts and viewing' },
    { id: 'media', title: 'Photos & Videos', icon: Camera, description: 'Team media management' },
    { id: 'payments', title: 'Payments', icon: CreditCard, description: 'Registration and fees' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'live': case 'paid': case 'yes':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': case 'scheduled': case 'maybe':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive': case 'final': case 'overdue': case 'no':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      case 'windy': return Wind;
      default: return Sun;
    }
  };

  const getRsvpStats = () => {
    const total = mockTeamMembers.filter(m => m.role === 'player').length;
    const yes = mockTeamMembers.filter(m => m.rsvpStatus === 'yes').length;
    const no = mockTeamMembers.filter(m => m.rsvpStatus === 'no').length;
    const maybe = mockTeamMembers.filter(m => m.rsvpStatus === 'maybe').length;
    const pending = mockTeamMembers.filter(m => m.rsvpStatus === 'pending').length;
    
    return { total, yes, no, maybe, pending };
  };

  const totalPayments = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const overduePayments = mockPayments.filter(p => p.status === 'overdue').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-blue-600" />
            TeamPro.ai Dashboard
            {user && (
              <span className="text-lg font-normal text-gray-600 ml-3">
                Welcome back, {user.firstName || 'Coach'}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Complete sports management hub with GameChanger and TeamSnap features
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowQuickActions(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto">
        {dashboardSections.map((section) => (
          <Button
            key={section.id}
            variant={currentSection === section.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentSection(section.id as any)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <section.icon className="h-4 w-4" />
            <span>{section.title}</span>
          </Button>
        ))}
      </div>

      {/* Overview Section */}
      {currentSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-blue-600">{mockTeamMembers.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">{mockTeamMembers.filter(m => m.status === 'active').length} active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Live Games</p>
                    <p className="text-2xl font-bold text-green-600">{mockLiveGames.filter(g => g.status === 'live').length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <Activity className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-600">Real-time updates</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Media Items</p>
                    <p className="text-2xl font-bold text-purple-600">{mockRecentMedia.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <Upload className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="text-blue-600">Recent uploads</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payment Status</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(paidPayments)}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                  <span className="text-yellow-600">{pendingPayments} pending</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Games & Scorekeeping */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-green-600" />
                      Live Games & Scorekeeping
                    </span>
                    <div className="flex space-x-2">
                      <Badge className="bg-red-100 text-red-700">
                        <Activity className="h-3 w-3 mr-1" />
                        {mockLiveGames.filter(g => g.status === 'live').length} Live
                      </Badge>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLiveGames.map((game) => (
                      <div key={game.id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(game.status)}>
                              {game.status === 'live' && <Activity className="h-3 w-3 mr-1" />}
                              {game.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium">{game.sport}</span>
                            {game.period && (
                              <span className="text-sm text-gray-600">• {game.period}</span>
                            )}
                          </div>
                          {game.weather && (
                            <div className="flex items-center text-sm text-gray-600">
                              {React.createElement(getWeatherIcon(game.weather.condition), { className: "h-4 w-4 mr-1" })}
                              <span>{game.weather.temperature}°F</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{game.homeTeam}</div>
                            <div className="text-3xl font-bold text-blue-600">{game.homeScore}</div>
                          </div>
                          <div className="text-center px-4">
                            <div className="text-xs text-gray-500 mb-1">VS</div>
                            <div className="text-sm font-medium">{formatTime(game.startTime)}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{game.awayTeam}</div>
                            <div className="text-3xl font-bold text-red-600">{game.awayScore}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {game.location}
                          </div>
                          <div className="flex space-x-2">
                            {game.streamUrl && (
                              <Button size="sm" variant="outline">
                                <Video className="h-3 w-3 mr-1" />
                                Watch Live
                              </Button>
                            )}
                            <Button size="sm">
                              <Edit3 className="h-3 w-3 mr-1" />
                              Update Score
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-purple-600" />
                      Recent Photos & Videos
                    </span>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {mockRecentMedia.map((media) => (
                      <div key={media.id} className="relative group cursor-pointer">
                        <img 
                          src={media.thumbnail} 
                          alt={media.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            {media.type === 'video' || media.type === 'highlight' ? (
                              <PlayCircle className="h-6 w-6 mx-auto" />
                            ) : (
                              <Eye className="h-6 w-6 mx-auto" />
                            )}
                          </div>
                        </div>
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-black/70 text-white text-xs">
                            {media.type}
                          </Badge>
                        </div>
                        <div className="absolute bottom-1 right-1 flex space-x-1 text-white text-xs">
                          <span className="bg-black/70 px-1 rounded">{media.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Overview & RSVPs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Team & RSVPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* RSVP Summary */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{getRsvpStats().yes}</div>
                        <div className="text-xs text-green-600">Yes</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{getRsvpStats().maybe}</div>
                        <div className="text-xs text-yellow-600">Maybe</div>
                      </div>
                    </div>
                    
                    {/* Recent Members */}
                    <div className="space-y-2">
                      {mockTeamMembers.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center space-x-2 text-sm">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.role}</div>
                          </div>
                          {member.rsvpStatus && (
                            <Badge className={`text-xs ${getStatusColor(member.rsvpStatus)}`}>
                              {member.rsvpStatus}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setCurrentSection('team')}>
                      View All Members
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                      Schedule
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setShowEventForm(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{event.title || 'Team Event'}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(event.startTime).toLocaleDateString()}</span>
                          {event.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => setCurrentSection('schedule')}>
                      View Full Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Collected</span>
                      <span className="font-semibold text-green-600">{formatCurrency(paidPayments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="font-semibold text-yellow-600">{pendingPayments} members</span>
                    </div>
                    {overduePayments > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overdue</span>
                        <span className="font-semibold text-red-600">{overduePayments} members</span>
                      </div>
                    )}
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(paidPayments / totalPayments) * 100}%` }}
                      ></div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setCurrentSection('payments')}>
                      Manage Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Hub */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Messages
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setShowMessageForm(true)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {notifications.length} unread messages
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setCurrentSection('communication')}>
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Section */}
      {currentSection === 'team' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Roster Management
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowRosterImport(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Roster
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTeamMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                        />
                        <h4 className="font-semibold text-lg mb-2">{member.name}</h4>
                        
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <Badge variant="outline">{member.role}</Badge>
                          {member.jerseyNumber && (
                            <Badge variant="outline">#{member.jerseyNumber}</Badge>
                          )}
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>

                        {member.position && (
                          <div className="text-sm text-gray-600 mb-2">{member.position}</div>
                        )}
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-center">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="text-xs">{member.contact.email}</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <Phone className="h-3 w-3 mr-2" />
                            <span className="text-xs">{member.contact.phone}</span>
                          </div>
                          <div className="text-xs">
                            Last active: {member.lastActive}
                          </div>
                        </div>

                        {member.rsvpStatus && (
                          <div className="mb-3">
                            <Badge className={`${getStatusColor(member.rsvpStatus)} text-xs`}>
                              RSVP: {member.rsvpStatus}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions Modal */}
      {showQuickActions && (
        <Dialog open={showQuickActions} onOpenChange={setShowQuickActions}>
          <DialogContent className="max-w-3xl" aria-describedby="quick-actions-description">
            <DialogHeader>
              <DialogTitle>Quick Actions Hub</DialogTitle>
              <div id="quick-actions-description" className="text-sm text-gray-600">
                Access frequently used GameChanger and TeamSnap features from this central hub.
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setCurrentSection('team'); setShowQuickActions(false)}}>
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Team Roster</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setShowEventForm(true); setShowQuickActions(false)}}>
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">Schedule Game</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setShowMessageForm(true); setShowQuickActions(false)}}>
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-sm">Send Message</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setCurrentSection('scorekeeping'); setShowQuickActions(false)}}>
                <Trophy className="h-6 w-6 mb-2" />
                <span className="text-sm">Update Score</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setCurrentSection('streaming'); setShowQuickActions(false)}}>
                <Video className="h-6 w-6 mb-2" />
                <span className="text-sm">Start Stream</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setCurrentSection('media'); setShowQuickActions(false)}}>
                <Camera className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload Media</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setCurrentSection('payments'); setShowQuickActions(false)}}>
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-sm">Collect Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => {setShowRosterImport(true); setShowQuickActions(false)}}>
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Import Roster</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Additional modals would go here for Event Form, Message Form, Roster Import, etc. */}
    </div>
  );
}