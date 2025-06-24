import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Loader2,
  Zap,
  Wifi
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isToday, isSameDay, parseISO, addMinutes } from "date-fns";

interface FacilityBookingCalendarProps {
  facilityId: number;
  facility: any;
}

interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  bookings: any[];
  conflicts: any[];
}

export default function FacilityBookingCalendar({ facilityId, facility }: FacilityBookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch facility availability
  const { data: availability } = useQuery({
    queryKey: [`/api/facilities/${facilityId}/availability`],
  });

  // Fetch bookings for selected time period
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [`/api/facilities/${facilityId}/bookings`, selectedDate],
    refetchInterval: realTimeUpdates ? 30000 : false, // Real-time updates every 30 seconds
  });

  // Fetch conflicts
  const { data: conflicts } = useQuery({
    queryKey: [`/api/facilities/${facilityId}/conflicts`],
  });

  // Generate time slots for the view
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startDate = viewMode === "day" ? selectedDate : startOfWeek(selectedDate);
    const endDate = viewMode === "day" ? selectedDate : endOfWeek(selectedDate);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Generate hourly slots from 6 AM to 11 PM
      for (let hour = 6; hour < 23; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        const slotBookings = bookings?.filter((booking: any) => {
          const bookingStart = parseISO(booking.startTime);
          const bookingEnd = parseISO(booking.endTime);
          return (bookingStart < slotEnd && bookingEnd > slotStart);
        }) || [];

        const slotConflicts = conflicts?.filter((conflict: any) => {
          const booking = conflict.booking;
          if (!booking) return false;
          const bookingStart = parseISO(booking.startTime);
          const bookingEnd = parseISO(booking.endTime);
          return (bookingStart < slotEnd && bookingEnd > slotStart);
        }) || [];

        const isAvailable = slotBookings.length === 0 && slotStart > new Date();

        slots.push({
          start: slotStart,
          end: slotEnd,
          isAvailable,
          bookings: slotBookings,
          conflicts: slotConflicts,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest("POST", `/api/facilities/${facilityId}/bookings`, bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: "Your facility booking has been confirmed.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/facilities/${facilityId}/bookings`] });
      setShowBookingDialog(false);
      setSelectedTimeSlot(null);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Real-time conflict detection
  const checkConflicts = async (startTime: Date, endTime: Date) => {
    try {
      const result = await apiRequest("POST", `/api/facilities/${facilityId}/check-conflicts`, {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      return result.conflicts || [];
    } catch (error) {
      console.error("Conflict check failed:", error);
      return [];
    }
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (!slot.isAvailable) return "bg-red-50 border-red-200";
    if (slot.conflicts.length > 0) return "bg-orange-50 border-orange-200";
    if (slot.bookings.length > 0) return "bg-blue-50 border-blue-200";
    return "bg-green-50 border-green-200 hover:bg-green-100";
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (!slot.isAvailable) return { icon: XCircle, text: "Unavailable", color: "text-red-600" };
    if (slot.conflicts.length > 0) return { icon: AlertTriangle, text: "Conflict", color: "text-orange-600" };
    if (slot.bookings.length > 0) return { icon: Users, text: "Booked", color: "text-blue-600" };
    return { icon: CheckCircle, text: "Available", color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Facility Booking</h2>
          <Badge className="bg-blue-100 text-blue-800">
            <MapPin className="h-3 w-3 mr-1" />
            {facility?.name}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={realTimeUpdates ? "default" : "outline"}
            size="sm"
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className="flex items-center space-x-2"
          >
            <Wifi className="h-4 w-4" />
            <span>Real-time</span>
          </Button>
          
          <Select value={viewMode} onValueChange={(value: "day" | "week") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
          
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Real-time Status */}
      {realTimeUpdates && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Real-time updates enabled. Availability refreshes every 30 seconds.
          </AlertDescription>
        </Alert>
      )}

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {viewMode === "day" 
                ? format(selectedDate, "EEEE, MMMM d, yyyy")
                : `Week of ${format(startOfWeek(selectedDate), "MMM d")} - ${format(endOfWeek(selectedDate), "MMM d, yyyy")}`
              }
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading availability...</span>
            </div>
          ) : (
            <div className={`grid gap-2 ${viewMode === "week" ? "grid-cols-7" : "grid-cols-1"}`}>
              {viewMode === "week" && (
                <>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-600 py-2 border-b">
                      {day}
                    </div>
                  ))}
                </>
              )}
              
              {timeSlots.map((slot, index) => {
                const status = getSlotStatus(slot);
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={index}
                    onClick={() => slot.isAvailable && setSelectedTimeSlot(slot)}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors
                      ${getSlotColor(slot)}
                      ${slot.isAvailable ? "cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {format(slot.start, "h:mm a")}
                        </span>
                      </div>
                      <div className={`flex items-center space-x-1 ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs">{status.text}</span>
                      </div>
                    </div>
                    
                    {slot.bookings.length > 0 && (
                      <div className="space-y-1">
                        {slot.bookings.map((booking: any) => (
                          <div key={booking.id} className="text-xs bg-white rounded px-2 py-1">
                            <div className="font-medium truncate">{booking.title}</div>
                            <div className="text-gray-500">{booking.team?.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {slot.conflicts.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          {slot.conflicts.length} Conflict{slot.conflicts.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogTrigger asChild>
          <Button 
            onClick={() => selectedTimeSlot && setShowBookingDialog(true)}
            disabled={!selectedTimeSlot}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book Selected Time Slot
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Facility</DialogTitle>
          </DialogHeader>
          <QuickBookingForm
            timeSlot={selectedTimeSlot}
            facilityId={facilityId}
            onSubmit={(data) => bookingMutation.mutate(data)}
            isLoading={bookingMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Quick Booking Form Component
function QuickBookingForm({ 
  timeSlot, 
  facilityId, 
  onSubmit, 
  isLoading 
}: { 
  timeSlot: TimeSlot | null; 
  facilityId: number; 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attendeeCount: "",
    equipmentNeeded: "",
  });

  if (!timeSlot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      facilityId,
      title: formData.title,
      description: formData.description,
      startTime: timeSlot.start.toISOString(),
      endTime: timeSlot.end.toISOString(),
      attendeeCount: parseInt(formData.attendeeCount) || 0,
      equipmentNeeded: formData.equipmentNeeded.split(",").map(item => item.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {format(timeSlot.start, "MMM d, h:mm a")} - {format(timeSlot.end, "h:mm a")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Practice session, game, meeting..."
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Additional details about the booking..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="attendeeCount">Expected Attendees</Label>
          <Input
            id="attendeeCount"
            type="number"
            value={formData.attendeeCount}
            onChange={(e) => setFormData(prev => ({ ...prev, attendeeCount: e.target.value }))}
            placeholder="Number of people attending"
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="equipment">Equipment Needed</Label>
          <Input
            id="equipment"
            value={formData.equipmentNeeded}
            onChange={(e) => setFormData(prev => ({ ...prev, equipmentNeeded: e.target.value }))}
            placeholder="Chairs, projector, sports equipment... (comma-separated)"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.title}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
      </div>
    </form>
  );
}