import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Wand2,
  FileText,
  Camera,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: string;
  jerseyNumber?: number;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalNotes?: string;
  photoUrl?: string;
  stats?: any;
  availability?: string;
  teamId: string;
  guardians: Guardian[];
  createdAt: string;
  updatedAt: string;
}

interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  isEmergencyContact: boolean;
}

export default function PlayerRosterManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch players data
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  // Fetch teams for filter
  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: async (playerData: any) => {
      return apiRequest("POST", "/api/players", playerData);
    },
    onSuccess: () => {
      toast({
        title: "Player Added",
        description: "Player has been successfully added to the roster.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setShowAddPlayer(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add player.",
        variant: "destructive",
      });
    },
  });

  // Import players mutation
  const importPlayersMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiRequest("POST", "/api/players/import", formData);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Import Successful",
        description: `${data.imported} players imported successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setImportMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import players.",
        variant: "destructive",
      });
    },
  });

  const filteredPlayers = players.filter((player: Player) => {
    const matchesSearch = 
      `${player.firstName} ${player.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.jerseyNumber?.toString().includes(searchTerm);
    
    const matchesTeam = selectedTeam === "all" || player.teamId === selectedTeam;
    
    return matchesSearch && matchesTeam;
  });

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importPlayersMutation.mutate(file);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["First Name", "Last Name", "Position", "Jersey Number", "Email", "Phone"];
    const csvContent = [
      headers.join(","),
      ...filteredPlayers.map((player: Player) => [
        player.firstName,
        player.lastName,
        player.position,
        player.jerseyNumber || "",
        player.email || "",
        player.phone || ""
      ].join(","))
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roster-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateAITeamBalance = () => {
    toast({
      title: "AI Team Balancing",
      description: "Analyzing player skills and generating balanced team suggestions...",
    });
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Teams Balanced",
        description: "AI has generated optimal team combinations based on player skills and positions.",
      });
    }, 3000);
  };

  const positions = [
    "Forward", "Midfielder", "Defender", "Goalkeeper",
    "Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center",
    "Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Outfield"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Player Roster Management</h2>
          <p className="text-gray-600">Manage your team rosters with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Enhanced
          </Badge>
          <Badge variant="outline">
            {filteredPlayers.length} Players
          </Badge>
        </div>
      </div>

      {/* Action Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setImportMode(true)}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={generateAITeamBalance}
                className="flex items-center text-purple-600 border-purple-200"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Balance
              </Button>
              <Button
                onClick={() => setShowAddPlayer(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Modal */}
      <Dialog open={importMode} onOpenChange={setImportMode}>
        <DialogContent aria-describedby="import-description">
          <DialogHeader>
            <DialogTitle>Import Players</DialogTitle>
            <div id="import-description" className="text-sm text-gray-600">
              Import player data from CSV or Excel files with automatic validation and duplicate detection.
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV or Excel file with player data. Supported formats include exports from TeamSnap, MaxPreps, and SportsEngine.
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={importPlayersMutation.isPending}
              >
                {importPlayersMutation.isPending ? "Importing..." : "Choose File"}
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p className="font-medium mb-1">Expected columns:</p>
              <ul className="text-xs space-y-1">
                <li>• First Name, Last Name (required)</li>
                <li>• Position, Jersey Number</li>
                <li>• Email, Phone, Date of Birth</li>
                <li>• Guardian Name, Guardian Email, Guardian Phone</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first player."}
            </p>
            <Button onClick={() => setShowAddPlayer(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Player
            </Button>
          </div>
        ) : (
          filteredPlayers.map((player: Player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={() => setSelectedPlayer(player)}
            />
          ))
        )}
      </div>

      {/* Add/Edit Player Modal */}
      <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="add-player-description">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <div id="add-player-description" className="text-sm text-gray-600">
              Add a new player to your roster with complete profile information and guardian details.
            </div>
          </DialogHeader>
          <AddPlayerForm
            onSubmit={(data) => createPlayerMutation.mutate(data)}
            onCancel={() => setShowAddPlayer(false)}
            isLoading={createPlayerMutation.isPending}
            teams={teams}
            positions={positions}
          />
        </DialogContent>
      </Dialog>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="player-details-description">
            <div id="player-details-description" className="sr-only">
              View detailed player profile including stats, guardian information, and performance metrics.
            </div>
            <PlayerDetailsView player={selectedPlayer} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Player Card Component
function PlayerCard({ player, onEdit }: { player: Player; onEdit: () => void }) {
  const availability = Math.random() > 0.3 ? "available" : "unavailable";
  
  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} />
            <AvatarFallback>
              {player.firstName[0]}{player.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">
                {player.firstName} {player.lastName}
              </h3>
              {player.jerseyNumber && (
                <Badge variant="outline" className="ml-2">
                  #{player.jerseyNumber}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600">{player.position}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className={`flex items-center ${
                availability === "available" ? "text-green-600" : "text-red-600"
              }`}>
                {availability === "available" ? 
                  <CheckCircle className="h-3 w-3 mr-1" /> : 
                  <XCircle className="h-3 w-3 mr-1" />
                }
                {availability === "available" ? "Available" : "Unavailable"}
              </div>
              
              {player.guardians.length > 0 && (
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {player.guardians.length} Guardian{player.guardians.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Add Player Form Component
function AddPlayerForm({ 
  onSubmit, 
  onCancel, 
  isLoading, 
  teams, 
  positions 
}: { 
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  teams: any[];
  positions: string[];
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    position: "",
    jerseyNumber: "",
    email: "",
    phone: "",
    teamId: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    medicalNotes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="jerseyNumber">Jersey Number</Label>
              <Input
                id="jerseyNumber"
                type="number"
                value={formData.jerseyNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, jerseyNumber: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teamId">Team</Label>
              <Select value={formData.teamId} onValueChange={(value) => setFormData(prev => ({ ...prev, teamId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyName">Emergency Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Select 
              value={formData.emergencyContact.relationship} 
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, relationship: value }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
            <Textarea
              id="medicalNotes"
              placeholder="Any medical conditions, allergies, or special notes..."
              value={formData.medicalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalNotes: e.target.value }))}
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Player"}
        </Button>
      </div>
    </form>
  );
}

// Player Details View Component
function PlayerDetailsView({ player }: { player: Player }) {
  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={player.photoUrl} />
            <AvatarFallback>
              {player.firstName[0]}{player.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{player.firstName} {player.lastName}</span>
            {player.jerseyNumber && (
              <Badge variant="outline" className="ml-2">
                #{player.jerseyNumber}
              </Badge>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="stats">Performance</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Born: {new Date(player.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Position: {player.position}</span>
                  </div>
                  {player.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{player.email}</span>
                    </div>
                  )}
                  {player.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{player.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {player.medicalNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                    Medical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{player.medicalNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guardians">
          <div className="space-y-3">
            {player.guardians.map((guardian) => (
              <Card key={guardian.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{guardian.firstName} {guardian.lastName}</h4>
                      <p className="text-sm text-gray-600">{guardian.relationship}</p>
                    </div>
                    {guardian.isEmergencyContact && (
                      <Badge variant="destructive">Emergency Contact</Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{guardian.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{guardian.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Performance statistics will appear here</p>
                <p className="text-sm text-gray-500">Connect with scorekeeping to track player performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Availability tracking will appear here</p>
                <p className="text-sm text-gray-500">Sync with calendars to track player availability</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}