import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, Database, Target, TrendingUp } from "lucide-react";
import { MatchingEngine } from "@/utils/matchingEngine";
import { MatchingResults } from "@/components/MatchingResults";
import { ReportGenerator } from "@/components/ReportGenerator";
import { EMBEDDED_RISK_TAXONOMY, type ReportInputData } from "@/data/riskTaxonomy";
import { toast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void;
  uploadedMaterialityFile: File | null;
}

export const FileUploadSection = ({ onFileUpload, uploadedMaterialityFile }: FileUploadSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportData, setReportData] = useState<ReportInputData | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(file);
    setIsProcessing(true);
    setReportData(null);

    try {
      const materialityEntries = await MatchingEngine.parseMaterialityFile(file);
      const matchedData = MatchingEngine.matchMaterialityToTaxonomy(materialityEntries);
      setReportData(matchedData);
      
      toast({
        title: "File processed successfully",
        description: "Materiality assessment processed and matched against risk taxonomy.",
      });
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        title: "File processing failed",
        description: error.message || "Failed to process the uploaded file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Embedded Risk Taxonomy Display */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Embedded Risk Taxonomy</CardTitle>
          </div>
          <CardDescription>
            Explore the pre-built structured risk pathways from dependencies to credit risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {EMBEDDED_RISK_TAXONOMY.map((path) => (
              <div key={path.pathId} className="p-3 bg-white rounded-lg border">
                <div className="font-semibold text-blue-600">{path.dependency}</div>
                <div className="text-sm text-gray-600">{path.impact}</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {path.pathId}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Upload Materiality Assessment</CardTitle>
          </div>
          <CardDescription>
            Upload your materiality assessment file (JSON or CSV) to match against our risk taxonomy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-green-600 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">JSON or CSV (max. 2MB)</p>
                {uploadedMaterialityFile && (
                  <div className="flex items-center mt-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">{uploadedMaterialityFile.name}</span>
                  </div>
                )}
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSelect} />
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Matching Results */}
      {reportData && (
        <MatchingResults reportData={reportData} isProcessing={isProcessing} />
      )}

      {/* Report Generator */}
      {reportData && reportData.reportInputData.length > 0 && (
        <ReportGenerator 
          reportInputData={reportData}
          onReportGenerated={(report) => {
            console.log("Report generated:", report);
          }}
        />
      )}
    </div>
  );
};
