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

I need a typescript function "function convertToBlockStyleYaml(yamlString: string): string" to convert the yaml to the second style and return the converted yaml string.

Code Only, no explanation.

Hint: The input yaml may not be a valid yaml, but you should convert it to the new format to make it valid.

## Response

```ts
import * as yaml from 'js-yaml';

export function convertToBlockStyleYaml(yamlString: string): string {
  const data = safelyParseYaml(yamlString);
  return toBlockStyleYaml(data);
}

function safelyParseYaml(str: string): any {
  try {
    const parsed = yaml.load(str);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function toBlockStyleYaml(obj: any, indent: number = 0): string {
  const indentation = '  '.repeat(indent);
  let out = '';

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === 'thought' || key === 'selfCriticism') {
      out += `${indentation}${key}: |\n`;
      const lines = typeof value === 'string' ? value.split(/\r?\n/) : [String(value)];
      for (const line of lines) {
        out += `${indentation}  ${line}\n`;
      }
    } else if (Array.isArray(value)) {
      out += `${indentation}${key}:\n`;
      for (const item of value) {
        if (item && typeof item === 'object') {
          out += `${indentation}  -\n` + toBlockStyleYaml(item, indent + 2);
        } else {
          out += `${indentation}  - ${item}\n`;
        }
      }
    } else if (value && typeof value === 'object') {
      out += `${indentation}${key}:\n` + toBlockStyleYaml(value, indent + 1);
    } else {
      out += `${indentation}${key}: ${value}\n`;
    }
  }
  return out;
}
```

