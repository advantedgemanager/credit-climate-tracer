
export interface DataRequirement {
  description: string;
  dataPoints: string[];
}

export interface TransmissionChannel {
  id: string;
  description: string;
  quantifiedImpact: string;
  pdDriver: string;
  dataRequirement: DataRequirement;
}

export interface RiskDependency {
  id: string;
  title: string;
  description: string;
  tfmMetric: string;
  transmissionChannels: TransmissionChannel[];
}

export interface RiskSubcategory {
  id: string;
  title: string;
  dependencies: RiskDependency[];
}

export interface RiskCategory {
  id: string;
  title: string;
  subcategories: RiskSubcategory[];
}

export interface MaterialityDecision {
  dependencyId: string;
  selected: boolean;
  rationale: string;
  approvedBy: string;
  timestamp: Date;
}

// Legacy interfaces for backward compatibility
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

// New Hierarchical Risk Taxonomy Structure
export const HIERARCHICAL_RISK_TAXONOMY: RiskCategory[] = [
  {
    id: "regulatory-misalignment",
    title: "Regulatory Misalignment",
    subcategories: [
      {
        id: "subsidy-dependency",
        title: "Client reliance on subsidies or tax credits for survival",
        dependencies: [
          {
            id: "loss-of-eligibility",
            title: "Loss of eligibility for tax credits or subsidies due to environmental non-compliance",
            description: "Client loses access to government subsidies or tax credits due to failure to meet environmental compliance requirements, leading to direct financial impact and reduced competitiveness.",
            tfmMetric: "Exposure of client to national subsidies or tax credits",
            transmissionChannels: [
              {
                id: "revenue-contraction",
                description: "Revenue contraction due to lost green offer",
                quantifiedImpact: "Lower turnover",
                pdDriver: "Impacts revenue growth and volatility",
                dataRequirement: {
                  description: "Revenue impact from loss of green product offerings",
                  dataPoints: ["Current period total turnover", "Prior period total turnover", "ESG revenue segment"]
                }
              },
              {
                id: "margin-compression",
                description: "Margin compression from commoditization",
                quantifiedImpact: "Decreased gross margin and contribution margin",
                pdDriver: "Impacts EBITDA margin and lowers cash flow resilience",
                dataRequirement: {
                  description: "Profitability metrics showing margin deterioration",
                  dataPoints: ["Gross margin or EBITDA margin"]
                }
              },
              {
                id: "pricing-power-loss",
                description: "Loss of product pricing power",
                quantifiedImpact: "Lower contribution per unit",
                pdDriver: "Impacts the ROA and the operational leverage",
                dataRequirement: {
                  description: "Unit economics and pricing power metrics",
                  dataPoints: ["Contribution margin per unit (selling price - variable cost)"]
                }
              },
              {
                id: "green-procurement-drop",
                description: "Drop in green procurement eligibility",
                quantifiedImpact: "Decrease in qualified revenue streams and increase in volatility",
                pdDriver: "Impacts revenue stability and earnings volatility",
                dataRequirement: {
                  description: "Green revenue segment analysis",
                  dataPoints: ["Revenue from green buyers or compliant products", "Total revenue for normalization"]
                }
              },
              {
                id: "npv-decline",
                description: "NPV decline of core business unit",
                quantifiedImpact: "Decreases future profitability and value erosion",
                pdDriver: "Impacts discounted cash flows",
                dataRequirement: {
                  description: "Business unit valuation changes over time",
                  dataPoints: ["NPV of forecasted FCF of key business segments (in two different times)"]
                }
              },
              {
                id: "asset-stranding",
                description: "Strategic asset stranding risk",
                quantifiedImpact: "Decrease book-to-market ratio and increases impairments",
                pdDriver: "Impacts asset quality which impacts PD and LGD",
                dataRequirement: {
                  description: "Asset impairment and stranding metrics",
                  dataPoints: ["Impaired asset value", "Total fixed assets"]
                }
              },
              {
                id: "esg-customer-loss",
                description: "Loss of ESG-sensitive clients",
                quantifiedImpact: "Decrease in customer diversification and loss of key accounts",
                pdDriver: "Impacts customer concentration which impacts PD",
                dataRequirement: {
                  description: "Customer concentration and ESG-sensitive revenue analysis",
                  dataPoints: ["Lost revenue from top 5 ESG buyers", "Total revenue"]
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

// Legacy taxonomy for backward compatibility
export const EMBEDDED_RISK_TAXONOMY: TaxonomyNode[] = [
  {
    pathId: "PATH_001",
    dependency: "Client reliance on subsidies or tax credits for survival",
    impact: "Direct financial shortfall in transition CAPEX funding, Higher cost of capital and leverage pressure, delayed transition readiness, reduced competitiveness against subsidized peers, loss of green product labelling and customer preference, missed access to blended finance structures, legal and reputational exposure",
    transitionRisk: "Business model risk, technology obsolescence risk, policy and regulatory risk, market risk, credit risk deterioration, reputational and stakeholder risk, strategic planning risk, liquidity and refinancing risk",
    transmissionChannel: "Revenue contraction due to lost green offer → Lower turnover → Impacts revenue growth and volatility. Margin compression from commoditization → decreased gross margin and contribution margin → impacts EBITDA margin and lowers cash flow resilience. Loss of product pricing power → lower contribution per unit → impacts the ROA and the operational leverage. Drop in green procurement eligibility → decrease in qualified revenue streams and increase in volatility → impacts revenue stability and earnings volatility. Loss of ESG-sensitive customers → decrease in customer diversification and loss of key accounts → impacts customer concentration which impacts PD. Strategic asset stranding → decrease book-to-market ratio and increases impairments → impacts asset quality which impacts PD and LGD. Lower NPV of business unit → decreases future profitability and value erosion → impacts discounted cashflows",
    financialEffect: "Loss of eligibility for tax credits or subsidies due to environmental non-compliance",
    creditRisk: "PD deterioration through multiple transmission channels affecting revenue stability, margin compression, asset quality, and cash flow resilience",
    KPIs: ["Revenue growth and volatility", "EBITDA margin", "ROA", "Operational leverage", "Customer concentration ratio", "Asset quality metrics", "Book-to-market ratio", "Discounted cash flows"]
  }
];
