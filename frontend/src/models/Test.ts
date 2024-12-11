import TestCase from "./TestCase";
import LLM from "./LLM";

export default class Test {
  name: string;
  testcases: TestCase[];
  llms: LLM[];

  constructor(name: string, testcases: TestCase[], llms: LLM[]) {
    this.name = name;
    this.testcases = testcases;
    this.llms = llms;
  }
}
