import { useState } from "react";
import { TreePine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExpandedState } from "@/types/bankSetup";
import { useBankSetup } from "@/contexts/BankSetupContext";
import BankSetupHeader from "@/components/BankSetupHeader";
import RiskTaxonomyTab from "@/components/RiskTaxonomyTab";

const BankSetup = () => {
  const { toast } = useToast();
  const { 
    materialityDecisions, 
    setMaterialityDecisions, 
    selectedRisks 
  } = useBankSetup();

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
    const documentation = {
      materialityDecisions: selectedRisks,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(documentation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bank-setup-materiality-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Documentation Exported",
      description: "Bank setup documentation has been downloaded successfully."
    });
  };

  const saveSetup = () => {
    toast({
      title: "Setup Saved",
      description: `Bank setup configuration saved with ${selectedRisks.length} material risks selected.`
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
        <RiskTaxonomyTab 
          materialityDecisions={materialityDecisions}
          expandedState={expandedState}
          onMaterialityToggle={handleMaterialityToggle}
          onRationaleUpdate={handleRationaleUpdate}
          onToggleExpanded={toggleExpanded}
        />
      </main>
    </div>
  );
};

export default BankSetup;