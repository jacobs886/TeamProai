import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import ParentSchedule from "@/components/parent-portal/parent-schedule";
import PlayerProgress from "@/components/parent-portal/player-progress";
import PaymentCenter from "@/components/parent-portal/payment-center";
import CommunicationHub from "@/components/parent-portal/communication-hub";
import VolunteerPortal from "@/components/parent-portal/volunteer-portal";
import EquipmentTracker from "@/components/parent-portal/equipment-tracker";
import SafetyCompliance from "@/components/parent-portal/safety-compliance";
import FanEngagement from "@/components/parent-portal/fan-engagement";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Calendar,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Users,
  Package,
  Shield,
  Star,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Brain,
  Zap,
  Heart
} from "lucide-react";

export default function ParentPortal() {
  const [activeTab, setActiveTab] = useState<"schedule" | "progress" | "payments" | "communication" | "volunteer" | "equipment" | "safety" | "engagement">("schedule");
  const [selectedChild, setSelectedChild] = useState<string>("child1");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch parent data
  const { data: parentData = {}, isLoading } = useQuery({
    queryKey: ["/api/parent-portal"],
  });

  // Fetch children data
  const { data: children = [] } = useQuery({
    queryKey: ["/api/parent-portal/children"],
  });

  // Fetch AI insights
  const { data: aiInsights = {} } = useQuery({
    queryKey: ["/api/parent-portal/ai-insights"],
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
            <p className="text-gray-600">Stay connected with your child's sports journey</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Secure Portal
            </Badge>
          </div>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Viewing data for:</span>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  {children.map((child: any) => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {child.team}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-600">Upcoming Events</p>
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
                  <p className="text-xs text-gray-600">Skill Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                  <p className="text-xs text-gray-600">Outstanding Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-600">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Banner */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">AI Parent Insights</h3>
                  <p className="text-sm text-blue-700">Personalized updates and recommendations for your child</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">15%</div>
                  <div className="text-gray-600">Skill Improvement</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">99.5%</div>
                  <div className="text-gray-600">Notification Reliability</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">24/7</div>
                  <div className="text-gray-600">AI Assistant</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Practice RSVP Confirmed</p>
                    <p className="text-sm text-gray-600">Tuesday, July 23 at 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Skill Assessment Updated</p>
                    <p className="text-sm text-gray-600">Shooting accuracy improved by 12%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Payment Processed</p>
                    <p className="text-sm text-gray-600">Monthly team fee - $45.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Important Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Weather Alert:</strong> Saturday's game may be postponed due to rain. Check for updates by 8 AM.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Equipment Return:</strong> Please return practice jersey by Friday for cleaning.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Star className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Achievement:</strong> Your child earned the "Team Player" badge this week!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="schedule" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Volunteer</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Safety</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Fan Zone</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <ParentSchedule 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="progress">
            <PlayerProgress 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentCenter 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationHub 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="volunteer">
            <VolunteerPortal 
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentTracker 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyCompliance 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="engagement">
            <FanEngagement 
              childId={selectedChild}
              aiInsights={aiInsights}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}