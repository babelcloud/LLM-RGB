export default class LLMConfig {
  remark: string;
  apiKey?: string | null;
  temperature?: number | null;
  max_new_tokens?: number | null;
  groupId?: string | null;
  maxOutputTokens?: number | null;
  secretKey?: string | null;
  secret_id?: string | null;
  secret_key?: string | null;
  app_id?: string | null;
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
    secret_id?: string,
    secret_key?: string,
    app_id?: string,
    id?: string,
    url?: string,
    config?: string,
    remark: string = "",
  ) {
    this.remark = remark;
    this.apiKey = apiKey;
    this.temperature = temperature;
    this.max_new_tokens = max_new_tokens;
    this.groupId = groupId;
    this.maxOutputTokens = maxOutputTokens;
    this.secretKey = secretKey;
    this.secret_id = secret_id;
    this.secret_key = secret_key;
    this.app_id = app_id;
    this.id = id;
    this.url = url;
    this.config = config;
    this.created = Date.now();
  }
}
