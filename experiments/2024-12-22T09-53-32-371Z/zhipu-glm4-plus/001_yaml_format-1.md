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

function convertToBlockStyle(inputYaml: string): string {
  try {
    const parsedYaml = yaml.load(inputYaml) as any;

    Object.keys(parsedYaml).forEach(key => {
      if (typeof parsedYaml[key] === 'string') {
        parsedYaml[key] = parsedYaml[key].split('\n').join('\n  ');
      }
    });

    return yaml.dump(parsedYaml, { lineWidth: -1 });
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return '';
  }
}

function isBlockStyle(inputYaml: string): boolean {
  try {
    const parsedYaml = yaml.load(inputYaml) as any;
    return Object.values(parsedYaml).some(value => typeof value === 'string' && value.includes('\n  '));
  } catch (error) {
    return false;
  }
}

function processYaml(inputYaml: string): string {
  if (isBlockStyle(inputYaml)) {
    return inputYaml;
  } else {
    return convertToBlockStyle(inputYaml);
  }
}

// Example usage:
const inputYaml1 = `
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

const inputYaml2 = `
thought: |
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

console.log(processYaml(inputYaml1));
console.log(processYaml(inputYaml2));
```

Make sure to install the `js-yaml` package using `npm install js-yaml` before running the code.

