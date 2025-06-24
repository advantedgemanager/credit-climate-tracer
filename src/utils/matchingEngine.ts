
import { EMBEDDED_RISK_TAXONOMY, type MaterialityEntry, type MatchedRiskPath, type ReportInputData } from '@/data/riskTaxonomy';

export class MatchingEngine {
  /**
   * Parse materiality assessment file content
   */
  static async parseMaterialityFile(file: File): Promise<MaterialityEntry[]> {
    const content = await file.text();
    
    if (file.name.toLowerCase().endsWith('.json')) {
      return JSON.parse(content);
    } else if (file.name.toLowerCase().endsWith('.csv')) {
      return this.parseCSV(content);
    }
    
    throw new Error('Unsupported file format. Please use JSON or CSV.');
  }

  /**
   * Parse CSV content to MaterialityEntry array
   */
  private static parseCSV(content: string): MaterialityEntry[] {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const entry: MaterialityEntry = {
        materialityHeatpoint: ''
      };
      
      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case 'materialityheatpoint':
          case 'materiality_heatpoint':
          case 'heatpoint':
            entry.materialityHeatpoint = value;
            break;
          case 'dependency':
            entry.dependency = value;
            break;
          case 'impact':
            entry.impact = value;
            break;
          case 'severityscore':
          case 'severity_score':
          case 'severity':
            entry.severityScore = parseFloat(value);
            break;
          case 'clientid':
          case 'client_id':
            entry.clientId = value;
            break;
          case 'sector':
            entry.sector = value;
            break;
        }
      });
      
      return entry;
    });
  }

  /**
   * Match materiality entries to taxonomy paths
   */
  static matchMaterialityToTaxonomy(materialityEntries: MaterialityEntry[]): ReportInputData {
    const matchedPaths: MatchedRiskPath[] = [];

    materialityEntries.forEach(entry => {
      // Try to match at dependency level
      if (entry.dependency) {
        const dependencyMatches = this.findTaxonomyMatches('dependency', entry.dependency);
        dependencyMatches.forEach(match => {
          matchedPaths.push({
            materialityHeatpoint: entry.materialityHeatpoint,
            matchedLevel: 'dependency',
            fullPath: {
              dependency: match.dependency,
              impact: match.impact,
              transitionRisk: match.transitionRisk,
              transmissionChannel: match.transmissionChannel,
              financialEffect: match.financialEffect,
              creditRisk: match.creditRisk
            },
            KPIs: match.KPIs,
            pathId: match.pathId
          });
        });
      }

      // Try to match at impact level
      if (entry.impact) {
        const impactMatches = this.findTaxonomyMatches('impact', entry.impact);
        impactMatches.forEach(match => {
          matchedPaths.push({
            materialityHeatpoint: entry.materialityHeatpoint,
            matchedLevel: 'impact',
            fullPath: {
              dependency: match.dependency,
              impact: match.impact,
              transitionRisk: match.transitionRisk,
              transmissionChannel: match.transmissionChannel,
              financialEffect: match.financialEffect,
              creditRisk: match.creditRisk
            },
            KPIs: match.KPIs,
            pathId: match.pathId
          });
        });
      }
    });

    return { reportInputData: matchedPaths };
  }

  /**
   * Find taxonomy matches using fuzzy string matching
   */
  private static findTaxonomyMatches(level: 'dependency' | 'impact', searchTerm: string) {
    return EMBEDDED_RISK_TAXONOMY.filter(path => {
      const targetValue = path[level].toLowerCase();
      const searchValue = searchTerm.toLowerCase();
      
      // Exact match
      if (targetValue === searchValue) return true;
      
      // Partial match (contains)
      if (targetValue.includes(searchValue) || searchValue.includes(targetValue)) return true;
      
      // Keyword overlap
      const targetKeywords = targetValue.split(/\s+/);
      const searchKeywords = searchValue.split(/\s+/);
      const overlap = targetKeywords.filter(word => 
        searchKeywords.some(searchWord => 
          word.includes(searchWord) || searchWord.includes(word)
        )
      );
      
      return overlap.length >= Math.min(2, Math.min(targetKeywords.length, searchKeywords.length));
    });
  }

  /**
   * Generate summary statistics from matched data
   */
  static generateMatchingSummary(reportData: ReportInputData) {
    const matches = reportData.reportInputData;
    
    return {
      totalMatches: matches.length,
      uniqueMaterialityIssues: new Set(matches.map(m => m.materialityHeatpoint)).size,
      dependencyMatches: matches.filter(m => m.matchedLevel === 'dependency').length,
      impactMatches: matches.filter(m => m.matchedLevel === 'impact').length,
      uniqueRiskPaths: new Set(matches.map(m => m.pathId)).size,
      totalKPIs: matches.reduce((acc, m) => acc + m.KPIs.length, 0)
    };
  }
}
