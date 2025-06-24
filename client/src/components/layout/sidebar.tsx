import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Home, 
  Users, 
  Calendar, 
  Building, 
  CreditCard, 
  Bell, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import HamburgerNav from "./hamburger-nav";
import NineDotMenu from "./nine-dot-menu";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Facilities", href: "/facilities", icon: Building },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin_operations':
        return 'bg-purple-100 text-purple-800';
      case 'team_admin':
        return 'bg-blue-100 text-blue-800';
      case 'team_user':
        return 'bg-green-100 text-green-800';
      case 'view_only':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <HamburgerNav />
          <div className="flex items-center ml-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">TeamPro.ai</h1>
          </div>
        </div>
        
        {/* User Role Badge */}
        {user?.role && (
          <div className="mt-4 px-4">
            <Badge className={getRoleColor(user.role)}>
              {formatRole(user.role)}
            </Badge>
          </div>
        )}

        <nav className="mt-6 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center w-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {user?.role && formatRole(user.role)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <NineDotMenu />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
