import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClientData, MaterialityDecision } from '@/types/bankSetup';
import { HIERARCHICAL_RISK_TAXONOMY } from '@/data/riskTaxonomy';

interface BankSetupContextType {
  clientData: ClientData;
  setClientData: React.Dispatch<React.SetStateAction<ClientData>>;
  materialityDecisions: MaterialityDecision[];
  setMaterialityDecisions: React.Dispatch<React.SetStateAction<MaterialityDecision[]>>;
  selectedRisks: MaterialityDecision[];
  isSetupComplete: boolean;
  clearBankSetup: () => void;
}

const BankSetupContext = createContext<BankSetupContextType | undefined>(undefined);

export const useBankSetup = () => {
  const context = useContext(BankSetupContext);
  if (context === undefined) {
    throw new Error('useBankSetup must be used within a BankSetupProvider');
  }
  return context;
};

export const BankSetupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientData, setClientData] = useState<ClientData>({
    clientName: "",
    naceCode: "",
    financialStatements: null,
    climateReports: null
  });

  const [materialityDecisions, setMaterialityDecisions] = useState<MaterialityDecision[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('bankSetup_materialityDecisions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((decision: any) => ({
          ...decision,
          timestamp: new Date(decision.timestamp)
        }));
      } catch (error) {
        console.error('Error parsing saved materiality decisions:', error);
      }
    }

    // Initialize with all risk dependencies
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

  // Save to localStorage whenever materialityDecisions change
  useEffect(() => {
    localStorage.setItem('bankSetup_materialityDecisions', JSON.stringify(materialityDecisions));
  }, [materialityDecisions]);

  // Load client data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bankSetup_clientData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClientData(parsed);
      } catch (error) {
        console.error('Error parsing saved client data:', error);
      }
    }
  }, []);

  // Save client data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bankSetup_clientData', JSON.stringify(clientData));
  }, [clientData]);

  const selectedRisks = materialityDecisions.filter(decision => decision.selected);
  const isSetupComplete = selectedRisks.length > 0;

  const clearBankSetup = () => {
    localStorage.removeItem('bankSetup_materialityDecisions');
    localStorage.removeItem('bankSetup_clientData');
    setClientData({
      clientName: "",
      naceCode: "",
      financialStatements: null,
      climateReports: null
    });
    setMaterialityDecisions(prev => 
      prev.map(decision => ({
        ...decision,
        selected: false,
        rationale: "",
        approvedBy: "",
        timestamp: new Date()
      }))
    );
  };

  return (
    <BankSetupContext.Provider value={{
      clientData,
      setClientData,
      materialityDecisions,
      setMaterialityDecisions,
      selectedRisks,
      isSetupComplete,
      clearBankSetup
    }}>
      {children}
    </BankSetupContext.Provider>
  );
};