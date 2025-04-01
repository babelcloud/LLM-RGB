interface CallApiContextParams {
  vars: Record<string, string | object>;
  prompt: string;
  originalProvider?: ApiProvider;
  logger?: any;
}

interface CallApiOptionsParams {
  includeLogProbs?: boolean;
}

interface ProviderResponse {
  cached?: boolean;
  cost?: number;
  error?: string;
  logProbs?: number[];
  metadata?: Record<string, any>;
  output?: string | any;
  tokenUsage?: {
    total: number;
    prompt: number;
    completion: number;
  };
}

interface ApiProvider {
  id: () => string;
  callApi: (
    prompt: string,
    context?: CallApiContextParams,
    options?: CallApiOptionsParams
  ) => Promise<ProviderResponse>;
}

class HyperbolicProvider implements ApiProvider {
  private providerId: string;
  private config: Record<string, any>;
  private baseUrl: string;

  constructor(options: { id?: string; config: Record<string, any> }) {
    this.providerId = options.id || 'hyperbolic';
    this.config = options.config;
    this.baseUrl = 'https://api.hyperbolic.xyz/v1';
    
    if (!this.config.apiKey) {
      throw new Error("API key should be provided to invoke the endpoint");
    }
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt: string, context?: CallApiContextParams, options?: CallApiOptionsParams): Promise<ProviderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'deepseek-ai/DeepSeek-V3-0324',
          messages: [{ role: 'user', content: prompt }],
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.choices?.[0]?.message?.content) {
        throw new Error('Unexpected response structure from Hyperbolic API');
      }

      return {
        output: json.choices[0].message.content,
        tokenUsage: {
          total: json.usage?.total_tokens || 0,
          prompt: json.usage?.prompt_tokens || 0,
          completion: json.usage?.completion_tokens || 0,
        },
        metadata: {
          model: json.model
        }
      };
    } catch (error: any) {
      console.error("An error occurred:", error);
      return { 
        error,
        metadata: { rawError: error }
      };
    }
  }
}

export default HyperbolicProvider;
