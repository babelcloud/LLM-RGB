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

function convertYaml(input: string): string {
  const data = yaml.load(input);

  function enforceBlockStyle(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes('\n')) {
          obj[key] = '|-\n  ' + obj[key].split('\n').join('\n  ').trim();
        } else if (typeof obj[key] === 'object') {
          obj[key] = enforceBlockStyle(obj[key]);
        }
      }
    }
    return obj;
  }

  const updated = enforceBlockStyle(data);
  return yaml.dump(updated, { lineWidth: -1 });
}

const inputYaml = `thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |- import sys
      !{sys.executable} -m pip install langchain openai langchain_community
    requirements: |- langchain
      openai
      langchain_community`;

const outputYaml = convertYaml(inputYaml);
console.log(outputYaml);
```

