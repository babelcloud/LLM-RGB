import LLM from "./LLM";

export default class LLMItem {
  type: string;
  value: string;
  llm: LLM;

  constructor(type: string, value: string, llm: LLM) {
    this.type = type;
    this.value = value;
    this.llm = llm;
  }
}
