import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import {
  Grid3X3,
  BarChart3,
  Bell,
  MessageSquare,
  Brain,
  Video,
  Calendar,
  Users,
  Settings,
  Trophy,
  Target,
  Zap,
  Star,
  Globe,
  Shield,
  Camera,
  TrendingUp,
  Package,
  Handshake,
  UserCheck,
  Bot,
  MapPin,
  CreditCard,
} from "lucide-react";

interface MenuCategory {
  title: string;
  color: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  description: string;
  badge?: string;
  isNew?: boolean;
  isPremium?: boolean;
  color: string;
}

export default function NineDotMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const menuCategories: MenuCategory[] = [
    {
      title: "Core Management",
      color: "blue",
      items: [
        { title: "Dashboard", icon: BarChart3, href: "/", description: "Overview & insights", color: "bg-blue-500" },
        { title: "Teams", icon: Users, href: "/teams", description: "Team management", color: "bg-green-500" },
        { title: "Schedule", icon: Calendar, href: "/schedule", description: "Events & calendar", color: "bg-purple-500" },
        { title: "Facilities", icon: MapPin, href: "/facilities", description: "Venue booking", color: "bg-orange-500" },
        { title: "Payments", icon: CreditCard, href: "/payments", description: "Financial tracking", color: "bg-red-500" },
        { title: "Notifications", icon: Bell, href: "/notifications", description: "Alerts & updates", color: "bg-yellow-500" },
        { title: "Settings", icon: Settings, href: "/settings", description: "Configuration", color: "bg-gray-500" },
        { title: "Admin", icon: Shield, href: "/admin", description: "System admin", color: "bg-indigo-500" },
        { title: "Reports", icon: TrendingUp, href: "/reports", description: "Analytics hub", color: "bg-teal-500", isNew: true },
      ]
    },
    {
      title: "Youth Management",
      color: "green",
      items: [
        { title: "Player Roster", icon: Users, href: "/players", description: "Player profiles", color: "bg-emerald-500" },
        { title: "Skills Tracking", icon: Target, href: "/skills", description: "Development paths", color: "bg-cyan-500", isNew: true },
        { title: "Equipment", icon: Package, href: "/equipment", description: "Gear management", color: "bg-amber-500" },
        { title: "Volunteers", icon: Handshake, href: "/volunteers", description: "Helper coordination", color: "bg-lime-500" },
        { title: "Guardians", icon: UserCheck, href: "/guardians", description: "Parent portal", color: "bg-rose-500" },
        { title: "Development", icon: TrendingUp, href: "/development", description: "Progress tracking", color: "bg-violet-500" },
      ]
    },
    {
      title: "AI & Analytics",
      color: "purple",
      items: [
        { title: "Smart Analytics", icon: Brain, href: "/ai/analytics", description: "AI insights", color: "bg-purple-600", isPremium: true },
        { title: "Chatbots", icon: Bot, href: "/ai/chatbots", description: "Automated responses", color: "bg-blue-600", isPremium: true },
        { title: "Video Analysis", icon: Video, href: "/ai/video", description: "Performance AI", color: "bg-red-600", isPremium: true },
        { title: "Translation", icon: Globe, href: "/ai/translation", description: "Multi-language", color: "bg-green-600", isPremium: true },
        { title: "Scheduling AI", icon: Zap, href: "/ai/scheduling", description: "Smart planning", color: "bg-orange-600", isPremium: true },
        { title: "Fan Engagement", icon: Star, href: "/ai/engagement", description: "Social features", color: "bg-pink-600", isPremium: true },
      ]
    },
    {
      title: "Communication",
      color: "orange",
      items: [
        { title: "Team Chat", icon: MessageSquare, href: "/chat", description: "Real-time messaging", color: "bg-blue-500" },
        { title: "Notifications", icon: Bell, href: "/notifications", description: "Alert system", color: "bg-red-500", isNew: true },
        { title: "Broadcasts", icon: Globe, href: "/broadcasts", description: "Mass communication", color: "bg-purple-500" },
        { title: "Emergency", icon: Zap, href: "/emergency", description: "Crisis communication", color: "bg-red-600" },
      ]
    }
  ];

  const getGridItems = () => {
    // Create a 3x3 grid from core management items
    const coreItems = menuCategories[0].items.slice(0, 9);
    return coreItems;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Grid3X3 className="h-5 w-5 text-gray-600" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute top-full right-0 mt-2 z-50">
            <Card className="w-96 shadow-xl border border-gray-200">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">TeamPro.ai</span>
                  </div>
                  {user && (
                    <Badge variant="outline" className="text-xs">
                      {user.role?.replace('_', ' ')}
                    </Badge>
                  )}
                </div>

                {/* 3x3 Core Grid */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Access</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {getGridItems().map((item, index) => (
                      <Link key={index} href={item.href}>
                        <div
                          onClick={() => setIsOpen(false)}
                          className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative"
                        >
                          <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                            {item.title}
                          </span>
                          {item.isNew && (
                            <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0">
                              NEW
                            </Badge>
                          )}
                          {item.isPremium && (
                            <Badge className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1 py-0">
                              AI
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Categorized Features */}
                <div className="space-y-4">
                  {menuCategories.slice(1).map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-${category.color}-500 rounded-full`}></div>
                        <span>{category.title}</span>
                        {category.title === "AI & Analytics" && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                            PREMIUM
                          </Badge>
                        )}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.items.slice(0, 4).map((item, itemIndex) => (
                          <Link key={itemIndex} href={item.href}>
                            <div
                              onClick={() => setIsOpen(false)}
                              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                              <div className={`w-6 h-6 ${item.color} rounded-md flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <item.icon className="h-3 w-3 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium text-gray-700 truncate">
                                    {item.title}
                                  </span>
                                  {item.isNew && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                                      NEW
                                    </Badge>
                                  )}
                                  {item.isPremium && (
                                    <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0">
                                      AI
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {category.items.length > 4 && (
                        <div className="mt-2">
                          <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600">
                            View All {category.title} ({category.items.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>TeamPro.ai v2.0</span>
                  <div className="flex items-center space-x-2">
                    <span>AI-Powered</span>
                    <Brain className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}