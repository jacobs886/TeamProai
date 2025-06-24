import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, Trophy, MessageCircle, BarChart3 } from "lucide-react";
import { useState } from "react";
import TeamCard from "@/components/teams/team-card";
import TeamChat from "@/components/chat/team-chat";
import Scorekeeping from "@/components/stats/scorekeeping";

export default function Teams() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["/api/teams"],
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
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Teams Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                My Teams
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your volleyball, basketball, and baseball teams
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>

          {/* Teams Content */}
          {teams && teams.length > 0 ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="chat">Team Chat</TabsTrigger>
                <TabsTrigger value="stats">Live Stats</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team: any) => (
                    <div key={team.id} onClick={() => setSelectedTeam(team)} className="cursor-pointer">
                      <TeamCard team={team} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-6">
                {selectedTeam ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Select Team</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {teams.map((team: any) => (
                              <Button
                                key={team.id}
                                variant={selectedTeam?.id === team.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedTeam(team)}
                              >
                                <span className="mr-2">
                                  {team.sport === 'volleyball' ? '🏐' : 
                                   team.sport === 'basketball' ? '🏀' : '⚾'}
                                </span>
                                {team.name}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="lg:col-span-2">
                      <TeamChat teamId={selectedTeam.id} teamName={selectedTeam.name} />
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Select a team to start chatting</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Choose a team from your list to access team chat and communication.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="stats" className="mt-6">
                {selectedTeam ? (
                  <Scorekeeping 
                    eventId={1} // In real app, this would be selected from current/upcoming games
                    sport={selectedTeam.sport}
                    players={[
                      { id: '1', name: 'Player 1', jerseyNumber: 10, position: 'Guard' },
                      { id: '2', name: 'Player 2', jerseyNumber: 23, position: 'Forward' },
                      { id: '3', name: 'Player 3', jerseyNumber: 7, position: 'Center' },
                    ]}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Select a team for live scorekeeping</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Choose a team to track game statistics and performance metrics.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar sync coming soon</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Auto-sync with Google, Apple, and Outlook calendars.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first team.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
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
