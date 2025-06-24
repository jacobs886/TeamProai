import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Brain,
  Search,
  Filter,
  Send
} from "lucide-react";

interface EquipmentAssignmentProps {
  equipment: any[];
  aiInsights: any;
}

export default function EquipmentAssignment({ equipment, aiInsights }: EquipmentAssignmentProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { toast } = useToast();

  // Mock assignment data
  const assignments = [
    {
      id: "1",
      equipmentId: "1",
      equipmentName: "Wilson Soccer Ball",
      playerId: "p1",
      playerName: "John Smith",
      assignedDate: "2024-06-15",
      dueDate: "2024-12-15",
      status: "active",
      condition: "good",
      notes: "Regular practice use",
      returnReminders: 2,
      autoReturn: true
    },
    {
      id: "2",
      equipmentId: "2",
      equipmentName: "Nike Basketball",
      playerId: "p2",
      playerName: "Emma Rodriguez",
      assignedDate: "2024-06-10",
      dueDate: "2024-11-10",
      status: "overdue",
      condition: "excellent",
      notes: "Tournament preparation",
      returnReminders: 5,
      autoReturn: false
    },
    {
      id: "3",
      equipmentId: "3",
      equipmentName: "Rawlings Baseball Helmet",
      playerId: "p3",
      playerName: "Mike Thompson",
      assignedDate: "2024-06-20",
      dueDate: "2024-09-20",
      status: "due_soon",
      condition: "fair",
      notes: "Personal protection gear",
      returnReminders: 1,
      autoReturn: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "due_soon": return "bg-yellow-100 text-yellow-800";
      case "returned": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "due_soon": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "returned": return <Package className="h-4 w-4 text-gray-600" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus === "all") return true;
    return assignment.status === filterStatus;
  });

  const handleSendReminder = (assignmentId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Return reminder has been sent to the player and guardian.",
    });
  };

  const handleAutoReturn = (assignmentId: string) => {
    toast({
      title: "Auto-Return Scheduled",
      description: "Equipment will be automatically marked for return in 24 hours.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Assignment Insights */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Assignment Intelligence</span>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Matching:</strong> AI suggests optimal equipment-player pairs based on size and skill
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Return Prediction:</strong> 95% accuracy in predicting equipment return likelihood
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Send className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto Reminders:</strong> Intelligent reminder scheduling reduces overdue items by 60%
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Assignment Score:</strong> Current team assignment efficiency: 87%
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due_soon">Due Soon</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline">
                {filteredAssignments.length} assignments
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
              <Button 
                onClick={() => setShowAssignModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{assignment.equipmentName}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(assignment.status)}
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Player Information */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{assignment.playerName}</p>
                  <p className="text-sm text-gray-600">Player ID: {assignment.playerId}</p>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Assigned:</span>
                  <span className="ml-2 font-medium">{new Date(assignment.assignedDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Due:</span>
                  <span className="ml-2 font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Condition:</span>
                  <span className="ml-2 font-medium">{assignment.condition}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reminders:</span>
                  <span className="ml-2 font-medium">{assignment.returnReminders} sent</span>
                </div>
              </div>

              {/* Notes */}
              {assignment.notes && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Notes:</strong> {assignment.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {assignment.status === "overdue" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-orange-600 border-orange-200"
                      onClick={() => handleSendReminder(assignment.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 border-red-200"
                      onClick={() => handleAutoReturn(assignment.id)}
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Force Return
                    </Button>
                  </>
                )}
                
                {assignment.status === "due_soon" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSendReminder(assignment.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Extend
                    </Button>
                  </>
                )}
                
                {assignment.status === "active" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Returned
                    </Button>
                  </>
                )}
              </div>

              {/* AI Recommendations */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">AI Recommendations</span>
                </div>
                <div className="text-xs space-y-1">
                  {assignment.status === "overdue" && (
                    <p className="text-purple-700">
                      • Send automated reminder via parent app
                      • Schedule pickup during next practice
                      • Consider equipment replacement if damaged
                    </p>
                  )}
                  {assignment.status === "due_soon" && (
                    <p className="text-purple-700">
                      • Proactive reminder recommended in 3 days
                      • Player has 98% return reliability score
                    </p>
                  )}
                  {assignment.status === "active" && (
                    <p className="text-purple-700">
                      • Assignment performing well
                      • Player match score: 92%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assignment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <p>{selectedAssignment.equipmentName}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Player</h4>
                  <p>{selectedAssignment.playerName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Assigned Date</h4>
                  <p>{new Date(selectedAssignment.assignedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Due Date</h4>
                  <p>{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-gray-600">{selectedAssignment.notes}</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  Edit Assignment
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Mark as Returned
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Assignment Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Equipment Assignment</DialogTitle>
          </DialogHeader>
          <NewAssignmentForm 
            onSubmit={(data) => {
              toast({
                title: "Assignment Created",
                description: "Equipment has been assigned successfully.",
              });
              setShowAssignModal(false);
            }}
            onCancel={() => setShowAssignModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// New Assignment Form Component
function NewAssignmentForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    equipmentId: "",
    playerId: "",
    dueDate: "",
    notes: "",
    autoReturn: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Equipment</label>
        <Select value={formData.equipmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Wilson Soccer Ball</SelectItem>
            <SelectItem value="2">Nike Basketball</SelectItem>
            <SelectItem value="3">Baseball Helmet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Player</label>
        <Select value={formData.playerId} onValueChange={(value) => setFormData(prev => ({ ...prev, playerId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select player" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p1">John Smith</SelectItem>
            <SelectItem value="p2">Emma Rodriguez</SelectItem>
            <SelectItem value="p3">Mike Thompson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Due Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Assignment notes or special instructions"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Assignment
        </Button>
      </div>
    </form>
  );
}