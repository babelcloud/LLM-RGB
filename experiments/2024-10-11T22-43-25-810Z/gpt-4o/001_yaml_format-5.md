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
import fs from 'fs';
import yaml from 'js-yaml';

function convertToBlockStyle(inputYaml: string): string {
  const data = yaml.load(inputYaml, { schema: yaml.FAILSAFE_SCHEMA });

  function toBlockStyle(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes('\n')) {
          obj[key] = `|\n  ${obj[key].replace(/\n/g, '\n  ')}`;
        }
        else {
          obj[key] = toBlockStyle(obj[key]);
        }
      }
    }
    return obj;
  }

  toBlockStyle(data);

  return yaml.dump(data, { lineWidth: -1 });
}

const inputYaml = fs.readFileSync('input.yaml', 'utf8');
const outputYaml = convertToBlockStyle(inputYaml);
fs.writeFileSync('output.yaml', outputYaml);
```

