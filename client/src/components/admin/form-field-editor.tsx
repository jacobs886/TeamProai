import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2 } from "lucide-react";

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

interface FormFieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

export default function FormFieldEditor({ field, onUpdate, onClose }: FormFieldEditorProps) {
  const [localField, setLocalField] = useState(field);

  const handleUpdate = (updates: Partial<FormField>) => {
    const updatedField = { ...localField, ...updates };
    setLocalField(updatedField);
    onUpdate(updates);
  };

  const addOption = () => {
    const newOptions = [...(localField.options || []), `Option ${(localField.options?.length || 0) + 1}`];
    handleUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(localField.options || [])];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = localField.options?.filter((_, i) => i !== index) || [];
    handleUpdate({ options: newOptions });
  };

  const hasOptions = ["select", "radio", "checkbox"].includes(localField.type);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Edit Field</span>
            <Badge variant="outline">{localField.type}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Label */}
        <div>
          <Label htmlFor="fieldLabel">Field Label</Label>
          <Input
            id="fieldLabel"
            value={localField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        {/* Field Placeholder */}
        {["text", "email", "phone", "number", "textarea"].includes(localField.type) && (
          <div>
            <Label htmlFor="fieldPlaceholder">Placeholder Text</Label>
            <Input
              id="fieldPlaceholder"
              value={localField.placeholder || ""}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Required Field</Label>
            <p className="text-sm text-gray-500">Users must fill this field</p>
          </div>
          <Switch
            checked={localField.required}
            onCheckedChange={(checked) => handleUpdate({ required: checked })}
          />
        </div>

        {/* Options for select, radio, checkbox */}
        {hasOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {localField.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={(localField.options?.length || 0) <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div>
          <Label>Validation Rules</Label>
          <div className="space-y-2 mt-2">
            {localField.type === "text" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Length</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => handleUpdate({
                      validation: { ...localField.validation, minLength: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Length</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    onChange={(e) => handleUpdate({
                      validation: { ...localField.validation, maxLength: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            )}

            {localField.type === "number" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Value</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => handleUpdate({
                      validation: { ...localField.validation, min: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Value</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    onChange={(e) => handleUpdate({
                      validation: { ...localField.validation, max: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            )}

            {localField.type === "file" && (
              <div>
                <Label className="text-xs">Accepted File Types</Label>
                <Input
                  placeholder="image/*, .pdf, .doc"
                  onChange={(e) => handleUpdate({
                    validation: { ...localField.validation, accept: e.target.value }
                  })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Field Description */}
        <div>
          <Label htmlFor="fieldDescription">Help Text (Optional)</Label>
          <Textarea
            id="fieldDescription"
            placeholder="Additional instructions for this field"
            rows={2}
            onChange={(e) => handleUpdate({
              validation: { ...localField.validation, helpText: e.target.value }
            })}
          />
        </div>

        {/* Conditional Logic */}
        <div>
          <Label>Conditional Logic</Label>
          <p className="text-sm text-gray-500 mb-2">
            Show this field only when certain conditions are met
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Add Condition
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}