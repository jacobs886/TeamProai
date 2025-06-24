import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import FacilityBookingCalendar from "@/components/facilities/facility-booking-calendar";
import RealTimeAvailability from "@/components/facilities/real-time-availability";
import { Plus, Search, MapPin, Users, Clock, Calendar, Zap, CheckCircle, XCircle } from "lucide-react";

export default function Facilities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["/api/facilities"],
  });

  const filteredFacilities = facilities.filter((facility: any) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookFacility = (facility: any) => {
    setSelectedFacility(facility);
    setShowBookingDialog(true);
  };

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
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
            <p className="text-gray-600">Manage sports facilities and real-time bookings</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first facility."}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Facility
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility: any) => (
              <FacilityCard 
                key={facility.id} 
                facility={facility} 
                onBook={() => handleBookFacility(facility)}
              />
            ))}
          </div>
        )}

        {/* Advanced Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Book {selectedFacility?.name}</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </DialogTitle>
            </DialogHeader>
            {selectedFacility && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FacilityBookingCalendar
                    facilityId={selectedFacility.id}
                    facility={selectedFacility}
                  />
                </div>
                <div>
                  <RealTimeAvailability facilityId={selectedFacility.id} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Enhanced Facility Card Component
function FacilityCard({ facility, onBook }: { facility: any; onBook: () => void }) {
  // Mock real-time availability status
  const isCurrentlyAvailable = Math.random() > 0.3; // 70% chance of being available
  const hasConflicts = Math.random() > 0.8; // 20% chance of conflicts
  
  const getStatusColor = () => {
    if (hasConflicts) return "text-red-600";
    if (!isCurrentlyAvailable) return "text-orange-600";
    return "text-green-600";
  };

  const getStatusText = () => {
    if (hasConflicts) return "Conflicts Detected";
    if (!isCurrentlyAvailable) return "Currently Booked";
    return "Available Now";
  };

  const StatusIcon = hasConflicts ? XCircle : isCurrentlyAvailable ? CheckCircle : Clock;

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>{facility.name}</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{facility.type}</Badge>
          <Badge variant={facility.isActive ? "default" : "secondary"}>
            {facility.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{facility.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>Capacity: {facility.capacity}</span>
        </div>
        
        {/* Real-time Status */}
        <div className={`flex items-center text-sm ${getStatusColor()}`}>
          <StatusIcon className="h-4 w-4 mr-2" />
          <span>{getStatusText()}</span>
        </div>

        <div className="pt-3 space-y-2">
          <Button 
            variant="outline" 
            className="w-full group-hover:border-blue-500 group-hover:text-blue-600" 
            size="sm"
            onClick={onBook}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
            size="sm"
            onClick={onBook}
          >
            <Zap className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
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
