import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIFormBuilderHeader from "./ai-form-builder-header";
import FormFieldEditor from "./form-field-editor";
import FormPreview from "./form-preview";
import PaymentIntegration from "./payment-integration";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Save,
  Eye,
  Code,
  Settings,
  CreditCard,
  Link as LinkIcon,
  Brain,
  Wand2,
  Trash2,
  Copy,
  Download,
  Share2
} from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
  conditional?: any;
}

interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    allowMultipleSubmissions: boolean;
    requireLogin: boolean;
    sendConfirmationEmail: boolean;
    redirectUrl?: string;
    successMessage: string;
  };
  payment?: {
    enabled: boolean;
    amount: number;
    currency: string;
    description: string;
  };
  styling: {
    theme: string;
    primaryColor: string;
    backgroundColor: string;
  };
}

export default function IntelligentFormBuilder() {
  const [form, setForm] = useState<FormConfig>({
    id: "",
    title: "New Form",
    description: "",
    fields: [],
    settings: {
      allowMultipleSubmissions: true,
      requireLogin: false,
      sendConfirmationEmail: false,
      successMessage: "Thank you for your submission!"
    },
    styling: {
      theme: "modern",
      primaryColor: "#3b82f6",
      backgroundColor: "#ffffff"
    }
  });

  const [activeTab, setActiveTab] = useState("builder");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const { toast } = useToast();

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: "📝" },
    { value: "email", label: "Email", icon: "📧" },
    { value: "phone", label: "Phone", icon: "📞" },
    { value: "number", label: "Number", icon: "#" },
    { value: "textarea", label: "Text Area", icon: "📄" },
    { value: "select", label: "Dropdown", icon: "🔽" },
    { value: "radio", label: "Radio Buttons", icon: "⚪" },
    { value: "checkbox", label: "Checkboxes", icon: "☑️" },
    { value: "date", label: "Date Picker", icon: "📅" },
    { value: "time", label: "Time Picker", icon: "🕐" },
    { value: "file", label: "File Upload", icon: "📎" },
    { value: "signature", label: "Digital Signature", icon: "✍️" },
  ];

  const handleAIPrompt = async (prompt: string) => {
    setIsProcessingAI(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = generateFormFromPrompt(prompt);
      setForm(prev => ({
        ...prev,
        ...aiResponse
      }));

      toast({
        title: "AI Form Generated",
        description: "Your form has been created based on your prompt.",
      });
    } catch (error) {
      toast({
        title: "AI Processing Error",
        description: "Failed to generate form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  const generateFormFromPrompt = (prompt: string): Partial<FormConfig> => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("registration") || lowerPrompt.includes("signup")) {
      return {
        title: "Team Registration Form",
        description: "Register for our team sports program",
        fields: [
          {
            id: "1",
            type: "text",
            label: "Player Name",
            placeholder: "Enter full name",
            required: true
          },
          {
            id: "2",
            type: "email",
            label: "Email Address",
            placeholder: "player@email.com",
            required: true
          },
          {
            id: "3",
            type: "phone",
            label: "Phone Number",
            placeholder: "(555) 123-4567",
            required: true
          },
          {
            id: "4",
            type: "date",
            label: "Date of Birth",
            required: true
          },
          {
            id: "5",
            type: "select",
            label: "Position",
            required: true,
            options: ["Forward", "Midfielder", "Defender", "Goalkeeper"]
          },
          {
            id: "6",
            type: "textarea",
            label: "Previous Experience",
            placeholder: "Describe your sports background",
            required: false
          }
        ]
      };
    }

    if (lowerPrompt.includes("payment") || lowerPrompt.includes("fee")) {
      return {
        title: "Payment Form",
        description: "Complete your payment for team services",
        fields: [
          {
            id: "1",
            type: "text",
            label: "Full Name",
            required: true
          },
          {
            id: "2",
            type: "email",
            label: "Email Address",
            required: true
          },
          {
            id: "3",
            type: "select",
            label: "Service Type",
            required: true,
            options: ["Team Registration", "Tournament Entry", "Equipment Rental", "Training Sessions"]
          }
        ],
        payment: {
          enabled: true,
          amount: 50.00,
          currency: "USD",
          description: "Team service payment"
        }
      };
    }

    if (lowerPrompt.includes("booking") || lowerPrompt.includes("facility")) {
      return {
        title: "Facility Booking Form",
        description: "Reserve your preferred time slot",
        fields: [
          {
            id: "1",
            type: "text",
            label: "Organization Name",
            required: true
          },
          {
            id: "2",
            type: "email",
            label: "Contact Email",
            required: true
          },
          {
            id: "3",
            type: "select",
            label: "Facility Type",
            required: true,
            options: ["Basketball Court", "Soccer Field", "Tennis Court", "Swimming Pool"]
          },
          {
            id: "4",
            type: "date",
            label: "Preferred Date",
            required: true
          },
          {
            id: "5",
            type: "time",
            label: "Start Time",
            required: true
          },
          {
            id: "6",
            type: "number",
            label: "Duration (hours)",
            required: true
          }
        ]
      };
    }

    // Default basic form
    return {
      title: "Custom Form",
      description: "Generated form based on your requirements",
      fields: [
        {
          id: "1",
          type: "text",
          label: "Name",
          required: true
        },
        {
          id: "2",
          type: "email",
          label: "Email",
          required: true
        }
      ]
    };
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false
    };

    if (type === "select" || type === "radio" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2", "Option 3"];
    }

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = form.fields.find(field => field.id === fieldId);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: Date.now().toString(),
        label: fieldToDuplicate.label + " (Copy)"
      };
      setForm(prev => ({
        ...prev,
        fields: [...prev.fields, duplicatedField]
      }));
    }
  };

  const saveForm = async () => {
    try {
      // Here you would save to your backend
      toast({
        title: "Form Saved",
        description: "Your form has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <AIFormBuilderHeader 
        onAIPrompt={handleAIPrompt}
        isProcessing={isProcessingAI}
      />

      {/* Main Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Form Builder */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="builder" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>Builder</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-4">
              {/* Form Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="formTitle">Form Title</Label>
                    <Input
                      id="formTitle"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formDescription">Description</Label>
                    <Textarea
                      id="formDescription"
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this form is for"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Field Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <Button
                        key={fieldType.value}
                        variant="outline"
                        onClick={() => addField(fieldType.value)}
                        className="flex flex-col items-center p-3 h-auto"
                      >
                        <span className="text-lg mb-1">{fieldType.icon}</span>
                        <span className="text-xs">{fieldType.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Fields ({form.fields.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {form.fields.length === 0 ? (
                    <Alert>
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        No fields added yet. Use AI to generate a form or add fields manually.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    form.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-mono text-gray-500">#{index + 1}</span>
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-500">
                              {field.type} {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedField(field)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateField(field.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <FormSettingsPanel form={form} setForm={setForm} />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentIntegration form={form} setForm={setForm} />
            </TabsContent>

            <TabsContent value="preview">
              <FormPreview form={form} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Field Editor */}
        <div className="space-y-4">
          {selectedField ? (
            <FormFieldEditor
              field={selectedField}
              onUpdate={(updates) => updateField(selectedField.id, updates)}
              onClose={() => setSelectedField(null)}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a field to edit its properties</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Form Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={saveForm} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Form
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Form Settings Component
function FormSettingsPanel({ form, setForm }: { form: FormConfig; setForm: (form: FormConfig | ((prev: FormConfig) => FormConfig)) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Multiple Submissions</Label>
              <p className="text-sm text-gray-500">Users can submit this form multiple times</p>
            </div>
            <Switch
              checked={form.settings.allowMultipleSubmissions}
              onCheckedChange={(checked) =>
                setForm(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allowMultipleSubmissions: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Login</Label>
              <p className="text-sm text-gray-500">Users must be logged in to submit</p>
            </div>
            <Switch
              checked={form.settings.requireLogin}
              onCheckedChange={(checked) =>
                setForm(prev => ({
                  ...prev,
                  settings: { ...prev.settings, requireLogin: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Send Confirmation Email</Label>
              <p className="text-sm text-gray-500">Send email confirmation to users</p>
            </div>
            <Switch
              checked={form.settings.sendConfirmationEmail}
              onCheckedChange={(checked) =>
                setForm(prev => ({
                  ...prev,
                  settings: { ...prev.settings, sendConfirmationEmail: checked }
                }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="successMessage">Success Message</Label>
          <Textarea
            id="successMessage"
            value={form.settings.successMessage}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                settings: { ...prev.settings, successMessage: e.target.value }
              }))
            }
            placeholder="Message shown after successful submission"
          />
        </div>

        <div>
          <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
          <Input
            id="redirectUrl"
            value={form.settings.redirectUrl || ""}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                settings: { ...prev.settings, redirectUrl: e.target.value }
              }))
            }
            placeholder="https://example.com/thank-you"
          />
        </div>
      </CardContent>
    </Card>
  );
}