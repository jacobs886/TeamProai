import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, MapPin, Clock } from "lucide-react";

export default function Facilities() {
  const { data: facilities, isLoading } = useQuery({
    queryKey: ["/api/facilities"],
  });

  if (isLoading) {
    return (
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basketball':
        return 'bg-orange-100 text-orange-800';
      case 'volleyball':
        return 'bg-blue-100 text-blue-800';
      case 'baseball':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Facilities Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Facilities
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage courts, fields, and sports facilities
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button className="inline-flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </div>
          </div>

          {/* Facilities Grid */}
          {facilities && facilities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility: any) => (
                <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                      <Building className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {facility.name}
                        </h3>
                        <Badge className={getTypeColor(facility.type)}>
                          {facility.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {facility.address && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {facility.address}
                        </div>
                      )}
                      {facility.capacity && (
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-2">👥</span>
                          Capacity: {facility.capacity}
                        </div>
                      )}
                      {facility.hourlyRate && (
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-2">💰</span>
                          ${facility.hourlyRate}/hour
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Next: Available Now
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Book
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add facilities to start booking courts and fields.
                  </p>
                  <div className="mt-6">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Facility
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
