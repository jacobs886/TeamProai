import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, MapPin } from "lucide-react";

export default function FacilitiesOverview() {
  const { data: facilities, isLoading } = useQuery({
    queryKey: ["/api/facilities"],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Facility Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basketball':
        return '🏀';
      case 'volleyball':
        return '🏐';
      case 'baseball':
        return '⚾';
      default:
        return '🏃';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Available' : 'Unavailable';
  };

  const getFacilityImage = (type: string) => {
    // Using placeholder images that match the sport type
    switch (type.toLowerCase()) {
      case 'basketball':
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600';
      case 'volleyball':
        return 'https://images.unsplash.com/photo-1594736797933-d0d4bce7b089?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600';
      case 'baseball':
        return 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600';
      default:
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600';
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Facility Availability</CardTitle>
            <Button variant="ghost" size="sm">
              Manage Facilities
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {facilities && facilities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.slice(0, 3).map((facility: any) => (
                <div key={facility.id} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    className="h-48 w-full object-cover" 
                    src={getFacilityImage(facility.type)}
                    alt={`${facility.type} facility`}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(facility.isActive)}>
                      {getStatusText(facility.isActive)}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(facility.type)}</span>
                      <h4 className="text-sm font-medium text-gray-900">{facility.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{facility.type}</p>
                    
                    {facility.address && (
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{facility.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Next: Available Now</span>
                      </div>
                      {facility.hourlyRate && (
                        <span className="text-xs font-medium text-gray-900">
                          ${facility.hourlyRate}/hr
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add facilities to start booking courts and fields.
              </p>
              <div className="mt-6">
                <Button>
                  Add Facility
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
