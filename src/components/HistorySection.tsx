
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Download, Eye, Calendar, TrendingUp } from "lucide-react";

export const HistorySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // No mock data - history will be populated from actual analyses
  const mockHistory: any[] = [];

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-700">
        Completed
      </Badge>
    );
  };

  const getRiskScoreBadge = (score: string) => {
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

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockHistory.length}</div>
              <div className="text-sm text-blue-700">Total Reports</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mockHistory.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {mockHistory.reduce((sum, r) => sum + r.materialIssues, 0)}
              </div>
              <div className="text-sm text-red-700">Total Issues</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {mockHistory.reduce((sum, r) => sum + r.kpis, 0)}
              </div>
              <div className="text-sm text-purple-700">Total KPIs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reports found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {item.client}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {item.createdAt}</span>
                      <span>•</span>
                      <span>Completed: {item.completedAt}</span>
                    </div>
                  </div>
                  {getRiskScoreBadge(item.riskScore)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-600">{item.materialIssues}</div>
                    <div className="text-xs text-red-700">Material Issues</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-600">{item.riskPathways}</div>
                    <div className="text-xs text-orange-700">Risk Pathways</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">{item.kpis}</div>
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
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Re-analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
