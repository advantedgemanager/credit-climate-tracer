
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, FileText, Settings, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useBankSetup } from "@/contexts/BankSetupContext";
import { ClientDocumentUpload } from "@/components/ClientDocumentUpload";
import { BankSetupStatus } from "@/components/BankSetupStatus";
import { ClientRiskAnalysis } from "@/components/ClientRiskAnalysis";
import { HistorySection } from "@/components/HistorySection";

const Index = () => {
  const { isSetupComplete } = useBankSetup();

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
            <div className="flex items-center gap-3">
              <Link to="/bank-setup">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Bank Setup
                </Button>
              </Link>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                CRO Edition
              </Badge>
            </div>
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
              <CardTitle className="text-lg">Embedded Risk Taxonomy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Pre-built structured risk taxonomy that defines pathways from dependencies to credit risks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="p-2 bg-green-100 rounded-lg w-fit">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Client Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Upload client documents to analyze against your established materiality framework from Bank Setup.
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
              Upload client documents and analyze against your Bank Setup materiality framework to generate AI-powered reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="setup" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Bank Setup
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Client Documents
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Risk Analysis
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup" className="space-y-6">
                <BankSetupStatus />
              </TabsContent>

              <TabsContent value="client" className="space-y-6">
                <ClientDocumentUpload />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <ClientRiskAnalysis />
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
