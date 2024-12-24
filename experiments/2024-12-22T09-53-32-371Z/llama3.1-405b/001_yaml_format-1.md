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

function convertYaml(inputYaml: string): string {
  const yamlRegex = /^(.+?):\s*(.*)$/gm;
  const blockStyleRegex = /^\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*:\s*\|$/gm;

  const lines = inputYaml.split('\n');
  const convertedLines: string[] = [];

  let inBlock = false;
  let blockIndent = 0;

  for (const line of lines) {
    const match = line.match(yamlRegex);
    if (match) {
      const key = match[1];
      const value = match[2];
      if (!inBlock && value.trim().indexOf('\n') === -1 && !value.trim().startsWith('|')) {
        convertedLines.push(`${key}: |`);
        inBlock = true;
        blockIndent = key.length + 2;
      } else {
        convertedLines.push(line);
      }
    } else if (inBlock) {
      if (line.trim() === '') {
        inBlock = false;
      } else {
        convertedLines.push(' '.repeat(blockIndent) + line.trim());
      }
    } else {
      convertedLines.push(line);
    }
  }

  const convertedYaml = convertedLines.join('\n');
  return yaml.dump(yaml.load(convertedYaml));
}

// Example usage:
const inputYaml = `
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

console.log(convertYaml(inputYaml));
```

