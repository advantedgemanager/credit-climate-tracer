
import { supabase } from "@/integrations/supabase/client";

export class MistralService {
  static async generateReport(reportInputData: any): Promise<string> {
    const response = await supabase.functions.invoke('mistral-analysis', {
      body: {
        type: 'generateReport',
        reportInputData
      }
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to generate report');
    }

    return response.data.content;
  }

  static async generateClientAnalysis(prompt: string): Promise<string> {
    const response = await supabase.functions.invoke('mistral-analysis', {
      body: {
        type: 'generateClientAnalysis',
        prompt
      }
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to generate client analysis');
    }

    return response.data.content;
  }
}
