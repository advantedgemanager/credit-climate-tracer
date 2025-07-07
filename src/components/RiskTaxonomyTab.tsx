import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TreePine, Settings, ChevronDown, ChevronRight, Database, TrendingDown } from "lucide-react";
import { HIERARCHICAL_RISK_TAXONOMY } from "@/data/riskTaxonomy";
import { MaterialityDecision, ExpandedState } from "@/types/bankSetup";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RiskTaxonomyTabProps {
  materialityDecisions: MaterialityDecision[];
  expandedState: ExpandedState;
  onMaterialityToggle: (dependencyId: string) => void;
  onRationaleUpdate: (dependencyId: string, rationale: string) => void;
  onToggleExpanded: (key: string) => void;
}

const RiskTaxonomyTab = ({
  materialityDecisions,
  expandedState,
  onMaterialityToggle,
  onRationaleUpdate,
  onToggleExpanded
}: RiskTaxonomyTabProps) => {
  return (
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
              <Collapsible open={expandedState[category.id]} onOpenChange={() => onToggleExpanded(category.id)}>
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
                      <Collapsible open={expandedState[subcategory.id]} onOpenChange={() => onToggleExpanded(subcategory.id)}>
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
                                    onCheckedChange={() => onMaterialityToggle(dependency.id)}
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
                                            onChange={(e) => onRationaleUpdate(dependency.id, e.target.value)}
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
  );
};

export default RiskTaxonomyTab;