import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Sparkles, TrendingUp, Database } from "lucide-react";
import { useBankSetup } from "@/contexts/BankSetupContext";
import { HIERARCHICAL_RISK_TAXONOMY } from "@/data/riskTaxonomy";
import { MistralService } from "@/services/mistralService";
import { ReportService } from "@/services/reportService";
import { toast } from "@/hooks/use-toast";

export const ClientRiskAnalysis = () => {
  const { selectedRisks, clientData, isSetupComplete } = useBankSetup();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = isSetupComplete && 
                     clientData.clientName && 
                     (clientData.financialStatements || clientData.climateReports);

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      setError("Please complete Bank Setup and upload client documents");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Get details of selected risks from taxonomy
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
                rationale: decision.rationale
              };
            }
          });
        });
        return riskDetail;
      }).filter(Boolean);

      // Prepare analysis data
      const analysisData = {
        clientData,
        selectedRisks: selectedRiskDetails,
        totalTransmissionChannels: selectedRiskDetails.reduce((acc, risk) => 
          acc + (risk?.transmissionChannels?.length || 0), 0),
        totalDataPoints: selectedRiskDetails.reduce((acc, risk) => 
          acc + (risk?.transmissionChannels?.reduce((channelAcc, channel) => 
            channelAcc + (channel.dataRequirement?.dataPoints?.length || 0), 0) || 0), 0)
      };

      // Create analysis prompt for Mistral
      const prompt = `You are a Chief Risk Officer analyzing a client for ESG transition risks that may impact credit risk and PD adjustment. 

CLIENT INFORMATION:
- Company: ${clientData.clientName}
- NACE Code: ${clientData.naceCode}
- Financial Statements: ${clientData.financialStatements ? 'Available' : 'Not provided'}
- Climate Reports: ${clientData.climateReports ? 'Available' : 'Not provided'}

MATERIAL RISK DEPENDENCIES SELECTED BY BANK:
${selectedRiskDetails.map(risk => `
- ${risk?.title} (${risk?.category} → ${risk?.subcategory})
  TFM Metric: ${risk?.tfmMetric}
  Rationale: ${risk?.rationale || 'No rationale provided'}
  Transmission Channels: ${risk?.transmissionChannels?.length || 0}
`).join('')}

TRANSMISSION CHANNELS & DATA REQUIREMENTS:
${selectedRiskDetails.map(risk => 
  risk?.transmissionChannels?.map(channel => `
  ${risk.title} → ${channel.description}
  Impact: ${channel.quantifiedImpact}
  PD Driver: ${channel.pdDriver}
  Required Data Points for PD Adjustment:
  ${channel.dataRequirement.dataPoints.map(point => `  • ${point}`).join('\n')}
  `).join('')
).join('')}

Based on this client and the selected material risks, generate a comprehensive ESG-to-Credit Risk Assessment Report that includes:

1. **Executive Summary** - Key findings about which material risks apply to this specific client
2. **Risk Pathway Analysis** - Which of the selected risks are most relevant to this client and why
3. **PD Adjustment Requirements** - Specific data points that need to be collected for each relevant transmission channel
4. **KPI Monitoring Framework** - Key metrics to track for ongoing risk management
5. **Actionable Recommendations** - Next steps for the CRO to integrate these risks into credit decisions

Focus on providing specific, actionable insights that help the CRO understand exactly how these ESG risks could impact the client's probability of default and what data/KPIs they need to monitor.

Format the response in HTML with proper headings and structure.`;

      console.log("Analyzing client with selected risks:", analysisData);
      
      // Generate report using Mistral
      const report = await MistralService.generateClientAnalysis(prompt);
      setAnalysisResult(report);
      
      // Save report to database
      try {
        await ReportService.saveReport({
          title: `Client Risk Analysis - ${clientData.clientName}`,
          client_name: clientData.clientName,
          nace_code: clientData.naceCode,
          report_type: 'client_analysis',
          content: report,
          metadata: { analysisData, selectedRisks: selectedRiskDetails },
          material_issues: selectedRiskDetails.length,
          risk_pathways: analysisData.totalTransmissionChannels,
          kpis: analysisData.totalDataPoints,
          risk_score: selectedRiskDetails.length > 10 ? 'High' : selectedRiskDetails.length > 5 ? 'Medium' : 'Low'
        });
        
        toast({
          title: "Analysis Complete & Saved",
          description: "Client risk analysis has been generated and saved to history.",
        });
      } catch (saveError) {
        console.error("Failed to save analysis:", saveError);
        toast({
          title: "Analysis Complete",
          description: "Analysis generated successfully, but failed to save to history.",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze client";
      setError(errorMessage);
      console.error("Analysis error:", err);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <Card className={canAnalyze ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${canAnalyze ? 'text-green-600' : 'text-yellow-600'}`} />
            Client Risk Analysis
          </CardTitle>
          <CardDescription>
            {canAnalyze 
              ? "Ready to analyze client against your selected material risks"
              : "Complete requirements to enable AI analysis"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className={`font-semibold text-xl ${isSetupComplete ? 'text-green-600' : 'text-gray-400'}`}>
                {selectedRisks.length}
              </div>
              <div className="text-sm text-gray-600">Material Risks Selected</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className={`font-semibold text-xl ${clientData.clientName ? 'text-blue-600' : 'text-gray-400'}`}>
                {clientData.clientName ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Client Information</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className={`font-semibold text-xl ${(clientData.financialStatements || clientData.climateReports) ? 'text-purple-600' : 'text-gray-400'}`}>
                {(clientData.financialStatements || clientData.climateReports) ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Documents Uploaded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Section */}
      {canAnalyze && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered Risk Analysis
            </CardTitle>
            <CardDescription>
              Generate comprehensive analysis matching client documents against your selected material risks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Client Risk...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Generate AI Risk Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Client Risk Analysis Report
                </CardTitle>
                <CardDescription>
                  AI-generated analysis for {clientData.clientName}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-6 bg-gray-50 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: analysisResult }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};