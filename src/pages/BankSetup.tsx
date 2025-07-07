import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Upload, 
  FileText, 
  Settings, 
  Users, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  TreePine,
  Shield,
  User,
  Clock
} from "lucide-react";
import { EMBEDDED_RISK_TAXONOMY } from "@/data/riskTaxonomy";
import { toast } from "@/hooks/use-toast";

interface PortfolioFile {
  name: string;
  type: 'nace' | 'exposure' | 'geography';
  file: File;
  uploadedAt: Date;
}

interface RiskAppetiteParams {
  maxConcentrationRatio: number;
  carbonIntensityThreshold: number;
  esgScoreMinimum: number;
  stressTestScenarios: string;
  monitoringFrequency: string;
}

interface MaterialityDecision {
  pathId: string;
  selected: boolean;
  rationale: string;
  decidedBy: string;
  decidedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

const BankSetup = () => {
  const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);
  const [riskParams, setRiskParams] = useState<RiskAppetiteParams>({
    maxConcentrationRatio: 10,
    carbonIntensityThreshold: 500,
    esgScoreMinimum: 60,
    stressTestScenarios: "",
    monitoringFrequency: "quarterly"
  });
  const [materialityDecisions, setMaterialityDecisions] = useState<MaterialityDecision[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("CRO");
  const [setupComplete, setSetupComplete] = useState(false);

  const handleFileUpload = (type: 'nace' | 'exposure' | 'geography') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFile: PortfolioFile = {
      name: file.name,
      type,
      file,
      uploadedAt: new Date()
    };

    setPortfolioFiles(prev => prev.filter(f => f.type !== type).concat(newFile));
    toast({
      title: "File uploaded",
      description: `${type.toUpperCase()} file uploaded successfully.`
    });
  };

  const handleMaterialitySelection = (pathId: string, selected: boolean, rationale: string) => {
    const decision: MaterialityDecision = {
      pathId,
      selected,
      rationale,
      decidedBy: currentUser,
      decidedAt: new Date()
    };

    setMaterialityDecisions(prev => {
      const filtered = prev.filter(d => d.pathId !== pathId);
      return [...filtered, decision];
    });
  };

