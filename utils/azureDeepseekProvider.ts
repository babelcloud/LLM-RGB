import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

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

class AzureDeepseekProvider implements ApiProvider {
  private providerId: string;
  private config: Record<string, any>;
  private client: any;

  constructor(options: { id?: string; config: Record<string, any> }) {
    this.providerId = options.id || 'azure-deepseek';
    this.config = options.config;
    
    if (!this.config.apiKey) {
      throw new Error("API key should be provided to invoke the endpoint");
    }

    if (!this.config.endpoint) {
      throw new Error("Endpoint should be provided to invoke the endpoint");
    }

    this.client = ModelClient(
      this.config.endpoint,
      new AzureKeyCredential(this.config.apiKey)
    );
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt: string, context?: CallApiContextParams, options?: CallApiOptionsParams): Promise<ProviderResponse> {
    try {
      const response = await this.client.path("/chat/completions").post({
        body: {
          messages: [{ role: "user", content: prompt }],
         // "max_tokens": this.config.max_tokens || 4096
        },
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      if (!response.body?.choices?.[0]?.message?.content) {
        throw new Error('Unexpected response structure from Azure API');
      }

      const azure_deepseek_pattern = /<think>\s*([\s\S]*?)\s*<\/think>\n+([\s\S]*)/;
      const content = response.body.choices[0].message.content;
      const match = content.match(azure_deepseek_pattern);
      const output = match ? match[2] : content;

      return {
        output,
        tokenUsage: {
          total: response.body.usage?.total_tokens || 0,
          prompt: response.body.usage?.prompt_tokens || 0,
          completion: response.body.usage?.completion_tokens || 0,
        },
        metadata: {
          model: response.body.model
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

export default AzureDeepseekProvider;