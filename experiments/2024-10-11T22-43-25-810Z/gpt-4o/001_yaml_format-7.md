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
import yaml from 'js-yaml';
import fs from 'fs';

function convertToBlockStyle(input: string): string {
  const data = yaml.load(input, { schema: yaml.JSON_SCHEMA });

  function processValue(value: any): any {
    if (typeof value === 'string' && value.includes('\n')) {
      return yaml.dump(value, { schema: yaml.JSON_SCHEMA }).trim();
    } else if (Array.isArray(value)) {
      return value.map(processValue);
    } else if (typeof value === 'object' && value !== null) {
      const newObj: any = {};
      for (const key in value) {
        newObj[key] = processValue(value[key]);
      }
      return newObj;
    }
    return value;
  }

  const processedData = processValue(data);
  const blockStyleYaml = yaml.dump(processedData, { schema: yaml.JSON_SCHEMA });
  return blockStyleYaml;
}

const inputYaml = fs.readFileSync('input.yaml', 'utf-8');
const blockStyleYaml = convertToBlockStyle(inputYaml);
fs.writeFileSync('output.yaml', blockStyleYaml);
```

