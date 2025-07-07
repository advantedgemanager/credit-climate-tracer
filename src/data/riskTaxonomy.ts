
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
    dependency: "Client reliance on subsidies or tax credits for survival",
    impact: "Direct financial shortfall in transition CAPEX funding, Higher cost of capital and leverage pressure, delayed transition readiness, reduced competitiveness against subsidized peers, loss of green product labelling and customer preference, missed access to blended finance structures, legal and reputational exposure",
    transitionRisk: "Business model risk, technology obsolescence risk, policy and regulatory risk, market risk, credit risk deterioration, reputational and stakeholder risk, strategic planning risk, liquidity and refinancing risk",
    transmissionChannel: "Revenue contraction due to lost green offer → Lower turnover → Impacts revenue growth and volatility. Margin compression from commoditization → decreased gross margin and contribution margin → impacts EBITDA margin and lowers cash flow resilience. Loss of product pricing power → lower contribution per unit → impacts the ROA and the operational leverage. Drop in green procurement eligibility → decrease in qualified revenue streams and increase in volatility → impacts revenue stability and earnings volatility. Loss of ESG-sensitive customers → decrease in customer diversification and loss of key accounts → impacts customer concentration which impacts PD. Strategic asset stranding → decrease book-to-market ratio and increases impairments → impacts asset quality which impacts PD and LGD. Lower NPV of business unit → decreases future profitability and value erosion → impacts discounted cashflows",
    financialEffect: "Loss of eligibility for tax credits or subsidies due to environmental non-compliance",
    creditRisk: "PD deterioration through multiple transmission channels affecting revenue stability, margin compression, asset quality, and cash flow resilience",
    KPIs: ["Revenue growth and volatility", "EBITDA margin", "ROA", "Operational leverage", "Customer concentration ratio", "Asset quality metrics", "Book-to-market ratio", "Discounted cash flows"]
  }
];
