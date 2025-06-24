import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import TeamCard from "@/components/teams/team-card";

export default function TeamManagement() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>My Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Teams</CardTitle>
            <Button className="inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.slice(0, 3).map((team: any) => (
                <TeamCard key={team.id} team={team} isDashboard={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first team.
              </p>
              <div className="mt-6">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
