import TestCaseDifficulties from './TestCaseDifficulties';

export default class TestResultStats {
  llms: string[] | undefined;
  max_total_score: number | undefined;
  max_context_length: number | undefined;
  max_reasoning_depth: number | undefined;
  max_instruction_compliance: number | undefined;
  startTime: number | undefined;
  endTime: number | undefined;
  testcases: TestCaseDifficulties[] | undefined;

  constructor(
    llms?: string[],
    max_total_score?: number,
    max_context_length?: number,
    max_reasoning_depth?: number,
    max_instruction_compliance?: number,
    startTime?: number,
    endTime?: number,
    testcases?: TestCaseDifficulties[],
  ) {
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
