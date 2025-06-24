import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import VolunteerTaskManager from "@/components/volunteers/volunteer-task-manager";
import VolunteerRecruitment from "@/components/volunteers/volunteer-recruitment";
import VolunteerScheduling from "@/components/volunteers/volunteer-scheduling";
import VolunteerRecognition from "@/components/volunteers/volunteer-recognition";
import BackgroundCheckPortal from "@/components/volunteers/background-check-portal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Award,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  Zap,
  UserPlus,
  FileText,
  Star,
  TrendingUp
} from "lucide-react";

export default function Volunteers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"tasks" | "recruitment" | "scheduling" | "recognition" | "compliance">("tasks");
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch volunteers data
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ["/api/volunteers"],
  });

  // Fetch volunteer tasks
  const { data: volunteerTasks = [] } = useQuery({
    queryKey: ["/api/volunteers/tasks"],
  });

  // Fetch AI insights
  const { data: aiInsights = {} } = useQuery({
    queryKey: ["/api/volunteers/ai-insights"],
  });

  const filteredVolunteers = volunteers.filter((volunteer: any) => {
    const matchesSearch = 
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === "all" || volunteer.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
            <p className="text-gray-600">AI-powered volunteer coordination and engagement platform</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Background Verified
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Active Volunteers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-xs text-gray-600">Open Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                  <p className="text-xs text-gray-600">Task Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-xs text-gray-600">Background Cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-xs text-gray-600">Hours This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Banner */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">AI Volunteer Intelligence</h3>
                  <p className="text-sm text-blue-700">Automated matching increases volunteer satisfaction by 40%</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">23</div>
                  <div className="text-gray-600">Perfect Matches</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">15</div>
                  <div className="text-gray-600">Tasks Auto-Filled</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">95%</div>
                  <div className="text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Volunteers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Volunteers</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="background_check">Background Check</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filter
                </Button>
                <Button 
                  variant="outline"
                  className="text-purple-600 border-purple-200"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  AI Match
                </Button>
                <Button onClick={() => setShowAddVolunteer(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Volunteer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Task Management</span>
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Recruitment</span>
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Scheduling</span>
            </TabsTrigger>
            <TabsTrigger value="recognition" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Recognition</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <VolunteerTaskManager 
              volunteers={volunteers}
              tasks={volunteerTasks}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="recruitment">
            <VolunteerRecruitment 
              volunteers={volunteers}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="scheduling">
            <VolunteerScheduling 
              volunteers={volunteers}
              tasks={volunteerTasks}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="recognition">
            <VolunteerRecognition 
              volunteers={volunteers}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="compliance">
            <BackgroundCheckPortal 
              volunteers={volunteers}
              aiInsights={aiInsights}
            />
          </TabsContent>
        </Tabs>

        {/* Add Volunteer Modal */}
        <Dialog open={showAddVolunteer} onOpenChange={setShowAddVolunteer}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Volunteer</DialogTitle>
            </DialogHeader>
            <AddVolunteerForm
              onSubmit={(data) => {
                toast({
                  title: "Volunteer Added",
                  description: "New volunteer has been added successfully.",
                });
                setShowAddVolunteer(false);
              }}
              onCancel={() => setShowAddVolunteer(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Add Volunteer Form Component
function AddVolunteerForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [] as string[],
    availability: [] as string[],
    preferredRoles: [] as string[],
    experience: "",
    emergencyContact: "",
    notes: ""
  });

  const skillOptions = [
    "Event Management", "Scorekeeping", "First Aid", "Coaching", 
    "Photography", "Equipment Setup", "Food Service", "Transportation",
    "Fundraising", "Communication", "Technology", "Field Maintenance"
  ];

  const availabilityOptions = [
    "Weekday Mornings", "Weekday Afternoons", "Weekday Evenings",
    "Weekend Mornings", "Weekend Afternoons", "Weekend Evenings"
  ];

  const roleOptions = [
    "Team Manager", "Assistant Coach", "Referee", "Scorekeeper",
    "Equipment Manager", "Event Coordinator", "Snack Coordinator",
    "Transportation", "Team Photographer", "Fundraising"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleAvailability = (time: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(time)
        ? prev.availability.filter(a => a !== time)
        : [...prev.availability, time]
    }));
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Emergency Contact</label>
          <Input
            value={formData.emergencyContact}
            onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
            placeholder="Contact name and phone"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Skills & Expertise</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {skillOptions.map((skill) => (
            <label key={skill} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
                className="rounded"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Availability</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availabilityOptions.map((time) => (
            <label key={time} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.availability.includes(time)}
                onChange={() => toggleAvailability(time)}
                className="rounded"
              />
              <span>{time}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Preferred Roles</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {roleOptions.map((role) => (
            <label key={role} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.preferredRoles.includes(role)}
                onChange={() => toggleRole(role)}
                className="rounded"
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Experience</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          placeholder="Describe any relevant experience or certifications"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes or special considerations"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Volunteer
        </Button>
      </div>
    </form>
  );
}