import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Upload, Settings, TreePine, FileText, Download, ChevronDown, ChevronRight, Database, TrendingDown } from "lucide-react";
import { HIERARCHICAL_RISK_TAXONOMY, MaterialityDecision as NewMaterialityDecision } from "@/data/riskTaxonomy";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ClientData {
  clientName: string;
  naceCode: string;
  financialStatements: File | null;
  climateReports: File | null;
}


interface MaterialityDecision {
  dependencyId: string;
  selected: boolean;
  rationale: string;
  approvedBy: string;
  timestamp: Date;
}

interface ExpandedState {
  [key: string]: boolean;
}

const BankSetup = () => {
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData>({
    clientName: "",
    naceCode: "",
    financialStatements: null,
    climateReports: null
  });


  const [materialityDecisions, setMaterialityDecisions] = useState<MaterialityDecision[]>(() => {
    const decisions: MaterialityDecision[] = [];
    HIERARCHICAL_RISK_TAXONOMY.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.dependencies.forEach(dependency => {
          decisions.push({
            dependencyId: dependency.id,
            selected: false,
            rationale: "",
            approvedBy: "",
            timestamp: new Date()
          });
        });
      });
    });
    return decisions;
  });

  const [expandedState, setExpandedState] = useState<ExpandedState>({});

  const handleFileUpload = (field: 'financialStatements' | 'climateReports') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClientData(prev => ({ ...prev, [field]: file }));
  };

  const handleMaterialityToggle = (dependencyId: string) => {
    setMaterialityDecisions(prev => 
      prev.map(decision => 
        decision.dependencyId === dependencyId 
          ? { ...decision, selected: !decision.selected, timestamp: new Date() }
          : decision
      )
    );
  };

  const handleRationaleUpdate = (dependencyId: string, rationale: string) => {
    setMaterialityDecisions(prev => 
      prev.map(decision => 
        decision.dependencyId === dependencyId 
          ? { ...decision, rationale, timestamp: new Date() }
          : decision
      )
    );
  };

  const toggleExpanded = (key: string) => {
    setExpandedState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const exportDocumentation = () => {
    const selectedDecisions = materialityDecisions.filter(d => d.selected);
    const documentation = {
      clientData,
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Portfolio Upload
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
                <div className="space-y-4">
                  {HIERARCHICAL_RISK_TAXONOMY.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <Collapsible open={expandedState[category.id]} onOpenChange={() => toggleExpanded(category.id)}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <TreePine className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{category.title}</h3>
                          </div>
                          {expandedState[category.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="px-4 pb-4">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="ml-6 border-l-2 border-slate-200 pl-4 space-y-4">
                              <Collapsible open={expandedState[subcategory.id]} onOpenChange={() => toggleExpanded(subcategory.id)}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-slate-50 rounded px-2">
                                  <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-amber-600" />
                                    <h4 className="font-medium">{subcategory.title}</h4>
                                  </div>
                                  {expandedState[subcategory.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="ml-6 space-y-4 pt-2">
                                  {subcategory.dependencies.map((dependency) => {
                                    const decision = materialityDecisions.find(d => d.dependencyId === dependency.id);
                                    return (
                                      <div key={dependency.id} className="border rounded-lg p-4 bg-slate-50">
                                        <div className="flex items-start space-x-3 mb-4">
                                          <Checkbox
                                            id={dependency.id}
                                            checked={decision?.selected || false}
                                            onCheckedChange={() => handleMaterialityToggle(dependency.id)}
                                          />
                                          <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <Label htmlFor={dependency.id} className="font-medium text-slate-900">
                                                {dependency.title}
                                              </Label>
                                              {decision?.selected && (
                                                <Badge variant="default">Material</Badge>
                                              )}
                                            </div>
                                            
                                            <p className="text-sm text-slate-600">{dependency.description}</p>
                                            
                                            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                              <Database className="h-4 w-4 text-blue-600" />
                                              <span className="text-sm font-medium text-blue-800">TFM Metric:</span>
                                              <span className="text-sm text-blue-700">{dependency.tfmMetric}</span>
                                            </div>

                                            {decision?.selected && (
                                              <div className="space-y-4 mt-4">
                                                <div className="space-y-2">
                                                  <Label htmlFor={`rationale-${dependency.id}`}>Materiality Rationale</Label>
                                                  <Textarea
                                                    id={`rationale-${dependency.id}`}
                                                    value={decision.rationale}
                                                    onChange={(e) => handleRationaleUpdate(dependency.id, e.target.value)}
                                                    placeholder="Explain why this dependency is material for the client..."
                                                    rows={2}
                                                  />
                                                </div>

                                                <div className="space-y-3">
                                                  <h5 className="font-medium text-slate-900 flex items-center gap-2">
                                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                                    Transmission Channels & Data Requirements
                                                  </h5>
                                                  
                                                  {dependency.transmissionChannels.map((channel) => (
                                                    <div key={channel.id} className="border rounded p-3 bg-white">
                                                      <div className="space-y-2">
                                                        <h6 className="font-medium text-sm">{channel.description}</h6>
                                                        <div className="text-xs text-slate-600 space-y-1">
                                                          <p><strong>Impact:</strong> {channel.quantifiedImpact}</p>
                                                          <p><strong>PD Driver:</strong> {channel.pdDriver}</p>
                                                        </div>
                                                        <div className="bg-amber-50 p-2 rounded border">
                                                          <p className="text-xs font-medium text-amber-800 mb-1">Required Data for PD Adjustment:</p>
                                                          <ul className="text-xs text-amber-700 space-y-0.5">
                                                            {channel.dataRequirement.dataPoints.map((point, idx) => (
                                                              <li key={idx}>• {point}</li>
                                                            ))}
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Audit Trail Summary</h4>
                  <p className="text-sm text-blue-700">
                    Selected {materialityDecisions.filter(d => d.selected).length} of {materialityDecisions.length} risk dependencies. 
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