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
  FileText,
  Heart,
  Phone,
  Upload,
  Download,
  Brain,
  Zap,
  UserCheck,
  Calendar
} from "lucide-react";

interface SafetyComplianceProps {
  childId: string;
  aiInsights: any;
}

export default function SafetyCompliance({ childId, aiInsights }: SafetyComplianceProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { toast } = useToast();

  // Mock compliance data
  const complianceStatus = {
    overallScore: 92,
    completedItems: 11,
    totalItems: 12,
    lastUpdated: "2024-07-20",
    nextReviewDate: "2025-07-20"
  };

  // Mock required documents
  const requiredDocuments = [
    {
      id: "doc_001",
      name: "Medical Information Form",
      category: "medical",
      status: "completed",
      submittedDate: "2024-06-15",
      expiryDate: "2025-06-15",
      description: "Emergency medical information and allergies",
      required: true,
      lastReviewed: "2024-07-01"
    },
    {
      id: "doc_002",
      name: "Emergency Contact Form",
      category: "emergency",
      status: "completed",
      submittedDate: "2024-06-15",
      expiryDate: "2025-06-15",
      description: "Primary and secondary emergency contacts",
      required: true,
      lastReviewed: "2024-07-01"
    },
    {
      id: "doc_003",
      name: "Liability Waiver",
      category: "legal",
      status: "completed", 
      submittedDate: "2024-06-20",
      expiryDate: "2025-06-20",
      description: "Team participation liability waiver",
      required: true,
      lastReviewed: "2024-06-20"
    },
    {
      id: "doc_004",
      name: "Photo/Video Release",
      category: "media",
      status: "completed",
      submittedDate: "2024-06-25",
      expiryDate: "2025-06-25",
      description: "Permission for team photos and videos",
      required: false,
      lastReviewed: "2024-06-25"
    },
    {
      id: "doc_005",
      name: "Updated Physical Exam",
      category: "medical",
      status: "expiring_soon",
      submittedDate: "2023-08-01",
      expiryDate: "2024-08-01",
      description: "Annual sports physical examination",
      required: true,
      lastReviewed: "2023-08-01"
    }
  ];

  // Mock medical information
  const medicalInfo = {
    allergies: ["Peanuts", "Bee stings"],
    medications: ["Inhaler (as needed for asthma)"],
    conditions: ["Mild asthma"],
    emergencyContacts: [
      {
        name: "Parent - Sarah Johnson",
        relationship: "Mother",
        phone: "(555) 123-4567",
        isPrimary: true
      },
      {
        name: "Grandparent - Robert Johnson", 
        relationship: "Grandfather",
        phone: "(555) 987-6543",
        isPrimary: false
      }
    ],
    lastPhysical: "2023-08-01",
    physician: "Dr. Emily Rodriguez",
    physicianPhone: "(555) 234-5678"
  };

  // Mock safety alerts
  const safetyAlerts = [
    {
      id: "alert_001",
      type: "medical_update",
      title: "Physical Exam Renewal Due",
      message: "Alex's sports physical expires on August 1st. Please schedule renewal.",
      priority: "high",
      dueDate: "2024-08-01",
      actionRequired: true
    },
    {
      id: "alert_002",
      type: "weather",
      title: "Heat Safety Protocol",
      message: "High temperatures expected this week. Extra hydration breaks will be implemented.",
      priority: "medium",
      dueDate: null,
      actionRequired: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expiring_soon": return "bg-orange-100 text-orange-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "expiring_soon": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "expired": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "medical": return <Heart className="h-4 w-4 text-red-600" />;
      case "emergency": return <Phone className="h-4 w-4 text-orange-600" />;
      case "legal": return <Shield className="h-4 w-4 text-blue-600" />;
      case "media": return <FileText className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleUploadDocument = (docId: string) => {
    toast({
      title: "Document Upload",
      description: "Your document has been uploaded and is under review.",
    });
  };

  const handleDownloadDocument = (docId: string) => {
    toast({
      title: "Document Downloaded",
      description: "Document has been downloaded to your device.",
    });
  };

  const handleUpdateMedicalInfo = () => {
    toast({
      title: "Medical Information",
      description: "Redirecting to medical information update form.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Safety Intelligence */}
      <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-red-600" />
            <span>AI Safety Intelligence</span>
            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Compliance Monitoring:</strong> AI tracks document expiration and sends proactive alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Medical Alerts:</strong> AI prioritizes critical medical information for coaches
              </AlertDescription>
            </Alert>
            
            <Alert>
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                <strong>Verification System:</strong> Automated checks ensure 100% compliance before participation
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Emergency Ready:</strong> Instant access to critical information during emergencies
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
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{complianceStatus.overallScore}%</p>
                <p className="text-xs text-gray-600">Compliance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complianceStatus.completedItems}/{complianceStatus.totalItems}
                </p>
                <p className="text-xs text-gray-600">Documents Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {safetyAlerts.filter(a => a.actionRequired).length}
                </p>
                <p className="text-xs text-gray-600">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(complianceStatus.nextReviewDate).getFullYear()}
                </p>
                <p className="text-xs text-gray-600">Next Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Safety Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-lg ${getPriorityColor(alert.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{alert.title}</h4>
                      <p className="text-sm mb-2">{alert.message}</p>
                      {alert.dueDate && (
                        <div className="text-xs opacity-75">
                          Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {alert.actionRequired && (
                      <Button size="sm" className="ml-4">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Compliance</span>
              <span>{complianceStatus.overallScore}%</span>
            </div>
            <Progress value={complianceStatus.overallScore} className="h-3" />
            <div className="text-xs text-gray-500">
              Last updated: {new Date(complianceStatus.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Required Documents</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  {getCategoryIcon(doc.category)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{doc.name}</h4>
                      {doc.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      {getStatusIcon(doc.status)}
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="text-xs text-gray-500 mt-1 space-x-4">
                      {doc.submittedDate && (
                        <span>Submitted: {new Date(doc.submittedDate).toLocaleDateString()}</span>
                      )}
                      {doc.expiryDate && (
                        <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {doc.status === "completed" && (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  {(doc.status === "pending" || doc.status === "expiring_soon") && (
                    <Button size="sm" onClick={() => handleUploadDocument(doc.id)}>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Medical Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-red-800">Allergies</h4>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.allergies.map((allergy, index) => (
                  <Badge key={index} className="bg-red-100 text-red-800">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Medical Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Medications</h4>
              <ul className="text-sm space-y-1">
                {medicalInfo.medications.map((med, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t">
              <div className="text-sm">
                <div>Last Physical: {new Date(medicalInfo.lastPhysical).toLocaleDateString()}</div>
                <div>Physician: {medicalInfo.physician}</div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleUpdateMedicalInfo}>
              <Heart className="h-4 w-4 mr-2" />
              Update Medical Information
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-orange-600" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicalInfo.emergencyContacts.map((contact, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{contact.name}</span>
                  {contact.isPrimary && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Primary</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <div>{contact.relationship}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Update Emergency Contacts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getCategoryIcon(selectedDocument.category)}
                <span>{selectedDocument.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Document Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Category: {selectedDocument.category}</div>
                    <div>Required: {selectedDocument.required ? "Yes" : "No"}</div>
                    <div>Status: {selectedDocument.status.replace('_', ' ')}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Dates</h4>
                  <div className="text-sm space-y-1">
                    {selectedDocument.submittedDate && (
                      <div>Submitted: {new Date(selectedDocument.submittedDate).toLocaleDateString()}</div>
                    )}
                    {selectedDocument.expiryDate && (
                      <div>Expires: {new Date(selectedDocument.expiryDate).toLocaleDateString()}</div>
                    )}
                    <div>Last Reviewed: {new Date(selectedDocument.lastReviewed).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedDocument.description}</p>
              </div>

              <div className="flex space-x-3">
                {selectedDocument.status === "completed" && (
                  <Button variant="outline" className="flex-1" onClick={() => handleDownloadDocument(selectedDocument.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                )}
                <Button className="flex-1" onClick={() => handleUploadDocument(selectedDocument.id)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Version
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <DocumentUploadForm 
            onSubmit={(data) => {
              toast({
                title: "Document Uploaded",
                description: "Your document has been uploaded successfully.",
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
    documentType: "",
    notes: ""
  });

  const documentTypes = [
    "Medical Information Form",
    "Emergency Contact Form", 
    "Liability Waiver",
    "Photo/Video Release",
    "Sports Physical Exam",
    "Insurance Card",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="text-sm font-medium">File Upload</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PDF, DOC, or image files up to 10MB</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes (Optional)</label>
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