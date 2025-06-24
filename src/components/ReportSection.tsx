
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ReportSectionProps {
  uploadedFiles: {
    taxonomy: File | null;
    materiality: File | null;
  };
}

export const ReportSection = ({ uploadedFiles }: ReportSectionProps) => {
  const hasRequiredFiles = uploadedFiles.taxonomy && uploadedFiles.materiality;

  // Mock report data for demonstration
  const mockReports = [
    {
      id: 1,
      name: "Q4 2024 Climate Risk Assessment",
      status: "completed",
      createdAt: "2024-01-15",
      materialIssues: 8,
      riskPathways: 12,
      kpis: 24
    },
    {
      id: 2,
      name: "Manufacturing Client Analysis",
      status: "processing",
      createdAt: "2024-01-14",
      materialIssues: 6,
      riskPathways: 9,
      kpis: 18
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  if (!hasRequiredFiles) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload both the risk taxonomy and materiality assessment files in the Upload & Analysis tab 
          to generate reports.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate New Report */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Generate New Report</CardTitle>
          </div>
          <CardDescription>
            Create a comprehensive ESG-to-credit risk assessment report using your uploaded files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-blue-600">Taxonomy</div>
              <div className="text-sm text-gray-600">{uploadedFiles.taxonomy?.name}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-green-600">Materiality</div>
              <div className="text-sm text-gray-600">{uploadedFiles.materiality?.name}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-purple-600">AI Engine</div>
              <div className="text-sm text-gray-600">Mistral API Ready</div>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate ESG Risk Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-sm text-gray-600">Created on {report.createdAt}</p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-600">{report.materialIssues}</div>
                    <div className="text-red-700">Material Issues</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-600">{report.riskPathways}</div>
                    <div className="text-orange-700">Risk Pathways</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">{report.kpis}</div>
                    <div className="text-blue-700">KPIs Identified</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {report.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </>
                  )}
                  {report.status === 'processing' && (
                    <Button variant="outline" size="sm" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Processing...
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
