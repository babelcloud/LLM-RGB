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
  const lines = yamlString.split('\n');
  const convertedLines: string[] = [];

  let inBlock = false;
  let blockIndent = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const indent = line.length - trimmedLine.length;

    if (trimmedLine.endsWith(':') && !inBlock) {
      inBlock = true;
      blockIndent = indent;
      convertedLines.push(line + ' |');
    } else if (inBlock && indent > blockIndent) {
      convertedLines.push(' '.repeat(blockIndent + 2) + trimmedLine);
    } else if (inBlock && indent <= blockIndent) {
      inBlock = false;
      convertedLines.push(line);
    } else {
      convertedLines.push(line);
    }
  }

  return convertedLines.join('\n');
}

function isBlockStyleYaml(yamlString: string): boolean {
  const lines = yamlString.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.endsWith(':')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine && nextLine.trim().startsWith('|')) {
        return true;
      }
    }
  }

  return false;
}

function processYaml(yamlString: string): string {
  if (!isBlockStyleYaml(yamlString)) {
    return convertYamlToBlockStyle(yamlString);
  }

  return yamlString;
}

// Example usage
const yamlString = `
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

console.log(processYaml(yamlString));
```

