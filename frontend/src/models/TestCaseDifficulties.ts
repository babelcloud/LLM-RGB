export default class TestCaseDifficulties {
    context_length: number;
    reasoning_depth: number;
    instruction_compliance: number;

    constructor(context_length: number, reasoning_depth: number, instruction_compliance: number) {
        this.context_length = context_length;
        this.reasoning_depth = reasoning_depth;
        this.instruction_compliance = instruction_compliance;
    }
}
