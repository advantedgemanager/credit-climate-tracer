
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Download, Eye, Calendar, TrendingUp, Loader2, Trash2 } from "lucide-react";
import { ReportService, type Report } from "@/services/reportService";
import { toast } from "@/hooks/use-toast";

export const HistorySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, [searchTerm, statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await ReportService.getReports({
        searchTerm: searchTerm || undefined,
        reportType: statusFilter === "all" ? undefined : statusFilter
      });
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await ReportService.deleteReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
      toast({
        title: "Report Deleted",
        description: "The report has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDownloadPDF = (report: Report) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${report.title}</title>
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
              <h1>${report.title}</h1>
              <p>Client: ${report.client_name}</p>
              <p>Generated on ${new Date(report.created_at).toLocaleDateString()}</p>
            </div>
            ${report.content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusBadge = () => {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-700">
        Completed
      </Badge>
    );
  };

  const getRiskScoreBadge = (score?: string) => {
    if (!score) return null;
    
    const colors = {
      High: "bg-red-100 text-red-700 border-red-200",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      Low: "bg-green-100 text-green-700 border-green-200"
    };
    
    return (
      <Badge variant="outline" className={colors[score as keyof typeof colors]}>
        {score} Risk
      </Badge>
    );
  };

  const stats = {
    total: reports.length,
    completed: reports.length, // All reports are completed
    totalIssues: reports.reduce((sum, r) => sum + (r.material_issues || 0), 0),
    totalKPIs: reports.reduce((sum, r) => sum + (r.kpis || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analysis History
          </CardTitle>
          <CardDescription>
            View and manage your previous ESG risk assessments and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by report name or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="materiality_assessment">Materiality Assessment</SelectItem>
                <SelectItem value="client_analysis">Client Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Reports</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.totalIssues}</div>
              <div className="text-sm text-red-700">Total Issues</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.totalKPIs}</div>
              <div className="text-sm text-purple-700">Total KPIs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading reports...</p>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reports found matching your criteria.</p>
              <p className="text-sm text-gray-500 mt-2">Generate your first report to see it here.</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-lg">{report.title}</h4>
                      {getStatusBadge()}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {report.client_name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Type: {report.report_type.replace('_', ' ')}</span>
                      {report.nace_code && (
                        <>
                          <span>•</span>
                          <span>NACE: {report.nace_code}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {getRiskScoreBadge(report.risk_score)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-600">{report.material_issues}</div>
                    <div className="text-xs text-red-700">Material Issues</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-600">{report.risk_pathways}</div>
                    <div className="text-xs text-orange-700">Risk Pathways</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">{report.kpis}</div>
                    <div className="text-xs text-blue-700">KPIs</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-600">
                      <TrendingUp className="h-4 w-4 mx-auto" />
                    </div>
                    <div className="text-xs text-purple-700">Risk Analysis</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(report)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Card className="fixed inset-4 z-50 bg-white shadow-lg border">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedReport.title}</CardTitle>
              <CardDescription>Client: {selectedReport.client_name}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div 
              dangerouslySetInnerHTML={{ __html: selectedReport.content }}
              className="prose max-w-none"
            />
          </CardContent>
        </Card>
      )}
      
      {/* Backdrop for modal */}
      {selectedReport && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};
