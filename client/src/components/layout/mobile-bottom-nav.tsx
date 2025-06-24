import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Users, 
  Calendar, 
  Building, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Facilities", href: "/facilities", icon: Building },
  { name: "Alerts", href: "/notifications", icon: Bell },
];

export default function MobileBottomNav() {
  const [location, setLocation] = useLocation();

  const { data: unreadNotifications } = useQuery({
    queryKey: ["/api/notifications/unread"],
  });

  const unreadCount = unreadNotifications?.length || 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <button
              key={item.name}
              onClick={() => setLocation(item.href)}
              className={cn(
                "flex flex-col items-center py-2 px-3 relative",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
              {item.name === "Alerts" && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
