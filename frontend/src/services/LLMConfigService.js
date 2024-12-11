import store from "store2";
export class LLMConfigService {
    LLM_CONFIG_PREFIX_KEY = "LLM-CONFIG:";
    get(llm) {
        const configs = store.get(this.key(llm));
        if (!configs) {
            return [];
        }
        return configs;
    }
    add(llm, config) {
        const configs = this.get(llm);
        configs.push(config);
        this.save(llm, configs);
    }
    delete(llm, config) {
        const configs = this.get(llm);
        const newConfigs = configs.filter((item) => item.created !== config.created);
        this.save(llm, newConfigs);
    }
    save(llm, configs) {
        store.set(this.key(llm), configs);
    }
    key(llm) {
        return this.LLM_CONFIG_PREFIX_KEY + llm;
    }
}
export function maskKey(key) {
    return `${key.slice(0, 8)}******${key.slice(-5)}`;
}
