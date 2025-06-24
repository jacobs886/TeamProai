import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Mail, 
  Phone, 
  Search, 
  Plus, 
  Edit, 
  MessageSquare,
  Calendar,
  AlertTriangle,
  FileText,
  UserCheck,
  Heart,
  Shield
} from "lucide-react";

interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  isEmergencyContact: boolean;
  playerId: string;
  address?: string;
  occupation?: string;
  workPhone?: string;
}

export default function GuardiansPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "directory" | "communication" | "emergency">("overview");
  
  const { toast } = useToast();

  // Fetch guardians data
  const { data: guardians = [], isLoading } = useQuery({
    queryKey: ["/api/guardians"],
  });

  // Fetch players data for linking
  const { data: players = [] } = useQuery({
    queryKey: ["/api/players"],
  });

  const filteredGuardians = guardians.filter((guardian: Guardian) =>
    guardian.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emergencyContacts = guardians.filter((guardian: Guardian) => guardian.isEmergencyContact);

  const handleContactGuardian = (guardian: Guardian, method: string) => {
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

  const getPlayerName = (playerId: string) => {
    const player = players.find((p: any) => p.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : "Unknown Player";
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guardian Portal</h1>
          <p className="text-gray-600">Manage parent and guardian communications and information</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Guardian
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="directory" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Directory</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Communication</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Emergency</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{guardians.length}</p>
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
                      {guardians.filter((g: Guardian) => g.email).length}
                    </p>
                    <p className="text-xs text-gray-600">Email Contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{emergencyContacts.length}</p>
                    <p className="text-xs text-gray-600">Emergency Contacts</p>
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
                      {guardians.filter((g: Guardian) => g.phone).length}
                    </p>
                    <p className="text-xs text-gray-600">Phone Numbers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Guardian Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Sarah Johnson sent a message</p>
                    <p className="text-sm text-gray-500">About practice schedule - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Michael Davis updated contact info</p>
                    <p className="text-sm text-gray-500">New phone number added - 1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guardians by name, email, or player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Guardian List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuardians.map((guardian: Guardian) => (
              <Card key={guardian.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{guardian.firstName} {guardian.lastName}</h3>
                        <p className="text-sm text-gray-500">{guardian.relationship}</p>
                        {guardian.isEmergencyContact && (
                          <Badge variant="destructive" className="mt-1">
                            Emergency Contact
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{getPlayerName(guardian.playerId)}</span>
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
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guardian Communication Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Team Newsletter
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Practice Reminder
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Share Schedule Update
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Communication Templates</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium">Practice Cancellation</p>
                      <p className="text-gray-500">Weather-related cancellation notice</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium">Equipment Reminder</p>
                      <p className="text-gray-500">Don't forget your gear checklist</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((guardian: Guardian) => (
                  <div key={guardian.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-red-900">
                        {guardian.firstName} {guardian.lastName}
                      </h3>
                      <Badge variant="destructive">Emergency</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><strong>Player:</strong> {getPlayerName(guardian.playerId)}</p>
                      <p><strong>Relationship:</strong> {guardian.relationship}</p>
                      <p><strong>Phone:</strong> {guardian.phone}</p>
                      <p><strong>Email:</strong> {guardian.email}</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleContactGuardian(guardian, "phone")}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Emergency Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleContactGuardian(guardian, "email")}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guardian Detail Modal */}
      {selectedGuardian && (
        <Dialog open={!!selectedGuardian} onOpenChange={() => setSelectedGuardian(null)}>
          <DialogContent className="max-w-2xl" aria-describedby="guardian-details-description">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{selectedGuardian.firstName} {selectedGuardian.lastName}</span>
              </DialogTitle>
              <div id="guardian-details-description" className="sr-only">
                View and edit detailed guardian information including contact details and player associations.
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Guardian Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Name: {selectedGuardian.firstName} {selectedGuardian.lastName}</div>
                    <div>Relationship: {selectedGuardian.relationship}</div>
                    <div>Emergency Contact: {selectedGuardian.isEmergencyContact ? "Yes" : "No"}</div>
                    {selectedGuardian.occupation && (
                      <div>Occupation: {selectedGuardian.occupation}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Email: {selectedGuardian.email || "Not provided"}</div>
                    <div>Phone: {selectedGuardian.phone || "Not provided"}</div>
                    {selectedGuardian.workPhone && (
                      <div>Work Phone: {selectedGuardian.workPhone}</div>
                    )}
                    {selectedGuardian.address && (
                      <div>Address: {selectedGuardian.address}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Player Information</h4>
                <div className="text-sm p-3 bg-gray-50 rounded">
                  <div>Player: {getPlayerName(selectedGuardian.playerId)}</div>
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