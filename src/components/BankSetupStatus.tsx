import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreePine, CheckCircle, AlertTriangle, Settings, Database } from "lucide-react";
import { useBankSetup } from "@/contexts/BankSetupContext";
import { HIERARCHICAL_RISK_TAXONOMY } from "@/data/riskTaxonomy";

export const BankSetupStatus = () => {
  const { selectedRisks, isSetupComplete, materialityDecisions } = useBankSetup();

  if (!isSetupComplete) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No material risks selected in Bank Setup. Please complete the setup to define your materiality framework.
          <br />
          <Button variant="link" className="p-0 h-auto mt-2" onClick={() => window.location.href = '/bank-setup'}>
            Complete Bank Setup →
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Get the risk details from taxonomy
  const selectedRiskDetails = selectedRisks.map(decision => {
    let riskDetail = null;
    HIERARCHICAL_RISK_TAXONOMY.forEach(category => {
      category.subcategories.forEach(subcategory => {
        const dependency = subcategory.dependencies.find(dep => dep.id === decision.dependencyId);
        if (dependency) {
          riskDetail = {
            ...dependency,
            category: category.title,
            subcategory: subcategory.title,
            decision
          };
        }
      });
    });
    return riskDetail;
  }).filter(Boolean);

  const totalKPIs = selectedRiskDetails.reduce((acc, risk) => 
    acc + (risk?.transmissionChannels?.length || 0), 0
  );

  const totalDataPoints = selectedRiskDetails.reduce((acc, risk) => 
    acc + (risk?.transmissionChannels?.reduce((channelAcc, channel) => 
      channelAcc + (channel.dataRequirement?.dataPoints?.length || 0), 0) || 0), 0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Bank Setup Status - Complete
          </CardTitle>
          <CardDescription>
            Your materiality framework has been established with {selectedRisks.length} material risk dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-green-600 text-xl">{selectedRisks.length}</div>
              <div className="text-sm text-gray-600">Material Risks</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-blue-600 text-xl">{totalKPIs}</div>
              <div className="text-sm text-gray-600">Transmission Channels</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-purple-600 text-xl">{totalDataPoints}</div>
              <div className="text-sm text-gray-600">Data Points Required</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-blue-600" />
            Selected Material Risk Dependencies
          </CardTitle>
          <CardDescription>
            Risk taxonomy elements marked as material for your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedRiskDetails.map((risk, index) => (
              <div key={risk?.id || index} className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{risk?.title}</h4>
                    <p className="text-sm text-gray-600">{risk?.category} → {risk?.subcategory}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Material</Badge>
                    {risk?.transmissionChannels && (
                      <Badge variant="outline">
                        {risk.transmissionChannels.length} Channels
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded mb-3">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">TFM Metric:</span>
                  <span className="text-sm text-blue-700">{risk?.tfmMetric}</span>
                </div>

                {risk?.decision?.rationale && (
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm"><strong>Rationale:</strong> {risk.decision.rationale}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/bank-setup'}>
              <Settings className="h-4 w-4 mr-2" />
              Modify Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};