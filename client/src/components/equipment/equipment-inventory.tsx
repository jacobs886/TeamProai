import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Barcode,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap
} from "lucide-react";

interface EquipmentInventoryProps {
  equipment: any[];
  categories: any[];
  aiInsights: any;
}

export default function EquipmentInventory({ equipment, categories, aiInsights }: EquipmentInventoryProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  // Mock equipment data for demonstration
  const mockEquipment = [
    {
      id: "1",
      name: "Wilson Soccer Ball",
      type: "ball",
      sport: "soccer",
      brand: "Wilson",
      model: "Pro Series",
      quantity: 15,
      available: 12,
      assigned: 3,
      condition: "excellent",
      location: "Equipment Room A",
      purchaseDate: "2024-01-15",
      cost: 29.99,
      totalValue: 449.85,
      lastMaintenance: "2024-06-01",
      nextMaintenance: "2024-12-01",
      complianceStatus: "compliant",
      serialNumber: "WS2024001",
      aiPredictions: {
        restockDate: "2024-08-15",
        wearRate: "normal",
        recommendedQuantity: 20
      }
    },
    {
      id: "2",
      name: "Nike Basketball",
      type: "ball",
      sport: "basketball",
      brand: "Nike",
      model: "Elite Championship",
      quantity: 8,
      available: 5,
      assigned: 3,
      condition: "good",
      location: "Gym Storage",
      purchaseDate: "2023-09-10",
      cost: 45.00,
      totalValue: 360.00,
      lastMaintenance: "2024-05-15",
      nextMaintenance: "2024-11-15",
      complianceStatus: "compliant",
      serialNumber: "NK2023002",
      aiPredictions: {
        restockDate: "2024-07-20",
        wearRate: "high",
        recommendedQuantity: 12
      }
    },
    {
      id: "3",
      name: "Rawlings Baseball Helmet",
      type: "helmet",
      sport: "baseball",
      brand: "Rawlings",
      model: "Mach Senior",
      quantity: 6,
      available: 4,
      assigned: 2,
      condition: "excellent",
      location: "Equipment Room B",
      purchaseDate: "2024-03-20",
      cost: 89.99,
      totalValue: 539.94,
      lastMaintenance: "2024-06-10",
      nextMaintenance: "2024-09-10",
      complianceStatus: "needs_check",
      serialNumber: "RW2024003",
      aiPredictions: {
        restockDate: "2025-01-15",
        wearRate: "low",
        recommendedQuantity: 8
      }
    }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "fair": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-orange-100 text-orange-800";
      case "damaged": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant": return "text-green-600";
      case "needs_check": return "text-orange-600";
      case "non_compliant": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs_check": return <Clock className="h-4 w-4 text-orange-600" />;
      case "non_compliant": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Inventory Insights */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Inventory Intelligence</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Restock Alert:</strong> 5 items predicted to run low in next 30 days
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Cost Optimization:</strong> $450 savings identified through better purchasing
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>Usage Patterns:</strong> Soccer equipment 40% higher demand this season
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Maintenance Due:</strong> 8 items need inspection within 2 weeks
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{item.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {getComplianceIcon(item.complianceStatus)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{item.sport}</Badge>
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stock Information */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Level</span>
                  <span>{item.available}/{item.quantity}</span>
                </div>
                <Progress value={(item.available / item.quantity) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.assigned} assigned</span>
                  <span>{item.available} available</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{item.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">${item.totalValue.toFixed(2)} total value</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Barcode className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{item.serialNumber}</span>
                </div>
              </div>

              {/* AI Predictions */}
              {item.aiPredictions && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">AI Insights</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Restock by:</span>
                      <span className="font-medium">{new Date(item.aiPredictions.restockDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wear rate:</span>
                      <Badge variant="outline" className="text-xs">
                        {item.aiPredictions.wearRate}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended qty:</span>
                      <span className="font-medium">{item.aiPredictions.recommendedQuantity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedItem(item)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{selectedItem.name}</span>
                {getComplianceIcon(selectedItem.complianceStatus)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Equipment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Brand:</span>
                      <span className="ml-2 font-medium">{selectedItem.brand}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <span className="ml-2 font-medium">{selectedItem.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{selectedItem.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sport:</span>
                      <span className="ml-2 font-medium">{selectedItem.sport}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{selectedItem.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Serial:</span>
                      <span className="ml-2 font-medium">{selectedItem.serialNumber}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Condition</span>
                      <Badge className={getConditionColor(selectedItem.condition)}>
                        {selectedItem.condition}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance</span>
                      <div className="flex items-center space-x-1">
                        {getComplianceIcon(selectedItem.complianceStatus)}
                        <span className={`text-sm ${getComplianceColor(selectedItem.complianceStatus)}`}>
                          {selectedItem.complianceStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock and Financial */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inventory & Financials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Quantity</span>
                      <span className="font-medium">{selectedItem.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available</span>
                      <span className="font-medium text-green-600">{selectedItem.available}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Assigned</span>
                      <span className="font-medium text-blue-600">{selectedItem.assigned}</span>
                    </div>
                    <Progress value={(selectedItem.available / selectedItem.quantity) * 100} className="h-2" />
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Unit Cost</span>
                      <span className="font-medium">${selectedItem.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value</span>
                      <span className="font-medium">${selectedItem.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Purchase Date</span>
                      <span className="font-medium">{new Date(selectedItem.purchaseDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>AI Analytics & Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Usage Prediction</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Wear rate: <strong>{selectedItem.aiPredictions?.wearRate}</strong>
                      </p>
                      <p className="text-sm text-blue-700">
                        Restock needed by: <strong>{new Date(selectedItem.aiPredictions?.restockDate).toLocaleDateString()}</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">Optimization</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Recommended quantity: <strong>{selectedItem.aiPredictions?.recommendedQuantity}</strong>
                      </p>
                      <p className="text-sm text-green-700">
                        Potential savings: <strong>$45</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-900">Maintenance</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Last service: <strong>{new Date(selectedItem.lastMaintenance).toLocaleDateString()}</strong>
                      </p>
                      <p className="text-sm text-orange-700">
                        Next due: <strong>{new Date(selectedItem.nextMaintenance).toLocaleDateString()}</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}