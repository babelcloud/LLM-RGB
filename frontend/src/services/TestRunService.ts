import store from 'store2';
import { TestRun } from '@models/TestRun';

export class TestRunService {
  private readonly TEST_RUN_LIST_KEY = 'TEST-RUN-LIST';
  private readonly TEST_RUN_INDEX_KEY = 'TEST-RUN-INDEX';

  private testRunList: TestRun[];
  private testRunIndex: number;

  constructor() {
    this.testRunList = store.get(this.TEST_RUN_LIST_KEY);
    if (!this.testRunList) {
      this.testRunList = [];
    } else {
      this.testRunList = this.testRunList.map((t) => {
        const result = Object.create(TestRun.prototype);
        Object.assign(result, t);
        return result;
      });
    }
    this.testRunIndex = store.get(this.TEST_RUN_INDEX_KEY);
    if (!this.testRunIndex) {
      this.testRunIndex = 1;
      this.saveIndex();
    }
    if (this.testRunList.length < 1) {
      this.testRunList.push(this.new());
      this.save();
    }
  }

  public listNames(): string[] {
    const result: string[] = [];
    this.testRunList.map((testRun) => result.push(testRun.name));
    return result;
  }

  public getByName(name: string): TestRun | undefined {
    return this.testRunList.find((testRun) => testRun.name === name);
  }

  public getByReportId(reportId: string): TestRun | undefined {
    return this.testRunList.find((testRun) => testRun.reportId === reportId);
  }

  public add(testRun: TestRun): void {
    this.testRunList.push(testRun);
    this.save();
  }

  public update(source: TestRun): void {
    this.testRunList = this.testRunList.map((target) =>
      target.name === source.name ? source : target
    );
    this.save();
  }

  public new(): TestRun {
    const index = this.getNextIndex();
    return new TestRun(`Test ${index}`);
  }

  public duplicate(name: string): TestRun | undefined {
    const index = this.getNextIndex();
    const sourceTestRun = this.getByName(name);
    if (sourceTestRun) {
      const targetTestRun = sourceTestRun.duplicate(`Test ${index}`);
      this.testRunList.push(targetTestRun);
      this.save();
      return targetTestRun;
    }
    return undefined;
  }

  public delete(name: string): void {
    this.testRunList = this.testRunList.filter((testRun) => testRun.name !== name);
    this.save();
  }

  private getNextIndex(): number {
    this.testRunIndex += 1;
    this.saveIndex();
    return this.testRunIndex;
  }

  private save(): void {
    store.set(this.TEST_RUN_LIST_KEY, this.testRunList);
  }

  private saveIndex(): void {
    store.set(this.TEST_RUN_INDEX_KEY, this.testRunIndex);
  }
}
