
export interface TaxonomyNode {
  dependency: string;
  impact: string;
  transitionRisk: string;
  transmissionChannel: string;
  financialEffect: string;
  creditRisk: string;
  pathId: string;
  KPIs: string[];
}

export interface MaterialityEntry {
  materialityHeatpoint: string;
  dependency?: string;
  impact?: string;
  severityScore?: number;
  clientId?: string;
  sector?: string;
}

export interface MatchedRiskPath {
  materialityHeatpoint: string;
  matchedLevel: 'dependency' | 'impact';
  fullPath: Omit<TaxonomyNode, 'pathId' | 'KPIs'>;
  KPIs: string[];
  pathId: string;
}

export interface ReportInputData {
  reportInputData: MatchedRiskPath[];
}

// Embedded Risk Taxonomy - Pre-built structured paths
export const EMBEDDED_RISK_TAXONOMY: TaxonomyNode[] = [
  {
    pathId: "PATH_001",
    dependency: "High reliance on carbon-intensive logistics",
    impact: "Cost increases due to fuel taxes",
    transitionRisk: "Policy-driven cost pass-through",
    transmissionChannel: "OPEX pressure reduces cash reserves",
    financialEffect: "Lower interest coverage ratio",
    creditRisk: "Elevated default risk",
    KPIs: ["Logistics emissions intensity", "Client fuel mix ratio", "EBITDA margin"]
  },
  {
    pathId: "PATH_002",
    dependency: "Fossil fuel-dependent manufacturing processes",
    impact: "Regulatory compliance costs",
    transitionRisk: "Carbon pricing mechanisms",
    transmissionChannel: "Increased operational expenditure",
    financialEffect: "Reduced profit margins",
    creditRisk: "Higher probability of default",
    KPIs: ["Carbon intensity per unit", "Compliance cost ratio", "Net profit margin"]
  },
  {
    pathId: "PATH_003",
    dependency: "Water-intensive operations",
    impact: "Water scarcity affects production",
    transitionRisk: "Physical climate risks",
    transmissionChannel: "Production capacity constraints",
    financialEffect: "Revenue decline",
    creditRisk: "Cash flow deterioration",
    KPIs: ["Water usage efficiency", "Production capacity utilization", "Revenue volatility"]
  },
  {
    pathId: "PATH_004",
    dependency: "Energy-intensive data centers",
    impact: "Rising electricity costs",
    transitionRisk: "Energy transition pricing",
    transmissionChannel: "Operating cost inflation",
    financialEffect: "Compressed operating margins",
    creditRisk: "Debt service coverage pressure",
    KPIs: ["Energy consumption per server", "Renewable energy mix", "Operating cost ratio"]
  },
  {
    pathId: "PATH_005",
    dependency: "Supply chain in climate-vulnerable regions",
    impact: "Supply chain disruptions",
    transitionRisk: "Physical climate adaptation",
    transmissionChannel: "Inventory and production volatility",
    financialEffect: "Working capital strain",
    creditRisk: "Liquidity risk elevation",
    KPIs: ["Supply chain resilience score", "Inventory turnover", "Working capital ratio"]
  }
];
