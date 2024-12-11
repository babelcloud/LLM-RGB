import store from 'store2';
import YAML from 'yaml';
import TestCase from '@models/TestCase';
import { AssertMap, ConfigMap, PromptMap } from '@TestCaseData';
import { TestCaseAssert } from '@models/TestCaseAssert';

class TestCaseService {
  private readonly NAMESPACE = 'test.case';
  private readonly store;
  private readonly defaultList: TestCase[];

  constructor() {
    this.store = store.namespace(this.NAMESPACE);
    this.defaultList = this.getDefault();
  }

  public list(): TestCase[] {
    const items = this.store.getAll() ?? [];
    const customList = Object.keys(items).map((key: any) => {
      const result = Object.create(TestCase.prototype);
      Object.assign(result, items[key]);
      return result;
    });
    return [
      ...this.defaultList,
      ...customList.sort(
        (left: TestCase, right: TestCase) =>
          parseInt(left.created, 10) - parseInt(right.created, 10),
      ),
    ];
  }

  public set(testCase: TestCase): void {
    this.store.set(this.key(testCase.created), testCase);
  }

  public setList(testCases: TestCase[]): void {
    this.store.clearAll();
    testCases.map(testCase => {
      if (!testCase.readonly) {
        this.set(testCase);
      }
      return testCase;
    });
  }

  public del(testCase: TestCase) {
    this.store.remove(this.key(testCase.created));
  }

  public getDefault(): TestCase[] {
    const result: TestCase[] = [];
    ConfigMap.forEach((value, key) => {
      const prompt = PromptMap.get(key.replace('_config', '_prompt'));
      const data = YAML.parse(this.decode(value));
      const item = data.pop();
      const asserts: TestCaseAssert[] = [];
      if (Array.isArray(item.assert)) {
        item.assert.map((assert: TestCaseAssert) => {
          let assertValue = assert.value;
          if (assert.type === 'javascript') {
            const assertFile = AssertMap.get(key.replace('_config', '_assert'));
            if (assertFile !== undefined) {
              assertValue = this.decode(assertFile);
            }
          }
          asserts.push(new TestCaseAssert(assert.type, assertValue ?? '', assert.weight ?? 1));
          return assert;
        });
      }

      const testCase = new TestCase(
        item.vars.name,
        item.threshold,
        item.vars.difficulties['context-length'],
        item.vars.difficulties['reasoning-depth'],
        item.vars.difficulties['instruction-compliance'],
        item.description,
        this.decode(prompt ?? ''),
        asserts,
      );
      testCase.readonly = true;
      result.push(testCase);
    });
    return result;
  }

  private key(name: string) {
    return name;
  }

  private decode(data: string): string {
    return decodeURIComponent(escape(atob(data)));
  }
}

const testCaseService = new TestCaseService();

export { testCaseService };
