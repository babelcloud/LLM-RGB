export class TestCaseAssert {
  id: string;
  type?: string;
  value?: string;
  weight?: number;

  constructor(type?: string, value?: string, weight?: number) {
    this.id = Math.random().toString(36);
    this.type = type;
    this.value = value;
    this.weight = weight;
  }
}

const AssertTypes: string[] = [];
AssertTypes.push('equals');
AssertTypes.push('contains');
AssertTypes.push('icontains');
AssertTypes.push('regex');
AssertTypes.push('starts-with');
AssertTypes.push('contains-any');
AssertTypes.push('contains-all');
AssertTypes.push('icontains-any');
AssertTypes.push('icontains-all');
AssertTypes.push('is-json');
AssertTypes.push('contains-json');
AssertTypes.push('javascript');
AssertTypes.push('webhook');
AssertTypes.push('similar');
AssertTypes.push('rouge-n');
AssertTypes.push('levenshtein');

export { AssertTypes };
