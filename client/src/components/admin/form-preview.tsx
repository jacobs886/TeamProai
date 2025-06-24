import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, Shield } from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
}

interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
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

interface FormPreviewProps {
  form: FormConfig;
}

export default function FormPreview({ form }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderField = (field: FormField) => {
    const baseClasses = "w-full";
    const isRequired = field.required;

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <Input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className={baseClasses}
            required={isRequired}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className={baseClasses}
            required={isRequired}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={formData[field.id] || ""}
            onValueChange={(value) => updateFormData(field.id, value)}
          >
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={formData[field.id] || ""}
            onValueChange={(value) => updateFormData(field.id, value)}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(formData[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.id] || [];
                    if (checked) {
                      updateFormData(field.id, [...currentValues, option]);
                    } else {
                      updateFormData(field.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !selectedDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  updateFormData(field.id, date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "time":
        return (
          <Input
            type="time"
            value={formData[field.id] || ""}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className={baseClasses}
            required={isRequired}
          />
        );

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => updateFormData(field.id, e.target.files)}
            className={baseClasses}
            required={isRequired}
          />
        );

      case "signature":
        return (
          <div className="border border-gray-300 rounded-md h-32 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Digital signature area</p>
          </div>
        );

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className={baseClasses}
            required={isRequired}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-2xl text-center">{form.title}</CardTitle>
          {form.description && (
            <p className="text-gray-600 text-center mt-2">{form.description}</p>
          )}
          {form.payment?.enabled && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Badge className="bg-green-100 text-green-800">
                <CreditCard className="h-3 w-3 mr-1" />
                Payment Required: ${form.payment.amount}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center space-x-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
                {field.validation?.helpText && (
                  <p className="text-sm text-gray-500">{field.validation.helpText}</p>
                )}
              </div>
            ))}

            {form.payment?.enabled && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Payment Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="123" />
                    </div>
                    <div>
                      <Label>Zip Code</Label>
                      <Input placeholder="12345" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {form.payment?.enabled ? `Submit & Pay $${form.payment.amount}` : "Submit Form"}
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}