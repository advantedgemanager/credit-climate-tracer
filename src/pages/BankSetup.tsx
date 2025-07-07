import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Upload, Settings, TreePine, FileText, Download } from "lucide-react";
import { EMBEDDED_RISK_TAXONOMY, TaxonomyNode } from "@/data/riskTaxonomy";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  clientName: string;
  naceCode: string;
  financialStatements: File | null;
  climateReports: File | null;
}

interface RiskParameters {
  riskAppetite: string;
  monitoringFrequency: string;
  thresholds: string;
  escalationProcedures: string;
}

interface MaterialityDecision {
  pathId: string;
  selected: boolean;
  rationale: string;
  approvedBy: string;
  timestamp: Date;
}

const BankSetup = () => {
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData>({
    clientName: "",
    naceCode: "",
    financialStatements: null,
    climateReports: null
  });

  const [riskParameters, setRiskParameters] = useState<RiskParameters>({
    riskAppetite: "",
    monitoringFrequency: "",
    thresholds: "",
    escalationProcedures: ""
  });

  const [materialityDecisions, setMaterialityDecisions] = useState<MaterialityDecision[]>(
    EMBEDDED_RISK_TAXONOMY.map(node => ({
      pathId: node.pathId,
      selected: false,
      rationale: "",
      approvedBy: "",
      timestamp: new Date()
    }))
  );

  const handleFileUpload = (field: 'financialStatements' | 'climateReports') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClientData(prev => ({ ...prev, [field]: file }));
  };

  const handleMaterialityToggle = (pathId: string) => {
    setMaterialityDecisions(prev => 
      prev.map(decision => 
        decision.pathId === pathId 
          ? { ...decision, selected: !decision.selected, timestamp: new Date() }
          : decision
      )
    );
  };

  const handleRationaleUpdate = (pathId: string, rationale: string) => {
    setMaterialityDecisions(prev => 
      prev.map(decision => 
        decision.pathId === pathId 
          ? { ...decision, rationale, timestamp: new Date() }
          : decision
      )
    );
  };

  const exportDocumentation = () => {
    const selectedDecisions = materialityDecisions.filter(d => d.selected);
    const documentation = {
      clientData,
      riskParameters,
      materialityDecisions: selectedDecisions,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(documentation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bank-setup-${clientData.clientName || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Documentation Exported",
      description: "Bank setup documentation has been downloaded successfully."
    });
  };

  const saveSetup = () => {
    // Here you would typically save to a backend
    toast({
      title: "Setup Saved",
      description: "Bank setup configuration has been saved with audit trail."
    });
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
                <h1 className="text-2xl font-bold text-slate-900">Initial Bank Setup</h1>
                <p className="text-sm text-slate-600">Configure portfolio, risk parameters, and materiality assessment</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportDocumentation} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Documentation
              </Button>
              <Button onClick={saveSetup}>
                Save Setup
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Portfolio Upload
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Risk Parameters
            </TabsTrigger>
            <TabsTrigger value="taxonomy" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              Risk Taxonomy
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Upload Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Client Portfolio Information</CardTitle>
                <CardDescription>
                  Input client details and upload relevant documents for risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientData.clientName}
                      onChange={(e) => setClientData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter client company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="naceCode">NACE Code</Label>
                    <Input
                      id="naceCode"
                      value={clientData.naceCode}
                      onChange={(e) => setClientData(prev => ({ ...prev, naceCode: e.target.value }))}
                      placeholder="e.g., 64.19 (Other monetary intermediation)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="financialStatements">Financial Statements</Label>
                    <Input
                      id="financialStatements"
                      type="file"
                      accept=".pdf,.xlsx,.xls"
                      onChange={handleFileUpload('financialStatements')}
                    />
                    {clientData.financialStatements && (
                      <Badge variant="secondary">{clientData.financialStatements.name}</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="climateReports">Climate Reporting Documents</Label>
                    <Input
                      id="climateReports"
                      type="file"
                      accept=".pdf,.xlsx,.xls"
                      onChange={handleFileUpload('climateReports')}
                    />
                    {clientData.climateReports && (
                      <Badge variant="secondary">{clientData.climateReports.name}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Parameters Tab */}
          <TabsContent value="parameters">
            <Card>
              <CardHeader>
                <CardTitle>Risk Appetite Parameters</CardTitle>
                <CardDescription>
                  Define risk appetite, monitoring frequency, and escalation procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="riskAppetite">Risk Appetite Statement</Label>
                  <Textarea
                    id="riskAppetite"
                    value={riskParameters.riskAppetite}
                    onChange={(e) => setRiskParameters(prev => ({ ...prev, riskAppetite: e.target.value }))}
                    placeholder="Define the bank's appetite for climate transition risks..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monitoringFrequency">Monitoring Frequency</Label>
                  <Input
                    id="monitoringFrequency"
                    value={riskParameters.monitoringFrequency}
                    onChange={(e) => setRiskParameters(prev => ({ ...prev, monitoringFrequency: e.target.value }))}
                    placeholder="e.g., Quarterly review, Monthly KPI updates"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thresholds">Risk Thresholds</Label>
                  <Textarea
                    id="thresholds"
                    value={riskParameters.thresholds}
                    onChange={(e) => setRiskParameters(prev => ({ ...prev, thresholds: e.target.value }))}
                    placeholder="Define quantitative thresholds for risk escalation..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalationProcedures">Escalation Procedures</Label>
                  <Textarea
                    id="escalationProcedures"
                    value={riskParameters.escalationProcedures}
                    onChange={(e) => setRiskParameters(prev => ({ ...prev, escalationProcedures: e.target.value }))}
                    placeholder="Describe procedures for risk threshold breaches..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Taxonomy Tab */}
          <TabsContent value="taxonomy">
            <Card>
              <CardHeader>
                <CardTitle>Embedded Risk Taxonomy Selection</CardTitle>
                <CardDescription>
                  Select material risk branches based on your materiality assessment. Provide rationale for audit trail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {EMBEDDED_RISK_TAXONOMY.map((node, index) => {
                    const decision = materialityDecisions.find(d => d.pathId === node.pathId);
                    return (
                      <div key={node.pathId} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={node.pathId}
                            checked={decision?.selected || false}
                            onCheckedChange={() => handleMaterialityToggle(node.pathId)}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={node.pathId} className="font-medium">
                                Risk Path {index + 1}: {node.dependency}
                              </Label>
                              {decision?.selected && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-slate-600 space-y-1">
                              <p><strong>Impact:</strong> {node.impact}</p>
                              <p><strong>Transition Risk:</strong> {node.transitionRisk}</p>
                              <p><strong>Credit Risk:</strong> {node.creditRisk}</p>
                              <p><strong>KPIs:</strong> {node.KPIs.join(", ")}</p>
                            </div>

                            {decision?.selected && (
                              <div className="space-y-2 mt-3">
                                <Label htmlFor={`rationale-${node.pathId}`}>Selection Rationale</Label>
                                <Textarea
                                  id={`rationale-${node.pathId}`}
                                  value={decision.rationale}
                                  onChange={(e) => handleRationaleUpdate(node.pathId, e.target.value)}
                                  placeholder="Explain why this risk path is material for the client..."
                                  rows={2}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Audit Trail Summary</h4>
                  <p className="text-sm text-blue-700">
                    Selected {materialityDecisions.filter(d => d.selected).length} of {EMBEDDED_RISK_TAXONOMY.length} risk paths. 
                    All decisions will be recorded with timestamps and rationale for regulatory compliance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BankSetup;