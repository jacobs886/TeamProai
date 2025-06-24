import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  Users, 
  Zap, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Wifi,
  WifiOff,
  Calendar
} from "lucide-react";
import { format, addMinutes, isAfter, isBefore } from "date-fns";

interface RealTimeAvailabilityProps {
  facilityId: number;
  updateInterval?: number; // milliseconds
}

interface AvailabilityStatus {
  isCurrentlyAvailable: boolean;
  currentBooking?: any;
  nextBooking?: any;
  availableUntil?: Date;
  availableFrom?: Date;
  conflictsDetected: number;
  lastUpdated: Date;
}

export default function RealTimeAvailability({ 
  facilityId, 
  updateInterval = 30000 
}: RealTimeAvailabilityProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Fetch real-time availability status
  const { 
    data: availabilityStatus, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: [`/api/facilities/${facilityId}/real-time-status`],
    refetchInterval: isRealTimeEnabled ? updateInterval : false,
    refetchIntervalInBackground: true,
    staleTime: 10000, // Consider data stale after 10 seconds
    onSuccess: () => {
      setLastUpdateTime(new Date());
      setConnectionStatus("connected");
    },
    onError: () => {
      setConnectionStatus("disconnected");
    },
  });

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const ws = new WebSocket(`wss://${window.location.host}/ws/facilities/${facilityId}`);
    
    ws.onopen = () => {
      setConnectionStatus("connected");
      console.log("WebSocket connected for facility", facilityId);
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        if (update.type === "booking_update") {
          refetch();
          setLastUpdateTime(new Date());
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      console.log("WebSocket disconnected for facility", facilityId);
    };

    ws.onerror = () => {
      setConnectionStatus("disconnected");
    };

    return () => {
      ws.close();
    };
  }, [facilityId, isRealTimeEnabled, refetch]);

  const getAvailabilityColor = (status: AvailabilityStatus) => {
    if (status.conflictsDetected > 0) return "bg-red-50 border-red-200";
    if (!status.isCurrentlyAvailable) return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  const getAvailabilityIcon = (status: AvailabilityStatus) => {
    if (status.conflictsDetected > 0) return { icon: AlertTriangle, color: "text-red-600", text: "Conflicts Detected" };
    if (!status.isCurrentlyAvailable) return { icon: XCircle, color: "text-orange-600", text: "Currently Occupied" };
    return { icon: CheckCircle, color: "text-green-600", text: "Available Now" };
  };

  const formatTimeRemaining = (targetTime: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((targetTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gray-400" />
              <span className="text-gray-500">Loading real-time status...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load real-time availability. 
          <Button variant="link" className="p-0 ml-2" onClick={() => refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const status = availabilityStatus as AvailabilityStatus;
  const availability = getAvailabilityIcon(status);
  const AvailabilityIcon = availability.icon;

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className="flex items-center space-x-2"
          >
            {connectionStatus === "connected" && isRealTimeEnabled ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span>Real-time</span>
          </Button>
          
          <Badge 
            variant={connectionStatus === "connected" ? "default" : "destructive"}
            className="text-xs"
          >
            {connectionStatus}
          </Badge>
        </div>
        
        <div className="text-xs text-gray-500">
          Updated {format(lastUpdateTime, "h:mm:ss a")}
        </div>
      </div>

      {/* Current Status */}
      <Card className={getAvailabilityColor(status)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <AvailabilityIcon className={`h-5 w-5 ${availability.color}`} />
            <span>{availability.text}</span>
            {status.conflictsDetected > 0 && (
              <Badge variant="destructive" className="ml-2">
                {status.conflictsDetected} Conflict{status.conflictsDetected > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Booking */}
          {status.currentBooking && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Currently Booked</span>
                </div>
                {status.availableFrom && (
                  <span className="text-xs text-gray-500">
                    Available in {formatTimeRemaining(status.availableFrom)}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="font-medium">{status.currentBooking.title}</div>
                <div className="text-sm text-gray-600">
                  {status.currentBooking.team?.name}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(status.currentBooking.startTime), "h:mm a")} - 
                    {format(new Date(status.currentBooking.endTime), "h:mm a")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Booking */}
          {status.nextBooking && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Next Booking</span>
                </div>
                <span className="text-xs text-blue-600">
                  Starts in {formatTimeRemaining(new Date(status.nextBooking.startTime))}
                </span>
              </div>
              <div className="space-y-1">
                <div className="font-medium">{status.nextBooking.title}</div>
                <div className="text-sm text-gray-600">
                  {status.nextBooking.team?.name}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(status.nextBooking.startTime), "h:mm a")} - 
                    {format(new Date(status.nextBooking.endTime), "h:mm a")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Available Window */}
          {status.isCurrentlyAvailable && status.availableUntil && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm text-green-800">Available Window</span>
              </div>
              <div className="text-sm text-green-700">
                Available for {formatTimeRemaining(status.availableUntil)} 
                (until {format(status.availableUntil, "h:mm a")})
              </div>
            </div>
          )}

          {/* Conflicts Alert */}
          {status.conflictsDetected > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {status.conflictsDetected} scheduling conflict{status.conflictsDetected > 1 ? "s" : ""} detected. 
                Immediate attention required.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Real-time Features Info */}
      {isRealTimeEnabled && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Real-time Features Active</span>
            </div>
            <ul className="mt-2 text-xs text-blue-800 space-y-1">
              <li>• Instant booking updates</li>
              <li>• Automatic conflict detection</li>
              <li>• Live availability status</li>
              <li>• WebSocket notifications</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}