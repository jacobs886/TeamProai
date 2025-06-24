import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Heart,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface PlayerRosterListProps {
  players: any[];
  isLoading: boolean;
  onEditPlayer: (player: any) => void;
  onBulkAction: (action: string, playerIds: string[]) => void;
}

export default function PlayerRosterList({ 
  players, 
  isLoading, 
  onEditPlayer, 
  onBulkAction 
}: PlayerRosterListProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { toast } = useToast();

  const handleSelectPlayer = (playerId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlayers(prev => [...prev, playerId]);
    } else {
      setSelectedPlayers(prev => prev.filter(id => id !== playerId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPlayers(players.map(p => p.id));
    } else {
      setSelectedPlayers([]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedPlayers.length === 0) {
      toast({
        title: "No Players Selected",
        description: "Please select players before applying bulk actions.",
        variant: "destructive",
      });
      return;
    }
    onBulkAction(action, selectedPlayers);
    setSelectedPlayers([]);
  };

  const getPositionColor = (position: string) => {
    switch (position?.toLowerCase()) {
      case "forward": return "bg-red-100 text-red-800";
      case "midfielder": return "bg-green-100 text-green-800";
      case "defender": return "bg-blue-100 text-blue-800";
      case "goalkeeper": return "bg-purple-100 text-purple-800";
      case "captain": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-4">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Players Found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first player to the roster.</p>
            <Button onClick={() => onEditPlayer(null)}>
              <Users className="h-4 w-4 mr-2" />
              Add First Player
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedPlayers.length > 0 && (
        <Card className="border-2 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedPlayers.length === players.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedPlayers.length} of {players.length} players selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("assign_team")}>
                  Assign to Team
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("email")}>
                  Send Email
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Showing {players.length} players
        </div>
      </div>

      {/* Player Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedPlayers.includes(player.id)}
                      onCheckedChange={(checked) => handleSelectPlayer(player.id, checked as boolean)}
                    />
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        #{player.jerseyNumber || "?"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPlayer(player)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditPlayer(player)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{player.firstName} {player.lastName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getPositionColor(player.position)}>
                      {player.position || "Unassigned"}
                    </Badge>
                    {player.position === "Captain" && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="h-3 w-3 mr-1" />
                        Captain
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Age: {calculateAge(player.dateOfBirth || "2010-01-01")}</span>
                  </div>
                  {player.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{player.email}</span>
                    </div>
                  )}
                  {player.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{player.phone}</span>
                    </div>
                  )}
                </div>

                {player.guardians && player.guardians.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium">Guardian: </span>
                    <span>{player.guardians[0].firstName} {player.guardians[0].lastName}</span>
                  </div>
                )}

                {player.medicalNotes && (
                  <div className="flex items-center space-x-2 text-xs text-red-600">
                    <Heart className="h-3 w-3" />
                    <span className="truncate">Medical notes on file</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Star className="h-3 w-3" />
                    <span>Skill: 7.5/10</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={selectedPlayers.length === players.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Age</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left">Guardian</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3">
                        <Checkbox
                          checked={selectedPlayers.includes(player.id)}
                          onCheckedChange={(checked) => handleSelectPlayer(player.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-3 font-bold">#{player.jerseyNumber || "?"}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{player.firstName} {player.lastName}</div>
                          {player.medicalNotes && (
                            <div className="flex items-center space-x-1 text-xs text-red-600">
                              <Heart className="h-3 w-3" />
                              <span>Medical notes</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getPositionColor(player.position)}>
                          {player.position || "Unassigned"}
                        </Badge>
                      </td>
                      <td className="p-3">{calculateAge(player.dateOfBirth || "2010-01-01")}</td>
                      <td className="p-3">
                        <div className="text-xs">
                          {player.email && <div>{player.email}</div>}
                          {player.phone && <div>{player.phone}</div>}
                        </div>
                      </td>
                      <td className="p-3">
                        {player.guardians && player.guardians.length > 0 && (
                          <div className="text-xs">
                            <div>{player.guardians[0].firstName} {player.guardians[0].lastName}</div>
                            <div className="text-gray-500">{player.guardians[0].phone}</div>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPlayer(player)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEditPlayer(player)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    #{selectedPlayer.jerseyNumber || "?"}
                  </span>
                </div>
                <span>{selectedPlayer.firstName} {selectedPlayer.lastName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Player Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Position: {selectedPlayer.position || "Unassigned"}</div>
                    <div>Age: {calculateAge(selectedPlayer.dateOfBirth || "2010-01-01")}</div>
                    <div>Jersey: #{selectedPlayer.jerseyNumber || "Unassigned"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Email: {selectedPlayer.email || "Not provided"}</div>
                    <div>Phone: {selectedPlayer.phone || "Not provided"}</div>
                  </div>
                </div>
              </div>

              {selectedPlayer.guardians && selectedPlayer.guardians.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Guardian Information</h4>
                  {selectedPlayer.guardians.map((guardian: any, index: number) => (
                    <div key={index} className="text-sm space-y-1 p-3 bg-gray-50 rounded">
                      <div>Name: {guardian.firstName} {guardian.lastName}</div>
                      <div>Relationship: {guardian.relationship}</div>
                      <div>Email: {guardian.email}</div>
                      <div>Phone: {guardian.phone}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPlayer.medicalNotes && (
                <div>
                  <h4 className="font-medium mb-2 text-red-800">Medical Information</h4>
                  <div className="text-sm p-3 bg-red-50 rounded border border-red-200">
                    {selectedPlayer.medicalNotes}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => onEditPlayer(selectedPlayer)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Player
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Guardian
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}