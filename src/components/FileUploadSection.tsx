
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileJson, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  onFileUpload: (fileType: 'taxonomy' | 'materiality', file: File) => void;
  uploadedFiles: {
    taxonomy: File | null;
    materiality: File | null;
  };
}

export const FileUploadSection = ({ onFileUpload, uploadedFiles }: FileUploadSectionProps) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateTaxonomyFile = (file: File): boolean => {
    if (!file.name.endsWith('.json')) {
      setValidationErrors(['Taxonomy file must be a JSON file']);
      return false;
    }
    return true;
  };

  const validateMaterialityFile = (file: File): boolean => {
    const validExtensions = ['.json', '.csv'];
    const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValid) {
      setValidationErrors(['Materiality file must be JSON or CSV format']);
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent, fileType: string) => {
    e.preventDefault();
    setDragOver(fileType);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, fileType: 'taxonomy' | 'materiality') => {
    e.preventDefault();
    setDragOver(null);
    setValidationErrors([]);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    let isValid = false;

    if (fileType === 'taxonomy') {
      isValid = validateTaxonomyFile(file);
    } else {
      isValid = validateMaterialityFile(file);
    }

    if (isValid) {
      onFileUpload(fileType, file);
      toast({
        title: "File uploaded successfully",
        description: `${fileType === 'taxonomy' ? 'Risk taxonomy' : 'Materiality assessment'} file has been uploaded.`,
      });
    }
  }, [onFileUpload, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'taxonomy' | 'materiality') => {
    setValidationErrors([]);
    const file = e.target.files?.[0];
    if (!file) return;

    let isValid = false;
    if (fileType === 'taxonomy') {
      isValid = validateTaxonomyFile(file);
    } else {
      isValid = validateMaterialityFile(file);
    }

    if (isValid) {
      onFileUpload(fileType, file);
      toast({
        title: "File uploaded successfully",
        description: `${fileType === 'taxonomy' ? 'Risk taxonomy' : 'Materiality assessment'} file has been uploaded.`,
      });
    }
  };

  const removeFile = (fileType: 'taxonomy' | 'materiality') => {
    onFileUpload(fileType, null as any);
    toast({
      title: "File removed",
      description: `${fileType === 'taxonomy' ? 'Risk taxonomy' : 'Materiality assessment'} file has been removed.`,
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
        {/* Risk Taxonomy Upload */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Risk Taxonomy</CardTitle>
              </div>
              {uploadedFiles.taxonomy && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            <CardDescription>
              Upload your structured JSON file containing the risk taxonomy hierarchy: 
              dependency → impact → transition risk → transmission channel → financial effect → credit risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.taxonomy ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {uploadedFiles.taxonomy.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('taxonomy')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {(uploadedFiles.taxonomy.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  dragOver === 'taxonomy'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => handleDragOver(e, 'taxonomy')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'taxonomy')}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drop your taxonomy JSON file here
                </p>
                <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileSelect(e, 'taxonomy')}
                  className="hidden"
                  id="taxonomy-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('taxonomy-upload')?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
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
              {uploadedFiles.materiality && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            <CardDescription>
              Upload your materiality assessment file (JSON or CSV) containing material heatpoints 
              that will be matched against the risk taxonomy dependencies and impacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.materiality ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {uploadedFiles.materiality.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('materiality')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {(uploadedFiles.materiality.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  dragOver === 'materiality'
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => handleDragOver(e, 'materiality')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'materiality')}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drop your materiality file here
                </p>
                <p className="text-xs text-gray-500 mb-3">JSON or CSV format accepted</p>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={(e) => handleFileSelect(e, 'materiality')}
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
      {uploadedFiles.taxonomy && uploadedFiles.materiality && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Ready for Analysis</h3>
                <p className="text-sm text-blue-700">
                  Both files have been uploaded successfully. You can now generate your ESG risk assessment report.
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
