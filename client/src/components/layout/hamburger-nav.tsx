import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  Menu,
  Home,
  Users,
  Calendar,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  Shield,
  MessageSquare,
  BarChart3,
  Video,
  Bot,
  Brain,
  Target,
  Trophy,
  UserCheck,
  Package,
  Handshake,
  Zap,
  Globe,
  Camera,
  TrendingUp,
  Star,
  MessageCircle,
  Database,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  const coreNavigation: NavSection[] = [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", icon: Home, href: "/" },
        { title: "Teams", icon: Users, href: "/teams" },
        { title: "Schedule", icon: Calendar, href: "/schedule" },
        { title: "Facilities", icon: MapPin, href: "/facilities" },
        { title: "Payments", icon: CreditCard, href: "/payments" },
        { title: "Notifications", icon: Bell, href: "/notifications" },
      ]
    }
  ];

  const youthManagement: NavSection[] = [
    {
      title: "Youth Team Management",
      items: [
        { title: "Player Roster", icon: Users, href: "/players", description: "Manage players & guardians" },
        { title: "Skills Tracking", icon: Target, href: "/skills", description: "Development pathways", isNew: true },
        { title: "Equipment", icon: Package, href: "/equipment", description: "Uniform & gear management" },
        { title: "Volunteers", icon: Handshake, href: "/volunteers", description: "Coordinate helpers" },
        { title: "Guardian Portal", icon: UserCheck, href: "/guardians", description: "Parent/guardian access" },
      ]
    }
  ];

  const aiFeatures: NavSection[] = [
    {
      title: "AI-Driven Communication",
      items: [
        { title: "Smart Chatbots", icon: Bot, href: "/smart-chatbots", description: "AI assistant trained on team data", isNew: true, isPremium: true },
        { title: "Message Analysis", icon: Brain, href: "/message-analysis", description: "Intent & sentiment detection", isPremium: true },
        { title: "Translation Hub", icon: Globe, href: "/translation-hub", description: "50+ languages with AI context", isPremium: true },
        { title: "Communication Logs", icon: MessageSquare, href: "/communication-logs", description: "AI-tracked message analytics" },
      ]
    },
    {
      title: "Smart Scheduling",
      items: [
        { title: "AI Optimizer", icon: Zap, href: "/smart-scheduler", description: "Smart scheduling with conflict detection", isNew: true, isPremium: true },
        { title: "Calendar Sync", icon: Calendar, href: "/calendar-sync", description: "Google/Apple integration" },
        { title: "Availability Prediction", icon: TrendingUp, href: "/availability-prediction", description: "AI forecasting from historical patterns", isPremium: true },
      ]
    },
    {
      title: "Performance Analytics",
      items: [
        { title: "Advanced Stats", icon: BarChart3, href: "/analytics", description: "200+ sport metrics", isNew: true },
        { title: "AI Insights", icon: Brain, href: "/ai/insights", description: "Performance analysis", isPremium: true },
        { title: "Player Development", icon: TrendingUp, href: "/player-development", description: "AI-driven personalized training plans", isPremium: true },
        { title: "Benchmarks", icon: Target, href: "/benchmarks", description: "Age-appropriate performance comparisons", isPremium: true },
      ]
    },
    {
      title: "Video & Streaming",
      items: [
        { title: "AutoStream", icon: Video, href: "/autostream", description: "AI-powered streaming", isNew: true, isPremium: true },
        { title: "Video Analysis", icon: Camera, href: "/video-analysis", description: "Technique improvement", isPremium: true },
        { title: "Highlight Clips", icon: Star, href: "/highlights", description: "Auto-generated clips", isPremium: true },
      ]
    },
    {
      title: "Fan Engagement",
      items: [
        { title: "AI Social Highlights", icon: Users, href: "/fan-engagement", description: "AI-curated social media content with platform optimization", isNew: true, isPremium: true },
        { title: "Fan Rewards", icon: Star, href: "/rewards", description: "Gamified experience" },
        { title: "Leaderboards", icon: TrendingUp, href: "/leaderboards", description: "Team competitions" },
        { title: "Newsletters", icon: MessageCircle, href: "/newsletters", description: "Automated updates" },
      ]
    }
  ];

  const adminNavigation: NavSection[] = [
    {
      title: "Administration",
      items: [
        { title: "Admin Dashboard", icon: Shield, href: "/admin", description: "System management" },
        { title: "User Management", icon: Users, href: "/admin/users", description: "Role assignments" },
        { title: "Database Management", icon: Database, href: "/admin/database", description: "Seed and manage database" },
        { title: "System Settings", icon: Settings, href: "/settings", description: "Global configuration" },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const renderNavSection = (section: NavSection) => (
    <div key={section.title} className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item) => (
          <SheetClose asChild key={item.href}>
            <Link href={item.href}>
              <div
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    {item.isNew && (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800">
                        NEW
                      </Badge>
                    )}
                    {item.isPremium && (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800">
                        AI
                      </Badge>
                    )}
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            TeamPro.ai
          </SheetTitle>
          {user && (
            <div className="text-sm text-gray-600">
              Welcome, {user.firstName || user.email}
              {user.role && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {user.role.replace('_', ' ')}
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Core Navigation */}
          {coreNavigation.map(renderNavSection)}
          
          <Separator />
          
          {/* Youth Team Management */}
          {youthManagement.map(renderNavSection)}
          
          <Separator />
          
          {/* AI-Driven Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">AI-Powered Features</span>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                PREMIUM
              </Badge>
            </div>
          </div>
          {aiFeatures.map(renderNavSection)}
          
          <Separator />
          
          {/* Admin Navigation */}
          {(user?.role === 'super_admin' || user?.role === 'admin_operations') && (
            <>
              {adminNavigation.map(renderNavSection)}
              <Separator />
            </>
          )}

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center py-4">
            <p>TeamPro.ai v2.0</p>
            <p>© 2025 TeamPro.ai</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}