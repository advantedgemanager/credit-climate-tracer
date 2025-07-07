
interface MistralMessage {
  role: 'system' | 'user';
  content: string;
}

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MistralService {
  private static readonly API_URL = 'https://api.mistral.ai/v1/chat/completions';
  
  static async generateReport(reportInputData: any, apiKey: string): Promise<string> {
    const systemPrompt = `You are a sustainability risk expert helping a bank's Chief Risk Officer integrate ESG risks into credit risk.

Based on the following input data, write a clear, professional, and structured report. The goal is to show how ESG materiality heatpoints identified by the bank translate into credit risks through specific transition risk pathways.

For each heatpoint:
1. Briefly describe the materiality concern.
2. Show the risk pathway from dependency to credit risk.
3. List the KPIs the CRO should monitor.
4. Provide a practical recommendation.

Return the response as clean HTML that can be displayed directly in a web browser. Use proper HTML structure with headings, lists, and sections.`;

    const userPrompt = `Input Data:
${JSON.stringify(reportInputData, null, 2)}

Please generate a comprehensive ESG-to-Credit Risk Report following the structure:

For each materiality heatpoint, include:
- **Materiality Heatpoint**: [name]
- **Matched Level**: [dependency/impact]
- **Transition Risk Pathway**: Full pathway with all 6 levels
- **KPIs to Monitor**: Bullet list
- **CRO Recommendation**: Practical advice

Format the output as clean HTML.`;

    const messages: MistralMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: messages,
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `Mistral API error: ${response.status}`);
    }

    const data: MistralResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from Mistral API');
    }

    return data.choices[0].message.content;
  }

  static async generateClientAnalysis(prompt: string, apiKey: string): Promise<string> {
    const messages: MistralMessage[] = [
      { role: 'user', content: prompt }
    ];

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: messages,
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `Mistral API error: ${response.status}`);
    }

    const data: MistralResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from Mistral API');
    }

    return data.choices[0].message.content;
  }
}
