
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadSection } from "@/components/FileUploadSection";
import { ReportSection } from "@/components/ReportSection";
import { HistorySection } from "@/components/HistorySection";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, FileText } from "lucide-react";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    taxonomy: null,
    materiality: null
  });

  const handleFileUpload = (fileType: 'taxonomy' | 'materiality', file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">ESG Risk Tracer</h1>
                <p className="text-sm text-slate-600">Climate Transition Risk Assessment Platform</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              CRO Edition
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Integrate ESG Risks into Credit Risk Management
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Generate AI-powered reports that trace material ESG dependencies through to credit risks, 
            helping Chief Risk Officers understand the complete risk pathway from climate transition to financial impact.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Risk Taxonomy Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Upload your structured risk taxonomy to define the pathway from dependencies to credit risks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="p-2 bg-green-100 rounded-lg w-fit">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Materiality Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Automatically match material heatpoints to taxonomy nodes and trace complete risk pathways.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="p-2 bg-purple-100 rounded-lg w-fit">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">AI-Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Receive comprehensive, CRO-focused reports with KPIs and actionable monitoring recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Risk Assessment Dashboard</CardTitle>
            <CardDescription>
              Upload your risk taxonomy and materiality assessment to generate comprehensive ESG-to-credit risk reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Upload & Analysis
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <FileUploadSection 
                  onFileUpload={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <ReportSection uploadedFiles={uploadedFiles} />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <HistorySection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
