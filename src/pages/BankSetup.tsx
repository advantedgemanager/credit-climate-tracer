import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, TreePine } from "lucide-react";
import { HIERARCHICAL_RISK_TAXONOMY } from "@/data/riskTaxonomy";
import { useToast } from "@/hooks/use-toast";
import { ClientData, MaterialityDecision, ExpandedState } from "@/types/bankSetup";
import BankSetupHeader from "@/components/BankSetupHeader";
import PortfolioUploadTab from "@/components/PortfolioUploadTab";
import RiskTaxonomyTab from "@/components/RiskTaxonomyTab";

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
      <BankSetupHeader 
        onExportDocumentation={exportDocumentation}
        onSaveSetup={saveSetup}
      />

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
            <PortfolioUploadTab 
              clientData={clientData}
              setClientData={setClientData}
            />
          </TabsContent>

          {/* Risk Taxonomy Tab */}
          <TabsContent value="taxonomy">
            <RiskTaxonomyTab 
              materialityDecisions={materialityDecisions}
              expandedState={expandedState}
              onMaterialityToggle={handleMaterialityToggle}
              onRationaleUpdate={handleRationaleUpdate}
              onToggleExpanded={toggleExpanded}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BankSetup;