import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Shield } from "lucide-react";

export default function AuthBypass() {
  const [email, setEmail] = useState("");
  const { user, isAuthenticated } = useAuth();

  const bypassMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/debug/bypass-auth", { email });
      return response;
    },
    onSuccess: (data) => {
      console.log("Bypass successful:", data);
      // Reload the page to refresh auth state
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    },
    onError: (error) => {
      console.error("Bypass failed:", error);
    }
  });

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Already Authenticated</h3>
              <p className="text-sm text-gray-500 mb-4">
                You are logged in as: {user?.email}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Role: {user?.role}
              </p>
              <Button 
                onClick={() => window.location.href = "/admin"}
                className="w-full"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Trophy className="h-6 w-6" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">TeamPro.ai</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Admin Authentication Bypass</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This is a temporary bypass for testing admin features while OAuth is being debugged.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={() => bypassMutation.mutate(email)}
                disabled={!email || bypassMutation.isPending}
                className="w-full"
              >
                {bypassMutation.isPending ? "Creating Admin User..." : "Create Test Admin & Login"}
              </Button>

              {bypassMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create test admin user. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              {bypassMutation.isSuccess && (
                <Alert>
                  <AlertDescription>
                    Test admin user created successfully! Redirecting to admin dashboard...
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>This will create a test super admin user and log you in immediately.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}