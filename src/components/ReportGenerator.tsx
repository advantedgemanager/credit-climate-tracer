
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Copy, Sparkles, FileText } from "lucide-react";
import { MistralService } from "@/services/mistralService";
import { toast } from "@/hooks/use-toast";
import type { ReportInputData } from "@/data/riskTaxonomy";

interface ReportGeneratorProps {
  reportInputData: ReportInputData;
  onReportGenerated?: (report: string) => void;
}

export const ReportGenerator = ({ reportInputData, onReportGenerated }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!reportInputData.reportInputData.length) {
      setError("No matched risk pathways found. Please upload and process a materiality assessment first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating report with data:", reportInputData);
      const report = await MistralService.generateReport(reportInputData);
      setGeneratedReport(report);
      onReportGenerated?.(report);
      
      toast({
        title: "Report Generated Successfully",
        description: "Your ESG risk assessment report has been generated.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate report";
      setError(errorMessage);
      console.error("Report generation error:", err);
      
      toast({
        title: "Report Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = async () => {
    if (generatedReport) {
      // Convert HTML to plain text for clipboard
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatedReport;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      try {
        await navigator.clipboard.writeText(plainText);
        toast({
          title: "Report Copied",
          description: "The report has been copied to your clipboard.",
        });
      } catch (err) {
        console.error("Failed to copy report:", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy report to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadPDF = () => {
    if (generatedReport) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>ESG Risk Assessment Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #333; }
                ul { margin: 10px 0; }
                .header { text-align: center; margin-bottom: 30px; }
                @media print { body { margin: 20px; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>ESG Risk Assessment Report</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
              </div>
              ${generatedReport}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const summary = {
    totalMatches: reportInputData.reportInputData.length,
    uniqueHeatpoints: new Set(reportInputData.reportInputData.map(m => m.materialityHeatpoint)).size,
    totalKPIs: reportInputData.reportInputData.reduce((acc, m) => acc + m.KPIs.length, 0)
  };

  return (
    <div className="space-y-6">
      {/* Input Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Report Input Summary
          </CardTitle>
          <CardDescription>
            Ready to generate AI-powered ESG risk assessment report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-blue-600 text-xl">{summary.uniqueHeatpoints}</div>
              <div className="text-sm text-gray-600">Material Heatpoints</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-orange-600 text-xl">{summary.totalMatches}</div>
              <div className="text-sm text-gray-600">Risk Pathways</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-purple-600 text-xl">{summary.totalKPIs}</div>
              <div className="text-sm text-gray-600">KPIs Identified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Generate AI Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive CRO-focused report using AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate ESG Risk Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Generated Report
                </CardTitle>
                <CardDescription>
                  AI-generated ESG-to-Credit Risk Assessment
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Ready
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyReport}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Report
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <div 
              className="border rounded-lg p-6 bg-gray-50 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generatedReport }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
