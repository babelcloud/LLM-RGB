# 001_yaml_format

## Prompt

Consider the following two yaml:

```yaml
thought: I need to resolve the `ModuleNotFoundError: No module named 'langchain_community'` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |-
      import sys
      !{sys.executable} -m pip install langchain openai langchain_community
    requirements: |-
      langchain
      openai
      langchain_community
```

```yaml
thought: |
  I need to resolve the `ModuleNotFoundError: No module named 'langchain_community'` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: |
  I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |-
      import sys
      !{sys.executable} -m pip install langchain openai langchain_community
    requirements: |-
      langchain
      openai
      langchain_community
```

THe content of the two yaml are the same, but the format is different. The "thought" and "selfCriticism" value in the second yaml is in block style which is what I want. 

I need a typescript program to check if the given yaml is in second style, if not, convert it to the second style. Code Only, no explanation.

Hint: The input yaml may not be a valid yaml, but you should convert it to the new format to make it valid.

## Response

```typescript
import * as yaml from 'js-yaml';
import * as fs from 'fs';

function convertYaml(input: string): string {
    const data = yaml.load(input);
    const convertToBlockStyle = (obj: any): any => {
        if (typeof obj === 'string') {
            return obj.includes('\n') || obj.length > 80 ? `|\n  ${obj.replace(/\n/g, '\n  ')}` : obj;
        } else if (Array.isArray(obj)) {
            return obj.map(item => convertToBlockStyle(item));
        } else if (typeof obj === 'object' && obj !== null) {
            const newObj: any = {};
            for (const [key, value] of Object.entries(obj)) {
                newObj[key] = convertToBlockStyle(value);
            }
            return newObj;
        } else {
            return obj;
        }
    };
    const converted = convertToBlockStyle(data);
    return yaml.dump(converted, { lineWidth: -1 });
}

const inputYamlPath = 'input.yaml';
const outputYamlPath = 'output.yaml';
const inputYaml = fs.readFileSync(inputYamlPath, 'utf8');
const convertedYaml = convertYaml(inputYaml);
fs.writeFileSync(outputYamlPath, convertedYaml);
```

