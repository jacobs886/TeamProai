import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface FacilityBookingCalendarProps {
  facilityId: number;
  facility: any;
}

export default function FacilityBookingCalendar({ facilityId, facility }: FacilityBookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock time slots for demonstration
  const timeSlots = [
    { time: "08:00", available: true, duration: "2h" },
    { time: "10:00", available: false, duration: "2h" },
    { time: "12:00", available: true, duration: "2h" },
    { time: "14:00", available: true, duration: "2h" },
    { time: "16:00", available: false, duration: "2h" },
    { time: "18:00", available: true, duration: "2h" },
    { time: "20:00", available: true, duration: "2h" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Date & Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                className={`p-3 h-auto flex flex-col items-center ${
                  !slot.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
              >
                <div className="font-medium">{slot.time}</div>
                <div className="text-xs text-gray-500">{slot.duration}</div>
                {!slot.available && (
                  <Badge variant="destructive" className="text-xs mt-1">
                    Booked
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{facility.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{selectedTime} - {parseInt(selectedTime.split(':')[0]) + 2}:00</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Capacity: {facility.capacity}</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}