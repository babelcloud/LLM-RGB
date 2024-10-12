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

function convertYaml(inputYaml: string): string {
  const lines = inputYaml.split('\n');
  const convertedLines: string[] = [];

  let inBlock = false;
  let blockIndent = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const indent = line.length - trimmedLine.length;

    if (trimmedLine.startsWith('|')) {
      inBlock = true;
      blockIndent = indent;
      convertedLines.push(line);
    } else if (inBlock) {
      if (indent > blockIndent) {
        convertedLines.push(' ' + line);
      } else {
        inBlock = false;
        convertedLines.push(line);
      }
    } else {
      const match = trimmedLine.match(/^(\w+): (.*)$/);
      if (match) {
        const key = match[1];
        const value = match[2];
        if (value.includes('\n') || value.includes('"') || value.includes("'")) {
          convertedLines.push(`${key}: |`);
          convertedLines.push(`  ${value}`);
        } else {
          convertedLines.push(line);
        }
      } else {
        convertedLines.push(line);
      }
    }
  }

  return convertedLines.join('\n');
}

function checkAndConvertYaml(inputYaml: string): string {
  try {
    const yamlJson = yaml.safeLoad(inputYaml);
    if (yamlJson) {
      return inputYaml;
    } else {
      return convertYaml(inputYaml);
    }
  } catch (e) {
    return convertYaml(inputYaml);
  }
}

const inputYaml = fs.readFileSync('input.yaml', 'utf8');
const convertedYaml = checkAndConvertYaml(inputYaml);
fs.writeFileSync('output.yaml', convertedYaml);
```

