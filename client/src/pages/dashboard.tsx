import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/stats-cards";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import QuickActions from "@/components/dashboard/quick-actions";
import FacilitiesOverview from "@/components/dashboard/facilities-overview";
import TeamManagement from "@/components/dashboard/team-management";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Plus, CalendarPlus } from "lucide-react";
import { useState } from "react";
import EventForm from "@/components/events/event-form";

export default function Dashboard() {
  const { user } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-events"],
  });

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? "Good morning" : "Good afternoon";
  const dateString = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Dashboard Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {greeting}! Today is {dateString}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button 
                onClick={() => setShowEventForm(true)}
                className="inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
              <Button 
                variant="outline"
                className="inline-flex items-center"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Quick Schedule
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} isLoading={statsLoading} />

          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <UpcomingEvents events={upcomingEvents} isLoading={eventsLoading} />
            </div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>

          {/* Facilities Overview */}
          <FacilitiesOverview />

          {/* Team Management Section */}
          <TeamManagement />
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm 
          open={showEventForm} 
          onClose={() => setShowEventForm(false)} 
        />
      )}
    </main>
  );
}
