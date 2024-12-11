import { TestCaseAssert } from "@models/TestCaseAssert";

export default class TestCase {
  name: string;
  description: string = "";
  threshold: number;
  contextLength: number;
  reasoningDepth: number;
  instructionCompliance: number;
  prompt: string = "";
  asserts: TestCaseAssert[] = [];
  readonly: boolean = false;
  created: string;

  constructor(
    name: string,
    threshold: number,
    contextLength: number,
    reasoningDepth: number,
    instructionCompliance: number,
    description?: string,
    prompt?: string,
    asserts?: TestCaseAssert[],
  ) {
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
