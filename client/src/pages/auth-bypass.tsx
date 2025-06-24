import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Shield } from "lucide-react";

export default function AuthBypass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleBypass = async () => {
    if (!email) return;
    
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/debug/bypass-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Test admin user created successfully! Redirecting to admin dashboard...");
        console.log("Bypass successful:", data);
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        setIsError(true);
        setMessage(data.error || "Failed to create test admin user");
      }
    } catch (error) {
      console.error("Bypass failed:", error);
      setIsError(true);
      setMessage("Failed to create test admin user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                onClick={handleBypass}
                disabled={!email || loading}
                className="w-full"
              >
                {loading ? "Creating Admin User..." : "Create Test Admin & Login"}
              </Button>

              {message && (
                <Alert variant={isError ? "destructive" : "default"}>
                  <AlertDescription>
                    {message}
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