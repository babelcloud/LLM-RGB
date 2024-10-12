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

function convertToBlockStyle(input: string): string {
    const lines = input.split('\n');
    const keys = ['thought', 'selfCriticism'];
    let output = '';
    let i = 0;
    while (i < lines.length) {
        let line = lines[i];
        const keyMatch = line.match(/^(\s*)(thought|selfCriticism):\s*(.*)$/);
        if (keyMatch) {
            const indent = keyMatch[1];
            const key = keyMatch[2];
            const value = keyMatch[3];
            output += `${indent}${key}: |\n`;
            if (value && value.trim() !== '') {
                const valueLines = value.split('\\n').map(v => `${indent}  ${v}`);
                output += valueLines.join('\n') + '\n';
            }
            i++;
            // Append any continuation lines
            while (i < lines.length && lines[i].startsWith(indent + '  ')) {
                output += lines[i] + '\n';
                i++;
            }
        } else {
            output += line + '\n';
            i++;
        }
    }
    return output;
}

const input = fs.readFileSync(0, 'utf-8');
const output = convertToBlockStyle(input);
console.log(output);
```

