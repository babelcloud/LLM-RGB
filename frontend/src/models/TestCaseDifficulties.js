export default class TestCaseDifficulties {
    context_length;
    reasoning_depth;
    instruction_compliance;
    constructor(context_length, reasoning_depth, instruction_compliance) {
        this.context_length = context_length;
        this.reasoning_depth = reasoning_depth;
        this.instruction_compliance = instruction_compliance;
    }
}
