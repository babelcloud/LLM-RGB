import { cloneDeep } from "lodash";
import TestCase from "./TestCase";
import LLM from "./LLM";

export class TestRun {
  name: string;
  testCaseList: TestCase[] = [];
  llmList: LLM[] = [];
  reportId: string | null = null;
  duration: number = 0;

  constructor(name: string, testCaseList?: TestCase[], llmList?: LLM[]) {
    this.name = name;
    if (testCaseList) {
      this.testCaseList = testCaseList;
    }
    if (llmList) {
      this.llmList = llmList;
    }
  }

  public getTestCaseList(): TestCase[] {
    return this.testCaseList;
  }

  public setTestCaseList(testCaseList: TestCase[]): void {
    this.testCaseList = testCaseList;
  }

  public getLlmList(): LLM[] {
    return this.llmList;
  }

  public setLlmList(llmList: LLM[]): void {
    this.llmList = llmList;
  }

  public setReportId(reportId: string): void {
    this.reportId = reportId;
  }

  public finished(): boolean {
    return this.reportId !== null;
  }

  public duplicate(name: string): TestRun {
    return new TestRun(
      name,
      cloneDeep(this.testCaseList),
      cloneDeep(this.llmList),
    );
  }

  private nextSeriesName(): string {
    let nextNumber = 1;
    const matches = this.name.match("[0-9]+");
    if (matches && matches.length > 0) {
      nextNumber = Number.parseInt(matches[0], 10) + 1;
    }
    return `Test ${nextNumber}`;
  }
}
