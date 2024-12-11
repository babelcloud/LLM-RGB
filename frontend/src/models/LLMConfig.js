export default class LLMConfig {
    remark;
    apiKey;
    temperature;
    max_new_tokens;
    groupId;
    maxOutputTokens;
    secretKey;
    secret_id;
    secret_key;
    app_id;
    id;
    url;
    config;
    created;
    constructor(apiKey, temperature, max_new_tokens, groupId, maxOutputTokens, secretKey, secret_id, secret_key, app_id, id, url, config, remark = "") {
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
