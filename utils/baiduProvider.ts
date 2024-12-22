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
  tokenUsage?: { total: number; prompt: number; completion: number; };
}

interface ApiProvider {
  id: () => string;
  callApi: (prompt: string, context?: CallApiContextParams, options?: CallApiOptionsParams) => Promise<ProviderResponse>;
}

class BaiduProvider implements ApiProvider {
  private providerId: string;
  private apiKey: string;
  private secretKey: string;

  constructor(options: { id?: string; config: { apiKey: string; secretKey: string; } }) {
    this.providerId = options.id || 'baidu-provider';
    this.apiKey = options.config.apiKey;
    this.secretKey = options.config.secretKey;
  }

  id() {
    return this.providerId;
  }

  async getAccessToken(): Promise<string> {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data.access_token;
    } else {
      throw new Error(`Failed to get access token: ${data.error_description}`);
    }
  }

  async callApi(prompt: string, context?: CallApiContextParams, options?: CallApiOptionsParams): Promise<ProviderResponse> {
    const accessToken = await this.getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0-turbo-128k?access_token=${accessToken}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ messages: [{ role: 'user', content: prompt }] });
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();
    if (response.ok) {
      if (data.error_code) {
        return {
          error: data.error_msg
        };
      }
      return {
        output: data.result,
        tokenUsage: { total: data.usage.total_tokens, prompt: data.usage.prompt_tokens, completion: data.usage.completion_tokens }
      };
    } else {
      //throw new Error(`Failed to call ERNIE model: ${data.error_description}`);
      return {
        error: data
      };
    }
  }
}

export default BaiduProvider;