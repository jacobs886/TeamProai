import { Bell, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import HamburgerNav from "./hamburger-nav";
import NineDotMenu from "./nine-dot-menu";

export default function MobileHeader() {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["/api/notifications/unread"],
  });

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HamburgerNav />
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">TeamPro.ai</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500 text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <NineDotMenu />
        </div>
      </div>
    </header>
  );
}
