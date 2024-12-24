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

function convertYamlToBlockStyle(yamlString: string): string {
  const yamlObj = yaml.safeLoad(yamlString);
  if (!yamlObj) return yamlString;

  function convertValueToBlockStyle(value: any): any {
    if (typeof value === 'string' && value.includes('\n')) {
      return { '|-': value };
    }
    if (typeof value === 'object') {
      for (const key in value) {
        value[key] = convertValueToBlockStyle(value[key]);
      }
    }
    return value;
  }

  yamlObj.thought = convertValueToBlockStyle(yamlObj.thought);
  yamlObj.selfCriticism = convertValueToBlockStyle(yamlObj.selfCriticism);

  return yaml.safeDump(yamlObj, { flowLevel: -1 });
}

// Test the function
const yamlString1 = `
thought: I need to resolve the 'ModuleNotFoundError: No module named 'langchain_community'' error by ensuring that all necessary dependencies are correctly installed.
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
`;

const yamlString2 = `
thought: |
  I need to resolve the 'ModuleNotFoundError: No module named 'langchain_community'' error by ensuring that all necessary dependencies are correctly installed.
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
`;

console.log(convertYamlToBlockStyle(yamlString1));
console.log(convertYamlToBlockStyle(yamlString2));
```

