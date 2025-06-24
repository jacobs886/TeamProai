import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  FileText,
  DollarSign,
  TrendingUp,
  Brain,
  Zap,
  Plus
} from "lucide-react";

interface EquipmentMaintenanceProps {
  equipment: any[];
  aiInsights: any;
}

export default function EquipmentMaintenance({ equipment, aiInsights }: EquipmentMaintenanceProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const { toast } = useToast();

  // Mock maintenance data
  const maintenanceItems = [
    {
      id: "1",
      equipmentId: "1",
      equipmentName: "Wilson Soccer Ball",
      type: "inspection",
      priority: "medium",
      status: "scheduled",
      scheduledDate: "2024-07-15",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-07-15",
      estimatedCost: 15.00,
      description: "Regular pressure check and surface inspection",
      technician: "Equipment Manager",
      images: [],
      notes: "Standard 6-month inspection",
      aiPrediction: {
        lifespan: "18 months remaining",
        riskLevel: "low",
        costForecast: "$45 total maintenance"
      }
    },
    {
      id: "2",
      equipmentId: "2",
      equipmentName: "Nike Basketball",
      type: "repair",
      priority: "high",
      status: "overdue",
      scheduledDate: "2024-06-20",
      lastMaintenance: "2023-12-10",
      nextMaintenance: "2024-06-20",
      estimatedCost: 25.00,
      description: "Valve replacement needed",
      technician: "Mike Johnson",
      images: ["damaged_valve.jpg"],
      notes: "Player reported air leakage",
      aiPrediction: {
        lifespan: "12 months remaining",
        riskLevel: "medium",
        costForecast: "$25 immediate repair"
      }
    },
    {
      id: "3",
      equipmentId: "3",
      equipmentName: "Rawlings Baseball Helmet",
      type: "safety_check",
      priority: "high",
      status: "in_progress",
      scheduledDate: "2024-07-01",
      lastMaintenance: "2024-06-10",
      nextMaintenance: "2024-09-10",
      estimatedCost: 0.00,
      description: "NOCSAE compliance verification",
      technician: "Safety Inspector",
      images: [],
      notes: "Quarterly safety inspection required",
      aiPrediction: {
        lifespan: "24 months remaining",
        riskLevel: "low",
        costForecast: "$0 compliance check"
      }
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress": return <Wrench className="h-4 w-4 text-blue-600" />;
      case "scheduled": return <Calendar className="h-4 w-4 text-purple-600" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredItems = maintenanceItems.filter(item => {
    if (filterPriority === "all") return true;
    return item.priority === filterPriority;
  });

  const handleScheduleMaintenance = (itemId: string) => {
    toast({
      title: "Maintenance Scheduled",
      description: "Maintenance task has been scheduled successfully.",
    });
  };

  const handleCompleteMaintenance = (itemId: string) => {
    toast({
      title: "Maintenance Completed",
      description: "Maintenance record has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Maintenance Insights */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-orange-600" />
            <span>AI Maintenance Intelligence</span>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Predictive Maintenance:</strong> AI prevents 90% of equipment failures before they occur
              </AlertDescription>
            </Alert>
            
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Cost Optimization:</strong> Predicted savings of $1,200 annually through preventive care
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Scheduling:</strong> Automated maintenance scheduling reduces equipment downtime
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Compliance Rate:</strong> 98% equipment safety compliance through AI monitoring
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline">
                {filteredItems.length} maintenance items
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule All
              </Button>
              <Button 
                variant="outline"
                className="text-purple-600 border-purple-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Button onClick={() => setShowMaintenanceModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Maintenance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">$340</p>
                <p className="text-xs text-gray-600">Monthly Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  <span className="text-base">{item.equipmentName}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority} priority
                </Badge>
                <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Maintenance Details */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="ml-2 font-medium">{new Date(item.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-medium">${item.estimatedCost.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Technician:</span>
                    <span className="ml-2 font-medium">{item.technician}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Service:</span>
                    <span className="ml-2 font-medium">{new Date(item.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* AI Predictions */}
              {item.aiPrediction && (
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">AI Predictions</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Equipment lifespan:</span>
                      <span className="font-medium">{item.aiPrediction.lifespan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk level:</span>
                      <Badge variant="outline" className="text-xs">
                        {item.aiPrediction.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost forecast:</span>
                      <span className="font-medium">{item.aiPrediction.costForecast}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar for Overdue Items */}
              {item.status === "overdue" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Days overdue</span>
                    <span className="text-red-600 font-medium">
                      {Math.floor((new Date().getTime() - new Date(item.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <Progress value={100} className="h-2 bg-red-100" />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {item.status === "scheduled" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 border-blue-200"
                      onClick={() => handleScheduleMaintenance(item.id)}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Start Work
                    </Button>
                  </>
                )}
                
                {item.status === "overdue" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 border-red-200"
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Urgent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Reschedule
                    </Button>
                  </>
                )}
                
                {item.status === "in_progress" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Add Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-green-600 border-green-200"
                      onClick={() => handleCompleteMaintenance(item.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Maintenance Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Maintenance Details - {selectedItem.equipmentName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Type</h4>
                  <p>{selectedItem.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  <Badge className={getPriorityColor(selectedItem.priority)}>
                    {selectedItem.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-gray-600">{selectedItem.notes}</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  Edit Maintenance
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Start Maintenance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Maintenance Modal */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
          </DialogHeader>
          <NewMaintenanceForm 
            onSubmit={(data) => {
              toast({
                title: "Maintenance Scheduled",
                description: "New maintenance task has been scheduled.",
              });
              setShowMaintenanceModal(false);
            }}
            onCancel={() => setShowMaintenanceModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// New Maintenance Form Component
function NewMaintenanceForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    equipmentId: "",
    type: "",
    priority: "medium",
    scheduledDate: "",
    description: "",
    estimatedCost: "",
    technician: ""
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="safety_check">Safety Check</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Scheduled Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={formData.scheduledDate}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the maintenance work needed"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Schedule Maintenance
        </Button>
      </div>
    </form>
  );
}