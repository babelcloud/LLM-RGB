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

Here's a TypeScript program that checks if the given YAML is in the desired block style format and converts it if not:

```typescript
import * as yaml from 'js-yaml';

function convertToBlockStyle(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  let inBlockStyle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('thought:') || trimmedLine.startsWith('selfCriticism:')) {
      output.push(trimmedLine + ' |');
      inBlockStyle = true;
    } else if (inBlockStyle && !trimmedLine.startsWith('-') && trimmedLine !== '') {
      output.push('  ' + line.trimStart());
    } else {
      output.push(line);
      inBlockStyle = false;
    }
  }

  return output.join('\n');
}

function isBlockStyle(input: string): boolean {
  return input.includes('thought: |') && input.includes('selfCriticism: |');
}

function processYaml(input: string): string {
  if (isBlockStyle(input)) {
    return input;
  }
  return convertToBlockStyle(input);
}

// Example usage
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

const processedYaml = processYaml(inputYaml);
console.log(processedYaml);
```

