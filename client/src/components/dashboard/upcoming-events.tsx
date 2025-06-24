import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

interface UpcomingEventsProps {
  events?: any[];
  isLoading?: boolean;
}

export default function UpcomingEvents({ events, isLoading }: UpcomingEventsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'volleyball':
        return '🏐';
      case 'basketball':
        return '🏀';
      case 'baseball':
        return '⚾';
      default:
        return '🏃';
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'volleyball':
        return 'bg-primary text-white';
      case 'basketball':
        return 'bg-secondary text-white';
      case 'baseball':
        return 'bg-accent text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <div 
                key={event.id} 
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${getSportColor(event.sport)}`}>
                    <span className="text-lg">{getSportIcon(event.sport)}</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.startTime), "h:mm a")}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Facility {event.facilityId}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(event.startTime), "MMM d")}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule your first event to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
