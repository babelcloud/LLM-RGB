export default class TestResultStats {
    llms;
    max_total_score;
    max_context_length;
    max_reasoning_depth;
    max_instruction_compliance;
    startTime;
    endTime;
    testcases;
    constructor(llms, max_total_score, max_context_length, max_reasoning_depth, max_instruction_compliance, startTime, endTime, testcases) {
        this.llms = llms;
        this.max_total_score = max_total_score;
        this.max_context_length = max_context_length;
        this.max_reasoning_depth = max_reasoning_depth;
        this.max_instruction_compliance = max_instruction_compliance;
        this.startTime = startTime;
        this.endTime = endTime;
        this.testcases = testcases;
    }
}
