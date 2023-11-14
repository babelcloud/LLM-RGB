import store from 'store2';
import YAML from 'yaml';
import TestCase from '@models/TestCase';
import { ConfigMap, PromptMap } from '@services/TestCaseData';
import { TestCaseAssert } from '@models/TestCaseAssert';

export class TestCaseService {
  private readonly NAMESPACE = 'test.case';
  private readonly store;
  private readonly defaultList: TestCase[];

  constructor() {
    this.store = store.namespace(this.NAMESPACE);
    this.defaultList = this.getDefault();
  }

  public list(): TestCase[] {
    const items = this.store.getAll() ?? [];
    const customList = Object.keys(items)
      .map((key: any) => {
        const result = Object.create(TestCase.prototype);
        Object.assign(result, items[key]);
        return result;
      });
    return [...this.defaultList, ...customList.sort((left: TestCase, right: TestCase) =>
      parseInt(left.created, 10) - parseInt(right.created, 10)
    )];
  }

  public create(): TestCase {
    let lastNumber = 0;
    this.list()
      .map(testCase => {
        const found = testCase.name.match('^[0-9]+');
        if (found !== null) {
          const number = parseInt(found[0], 10);
          if (number >= lastNumber) {
            lastNumber = number;
          }
        }
        return testCase;
      });
    lastNumber += 1;
    const index = String(lastNumber)
      .padStart(3, '0');
    return new TestCase(`${index}_test_case`, 1, 1, 1, 1);
  }

  public set(testCase: TestCase): void {
    this.store.set(this.key(testCase.created), testCase);
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
        item.assert.map((assert: TestCaseAssert) =>
          asserts.push(new TestCaseAssert(assert.type, assert.value, assert.weight))
        );
      }

      const testCase = new TestCase(item.vars.name,
        item.threshold,
        item.vars.difficulties['context-length'],
        item.vars.difficulties['reasoning-depth'],
        item.vars.difficulties['instruction-compliance'],
        item.description,
        this.decode(prompt ?? ''),
        asserts);
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
