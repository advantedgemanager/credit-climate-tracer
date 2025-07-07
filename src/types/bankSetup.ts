export interface ClientData {
  clientName: string;
  naceCode: string;
  financialStatements: File | null;
  climateReports: File | null;
}

export interface MaterialityDecision {
  dependencyId: string;
  selected: boolean;
  rationale: string;
  approvedBy: string;
  timestamp: Date;
}

export interface ExpandedState {
  [key: string]: boolean;
}