  const handleExportDocumentation = () => {
    const documentation = {
      setupDate: new Date().toISOString(),
      portfolioFiles: portfolioFiles.map(f => ({ name: f.name, type: f.type, uploadedAt: f.uploadedAt })),
      riskParameters: riskParams,
      materialityDecisions,
      completedBy: currentUser
    };

    const blob = new Blob([JSON.stringify(documentation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-setup-documentation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Documentation exported",
      description: "Setup documentation has been downloaded."
    });
  };

  const isSetupComplete = portfolioFiles.length === 3 && 
    riskParams.stressTestScenarios && 
    materialityDecisions.length === EMBEDDED_RISK_TAXONOMY.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Initial Bank Setup</h1>
                <p className="text-sm text-slate-600">Configure ESG Risk Management Framework</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={currentUser === "CRO" ? "default" : "secondary"}>
                <User className="h-3 w-3 mr-1" />
                {currentUser}
              </Badge>
              <Button
                variant="outline"
                onClick={() => setCurrentUser(currentUser === "CRO" ? "Expert Consultant" : "CRO")}
              >
                Switch User
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <Card className="mb-8 border-0 shadow-md bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Setup Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className={`text-center p-3 rounded-lg ${portfolioFiles.length === 3 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Upload className={`h-6 w-6 mx-auto mb-2 ${portfolioFiles.length === 3 ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-sm font-medium">Portfolio Files</div>
                <div className="text-xs text-gray-600">{portfolioFiles.length}/3</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${riskParams.stressTestScenarios ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Settings className={`h-6 w-6 mx-auto mb-2 ${riskParams.stressTestScenarios ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-sm font-medium">Risk Parameters</div>
                <div className="text-xs text-gray-600">{riskParams.stressTestScenarios ? 'Complete' : 'Pending'}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${materialityDecisions.length === EMBEDDED_RISK_TAXONOMY.length ? 'bg-green-100' : 'bg-gray-100'}`}>
                <TreePine className={`h-6 w-6 mx-auto mb-2 ${materialityDecisions.length === EMBEDDED_RISK_TAXONOMY.length ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-sm font-medium">Taxonomy Selection</div>
                <div className="text-xs text-gray-600">{materialityDecisions.length}/{EMBEDDED_RISK_TAXONOMY.length}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${isSetupComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${isSetupComplete ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-sm font-medium">Ready</div>
                <div className="text-xs text-gray-600">{isSetupComplete ? 'Complete' : 'In Progress'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Tabs */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="parameters" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Risk Parameters
                </TabsTrigger>
                <TabsTrigger value="taxonomy" className="flex items-center gap-2">
                  <TreePine className="h-4 w-4" />
                  Taxonomy
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Audit Trail
                </TabsTrigger>
              </TabsList>

              {/* Portfolio Upload */}
              <TabsContent value="portfolio" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { type: 'nace' as const, title: 'NACE Classification', desc: 'Industry sector classifications' },
                    { type: 'exposure' as const, title: 'Exposure Data', desc: 'Credit exposure by client' },
                    { type: 'geography' as const, title: 'Geographic Data', desc: 'Regional distribution' }
                  ].map(({ type, title, desc }) => {
                    const uploaded = portfolioFiles.find(f => f.type === type);
                    return (
                      <Card key={type} className={`border-2 ${uploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-300'}`}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {uploaded ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Upload className="h-5 w-5 text-gray-400" />}
                            {title}
                          </CardTitle>
                          <CardDescription>{desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {uploaded ? (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-green-700">{uploaded.name}</div>
                              <div className="text-xs text-gray-600">
                                Uploaded {uploaded.uploadedAt.toLocaleDateString()}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Label htmlFor={`${type}-upload`} className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400">
                                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                  <div className="text-sm text-gray-600">Click to upload {type.toUpperCase()}</div>
                                </div>
                              </Label>
                              <Input 
                                id={`${type}-upload`} 
                                type="file" 
                                className="hidden" 
                                onChange={handleFileUpload(type)}
                                accept=".csv,.xlsx,.json"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Risk Parameters */}
              <TabsContent value="parameters" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="concentration">Maximum Concentration Ratio (%)</Label>
                      <Input 
                        id="concentration"
                        type="number"
                        value={riskParams.maxConcentrationRatio}
                        onChange={(e) => setRiskParams(prev => ({ ...prev, maxConcentrationRatio: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbon">Carbon Intensity Threshold (tCO2e/€M)</Label>
                      <Input 
                        id="carbon"
                        type="number"
                        value={riskParams.carbonIntensityThreshold}
                        onChange={(e) => setRiskParams(prev => ({ ...prev, carbonIntensityThreshold: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="esg">Minimum ESG Score</Label>
                      <Input 
                        id="esg"
                        type="number"
                        value={riskParams.esgScoreMinimum}
                        onChange={(e) => setRiskParams(prev => ({ ...prev, esgScoreMinimum: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scenarios">Stress Test Scenarios</Label>
                      <Textarea 
                        id="scenarios"
                        placeholder="Define stress test scenarios..."
                        value={riskParams.stressTestScenarios}
                        onChange={(e) => setRiskParams(prev => ({ ...prev, stressTestScenarios: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Monitoring Frequency</Label>
                      <Input 
                        id="frequency"
                        value={riskParams.monitoringFrequency}
                        onChange={(e) => setRiskParams(prev => ({ ...prev, monitoringFrequency: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Taxonomy Selection */}
              <TabsContent value="taxonomy" className="space-y-6">
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    Expert consultants can select material risk pathways. CRO reviews and approves selections.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  {EMBEDDED_RISK_TAXONOMY.map((path) => {
                    const decision = materialityDecisions.find(d => d.pathId === path.pathId);
                    const canEdit = currentUser === "Expert Consultant" || !decision;
                    
                    return (
                      <Card key={path.pathId} className={`border ${decision?.selected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={decision?.selected || false}
                                disabled={!canEdit}
                                onCheckedChange={(checked) => {
                                  if (canEdit) {
                                    const rationale = decision?.rationale || "";
                                    handleMaterialitySelection(path.pathId, checked as boolean, rationale);
                                  }
                                }}
                              />
                              <div>
                                <CardTitle className="text-lg">{path.dependency}</CardTitle>
                                <CardDescription>{path.impact}</CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline">{path.pathId}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 text-sm text-gray-600">
                            <div><strong>Transition Risk:</strong> {path.transitionRisk}</div>
                            <div><strong>Financial Effect:</strong> {path.financialEffect}</div>
                            <div><strong>Credit Risk:</strong> {path.creditRisk}</div>
                          </div>
                          
                          {canEdit && (
                            <div className="space-y-2">
                              <Label>Rationale for Selection</Label>
                              <Textarea 
                                placeholder="Explain why this pathway is material to the bank..."
                                value={decision?.rationale || ""}
                                onChange={(e) => handleMaterialitySelection(path.pathId, decision?.selected || false, e.target.value)}
                                rows={2}
                              />
                            </div>
                          )}
                          
                          {decision && (
                            <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                Decided by {decision.decidedBy} on {decision.decidedAt.toLocaleDateString()}
                              </div>
                              {decision.rationale && (
                                <div className="italic">"{decision.rationale}"</div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Audit Trail */}
              <TabsContent value="audit" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Setup Audit Trail</h3>
                  <Button onClick={handleExportDocumentation} disabled={!isSetupComplete}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Documentation
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Portfolio Files Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Portfolio Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {portfolioFiles.length > 0 ? (
                        <div className="space-y-2">
                          {portfolioFiles.map((file, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium">{file.type.toUpperCase()}: {file.name}</span>
                              <span className="text-sm text-gray-600">{file.uploadedAt.toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">No files uploaded yet</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Materiality Decisions Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Materiality Decisions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {materialityDecisions.length > 0 ? (
                        <div className="space-y-2">
                          {materialityDecisions.map((decision, index) => (
                            <div key={index} className="p-3 border rounded">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium">{decision.pathId}</span>
                                <Badge variant={decision.selected ? "default" : "secondary"}>
                                  {decision.selected ? "Selected" : "Not Selected"}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                By {decision.decidedBy} on {decision.decidedAt.toLocaleDateString()}
                              </div>
                              {decision.rationale && (
                                <div className="text-sm mt-2 italic">"{decision.rationale}"</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">No decisions recorded yet</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Completion Status */}
        {isSetupComplete && (
          <Alert className="mt-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Bank setup is complete! All portfolio files uploaded, risk parameters configured, and materiality decisions recorded.
              You can now proceed with regular risk assessments.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
};

export default BankSetup;