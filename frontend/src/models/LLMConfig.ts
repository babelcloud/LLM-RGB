export default class LLMConfig {
  remark: string;
  apiKey?: string | null;
  temperature?: number | null;
  max_new_tokens?: number | null;
  groupId?: string | null;
  maxOutputTokens?: number | null;
  secretKey?: string | null;
  id?: string | null;
  url?: string | null;
  config?: string | null;
  created: number;

  constructor(
    apiKey?: string,
    temperature?: number,
    max_new_tokens?: number,
    groupId?: string,
    maxOutputTokens?: number,
    secretKey?: string,
    id?: string,
    url?: string,
    config?: string,
    remark: string = '',
  ) {
    this.remark = remark;
    this.apiKey = apiKey;
    this.temperature = temperature;
    this.max_new_tokens = max_new_tokens;
    this.groupId = groupId;
    this.maxOutputTokens = maxOutputTokens;
    this.secretKey = secretKey;
    this.id = id;
    this.url = url;
    this.config = config;
    this.created = Date.now();
  }
}
