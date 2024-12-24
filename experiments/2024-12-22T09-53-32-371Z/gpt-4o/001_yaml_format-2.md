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

function convertToBlockStyle(input: string): string {
    const isBlockStyle = (str: string) => str.includes('\n') || str.includes(': ');

    try {
        const data = yaml.load(input);
        const needsBlockStyle = (value: any) => typeof value === 'string' && isBlockStyle(value);

        const convertObject = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    convertObject(obj[key]);
                } else if (needsBlockStyle(obj[key])) {
                    obj[key] = obj[key].split('\n').map(line => line.trim()).join('\n');
                }
            }
        };

        convertObject(data);

        return yaml.dump(data, { lineWidth: Infinity });
    } catch (e) {
        return input; // If invalid YAML, return original
    }
}

// Example usage:
const inputYaml = `
thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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

console.log(convertToBlockStyle(inputYaml));
```

