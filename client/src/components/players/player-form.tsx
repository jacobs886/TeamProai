import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Users,
  Heart,
  FileText,
  Save,
  X
} from "lucide-react";

interface PlayerFormProps {
  player?: any;
  teams: any[];
  onSubmit: (playerData: any) => void;
  onCancel: () => void;
}

export default function PlayerForm({ player, teams, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    firstName: player?.firstName || "",
    lastName: player?.lastName || "",
    dateOfBirth: player?.dateOfBirth || "",
    position: player?.position || "",
    jerseyNumber: player?.jerseyNumber || "",
    email: player?.email || "",
    phone: player?.phone || "",
    teamId: player?.teamId || "",
    medicalNotes: player?.medicalNotes || "",
    guardians: player?.guardians || [
      {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        relationship: "parent",
        isEmergencyContact: true
      }
    ]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Validation Error",
        description: "Player first and last name are required.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  const handleGuardianChange = (index: number, field: string, value: string) => {
    const updatedGuardians = [...formData.guardians];
    updatedGuardians[index] = { ...updatedGuardians[index], [field]: value };
    setFormData({ ...formData, guardians: updatedGuardians });
  };

  const addGuardian = () => {
    setFormData({
      ...formData,
      guardians: [
        ...formData.guardians,
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          relationship: "parent",
          isEmergencyContact: false
        }
      ]
    });
  };

  const removeGuardian = (index: number) => {
    const updatedGuardians = formData.guardians.filter((_, i) => i !== index);
    setFormData({ ...formData, guardians: updatedGuardians });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="guardians" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Guardians</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Medical</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="jerseyNumber">Jersey Number</Label>
                  <Input
                    id="jerseyNumber"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Position</option>
                    <option value="Forward">Forward</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Captain">Captain</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="teamId">Team</Label>
                  <select
                    id="teamId"
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Guardian Information</CardTitle>
                <Button type="button" variant="outline" onClick={addGuardian}>
                  <Users className="h-4 w-4 mr-2" />
                  Add Guardian
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.guardians.map((guardian, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Guardian {index + 1}</h4>
                    {formData.guardians.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuardian(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guardian_firstName_${index}`}>First Name</Label>
                      <Input
                        id={`guardian_firstName_${index}`}
                        value={guardian.firstName}
                        onChange={(e) => handleGuardianChange(index, "firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guardian_lastName_${index}`}>Last Name</Label>
                      <Input
                        id={`guardian_lastName_${index}`}
                        value={guardian.lastName}
                        onChange={(e) => handleGuardianChange(index, "lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guardian_email_${index}`}>Email</Label>
                      <Input
                        id={`guardian_email_${index}`}
                        type="email"
                        value={guardian.email}
                        onChange={(e) => handleGuardianChange(index, "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guardian_phone_${index}`}>Phone</Label>
                      <Input
                        id={`guardian_phone_${index}`}
                        type="tel"
                        value={guardian.phone}
                        onChange={(e) => handleGuardianChange(index, "phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`guardian_relationship_${index}`}>Relationship</Label>
                    <select
                      id={`guardian_relationship_${index}`}
                      value={guardian.relationship}
                      onChange={(e) => handleGuardianChange(index, "relationship", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Medical Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <textarea
                  id="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  rows={4}
                  placeholder="Include any allergies, medical conditions, medications, or special considerations..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information will be kept confidential and only shared with coaches and medical staff.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {player ? "Update Player" : "Add Player"}
        </Button>
      </div>
    </form>
  );
}