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

const inputText = fs.readFileSync(0, 'utf-8');
const lines = inputText.split('\n');
const outputLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^(\s*)(thought|selfCriticism):\s*(.*)$/);
  if (match) {
    const indent = match[1];
    const key = match[2];
    const rest = match[3];
    if (rest.startsWith('|') || rest.startsWith('>')) {
      outputLines.push(line);
    } else if (rest.length === 0) {
      outputLines.push(line);
    } else {
      outputLines.push(`${indent}${key}: |`);
      outputLines.push(`${indent}  ${rest}`);
    }
  } else {
    outputLines.push(line);
  }
}
const outputText = outputLines.join('\n');
console.log(outputText);
```

