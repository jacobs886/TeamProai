import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Edit,
  Trash2,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface GuardianManagementProps {
  players: any[];
}

export default function GuardianManagement({ players }: GuardianManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [showGuardianForm, setShowGuardianForm] = useState(false);

  const { toast } = useToast();

  // Extract all guardians from players
  const allGuardians = players.flatMap(player => 
    (player.guardians || []).map((guardian: any) => ({
      ...guardian,
      playerId: player.id,
      playerName: `${player.firstName} ${player.lastName}`,
      playerJersey: player.jerseyNumber
    }))
  );

  const filteredGuardians = allGuardians.filter(guardian =>
    guardian.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactGuardian = (guardian: any, method: string) => {
    if (method === "email" && guardian.email) {
      window.location.href = `mailto:${guardian.email}`;
    } else if (method === "phone" && guardian.phone) {
      window.location.href = `tel:${guardian.phone}`;
    }
    
    toast({
      title: "Contact Initiated",
      description: `Opening ${method} to contact ${guardian.firstName} ${guardian.lastName}`,
    });
  };

  const handleBulkEmail = () => {
    const emails = filteredGuardians
      .filter(g => g.email)
      .map(g => g.email)
      .join(',');
    
    if (emails) {
      window.location.href = `mailto:?bcc=${emails}`;
      toast({
        title: "Bulk Email",
        description: `Preparing email for ${filteredGuardians.filter(g => g.email).length} guardians.`,
      });
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship?.toLowerCase()) {
      case "parent": return "bg-blue-100 text-blue-800";
      case "guardian": return "bg-green-100 text-green-800";
      case "grandparent": return "bg-purple-100 text-purple-800";
      case "sibling": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guardians by name, email, or player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {filteredGuardians.length} guardians
              </Badge>
              <Button variant="outline" size="sm" onClick={handleBulkEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Bulk Email
              </Button>
              <Button size="sm" onClick={() => setShowGuardianForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Guardian
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{allGuardians.length}</p>
                <p className="text-xs text-gray-600">Total Guardians</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {allGuardians.filter(g => g.email).length}
                </p>
                <p className="text-xs text-gray-600">Email Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {allGuardians.filter(g => g.phone).length}
                </p>
                <p className="text-xs text-gray-600">Phone Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {allGuardians.filter(g => g.isEmergencyContact).length}
                </p>
                <p className="text-xs text-gray-600">Emergency Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guardian List */}
      <Card>
        <CardHeader>
          <CardTitle>Guardian Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGuardians.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Guardians Found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No guardians match your search criteria." : "No guardians have been added yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuardians.map((guardian, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{guardian.firstName} {guardian.lastName}</h4>
                          <Badge className={getRelationshipColor(guardian.relationship)}>
                            {guardian.relationship || "Guardian"}
                          </Badge>
                        </div>
                        {guardian.isEmergencyContact && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Emergency
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>#{guardian.playerJersey || "?"} {guardian.playerName}</span>
                        </div>
                        
                        {guardian.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate text-blue-600">{guardian.email}</span>
                          </div>
                        )}
                        
                        {guardian.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{guardian.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t">
                        {guardian.email && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactGuardian(guardian, "email")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        )}
                        {guardian.phone && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactGuardian(guardian, "phone")}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedGuardian(guardian)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players.slice(0, 5).map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">#{player.jerseyNumber || "?"}</span>
                  </div>
                  <div>
                    <span className="font-medium">{player.firstName} {player.lastName}</span>
                    <div className="text-xs text-gray-500">
                      {(player.guardians || []).length} guardian(s)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {(player.guardians || []).some((g: any) => g.email) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" title="Email contact available" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" title="No email contact" />
                  )}
                  
                  {(player.guardians || []).some((g: any) => g.phone) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" title="Phone contact available" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" title="No phone contact" />
                  )}
                  
                  {(player.guardians || []).some((g: any) => g.isEmergencyContact) ? (
                    <Shield className="h-4 w-4 text-blue-600" title="Emergency contact designated" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" title="No emergency contact" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guardian Detail Modal */}
      {selectedGuardian && (
        <Dialog open={!!selectedGuardian} onOpenChange={() => setSelectedGuardian(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{selectedGuardian.firstName} {selectedGuardian.lastName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Guardian Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Name: {selectedGuardian.firstName} {selectedGuardian.lastName}</div>
                    <div>Relationship: {selectedGuardian.relationship}</div>
                    <div>Emergency Contact: {selectedGuardian.isEmergencyContact ? "Yes" : "No"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Email: {selectedGuardian.email || "Not provided"}</div>
                    <div>Phone: {selectedGuardian.phone || "Not provided"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Player Information</h4>
                <div className="text-sm p-3 bg-gray-50 rounded">
                  <div>Player: #{selectedGuardian.playerJersey || "?"} {selectedGuardian.playerName}</div>
                </div>
              </div>

              <div className="flex space-x-3">
                {selectedGuardian.email && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleContactGuardian(selectedGuardian, "email")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
                {selectedGuardian.phone && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleContactGuardian(selectedGuardian, "phone")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Phone
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Guardian
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}