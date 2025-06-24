import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Play,
  Download,
  Share2,
  Star,
  Trophy,
  Camera,
  Video,
  Mail,
  Brain,
  Zap,
  Calendar,
  Users,
  Award
} from "lucide-react";

interface FanEngagementProps {
  childId: string;
  aiInsights: any;
}

export default function FanEngagement({ childId, aiInsights }: FanEngagementProps) {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"highlights" | "photos" | "newsletter" | "achievements">("highlights");

  const { toast } = useToast();

  // Mock highlights and media
  const gameHighlights = [
    {
      id: "highlight_001",
      title: "Alex's Winning Goal",
      description: "Championship game winning goal in the 89th minute",
      type: "video",
      thumbnail: "/api/placeholder/300/200",
      duration: "0:45",
      date: "2024-07-20",
      game: "Hawks vs Eagles - Championship Final",
      views: 245,
      likes: 32,
      aiGenerated: true,
      personalizedFor: "Alex Johnson"
    },
    {
      id: "highlight_002", 
      title: "Amazing Save Sequence",
      description: "Goalkeeper's incredible double save in the semi-final",
      type: "video",
      thumbnail: "/api/placeholder/300/200",
      duration: "0:32",
      date: "2024-07-15",
      game: "Hawks vs Sharks - Semi-Final",
      views: 189,
      likes: 28,
      aiGenerated: true,
      personalizedFor: "Team Goalkeeper"
    },
    {
      id: "highlight_003",
      title: "Team Celebration",
      description: "Team celebrating after advancing to finals",
      type: "video",
      thumbnail: "/api/placeholder/300/200",
      duration: "1:12",
      date: "2024-07-15",
      game: "Hawks vs Sharks - Semi-Final",
      views: 312,
      likes: 45,
      aiGenerated: false,
      personalizedFor: null
    }
  ];

  // Mock team photos
  const teamPhotos = [
    {
      id: "photo_001",
      title: "Championship Trophy Presentation",
      description: "Team receiving the championship trophy",
      url: "/api/placeholder/400/300",
      date: "2024-07-20",
      photographer: "Team Parent Volunteer",
      tags: ["championship", "trophy", "celebration"],
      featured: true,
      downloads: 89
    },
    {
      id: "photo_002",
      title: "Pre-Game Team Huddle",
      description: "Team motivational huddle before the big game",
      url: "/api/placeholder/400/300", 
      date: "2024-07-20",
      photographer: "Coach Sarah Williams",
      tags: ["teamwork", "motivation", "championship"],
      featured: false,
      downloads: 45
    },
    {
      id: "photo_003",
      title: "Victory Lap with Families",
      description: "Players celebrating with their families after the win",
      url: "/api/placeholder/400/300",
      date: "2024-07-20",
      photographer: "Event Photographer",
      tags: ["family", "celebration", "victory"],
      featured: true,
      downloads: 67
    }
  ];

  // Mock newsletter content
  const newsletters = [
    {
      id: "newsletter_001",
      title: "Championship Victory Newsletter",
      subtitle: "Hawks Claim the Championship!",
      date: "2024-07-21",
      content: {
        headline: "Hawks Win Championship in Thrilling Final",
        highlights: [
          "Alex Johnson scores winning goal in 89th minute",
          "Team maintains perfect record through playoffs",
          "Coach Sarah Williams named Coach of the Year"
        ],
        playerSpotlight: {
          name: "Alex Johnson",
          achievement: "Tournament MVP with 8 goals and 5 assists",
          quote: "This team is like family to me. We worked so hard for this moment!"
        },
        upcomingEvents: [
          "Championship Celebration Dinner - July 28th",
          "Team Photo Day - August 5th",
          "Summer Camp Registration Opens - August 10th"
        ]
      },
      aiPersonalized: true,
      readTime: "3 min"
    }
  ];

  // Mock achievements and milestones
  const achievements = [
    {
      id: "achieve_001",
      title: "Championship Winners 2024",
      description: "Hawks claim the league championship title",
      date: "2024-07-20",
      type: "team",
      badge: "🏆",
      rarity: "legendary",
      celebrationVideo: "championship_celebration.mp4"
    },
    {
      id: "achieve_002",
      title: "Perfect Season",
      description: "Completed regular season undefeated (12-0-0)",
      date: "2024-07-10",
      type: "team",
      badge: "⭐",
      rarity: "rare",
      celebrationVideo: null
    },
    {
      id: "achieve_003",
      title: "Most Improved Player",
      description: "Alex Johnson - 200% improvement in shooting accuracy",
      date: "2024-07-15",
      type: "individual",
      badge: "📈",
      rarity: "epic",
      celebrationVideo: null
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "epic": return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
      case "rare": return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
      case "common": return "bg-gray-100 text-gray-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const handleShareContent = (contentId: string, type: string) => {
    toast({
      title: "Content Shared",
      description: `${type} has been shared with your social networks.`,
    });
  };

  const handleDownloadContent = (contentId: string, type: string) => {
    toast({
      title: "Download Started",
      description: `${type} is being downloaded to your device.`,
    });
  };

  const handleLikeContent = (contentId: string) => {
    toast({
      title: "Liked!",
      description: "Your appreciation has been recorded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Fan Engagement Intelligence */}
      <Card className="border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-pink-600" />
            <span>AI Fan Engagement Intelligence</span>
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto-Highlights:</strong> AI creates personalized highlight reels featuring your child
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Newsletters:</strong> AI curates team news with personalized content for each family
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                <strong>Photo Recognition:</strong> AI automatically tags and organizes photos featuring your child
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Engagement Analytics:</strong> Track family engagement and create memorable moments
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Fan Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{gameHighlights.length}</p>
                <p className="text-xs text-gray-600">Video Highlights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{teamPhotos.length}</p>
                <p className="text-xs text-gray-600">Team Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{newsletters.length}</p>
                <p className="text-xs text-gray-600">Newsletters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
                <p className="text-xs text-gray-600">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Content & Memories</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "highlights" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("highlights")}
              >
                <Play className="h-4 w-4 mr-1" />
                Highlights
              </Button>
              <Button
                variant={activeTab === "photos" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("photos")}
              >
                <Camera className="h-4 w-4 mr-1" />
                Photos
              </Button>
              <Button
                variant={activeTab === "newsletter" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("newsletter")}
              >
                <Mail className="h-4 w-4 mr-1" />
                Newsletter
              </Button>
              <Button
                variant={activeTab === "achievements" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("achievements")}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Achievements
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Video Highlights */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameHighlights.map((highlight) => (
                <Card key={highlight.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-400">Video Thumbnail</span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {highlight.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        {highlight.aiGenerated && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12"
                        onClick={() => setSelectedMedia(highlight)}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-medium">{highlight.title}</h4>
                        <p className="text-sm text-gray-600">{highlight.description}</p>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>{highlight.game}</div>
                        <div>{new Date(highlight.date).toLocaleDateString()}</div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <span>{highlight.views} views</span>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>{highlight.likes}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleLikeContent(highlight.id)}>
                          <Heart className="h-3 w-3 mr-1" />
                          Like
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShareContent(highlight.id, "video")}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadContent(highlight.id, "video")}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Team Photos */}
          {activeTab === "photos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamPhotos.map((photo) => (
                <Card key={photo.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-400">Team Photo</span>
                      </div>
                      {photo.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-medium">{photo.title}</h4>
                        <p className="text-sm text-gray-600">{photo.description}</p>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>By: {photo.photographer}</div>
                        <div>{new Date(photo.date).toLocaleDateString()}</div>
                        <div>{photo.downloads} downloads</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedMedia(photo)}>
                          <Camera className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShareContent(photo.id, "photo")}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadContent(photo.id, "photo")}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Newsletter */}
          {activeTab === "newsletter" && (
            <div className="space-y-4">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{newsletter.title}</CardTitle>
                        <p className="text-gray-600">{newsletter.subtitle}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {newsletter.readTime}
                        </Badge>
                        {newsletter.aiPersonalized && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Brain className="h-3 w-3 mr-1" />
                            Personalized
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{newsletter.content.headline}</h3>
                      <div>
                        <h4 className="font-medium mb-2">Season Highlights</h4>
                        <ul className="space-y-1">
                          {newsletter.content.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium mb-2 text-yellow-900">Player Spotlight</h4>
                      <div className="text-sm">
                        <div className="font-medium">{newsletter.content.playerSpotlight.name}</div>
                        <div className="text-yellow-800 mb-2">{newsletter.content.playerSpotlight.achievement}</div>
                        <div className="italic text-yellow-700">"{newsletter.content.playerSpotlight.quote}"</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Upcoming Events</h4>
                      <ul className="space-y-1">
                        {newsletter.content.upcomingEvents.map((event, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1" onClick={() => handleShareContent(newsletter.id, "newsletter")}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Newsletter
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleDownloadContent(newsletter.id, "newsletter")}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Achievements */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`hover:shadow-md transition-shadow border-2`}>
                  <CardContent className="pt-4">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{achievement.badge}</div>
                      
                      <div>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                      
                      <div className="text-xs text-gray-500">
                        Earned: {new Date(achievement.date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex space-x-2">
                        {achievement.celebrationVideo && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play className="h-3 w-3 mr-1" />
                            Celebration
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleShareContent(achievement.id, "achievement")}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Detail Modal */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedMedia.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">
                  {selectedMedia.type === "video" ? "Video Player" : "Full Size Photo"}
                </span>
              </div>
              
              <div>
                <p className="text-gray-600">{selectedMedia.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                  {selectedMedia.game && <div>{selectedMedia.game}</div>}
                  <div>{new Date(selectedMedia.date).toLocaleDateString()}</div>
                  {selectedMedia.photographer && <div>Photo by: {selectedMedia.photographer}</div>}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => handleLikeContent(selectedMedia.id)}>
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleShareContent(selectedMedia.id, selectedMedia.type)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button className="flex-1" onClick={() => handleDownloadContent(selectedMedia.id, selectedMedia.type)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}