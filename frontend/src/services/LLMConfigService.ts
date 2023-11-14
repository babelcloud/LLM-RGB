import store from 'store2';
import LLMConfig from '@models/LLMConfig';

export class LLMConfigService {
  private readonly LLM_CONFIG_PREFIX_KEY = 'LLM-CONFIG:';

  public get(llm: string): LLMConfig[] {
    const configs: LLMConfig[] = store.get(this.key(llm));
    if (!configs) {
      return [];
    }
    return configs;
  }

  public add(llm: string, config: LLMConfig): void {
    const configs = this.get(llm);
    configs.push(config);
    this.save(llm, configs);
  }

  public delete(llm: string, config: LLMConfig): void {
    const configs = this.get(llm);
    const newConfigs = configs.filter((item) => item.created !== config.created);
    this.save(llm, newConfigs);
  }

  private save(llm: string, configs: LLMConfig[]): void {
    store.set(this.key(llm), configs);
  }

  private key(llm: string): string {
    return this.LLM_CONFIG_PREFIX_KEY + llm;
  }
}

export function maskKey(key: string): string {
  return `${key.slice(0, 8)}******${key.slice(-5)}`;
}
