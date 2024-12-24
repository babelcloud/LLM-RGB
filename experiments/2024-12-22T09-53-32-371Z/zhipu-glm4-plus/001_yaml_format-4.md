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
import yaml from 'yaml';

function convertToBlockStyle(yamlContent: string): string {
  try {
    const parsed = yaml.parse(yamlContent);
    Object.keys(parsed).forEach(key => {
      if (typeof parsed[key] === 'string' && (key === 'thought' || key === 'selfCriticism')) {
        parsed[key] = parsed[key].split('\n').join('\n  ');
      }
    });
    return yaml.stringify(parsed);
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return '';
  }
}

function isBlockStyle(yamlContent: string): boolean {
  try {
    const parsed = yaml.parse(yamlContent);
    return Object.keys(parsed).every(key => {
      if (typeof parsed[key] === 'string' && (key === 'thought' || key === 'selfCriticism')) {
        return parsed[key].startsWith('\n') || parsed[key].includes('\n  ');
      }
      return true;
    });
  } catch (error) {
    return false;
  }
}

function processYaml(yamlContent: string): string {
  if (!isBlockStyle(yamlContent)) {
    return convertToBlockStyle(yamlContent);
  }
  return yamlContent;
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

console.log(processYaml(inputYaml));
```

