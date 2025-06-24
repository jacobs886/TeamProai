import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear development auth
    localStorage.removeItem('dev_auth');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to landing page
    window.location.href = "/";
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}