import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, reportInputData, prompt } = await req.json();
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

    if (!mistralApiKey) {
      throw new Error('MISTRAL_API_KEY not configured');
    }

    let analysisPrompt = '';

    if (type === 'generateReport') {
      // Generate comprehensive report from materiality assessment data
      analysisPrompt = `You are a Chief Risk Officer creating a comprehensive ESG-to-Credit Risk Assessment Report.

MATERIALITY ASSESSMENT DATA:
${JSON.stringify(reportInputData, null, 2)}

Generate a detailed HTML-formatted report that includes:

1. **Executive Summary** - Key findings about material ESG risks and their credit implications
2. **Risk Pathway Analysis** - Detailed analysis of each identified risk pathway and transmission channels
3. **PD Adjustment Framework** - Specific data points and KPIs needed for probability of default adjustments
4. **Implementation Roadmap** - Step-by-step guidance for integrating these risks into credit decisions
5. **Monitoring Dashboard** - Key metrics and indicators to track ongoing risk exposure

Focus on actionable insights that help the CRO understand exactly how these ESG risks impact credit decisions and what concrete steps are needed.

Format the response in clean HTML with proper headings, lists, and structure. Use professional language suitable for C-suite executives.`;

    } else if (type === 'generateClientAnalysis') {
      // Use the provided prompt for client-specific analysis
      analysisPrompt = prompt;
    } else {
      throw new Error('Invalid request type. Must be "generateReport" or "generateClientAnalysis"');
    }

    console.log('Sending request to Mistral API...');

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Chief Risk Officer with deep knowledge of ESG risks, credit risk assessment, and financial analysis. Provide detailed, actionable insights.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API error:', errorText);
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Successfully generated analysis');

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in mistral-analysis function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate analysis' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});