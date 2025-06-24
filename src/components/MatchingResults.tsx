
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, TrendingUp, Target, Database } from "lucide-react";
import type { ReportInputData, MatchedRiskPath } from "@/data/riskTaxonomy";

interface MatchingResultsProps {
  reportData: ReportInputData | null;
  isProcessing: boolean;
}

export const MatchingResults = ({ reportData, isProcessing }: MatchingResultsProps) => {
  if (isProcessing) {
    return (
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          Processing materiality assessment and matching against embedded risk taxonomy...
        </AlertDescription>
      </Alert>
    );
  }

  if (!reportData) {
    return null;
  }

  const matches = reportData.reportInputData;
  const summary = {
    totalMatches: matches.length,
    uniqueMaterialityIssues: new Set(matches.map(m => m.materialityHeatpoint)).size,
    dependencyMatches: matches.filter(m => m.matchedLevel === 'dependency').length,
    impactMatches: matches.filter(m => m.matchedLevel === 'impact').length,
    uniqueRiskPaths: new Set(matches.map(m => m.pathId)).size,
    totalKPIs: matches.reduce((acc, m) => acc + m.KPIs.length, 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Matching Complete</CardTitle>
          </div>
          <CardDescription>
            Successfully matched materiality assessment against embedded risk taxonomy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-blue-600 text-xl">{summary.totalMatches}</div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-red-600 text-xl">{summary.uniqueMaterialityIssues}</div>
              <div className="text-sm text-gray-600">Material Issues</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-orange-600 text-xl">{summary.uniqueRiskPaths}</div>
              <div className="text-sm text-gray-600">Risk Pathways</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="font-semibold text-purple-600 text-xl">{summary.totalKPIs}</div>
              <div className="text-sm text-gray-600">KPIs Identified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Matches */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Matched Risk Pathways</h3>
        <div className="space-y-4">
          {matches.map((match, index) => (
            <MatchCard key={`${match.pathId}-${index}`} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchCard = ({ match }: { match: MatchedRiskPath }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{match.materialityHeatpoint}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={
                match.matchedLevel === 'dependency' 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-green-100 text-green-700"
              }>
                <Target className="h-3 w-3 mr-1" />
                Matched at {match.matchedLevel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {match.pathId}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Pathway Flow */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Risk Pathway:</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Dependency:</span>
              <span className="text-gray-800">{match.fullPath.dependency}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Impact:</span>
              <span className="text-gray-800">{match.fullPath.impact}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Trans. Risk:</span>
              <span className="text-gray-800">{match.fullPath.transitionRisk}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Channel:</span>
              <span className="text-gray-800">{match.fullPath.transmissionChannel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Fin. Effect:</span>
              <span className="text-gray-800">{match.fullPath.financialEffect}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-xs font-medium text-gray-500">Credit Risk:</span>
              <span className="text-red-600 font-medium">{match.fullPath.creditRisk}</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            Key Performance Indicators:
          </h4>
          <div className="flex flex-wrap gap-1">
            {match.KPIs.map((kpi, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                {kpi}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
