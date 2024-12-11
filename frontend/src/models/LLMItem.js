export default class LLMItem {
    type;
    value;
    llm;
    constructor(type, value, llm) {
        this.type = type;
        this.value = value;
        this.llm = llm;
    }
}
