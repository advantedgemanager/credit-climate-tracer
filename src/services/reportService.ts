import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Report = Tables<'reports'>;

export type CreateReportData = {
  title: string;
  client_name: string;
  nace_code?: string;
  report_type: 'materiality_assessment' | 'client_analysis';
  content: string;
  metadata?: any;
  material_issues?: number;
  risk_pathways?: number;
  kpis?: number;
  risk_score?: 'Low' | 'Medium' | 'High';
};

export class ReportService {
  static async saveReport(reportData: CreateReportData): Promise<Report> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        ...reportData,
        user_id: user.id,
        metadata: reportData.metadata || {},
        material_issues: reportData.material_issues || 0,
        risk_pathways: reportData.risk_pathways || 0,
        kpis: reportData.kpis || 0
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save report: ${error.message}`);
    }

    return data;
  }

  static async getReports(filters?: {
    searchTerm?: string;
    reportType?: string;
  }): Promise<Report[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filters?.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,client_name.ilike.%${filters.searchTerm}%`);
    }

    if (filters?.reportType && filters.reportType !== 'all') {
      query = query.eq('report_type', filters.reportType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }

    return data || [];
  }

  static async getReport(id: string): Promise<Report | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Report not found
      }
      throw new Error(`Failed to fetch report: ${error.message}`);
    }

    return data;
  }

  static async deleteReport(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }

  static async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update report: ${error.message}`);
    }

    return data;
  }
}