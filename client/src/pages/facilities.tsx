import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  MapPin,
  Plus,
  Calendar,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Edit
} from "lucide-react";

export default function Facilities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch facilities data
  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["/api/facilities"],
  });

  // Create facility mutation
  const createFacilityMutation = useMutation({
    mutationFn: (facilityData: any) => apiRequest("POST", "/api/facilities", facilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities"] });
      toast({
        title: "Facility Added",
        description: "New facility has been successfully added.",
      });
      setShowFacilityForm(false);
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => apiRequest("POST", "/api/facility-bookings", bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities"] });
      toast({
        title: "Booking Confirmed",
        description: "Facility has been successfully booked.",
      });
      setShowBookingForm(false);
    },
  });

  const filteredFacilities = facilities.filter((facility: any) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFacility = (facilityData: any) => {
    createFacilityMutation.mutate(facilityData);
  };

  const handleBookFacility = (bookingData: any) => {
    createBookingMutation.mutate({
      ...bookingData,
      facilityId: selectedFacility?.id,
    });
  };

  const getFacilityTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "field": return "bg-green-100 text-green-800";
      case "court": return "bg-blue-100 text-blue-800";
      case "gym": return "bg-purple-100 text-purple-800";
      case "pool": return "bg-cyan-100 text-cyan-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facility Management</h1>
            <p className="text-gray-600">Book and manage sports facilities</p>
          </div>
          <Button onClick={() => setShowFacilityForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  All Types
                </Button>
                <Button variant="outline" size="sm">
                  Available Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFacilities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Facilities Found</h3>
                <p className="text-gray-600 mb-4">Add your first facility to get started.</p>
                <Button onClick={() => setShowFacilityForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Facility
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility: any) => (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                      <Badge className={getFacilityTypeColor(facility.type)}>
                        {facility.type}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {facility.capacity || "Not specified"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Hours: {facility.operatingHours || "24/7"}</span>
                    </div>
                  </div>

                  {facility.amenities && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Amenities:</div>
                      <div className="flex flex-wrap gap-1">
                        {facility.amenities.slice(0, 3).map((amenity: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{facility.rating || "4.5"}/5</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFacility(facility);
                          setShowBookingForm(true);
                        }}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Book
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Facility Form Modal */}
      <Dialog open={showFacilityForm} onOpenChange={setShowFacilityForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Facility</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const facilityData = {
                name: formData.get("name"),
                type: formData.get("type"),
                location: formData.get("location"),
                capacity: formData.get("capacity"),
                description: formData.get("description"),
              };
              handleCreateFacility(facilityData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Facility Name</label>
              <Input name="name" required />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select name="type" className="w-full p-2 border rounded-md" required>
                <option value="">Select Type</option>
                <option value="field">Field</option>
                <option value="court">Court</option>
                <option value="gym">Gym</option>
                <option value="pool">Pool</option>
                <option value="track">Track</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input name="location" required />
            </div>
            <div>
              <label className="text-sm font-medium">Capacity</label>
              <Input name="capacity" type="number" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowFacilityForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Facility</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Form Modal */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedFacility?.name}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const bookingData = {
                date: formData.get("date"),
                startTime: formData.get("startTime"),
                endTime: formData.get("endTime"),
                purpose: formData.get("purpose"),
                notes: formData.get("notes"),
              };
              handleBookFacility(bookingData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input name="date" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input name="startTime" type="time" required />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input name="endTime" type="time" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Purpose</label>
              <select name="purpose" className="w-full p-2 border rounded-md" required>
                <option value="">Select Purpose</option>
                <option value="practice">Practice</option>
                <option value="game">Game</option>
                <option value="tournament">Tournament</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Book Facility</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}