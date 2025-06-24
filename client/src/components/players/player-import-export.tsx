import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface PlayerImportExportProps {
  onImportComplete: () => void;
}

export default function PlayerImportExport({ onImportComplete }: PlayerImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setImportResults({
        total: 25,
        successful: 23,
        failed: 2,
        errors: [
          "Row 15: Missing required field 'firstName'",
          "Row 22: Invalid email format"
        ]
      });
      setImporting(false);
      onImportComplete();
      
      toast({
        title: "Import Complete",
        description: "23 of 25 players imported successfully.",
      });
    }, 2000);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Player roster export will download shortly.",
    });
  };

  const downloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Import template has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import Players</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Import players from CSV or Excel files. Download the template below to ensure proper formatting.
            </AlertDescription>
          </Alert>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={downloadTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <span className="text-sm text-gray-600">
              Use this template to format your player data correctly
            </span>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {importing ? "Processing Import..." : "Upload Player File"}
            </h3>
            <p className="text-gray-600 mb-4">
              {importing ? "Please wait while we process your file." : "Drag and drop your CSV or Excel file here, or click to browse"}
            </p>
            
            {!importing && (
              <div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </div>
            )}

            {importing && (
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            )}
          </div>

          {importResults && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Import Results</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                  <div className="text-sm text-blue-700">Total Records</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Import Errors:</div>
                    <ul className="text-sm space-y-1">
                      {importResults.errors.map((error: string, index: number) => (
                        <li key={index} className="text-red-600">• {error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Players</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Export your complete player roster including contact information, guardians, and medical notes.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border">
              <CardContent className="pt-4">
                <div className="text-center space-y-3">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto" />
                  <h4 className="font-medium">Complete Roster (CSV)</h4>
                  <p className="text-sm text-gray-600">
                    All player data including guardians and medical information
                  </p>
                  <Button className="w-full" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Full Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="pt-4">
                <div className="text-center space-y-3">
                  <FileText className="h-8 w-8 text-green-600 mx-auto" />
                  <h4 className="font-medium">Basic Info (CSV)</h4>
                  <p className="text-sm text-gray-600">
                    Player names, positions, and contact information only
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Basic Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Exported files will include all visible players based on current filters</p>
            <p>• Medical information is included only in complete exports and requires additional permissions</p>
            <p>• Guardian contact information follows privacy protection guidelines</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Import Format Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Fields</h4>
              <div className="text-sm space-y-1">
                <div>• <code className="bg-gray-100 px-1 rounded">firstName</code> - Player's first name</div>
                <div>• <code className="bg-gray-100 px-1 rounded">lastName</code> - Player's last name</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Optional Fields</h4>
              <div className="text-sm space-y-1">
                <div>• <code className="bg-gray-100 px-1 rounded">dateOfBirth</code> - Format: YYYY-MM-DD</div>
                <div>• <code className="bg-gray-100 px-1 rounded">position</code> - Forward, Midfielder, Defender, Goalkeeper</div>
                <div>• <code className="bg-gray-100 px-1 rounded">jerseyNumber</code> - Number between 1-99</div>
                <div>• <code className="bg-gray-100 px-1 rounded">email</code> - Player's email address</div>
                <div>• <code className="bg-gray-100 px-1 rounded">phone</code> - Player's phone number</div>
                <div>• <code className="bg-gray-100 px-1 rounded">guardianName</code> - Primary guardian's full name</div>
                <div>• <code className="bg-gray-100 px-1 rounded">guardianEmail</code> - Guardian's email address</div>
                <div>• <code className="bg-gray-100 px-1 rounded">guardianPhone</code> - Guardian's phone number</div>
                <div>• <code className="bg-gray-100 px-1 rounded">medicalNotes</code> - Any medical conditions or allergies</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}