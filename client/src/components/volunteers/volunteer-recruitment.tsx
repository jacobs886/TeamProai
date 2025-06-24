import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Users,
  Send,
  Target,
  Brain,
  Zap,
  Mail,
  Phone,
  Share2,
  CheckCircle,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";

interface VolunteerRecruitmentProps {
  volunteers: any[];
  aiInsights: any;
}

export default function VolunteerRecruitment({ volunteers, aiInsights }: VolunteerRecruitmentProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const { toast } = useToast();

  // Mock recruitment campaigns
  const recruitmentCampaigns = [
    {
      id: "1",
      title: "Championship Tournament Volunteers",
      description: "Recruiting volunteers for the upcoming championship tournament weekend",
      targetRoles: ["Scorekeeper", "Equipment Manager", "Referee Assistant"],
      status: "active",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      targetCount: 25,
      currentSignups: 18,
      responseRate: 72,
      channels: ["Email", "Social Media", "Team App"],
      aiOptimized: true,
      demographics: {
        parents: 60,
        students: 25,
        community: 15
      },
      performance: {
        emailOpenRate: 85,
        clickRate: 45,
        conversionRate: 32
      },
      aiRecommendations: [
        "Send reminder emails to non-responders on weekday mornings",
        "Highlight community service hours for student volunteers",
        "Offer team dinner discount for tournament volunteers"
      ]
    },
    {
      id: "2",
      title: "Season-Long Coaching Assistants",
      description: "Finding dedicated volunteers to assist with coaching throughout the season",
      targetRoles: ["Assistant Coach", "Equipment Helper", "Practice Support"],
      status: "completed",
      startDate: "2024-06-01",
      endDate: "2024-06-20",
      targetCount: 12,
      currentSignups: 15,
      responseRate: 83,
      channels: ["Email", "Parent Meeting", "Direct Contact"],
      aiOptimized: true,
      demographics: {
        parents: 80,
        students: 10,
        community: 10
      },
      performance: {
        emailOpenRate: 92,
        clickRate: 58,
        conversionRate: 48
      },
      aiRecommendations: [
        "Campaign exceeded target by 25% - use similar messaging",
        "Parent meeting announcements most effective",
        "Direct personal invitations had highest conversion"
      ]
    },
    {
      id: "3",
      title: "Game Day Support Team",
      description: "Regular volunteers needed for home game operations and fan engagement",
      targetRoles: ["Concessions", "Ticket Sales", "Fan Engagement", "Cleanup Crew"],
      status: "planning",
      startDate: "2024-07-20",
      endDate: "2024-08-05",
      targetCount: 30,
      currentSignups: 0,
      responseRate: 0,
      channels: ["Email", "Social Media", "Community Board"],
      aiOptimized: true,
      demographics: {
        parents: 50,
        students: 30,
        community: 20
      },
      performance: {
        emailOpenRate: 0,
        clickRate: 0,
        conversionRate: 0
      },
      aiRecommendations: [
        "Schedule launch for Tuesday morning for optimal engagement",
        "Create video testimonials from current volunteers",
        "Partner with local businesses for volunteer incentives"
      ]
    }
  ];

  // Mock volunteer pipeline
  const volunteerPipeline = [
    {
      stage: "Interested",
      count: 45,
      percentage: 100,
      description: "People who showed initial interest"
    },
    {
      stage: "Applied",
      count: 32,
      percentage: 71,
      description: "Submitted volunteer application"
    },
    {
      stage: "Screened",
      count: 28,
      percentage: 62,
      description: "Passed initial screening"
    },
    {
      stage: "Background Check",
      count: 24,
      percentage: 53,
      description: "Cleared background verification"
    },
    {
      stage: "Onboarded",
      count: 20,
      percentage: 44,
      description: "Completed orientation and training"
    },
    {
      stage: "Active",
      count: 18,
      percentage: 40,
      description: "Currently volunteering"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "planning": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-gray-100 text-gray-800";
      default: return "bg-purple-100 text-purple-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "planning": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "paused": return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <UserPlus className="h-4 w-4 text-purple-600" />;
    }
  };

  const handleSendCampaign = (campaignId: string) => {
    toast({
      title: "Campaign Launched",
      description: "Recruitment campaign has been sent to target audience.",
    });
  };

  const handleAIOptimize = (campaignId: string) => {
    toast({
      title: "AI Optimization",
      description: "Campaign messaging and timing optimized using AI insights.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Recruitment Intelligence */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-600" />
            <span>AI Recruitment Intelligence</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Targeting:</strong> AI identifies best volunteer prospects with 85% accuracy
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Send className="h-4 w-4" />
              <AlertDescription>
                <strong>Optimal Timing:</strong> Campaign timing optimization increases response rates by 40%
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>Personalization:</strong> Custom messaging for each volunteer type improves conversion
              </AlertDescription>
            </Alert>
            
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Performance Tracking:</strong> Real-time analytics and A/B testing capabilities
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Recruitment Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Recruitment Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteerPipeline.map((stage, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{stage.description}</span>
                    <span className="text-sm font-medium">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recruitment Campaigns</h3>
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recruitmentCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{campaign.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(campaign.status)}
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  {campaign.aiOptimized && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Brain className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-700">{campaign.description}</p>

              {/* Target Roles */}
              <div>
                <h4 className="font-medium text-sm mb-2">Target Roles</h4>
                <div className="flex flex-wrap gap-1">
                  {campaign.targetRoles.map((role, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {campaign.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volunteer Signups</span>
                    <span>{campaign.currentSignups}/{campaign.targetCount}</span>
                  </div>
                  <Progress value={(campaign.currentSignups / campaign.targetCount) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {campaign.responseRate}% response rate
                  </div>
                </div>
              )}

              {/* Campaign Metrics */}
              {campaign.status === "active" || campaign.status === "completed" ? (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{campaign.performance.emailOpenRate}%</div>
                    <div className="text-gray-600">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{campaign.performance.clickRate}%</div>
                    <div className="text-gray-600">Click Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{campaign.performance.conversionRate}%</div>
                    <div className="text-gray-600">Conversion</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Campaign not yet launched
                </div>
              )}

              {/* Channels */}
              <div>
                <h4 className="font-medium text-sm mb-2">Distribution Channels</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.channels.map((channel, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      {channel === "Email" && <Mail className="h-3 w-3" />}
                      {channel === "Social Media" && <Share2 className="h-3 w-3" />}
                      {channel === "Team App" && <Phone className="h-3 w-3" />}
                      {channel === "Parent Meeting" && <Users className="h-3 w-3" />}
                      {channel === "Direct Contact" && <Phone className="h-3 w-3" />}
                      {channel === "Community Board" && <Share2 className="h-3 w-3" />}
                      <span>{channel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              {campaign.aiRecommendations && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">AI Recommendations</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {campaign.aiRecommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {campaign.status === "planning" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-purple-600 border-purple-200"
                      onClick={() => handleAIOptimize(campaign.id)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      AI Optimize
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSendCampaign(campaign.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Launch
                    </Button>
                  </>
                )}
                
                {campaign.status === "active" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 border-blue-200"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send Reminder
                    </Button>
                  </>
                )}
                
                {campaign.status === "completed" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>{selectedCampaign.title}</span>
                {getStatusIcon(selectedCampaign.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCampaign.performance.emailOpenRate}%
                      </div>
                      <div className="text-sm text-gray-600">Email Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCampaign.performance.clickRate}%
                      </div>
                      <div className="text-sm text-gray-600">Click Through Rate</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedCampaign.performance.conversionRate}%
                    </div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Signups Progress</span>
                      <span>{selectedCampaign.currentSignups}/{selectedCampaign.targetCount}</span>
                    </div>
                    <Progress value={(selectedCampaign.currentSignups / selectedCampaign.targetCount) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Volunteer Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Parents</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedCampaign.demographics.parents}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedCampaign.demographics.parents}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Students</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${selectedCampaign.demographics.students}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedCampaign.demographics.students}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Community</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${selectedCampaign.demographics.community}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedCampaign.demographics.community}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Campaign Modal */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Recruitment Campaign</DialogTitle>
          </DialogHeader>
          <CreateCampaignForm 
            onSubmit={(data) => {
              toast({
                title: "Campaign Created",
                description: "New recruitment campaign has been created successfully.",
              });
              setShowCreateCampaign(false);
            }}
            onCancel={() => setShowCreateCampaign(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Campaign Form Component
function CreateCampaignForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetRoles: [] as string[],
    targetCount: 10,
    startDate: "",
    endDate: "",
    channels: [] as string[]
  });

  const roleOptions = [
    "Scorekeeper", "Equipment Manager", "Assistant Coach", "Referee Assistant",
    "Concessions", "Transportation", "Event Coordinator", "Photography",
    "First Aid", "Cleanup Crew", "Fundraising", "Social Media"
  ];

  const channelOptions = [
    "Email", "Social Media", "Team App", "Parent Meeting", 
    "Direct Contact", "Community Board", "Website"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Campaign Title *</label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded-md"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Summer Tournament Volunteers"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the volunteer opportunities and requirements"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Target Roles</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {roleOptions.map((role) => (
            <label key={role} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.targetRoles.includes(role)}
                onChange={() => toggleRole(role)}
                className="rounded"
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Distribution Channels</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {channelOptions.map((channel) => (
            <label key={channel} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.channels.includes(channel)}
                onChange={() => toggleChannel(channel)}
                className="rounded"
              />
              <span>{channel}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Campaign
        </Button>
      </div>
    </form>
  );
}