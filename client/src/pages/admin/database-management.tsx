import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Bell,
  CreditCard,
  MessageSquare,
  BarChart3,
  Shield,
  UserCheck,
  Award,
  Package,
  Heart,
  Bot,
  Brain,
  MessageCircle,
  Building,
  TrendingUp,
  Video,
  Sparkles
} from "lucide-react";

export default function DatabaseManagement() {
  const [seedingStatus, setSeedingStatus] = useState<string>("");
  const { toast } = useToast();

  // Seed database mutation
  const seedDatabaseMutation = useMutation({
    mutationFn: async () => {
      setSeedingStatus("Seeding database...");
      const response = await apiRequest("POST", "/api/admin/seed-database", {});
      return response.json();
    },
    onSuccess: (data) => {
      setSeedingStatus("Database seeded successfully!");
      toast({
        title: "Database Seeded",
        description: `Successfully created ${Object.values(data.recordsCreated).reduce((a: number, b: number) => a + b, 0)} records across all tables`,
      });
      
      // Auto-refresh the page after 2 seconds to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      setSeedingStatus(`Seeding failed: ${error.message}`);
      toast({
        title: "Seeding Failed",
        description: "Unable to seed database with mock data",
        variant: "destructive",
      });
    }
  });

  const handleSeedDatabase = () => {
    seedDatabaseMutation.mutate();
  };

  const tableInfo = [
    { name: "Users", icon: Users, description: "Coaches, players, and administrators", expectedRecords: 7 },
    { name: "Teams", icon: Trophy, description: "Sports teams across different age groups", expectedRecords: 3 },
    { name: "Facilities", icon: MapPin, description: "Sports venues and training facilities", expectedRecords: 3 },
    { name: "Events", icon: Calendar, description: "Games, practices, and tournaments", expectedRecords: 4 },
    { name: "Notifications", icon: Bell, description: "System and team notifications", expectedRecords: 4 },
    { name: "Payments", icon: CreditCard, description: "Team fees and payment tracking", expectedRecords: 4 },
    { name: "Team Messages", icon: MessageSquare, description: "Team communication and updates", expectedRecords: 4 },
    { name: "Game Stats", icon: BarChart3, description: "Player and game performance data", expectedRecords: 3 },
    { name: "Guardians", icon: Shield, description: "Parent and guardian information", expectedRecords: 3 },
    { name: "Players", icon: UserCheck, description: "Player profiles and details", expectedRecords: 3 },
    { name: "Skills Tracking", icon: Award, description: "Player skill assessments and progress", expectedRecords: 2 },
    { name: "Equipment", icon: Package, description: "Team equipment and inventory", expectedRecords: 3 },
    { name: "Volunteers", icon: Heart, description: "Community volunteers and assignments", expectedRecords: 2 },
    { name: "Player Development", icon: TrendingUp, description: "Individual player development plans", expectedRecords: 2 },
    { name: "AI Chatbots", icon: Bot, description: "Intelligent team and general assistants", expectedRecords: 2 },
    { name: "Sentiment Analysis", icon: Brain, description: "Message sentiment and emotion tracking", expectedRecords: 2 },
    { name: "Communication Logs", icon: MessageCircle, description: "Message delivery and engagement tracking", expectedRecords: 3 },
    { name: "Facility Bookings", icon: Building, description: "Facility reservations and scheduling", expectedRecords: 2 },
    { name: "Schedule Optimization", icon: TrendingUp, description: "AI-powered schedule improvements", expectedRecords: 1 },
    { name: "Video Analysis", icon: Video, description: "Player performance video insights", expectedRecords: 1 },
    { name: "Fan Engagement", icon: Sparkles, description: "Team content and fan interaction", expectedRecords: 2 }
  ];

  const totalExpectedRecords = tableInfo.reduce((sum, table) => sum + table.expectedRecords, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            Database Management
          </h1>
          <p className="text-gray-600">Manage and populate database tables with comprehensive mock data</p>
        </div>
      </div>

      {/* Seeding Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Database Seeding</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Development Environment Only</p>
                  <p className="text-sm text-blue-700">This will populate all database tables with realistic mock data to showcase platform features</p>
                </div>
              </div>
              <Button 
                onClick={handleSeedDatabase} 
                disabled={seedDatabaseMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {seedDatabaseMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Seed Database
                  </>
                )}
              </Button>
            </div>

            {seedingStatus && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                seedingStatus.includes("successfully") 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : seedingStatus.includes("failed")
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-800"
              }`}>
                {seedingStatus.includes("successfully") ? (
                  <CheckCircle className="h-5 w-5" />
                ) : seedingStatus.includes("failed") ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                )}
                <span className="font-medium">{seedingStatus}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Database Tables Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tables Overview</CardTitle>
          <p className="text-sm text-gray-600">
            Total Expected Records: <span className="font-bold text-blue-600">{totalExpectedRecords}</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableInfo.map((table, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <table.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{table.name}</p>
                  <p className="text-xs text-gray-600 mb-1">{table.description}</p>
                  <p className="text-xs font-medium text-blue-600">{table.expectedRecords} records</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">Core Data</p>
                <p className="text-xs text-gray-600">Users, Teams, Facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">Activities</p>
                <p className="text-xs text-gray-600">Events, Messages, Stats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">AI Features</p>
                <p className="text-xs text-gray-600">Chatbots, Analysis, Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">Analytics</p>
                <p className="text-xs text-gray-600">Performance, Development</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits of Mock Data */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Comprehensive Mock Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-3 text-green-700">Feature Demonstration</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Showcase all platform capabilities with realistic data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Display comprehensive team management workflows</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Demonstrate AI-powered features with meaningful examples</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Show performance analytics and benchmarking capabilities</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-blue-700">User Experience</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Provide immediate value for new users exploring the platform</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Enable full testing of all features without setup time</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Create engaging demos for stakeholders and investors</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Support comprehensive user training and onboarding</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}