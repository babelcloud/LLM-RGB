import fetch from 'node-fetch';

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
  tokenUsage?: { total: number; prompt: number; completion: number };
}

interface ApiProvider {
  id: () => string;
  callApi: (
    prompt: string,
    context?: CallApiContextParams,
    options?: CallApiOptionsParams
  ) => Promise<ProviderResponse>;
}

interface ApiResponse {
  choices: Array<{ message: { content: string } }>;
  usage: { total_tokens: number; prompt_tokens: number; completion_tokens: number };
}

class GLM4PlusProvider implements ApiProvider {
  private providerId: string;
  private apiKey: string;

  constructor(options: { id?: string; config: { apiKey: string; } }) {
    this.providerId = options.id || 'glm-4-plus';
    this.apiKey = options.config.apiKey;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt: string): Promise<ProviderResponse> {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: [{ role: 'user', content: prompt }]
      }),
    });

    if (!response.ok) {
      return { error: `Error: ${response.statusText}` };
    }

    const data = await response.json() as ApiResponse;
    return {
      output: data.choices[0].message.content,
      tokenUsage: {
        total: data.usage.total_tokens,
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
      },
    };
  }
}

export default GLM4PlusProvider;