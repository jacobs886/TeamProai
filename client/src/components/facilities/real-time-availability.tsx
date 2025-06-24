import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap } from "lucide-react";

interface RealTimeAvailabilityProps {
  facilityId: number;
}

export default function RealTimeAvailability({ facilityId }: RealTimeAvailabilityProps) {
  const [status, setStatus] = useState("available");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["available", "busy", "maintenance"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "busy":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return "Available Now";
      case "busy":
        return "Currently Occupied";
      case "maintenance":
        return "Under Maintenance";
      default:
        return "Status Unknown";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "busy":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Real-time Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
              <div className="text-xs text-gray-500 mt-1">
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {status === "available" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This facility is available for immediate booking.
              </AlertDescription>
            </Alert>
          )}

          {status === "busy" && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Currently in use. Next available slot: 2:00 PM
              </AlertDescription>
            </Alert>
          )}

          {status === "maintenance" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Scheduled maintenance until 3:00 PM today.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "09:00-11:00", event: "Basketball Practice", team: "Eagles" },
              { time: "14:00-16:00", event: "Volleyball Game", team: "Hawks" },
              { time: "18:00-20:00", event: "Open Play", team: "Public" },
            ].map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{booking.event}</div>
                  <div className="text-xs text-gray-500">{booking.team}</div>
                </div>
                <div className="text-sm text-gray-600">{booking.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}