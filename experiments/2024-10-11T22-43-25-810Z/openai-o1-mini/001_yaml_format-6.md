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
import * as fs from 'fs';
import * as yaml from 'js-yaml';

function convertToBlockStyle(inputYaml: string): string {
    try {
        const data = yaml.load(inputYaml) as any;
        if (data.thought && typeof data.thought === 'string') {
            data.thought = yaml.createNode(data.thought, { blockScalar: true });
        }
        if (data.selfCriticism && typeof data.selfCriticism === 'string') {
            data.selfCriticism = yaml.createNode(data.selfCriticism, { blockScalar: true });
        }
        return yaml.dump(data, { lineWidth: -1 });
    } catch (e) {
        // If parsing fails, manually replace the keys
        let output = inputYaml;
        output = output.replace(/thought:\s*(?!\|)/, 'thought: |');
        output = output.replace(/selfCriticism:\s*(?!\|)/, 'selfCriticism: |');
        return output;
    }
}

// Example usage:
const inputYaml1 = `thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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

const inputYaml2 = `thought: |
  I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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

console.log(convertToBlockStyle(inputYaml1));
console.log(convertToBlockStyle(inputYaml2));
```

