import LLMConfig from "./LLMConfig";

export default class LLM {
  key: string;
  id: string;
  name: string;
  icon: string;
  note: string = "";
  config: LLMConfig;

  constructor(
    key: string,
    id: string,
    name: string,
    icon: string,
    settings?: LLMConfig,
    note?: string,
  ) {
    this.key = key;
    this.id = id;
    this.name = name;
    this.icon = icon;
    if (settings === undefined) {
      this.config = new LLMConfig();
    } else {
      this.config = settings;
    }
    if (note !== undefined) {
      this.note = note;
    }
  }
}
