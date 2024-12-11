import LLMConfig from "./LLMConfig";
export default class LLM {
    key;
    id;
    name;
    icon;
    note = "";
    config;
    constructor(key, id, name, icon, settings, note) {
        this.key = key;
        this.id = id;
        this.name = name;
        this.icon = icon;
        if (settings === undefined) {
            this.config = new LLMConfig();
        }
        else {
            this.config = settings;
        }
        if (note !== undefined) {
            this.note = note;
        }
    }
}
