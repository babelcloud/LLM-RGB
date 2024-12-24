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

function convertYamlToBlockStyle(inputYaml: string): string {
  try {
    const parsedYaml = yaml.load(inputYaml) as any;

    Object.keys(parsedYaml).forEach((key) => {
      if (typeof parsedYaml[key] === 'string' && (key === 'thought' || key === 'selfCriticism')) {
        parsedYaml[key] = parsedYaml[key].split('\n').join('\n  ');
      }
    });

    return yaml.dump(parsedYaml, { indent: 2 });
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return '';
  }
}

function isBlockStyle(inputYaml: string): boolean {
  try {
    const parsedYaml = yaml.load(inputYaml) as any;

    return Object.keys(parsedYaml).every((key) => {
      if (typeof parsedYaml[key] === 'string' && (key === 'thought' || key === 'selfCriticism')) {
        return parsedYaml[key].includes('\n  ');
      }
      return true;
    });
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return false;
  }
}

function processYaml(inputYaml: string): string {
  if (!isBlockStyle(inputYaml)) {
    return convertYamlToBlockStyle(inputYaml);
  }
  return inputYaml;
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

const outputYaml = processYaml(inputYaml1);
console.log(outputYaml);
```

