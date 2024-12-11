export default class TestCase {
    name;
    description = "";
    threshold;
    contextLength;
    reasoningDepth;
    instructionCompliance;
    prompt = "";
    asserts = [];
    readonly = false;
    created;
    constructor(name, threshold, contextLength, reasoningDepth, instructionCompliance, description, prompt, asserts) {
        this.name = name;
        this.threshold = threshold;
        this.contextLength = contextLength;
        this.reasoningDepth = reasoningDepth;
        this.instructionCompliance = instructionCompliance;
        if (description !== undefined) {
            this.description = description;
        }
        if (prompt !== undefined) {
            this.prompt = prompt;
        }
        if (asserts !== undefined) {
            this.asserts = asserts;
        }
        this.created =
            Date.now().toString(10) + Math.random().toString(10).substring(2);
    }
}
