import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Lock } from "lucide-react";

interface DevLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DevLogin({ open, onOpenChange }: DevLoginProps) {
  const [devEmail, setDevEmail] = useState("admin@teampro.ai");
  const [devPassword, setDevPassword] = useState("admin123");
  const { toast } = useToast();

  const handleDevLogin = () => {
    // Simple development login bypass
    if (devEmail && devPassword) {
      // Store development session
      localStorage.setItem('dev_auth', JSON.stringify({
        email: devEmail,
        role: 'super_admin',
        firstName: 'Development',
        lastName: 'User',
        timestamp: Date.now()
      }));
      
      toast({
        title: "Development Login Success",
        description: "You are now logged in as super admin for development.",
      });
      
      // Close modal and redirect
      onOpenChange(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      toast({
        title: "Login Required",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
    }
  };

  const devCredentials = [
    { email: "admin@teampro.ai", password: "admin123", role: "Super Admin" },
    { email: "coach@teampro.ai", password: "coach123", role: "Team Admin" },
    { email: "parent@teampro.ai", password: "parent123", role: "Parent" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Development Login</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pr-2">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Development Mode:</strong> This bypasses OAuth for testing purposes only.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Email</span>
            </label>
            <Input
              type="email"
              placeholder="admin@teampro.ai"
              value={devEmail}
              onChange={(e) => setDevEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </label>
            <Input
              type="password"
              placeholder="admin123"
              value={devPassword}
              onChange={(e) => setDevPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleDevLogin()}
              className="mt-1"
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-medium">Quick Login Options:</h4>
            <div className="space-y-1 pr-1">
              {devCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDevEmail(cred.email);
                    setDevPassword(cred.password);
                  }}
                  className="w-full text-left p-3 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                >
                  <div className="font-medium text-gray-900">{cred.role}</div>
                  <div className="text-gray-600 break-all">{cred.email}</div>
                  <div className="text-gray-500">Password: {cred.password}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDevLogin} className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}