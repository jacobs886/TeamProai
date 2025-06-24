import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  FileText,
  Upload,
  Download,
  Eye,
  RefreshCw,
  Brain,
  Zap,
  Users,
  Calendar
} from "lucide-react";

interface BackgroundCheckPortalProps {
  volunteers: any[];
  aiInsights: any;
}

export default function BackgroundCheckPortal({ volunteers, aiInsights }: BackgroundCheckPortalProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { toast } = useToast();

  // Mock background check data
  const backgroundChecks = [
    {
      id: "bc1",
      volunteerId: "v1",
      volunteerName: "Sarah Johnson",
      email: "sarah@example.com",
      status: "cleared",
      checkType: "Enhanced Background Check",
      provider: "SafeSport Certified",
      submittedDate: "2024-06-15",
      completedDate: "2024-06-18",
      expirationDate: "2025-06-18",
      documents: [
        { name: "Background Check Report", type: "pdf", size: "2.3 MB", url: "#" },
        { name: "SafeSport Certificate", type: "pdf", size: "1.1 MB", url: "#" }
      ],
      compliance: {
        SafeSport: { status: "compliant", expiry: "2025-06-18" },
        FBI: { status: "compliant", expiry: "2025-06-15" },
        LocalCheck: { status: "compliant", expiry: "2025-06-15" }
      },
      notes: "All checks cleared. No issues found.",
      riskLevel: "low",
      aiFlags: []
    },
    {
      id: "bc2",
      volunteerId: "v2", 
      volunteerName: "Mike Thompson",
      email: "mike@example.com",
      status: "pending",
      checkType: "Standard Background Check",
      provider: "National Criminal Database",
      submittedDate: "2024-07-10",
      completedDate: null,
      expirationDate: null,
      documents: [
        { name: "Application Form", type: "pdf", size: "856 KB", url: "#" }
      ],
      compliance: {
        SafeSport: { status: "pending", expiry: null },
        FBI: { status: "pending", expiry: null },
        LocalCheck: { status: "pending", expiry: null }
      },
      notes: "Awaiting completion of background check process.",
      riskLevel: "medium",
      aiFlags: ["Delayed submission", "Missing documents"]
    },
    {
      id: "bc3",
      volunteerId: "v3",
      volunteerName: "Jennifer Adams",
      email: "jennifer@example.com",
      status: "needs_renewal",
      checkType: "Enhanced Background Check",
      provider: "SafeSport Certified",
      submittedDate: "2023-07-05",
      completedDate: "2023-07-08",
      expirationDate: "2024-07-08",
      documents: [
        { name: "Expired Background Check", type: "pdf", size: "2.1 MB", url: "#" },
        { name: "SafeSport Certificate", type: "pdf", size: "1.0 MB", url: "#" }
      ],
      compliance: {
        SafeSport: { status: "expired", expiry: "2024-07-08" },
        FBI: { status: "expired", expiry: "2024-07-05" },
        LocalCheck: { status: "expired", expiry: "2024-07-05" }
      },
      notes: "Background check expired. Renewal required.",
      riskLevel: "high",
      aiFlags: ["Expired certification", "Renewal overdue"]
    },
    {
      id: "bc4",
      volunteerId: "v4",
      volunteerName: "David Wilson",
      email: "david@example.com",
      status: "flagged",
      checkType: "Enhanced Background Check",
      provider: "National Criminal Database",
      submittedDate: "2024-07-01",
      completedDate: "2024-07-05",
      expirationDate: "2025-07-05",
      documents: [
        { name: "Background Check Report", type: "pdf", size: "2.8 MB", url: "#" },
        { name: "Additional Review", type: "pdf", size: "1.5 MB", url: "#" }
      ],
      compliance: {
        SafeSport: { status: "requires_review", expiry: "2025-07-05" },
        FBI: { status: "compliant", expiry: "2025-07-01" },
        LocalCheck: { status: "requires_review", expiry: "2025-07-01" }
      },
      notes: "Minor issues found. Requires administrative review.",
      riskLevel: "medium",
      aiFlags: ["Requires manual review", "Administrative decision needed"]
    }
  ];

  // Mock compliance requirements
  const complianceRequirements = [
    {
      name: "SafeSport Training",
      description: "Mandatory training for all volunteers working with minors",
      frequency: "Annual",
      provider: "SafeSport",
      required: true,
      compliance: 85
    },
    {
      name: "FBI Background Check",
      description: "Federal criminal history check",
      frequency: "Every 2 years",
      provider: "FBI",
      required: true,
      compliance: 92
    },
    {
      name: "Local Criminal Check",
      description: "Local and state criminal history verification",
      frequency: "Annual",
      provider: "Local Agencies",
      required: true,
      compliance: 88
    },
    {
      name: "Reference Verification",
      description: "Personal and professional reference checks",
      frequency: "One-time",
      provider: "Internal",
      required: false,
      compliance: 76
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "flagged": return "bg-red-100 text-red-800 border-red-200";
      case "needs_renewal": return "bg-orange-100 text-orange-800 border-orange-200";
      case "expired": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "flagged": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "needs_renewal": return <RefreshCw className="h-4 w-4 text-orange-600" />;
      case "expired": return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getComplianceStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "requires_review": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
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

  const filteredChecks = backgroundChecks.filter(check => {
    if (filterStatus === "all") return true;
    return check.status === filterStatus;
  });

  const handleInitiateCheck = (volunteerId: string) => {
    toast({
      title: "Background Check Initiated",
      description: "Background check process has been started for the volunteer.",
    });
  };

  const handleApproveCheck = (checkId: string) => {
    toast({
      title: "Background Check Approved",
      description: "Volunteer has been cleared for participation.",
    });
  };

  const handleRenewCheck = (checkId: string) => {
    toast({
      title: "Renewal Initiated",
      description: "Background check renewal process has been started.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Compliance Intelligence */}
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
                <strong>Auto-Monitoring:</strong> AI tracks expiration dates and sends proactive renewal alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Document Verification:</strong> Automated validation of background check documents
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Risk Assessment:</strong> AI analyzes patterns and flags potential compliance issues
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Compliance Rate:</strong> 98% volunteer safety compliance through automated monitoring
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
                <p className="text-2xl font-bold text-gray-900">
                  {backgroundChecks.filter(c => c.status === "cleared").length}
                </p>
                <p className="text-xs text-gray-600">Cleared</p>
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
                  {backgroundChecks.filter(c => c.status === "pending").length}
                </p>
                <p className="text-xs text-gray-600">Pending</p>
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
                  {backgroundChecks.filter(c => c.status === "flagged").length}
                </p>
                <p className="text-xs text-gray-600">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {backgroundChecks.filter(c => c.status === "needs_renewal").length}
                </p>
                <p className="text-xs text-gray-600">Need Renewal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceRequirements.map((requirement, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{requirement.name}</h4>
                  {requirement.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span>{requirement.compliance}%</span>
                  </div>
                  <Progress value={requirement.compliance} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Frequency: {requirement.frequency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Check Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Background Check Status</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                className="p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="needs_renewal">Needs Renewal</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredChecks.map((check) => (
              <div key={check.id} className={`p-4 border rounded-lg ${getStatusColor(check.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(check.status)}
                      <div>
                        <span className="font-medium">{check.volunteerName}</span>
                        <div className="text-sm opacity-75">{check.email}</div>
                      </div>
                      <Badge className={`${getStatusColor(check.status)} border-0`}>
                        {check.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <span className="opacity-75">Check Type:</span>
                        <div className="font-medium">{check.checkType}</div>
                      </div>
                      <div>
                        <span className="opacity-75">Provider:</span>
                        <div className="font-medium">{check.provider}</div>
                      </div>
                      <div>
                        <span className="opacity-75">Submitted:</span>
                        <div className="font-medium">{new Date(check.submittedDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="opacity-75">Risk Level:</span>
                        <span className={`font-medium ${getRiskColor(check.riskLevel)}`}>
                          {check.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* Compliance Status */}
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">Compliance Status</h5>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(check.compliance).map(([type, status]) => (
                          <Badge key={type} className={getComplianceStatus((status as any).status)}>
                            {type}: {(status as any).status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* AI Flags */}
                    {check.aiFlags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-sm">AI Alerts</span>
                        </div>
                        <div className="space-y-1">
                          {check.aiFlags.map((flag, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">Documents ({check.documents.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {check.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                            <FileText className="h-3 w-3" />
                            <span>{doc.name}</span>
                            <span className="opacity-75">({doc.size})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm opacity-75">{check.notes}</p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedVolunteer(check)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>

                    {check.status === "pending" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleInitiateCheck(check.volunteerId)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Follow Up
                      </Button>
                    )}

                    {check.status === "flagged" && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleApproveCheck(check.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}

                    {check.status === "needs_renewal" && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleRenewCheck(check.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Renew
                      </Button>
                    )}

                    {check.status === "cleared" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Check Detail Modal */}
      {selectedVolunteer && (
        <Dialog open={!!selectedVolunteer} onOpenChange={() => setSelectedVolunteer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{selectedVolunteer.volunteerName} - Background Check Details</span>
                {getStatusIcon(selectedVolunteer.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Check Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Check Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedVolunteer.status)} variant="outline">
                        {selectedVolunteer.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(selectedVolunteer.riskLevel)}`}>
                        {selectedVolunteer.riskLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Check Type:</span>
                      <span className="ml-2 font-medium">{selectedVolunteer.checkType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Provider:</span>
                      <span className="ml-2 font-medium">{selectedVolunteer.provider}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="ml-2 font-medium">{new Date(selectedVolunteer.submittedDate).toLocaleDateString()}</span>
                    </div>
                    {selectedVolunteer.completedDate && (
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 font-medium">{new Date(selectedVolunteer.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {selectedVolunteer.expirationDate && (
                    <div className="pt-3 border-t">
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium">{new Date(selectedVolunteer.expirationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Compliance Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(selectedVolunteer.compliance).map(([type, status]) => (
                      <div key={type} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-medium">{type}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={getComplianceStatus((status as any).status)}>
                            {(status as any).status}
                          </Badge>
                          {(status as any).expiry && (
                            <span className="text-xs text-gray-500">
                              Expires: {new Date((status as any).expiry).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Associated Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedVolunteer.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <span className="font-medium text-sm">{doc.name}</span>
                            <div className="text-xs text-gray-500">{doc.type.toUpperCase()} • {doc.size}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Upload Additional Documents
              </Button>
              <Button className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Background Check Documents</DialogTitle>
          </DialogHeader>
          <DocumentUploadForm 
            onSubmit={(data) => {
              toast({
                title: "Documents Uploaded",
                description: "Background check documents have been uploaded successfully.",
              });
              setShowUploadModal(false);
            }}
            onCancel={() => setShowUploadModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Document Upload Form Component
function DocumentUploadForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    volunteerId: "",
    documentType: "",
    provider: "",
    notes: ""
  });

  const documentTypes = [
    "Background Check Report",
    "SafeSport Certificate",
    "FBI Clearance",
    "Local Criminal Check",
    "Reference Letter",
    "Training Certificate"
  ];

  const providers = [
    "SafeSport",
    "FBI",
    "National Criminal Database",
    "Local Law Enforcement",
    "Third-Party Provider"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Volunteer</label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.volunteerId}
          onChange={(e) => setFormData(prev => ({ ...prev, volunteerId: e.target.value }))}
        >
          <option value="">Select volunteer</option>
          <option value="v1">Sarah Johnson</option>
          <option value="v2">Mike Thompson</option>
          <option value="v3">Jennifer Adams</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Document Type</label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.documentType}
          onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
        >
          <option value="">Select document type</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Provider</label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.provider}
          onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
        >
          <option value="">Select provider</option>
          {providers.map((provider) => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">File Upload</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PDF, DOC, or image files up to 10MB</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this document"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </form>
  );
}