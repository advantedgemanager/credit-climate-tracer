
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, FileText, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void;
  uploadedMaterialityFile: File | null;
}

export const FileUploadSection = ({ onFileUpload, uploadedMaterialityFile }: FileUploadSectionProps) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateMaterialityFile = (file: File): boolean => {
    const validExtensions = ['.json', '.csv'];
    const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValid) {
      setValidationErrors(['Materiality file must be JSON or CSV format']);
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setValidationErrors([]);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    const isValid = validateMaterialityFile(file);

    if (isValid) {
      onFileUpload(file);
      toast({
        title: "File uploaded successfully",
        description: "Materiality assessment file has been uploaded.",
      });
    }
  }, [onFileUpload, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors([]);
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = validateMaterialityFile(file);

    if (isValid) {
      onFileUpload(file);
      toast({
        title: "File uploaded successfully",
        description: "Materiality assessment file has been uploaded.",
      });
    }
  };

  const removeFile = () => {
    onFileUpload(null as any);
    toast({
      title: "File removed",
      description: "Materiality assessment file has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationErrors.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Embedded Risk Taxonomy Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Risk Taxonomy</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Embedded
              </Badge>
            </div>
            <CardDescription>
              Pre-built structured taxonomy containing the risk hierarchy: 
              dependency → impact → transition risk → transmission channel → financial effect → credit risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-100/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Integrated Risk Framework
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Ready to match against your materiality assessment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Materiality Assessment Upload */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Materiality Assessment</CardTitle>
              </div>
              {uploadedMaterialityFile && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            <CardDescription>
              Upload your materiality assessment file (JSON or CSV) containing material heatpoints 
              that will be matched against the embedded risk taxonomy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedMaterialityFile ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {uploadedMaterialityFile.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {(uploadedMaterialityFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  dragOver
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drop your materiality file here
                </p>
                <p className="text-xs text-gray-500 mb-3">JSON or CSV format accepted</p>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="materiality-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('materiality-upload')?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Actions */}
      {uploadedMaterialityFile && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Ready for Analysis</h3>
                <p className="text-sm text-blue-700">
                  Materiality assessment uploaded successfully. You can now generate your ESG risk assessment report using our embedded taxonomy.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
