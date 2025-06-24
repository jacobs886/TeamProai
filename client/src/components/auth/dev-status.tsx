import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "./logout-button";
import { Shield, User } from "lucide-react";

export default function DevStatus() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  // Check if this is a development user
  const devAuth = localStorage.getItem('dev_auth');
  if (!devAuth) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <div className="text-sm">
            <div className="font-medium text-blue-900">Development Mode</div>
            <div className="text-blue-700">{user.firstName} {user.lastName}</div>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          <User className="h-3 w-3 mr-1" />
          {user.role?.replace('_', ' ') || 'Admin'}
        </Badge>
        <LogoutButton />
      </div>
    </div>
  );
}