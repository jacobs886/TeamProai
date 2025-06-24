import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  Camera,
  RotateCcw,
  ShoppingCart,
  Brain,
  Zap,
  Star,
  Calendar,
  MapPin
} from "lucide-react";

interface EquipmentTrackerProps {
  childId: string;
  aiInsights: any;
}

export default function EquipmentTracker({ childId, aiInsights }: EquipmentTrackerProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [issuePhoto, setIssuePhoto] = useState<string>("");

  const { toast } = useToast();

  // Mock assigned equipment
  const assignedEquipment = [
    {
      id: "eq_001",
      name: "Team Practice Jersey #12",
      type: "uniform",
      assignedDate: "2024-06-15",
      dueDate: "2024-12-15",
      status: "assigned",
      condition: "good",
      location: "At Home",
      notes: "Regular practice jersey, wash in cold water",
      returnRequired: true,
      estimatedValue: 25.00,
      aiPrediction: {
        wearLevel: "normal",
        recommendedCare: "Wash after every 2-3 uses",
        replacementDate: "2025-01-15"
      }
    },
    {
      id: "eq_002",
      name: "Team Water Bottle",
      type: "accessories",
      assignedDate: "2024-06-20",
      dueDate: "2024-12-20",
      status: "assigned",
      condition: "excellent",
      location: "At Home",
      notes: "Keep for hydration during practices and games",
      returnRequired: false,
      estimatedValue: 12.00,
      aiPrediction: {
        wearLevel: "minimal",
        recommendedCare: "Daily cleaning recommended",
        replacementDate: "2025-06-20"
      }
    },
    {
      id: "eq_003",
      name: "Shin Guards - Youth Medium",
      type: "protective",
      assignedDate: "2024-07-01",
      dueDate: "2024-11-01",
      status: "needs_return",
      condition: "fair",
      location: "At Home",
      notes: "Size medium, return when outgrown",
      returnRequired: true,
      estimatedValue: 18.00,
      aiPrediction: {
        wearLevel: "high",
        recommendedCare: "Clean after each use",
        replacementDate: "2024-09-01"
      }
    }
  ];

  // Mock equipment issues
  const reportedIssues = [
    {
      id: "issue_001",
      equipmentId: "eq_001",
      equipmentName: "Team Practice Jersey #12",
      issueType: "damage",
      description: "Small tear in the fabric near the collar",
      reportedDate: "2024-07-20",
      status: "under_review",
      photos: ["tear_photo.jpg"],
      solution: "Replacement jersey will be provided"
    }
  ];

  // Mock store recommendations
  const storeRecommendations = [
    {
      id: "rec_001",
      name: "Replacement Shin Guards - Youth Large",
      reason: "Child has outgrown current size",
      price: 22.99,
      aiRecommended: true,
      inStock: true,
      personalizedFit: true
    },
    {
      id: "rec_002",
      name: "Team Championship Patch",
      reason: "Commemorate tournament participation",
      price: 8.99,
      aiRecommended: false,
      inStock: true,
      personalizedFit: false
    },
    {
      id: "rec_003",
      name: "Equipment Bag with Name",
      reason: "Organize and carry team gear",
      price: 34.99,
      aiRecommended: true,
      inStock: true,
      personalizedFit: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned": return "bg-green-100 text-green-800";
      case "needs_return": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "returned": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs_return": return <RotateCcw className="h-4 w-4 text-yellow-600" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "returned": return <Package className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "fair": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIssueStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleReportIssue = (equipmentId: string) => {
    toast({
      title: "Issue Reported",
      description: "Your equipment issue has been reported to the team manager.",
    });
  };

  const handleRequestReturn = (equipmentId: string) => {
    toast({
      title: "Return Requested",
      description: "Return request submitted. Instructions will be sent shortly.",
    });
  };

  const handleOrderItem = (itemId: string) => {
    toast({
      title: "Added to Cart",
      description: "Item has been added to your team store cart.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Equipment Intelligence */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-orange-600" />
            <span>AI Equipment Intelligence</span>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Predictive Maintenance:</strong> AI predicts when equipment needs replacement
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Recommendations:</strong> AI suggests equipment based on your child's size and sport
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Return Reminders:</strong> Never miss equipment return deadlines with smart alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription>
                <strong>Personalized Store:</strong> AI curates equipment recommendations for your child
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{assignedEquipment.length}</p>
                <p className="text-xs text-gray-600">Items Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <RotateCcw className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {assignedEquipment.filter(item => item.status === "needs_return").length}
                </p>
                <p className="text-xs text-gray-600">Need Return</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reportedIssues.length}</p>
                <p className="text-xs text-gray-600">Reported Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{storeRecommendations.filter(r => r.aiRecommended).length}</p>
                <p className="text-xs text-gray-600">AI Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Issues Alert */}
      {reportedIssues.length > 0 && (
        <Card className="border-2 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Equipment Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportedIssues.map((issue) => (
              <div key={issue.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-900">{issue.equipmentName}</span>
                  <Badge className={getIssueStatusColor(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-yellow-800 mb-2">{issue.description}</p>
                <div className="text-xs text-yellow-700">
                  Reported: {new Date(issue.reportedDate).toLocaleDateString()}
                  {issue.solution && (
                    <div className="mt-1">
                      <strong>Solution:</strong> {issue.solution}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Assigned Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Your Child's Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignedEquipment.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{item.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium capitalize">{item.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <Badge className={getConditionColor(item.condition)} variant="outline">
                        {item.condition}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Assigned:</span>
                      <span className="ml-2 font-medium">{new Date(item.assignedDate).toLocaleDateString()}</span>
                    </div>
                    {item.returnRequired && (
                      <div>
                        <span className="text-gray-600">Due Back:</span>
                        <span className="ml-2 font-medium">{new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{item.location}</span>
                  </div>

                  <p className="text-sm text-gray-600">{item.notes}</p>

                  {/* AI Predictions */}
                  {item.aiPrediction && (
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">AI Care Insights</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>Wear Level:</strong> {item.aiPrediction.wearLevel}
                        </div>
                        <div>
                          <strong>Care Tip:</strong> {item.aiPrediction.recommendedCare}
                        </div>
                        <div>
                          <strong>Replace By:</strong> {new Date(item.aiPrediction.replacementDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    
                    {item.status === "needs_return" && (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => handleRequestReturn(item.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Request Return
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200"
                      onClick={() => handleReportIssue(item.id)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Report Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>AI Equipment Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeRecommendations.map((item) => (
              <Card key={item.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.aiRecommended && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Pick
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{item.reason}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">${item.price}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {item.personalizedFit && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Custom Fit
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={!item.inStock}
                      onClick={() => handleOrderItem(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{selectedItem.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Equipment Details</h4>
                  <div className="text-sm space-y-1">
                    <div>Type: {selectedItem.type}</div>
                    <div>Condition: {selectedItem.condition}</div>
                    <div>Value: ${selectedItem.estimatedValue}</div>
                    <div>Location: {selectedItem.location}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Assignment Info</h4>
                  <div className="text-sm space-y-1">
                    <div>Assigned: {new Date(selectedItem.assignedDate).toLocaleDateString()}</div>
                    {selectedItem.returnRequired && (
                      <div>Due Back: {new Date(selectedItem.dueDate).toLocaleDateString()}</div>
                    )}
                    <div>Return Required: {selectedItem.returnRequired ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Care Instructions</h4>
                <p className="text-sm text-gray-600">{selectedItem.notes}</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => handleReportIssue(selectedItem.id)}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
                {selectedItem.returnRequired && (
                  <Button className="flex-1" onClick={() => handleRequestReturn(selectedItem.id)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Request Return
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}