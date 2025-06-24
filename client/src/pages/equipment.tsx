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
import EquipmentInventory from "@/components/equipment/equipment-inventory";
import EquipmentAssignment from "@/components/equipment/equipment-assignment";
import EquipmentMaintenance from "@/components/equipment/equipment-maintenance";
import EquipmentStore from "@/components/equipment/equipment-store";
import EquipmentCompliance from "@/components/equipment/equipment-compliance";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Package,
  Plus,
  Search,
  Filter,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Brain,
  Wrench,
  Shield,
  Download,
  Upload,
  QrCode,
  Barcode,
  TrendingUp,
  Zap
} from "lucide-react";

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"inventory" | "assignments" | "maintenance" | "store" | "compliance">("inventory");
  const [showAddEquipment, setShowAddEquipment] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch equipment data
  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["/api/equipment"],
  });

  // Fetch equipment categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/equipment/categories"],
  });

  // Fetch AI insights
  const { data: aiInsights = {} } = useQuery({
    queryKey: ["/api/equipment/ai-insights"],
  });

  const sports = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis", "Volleyball"];

  const filteredEquipment = equipment.filter((item: any) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = selectedSport === "all" || item.sport === selectedSport.toLowerCase();
    
    return matchesSearch && matchesSport;
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
            <p className="text-gray-600">AI-powered inventory tracking and management across all sports</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Compliance Tracked
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">324</p>
                  <p className="text-xs text-gray-600">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">87</p>
                  <p className="text-xs text-gray-600">Items Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-600">Need Maintenance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-gray-600">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">$2,340</p>
                  <p className="text-xs text-gray-600">Total Value</p>
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
                  <h3 className="font-semibold text-blue-900">AI Equipment Insights</h3>
                  <p className="text-sm text-blue-700">Automated predictions save 30% on equipment costs</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">15</div>
                  <div className="text-gray-600">Items to Restock</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">8</div>
                  <div className="text-gray-600">Maintenance Due</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">$450</div>
                  <div className="text-gray-600">Cost Savings</div>
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
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport.toLowerCase()}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline"
                  className="text-purple-600 border-purple-200"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  AI Predict
                </Button>
                <Button onClick={() => setShowAddEquipment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Store</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <EquipmentInventory 
              equipment={filteredEquipment}
              categories={categories}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="assignments">
            <EquipmentAssignment 
              equipment={equipment}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="maintenance">
            <EquipmentMaintenance 
              equipment={equipment}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="store">
            <EquipmentStore 
              categories={categories}
              aiInsights={aiInsights}
            />
          </TabsContent>

          <TabsContent value="compliance">
            <EquipmentCompliance 
              equipment={equipment}
              aiInsights={aiInsights}
            />
          </TabsContent>
        </Tabs>

        {/* Add Equipment Modal */}
        <Dialog open={showAddEquipment} onOpenChange={setShowAddEquipment}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <AddEquipmentForm
              onSubmit={(data) => {
                // Handle form submission
                toast({
                  title: "Equipment Added",
                  description: "New equipment has been added to inventory.",
                });
                setShowAddEquipment(false);
              }}
              onCancel={() => setShowAddEquipment(false)}
              categories={categories}
              sports={sports}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Add Equipment Form Component
function AddEquipmentForm({ 
  onSubmit, 
  onCancel, 
  categories, 
  sports 
}: { 
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categories: any[];
  sports: string[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sport: "",
    brand: "",
    model: "",
    quantity: 1,
    condition: "new",
    location: "",
    purchaseDate: "",
    cost: "",
    supplier: "",
    serialNumber: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Equipment Name *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Wilson Football"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ball">Ball</SelectItem>
              <SelectItem value="helmet">Helmet</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="protective">Protective Gear</SelectItem>
              <SelectItem value="training">Training Equipment</SelectItem>
              <SelectItem value="goal">Goal/Net</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Sport</label>
          <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport.toLowerCase()}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Brand</label>
          <Input
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            placeholder="e.g., Nike, Adidas"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Model</label>
          <Input
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            placeholder="e.g., Air Max Pro"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Condition</label>
          <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Equipment Room A"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Purchase Date</label>
          <Input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Cost</label>
          <Input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes or description"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Equipment
        </Button>
      </div>
    </form>
  );
}