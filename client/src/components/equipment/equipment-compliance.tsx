import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  Eye,
  Download,
  Upload,
  Brain,
  Award,
  Users,
  Zap
} from "lucide-react";

interface EquipmentComplianceProps {
  equipment: any[];
  aiInsights: any;
}

export default function EquipmentCompliance({ equipment, aiInsights }: EquipmentComplianceProps) {
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { toast } = useToast();

  // Mock compliance data
  const complianceItems = [
    {
      id: "1",
      equipmentId: "3",
      equipmentName: "Rawlings Baseball Helmet",
      standard: "NOCSAE",
      standardName: "National Operating Committee on Standards for Athletic Equipment",
      status: "compliant",
      certificationDate: "2024-03-20",
      expirationDate: "2026-03-20",
      certificationNumber: "NOCSAE-2024-001",
      testingLab: "Independent Testing Labs",
      documents: ["cert_nocsae_001.pdf", "test_report_001.pdf"],
      requirements: [
        "Impact resistance testing",
        "Retention system evaluation", 
        "Warning label compliance",
        "Manufacturing quality control"
      ],
      riskLevel: "low",
      nextInspection: "2024-09-20",
      aiRecommendations: [
        "Schedule quarterly inspections",
        "Monitor for visible damage",
        "Replace after 3 years or 500+ impacts"
      ]
    },
    {
      id: "2",
      equipmentId: "4",
      equipmentName: "Youth Football Helmet",
      standard: "NOCSAE",
      standardName: "National Operating Committee on Standards for Athletic Equipment",
      status: "needs_inspection",
      certificationDate: "2023-08-15",
      expirationDate: "2025-08-15",
      certificationNumber: "NOCSAE-2023-087",
      testingLab: "SafeSport Testing",
      documents: ["cert_nocsae_087.pdf"],
      requirements: [
        "Annual recertification",
        "Impact sensor calibration",
        "Padding integrity check",
        "Shell crack inspection"
      ],
      riskLevel: "medium",
      nextInspection: "2024-08-15",
      aiRecommendations: [
        "Schedule immediate inspection",
        "Check for reconditioning needs",
        "Update certification if required"
      ]
    },
    {
      id: "3",
      equipmentId: "5",
      equipmentName: "Soccer Shin Guards",
      standard: "FIFA",
      standardName: "Fédération Internationale de Football Association",
      status: "non_compliant",
      certificationDate: "2022-05-10",
      expirationDate: "2024-05-10",
      certificationNumber: "FIFA-2022-156",
      testingLab: "FIFA Quality Labs",
      documents: ["cert_fifa_156.pdf"],
      requirements: [
        "Material composition standards",
        "Size and coverage requirements",
        "Impact protection testing",
        "Comfort and breathability"
      ],
      riskLevel: "high",
      nextInspection: "Immediate",
      aiRecommendations: [
        "Replace immediately - expired certification",
        "Order FIFA-approved replacements",
        "Document non-compliance for insurance"
      ]
    },
    {
      id: "4",
      equipmentId: "6", 
      equipmentName: "Hockey Protective Equipment",
      standard: "CSA",
      standardName: "Canadian Standards Association",
      status: "pending_review",
      certificationDate: "2024-01-30",
      expirationDate: "2027-01-30",
      certificationNumber: "CSA-2024-009",
      testingLab: "Canadian Testing Institute",
      documents: ["cert_csa_009.pdf", "review_pending.pdf"],
      requirements: [
        "Multi-impact protection",
        "Temperature resistance",
        "Strap and fastener testing",
        "Ventilation standards"
      ],
      riskLevel: "low",
      nextInspection: "2024-07-30",
      aiRecommendations: [
        "Awaiting review completion",
        "Continue normal use during review",
        "Monitor for updates from CSA"
      ]
    }
  ];

  const complianceStandards = [
    { value: "NOCSAE", label: "NOCSAE (Helmets & Protective)" },
    { value: "FIFA", label: "FIFA (Soccer Equipment)" },
    { value: "NBA", label: "NBA (Basketball Equipment)" },
    { value: "CSA", label: "CSA (Hockey Equipment)" },
    { value: "CPSC", label: "CPSC (Consumer Safety)" },
    { value: "ASTM", label: "ASTM (Sports Equipment)" }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant": return "bg-green-100 text-green-800";
      case "needs_inspection": return "bg-yellow-100 text-yellow-800";
      case "non_compliant": return "bg-red-100 text-red-800";
      case "pending_review": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs_inspection": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "non_compliant": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending_review": return <Clock className="h-4 w-4 text-blue-600" />;
      case "expired": return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesStandard = selectedStandard === "all" || item.standard === selectedStandard;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesStandard && matchesStatus;
  });

  const getComplianceScore = () => {
    const compliant = complianceItems.filter(item => item.status === "compliant").length;
    return Math.round((compliant / complianceItems.length) * 100);
  };

  const handleCertificationUpload = (itemId: string) => {
    toast({
      title: "Certification Uploaded",
      description: "New certification document has been uploaded and verified.",
    });
  };

  const handleScheduleInspection = (itemId: string) => {
    toast({
      title: "Inspection Scheduled", 
      description: "Compliance inspection has been scheduled successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Compliance Insights */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-600" />
            <span>AI Compliance Intelligence</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto-Monitoring:</strong> AI tracks certification expiration dates and sends proactive alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                <strong>Standards Database:</strong> Automated verification against 50+ safety standards
              </AlertDescription>
            </Alert>
            
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Document Management:</strong> Secure storage and instant access to all certifications
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Liability Protection:</strong> Complete audit trail for insurance and legal compliance
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{getComplianceScore()}%</p>
                <p className="text-xs text-gray-600">Compliance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complianceItems.filter(item => item.status === "non_compliant").length}
                </p>
                <p className="text-xs text-gray-600">Non-Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complianceItems.filter(item => item.status === "needs_inspection").length}
                </p>
                <p className="text-xs text-gray-600">Need Inspection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complianceItems.filter(item => {
                    const expiry = new Date(item.expirationDate);
                    const now = new Date();
                    const monthsToExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
                    return monthsToExpiry <= 6;
                  }).length}
                </p>
                <p className="text-xs text-gray-600">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Standards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Standards</SelectItem>
                  {complianceStandards.map((standard) => (
                    <SelectItem key={standard.value} value={standard.value}>
                      {standard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="needs_inspection">Needs Inspection</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline">
                {filteredItems.length} items
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Cert
              </Button>
              <Button 
                variant="outline"
                className="text-purple-600 border-purple-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                AI Audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
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
                <Badge variant="outline">{item.standard}</Badge>
                <Badge className={`${getRiskColor(item.riskLevel)} bg-gray-100`}>
                  {item.riskLevel} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Certification Details */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Standard:</span>
                    <span className="ml-2 font-medium">{item.standardName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cert Number:</span>
                    <span className="ml-2 font-medium">{item.certificationNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Certified:</span>
                    <span className="ml-2 font-medium">{new Date(item.certificationDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expires:</span>
                    <span className="ml-2 font-medium">{new Date(item.expirationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Expiration Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time to Expiration</span>
                  <span>
                    {Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, Math.min(100, 
                    ((new Date(item.expirationDate).getTime() - new Date().getTime()) / 
                     (new Date(item.expirationDate).getTime() - new Date(item.certificationDate).getTime())) * 100
                  ))} 
                  className="h-2" 
                />
              </div>

              {/* Testing Lab */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Testing Laboratory</span>
                </div>
                <p className="text-sm text-gray-700">{item.testingLab}</p>
              </div>

              {/* AI Recommendations */}
              {item.aiRecommendations && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">AI Recommendations</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {item.aiRecommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {item.status === "needs_inspection" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 border-blue-200"
                      onClick={() => handleScheduleInspection(item.id)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </>
                )}
                
                {item.status === "non_compliant" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 border-red-200"
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Replace
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleCertificationUpload(item.id)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Update Cert
                    </Button>
                  </>
                )}
                
                {item.status === "compliant" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Documents
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </Button>
                  </>
                )}
                
                {item.status === "pending_review" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Status
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 border-blue-200"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Compliance Details - {selectedItem.equipmentName}</span>
                {getStatusIcon(selectedItem.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Certification Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certification Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Standard:</span>
                      <span className="ml-2 font-medium">{selectedItem.standard}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedItem.status)} variant="outline">
                        {selectedItem.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Cert Number:</span>
                      <span className="ml-2 font-medium">{selectedItem.certificationNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(selectedItem.riskLevel)}`}>
                        {selectedItem.riskLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Issued:</span>
                      <span className="ml-2 font-medium">{new Date(selectedItem.certificationDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium">{new Date(selectedItem.expirationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span className="text-gray-600">Testing Lab:</span>
                    <span className="ml-2 font-medium">{selectedItem.testingLab}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedItem.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Documents & Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedItem.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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