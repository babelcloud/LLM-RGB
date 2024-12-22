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

interface DoubaoResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

class DoubaoProProvider implements ApiProvider {
  private providerId: string;
  private config: Record<string, any>;

  constructor(options: { id?: string; config: Record<string, any> }) {
    this.providerId = options.id || 'doubao-pro-provider';
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt: string, context?: CallApiContextParams, options?: CallApiOptionsParams): Promise<ProviderResponse> {
    const apiKey = this.config.apiKey;
    const endpoint = this.config.endpoint;
    const model = this.config.model || 'ep-20241221210216-tsmzn';

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const data = {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json() as DoubaoResponse;
      return {
        output: result.choices[0].message.content,
        tokenUsage: {
          total: result.usage.total_tokens,
          prompt: result.usage.prompt_tokens,
          completion: result.usage.completion_tokens,
        },
      };
    } catch (error: any) {
      console.error(`An error occurred: ${error}`);
      return { error: error.message };
    }
  }
}

export default DoubaoProProvider;