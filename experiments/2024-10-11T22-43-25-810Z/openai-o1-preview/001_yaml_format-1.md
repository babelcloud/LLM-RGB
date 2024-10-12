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
function convertToBlockStyle(yamlStr: string): string {
    const keys = ['thought', 'selfCriticism'];
    const lines = yamlStr.split('\n');
    let resultLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];
        let match = line.match(/^(\s*)(thought|selfCriticism):\s*(.*)$/);
        if (match) {
            const indent = match[1];
            const key = match[2];
            let value = match[3];
            if (value.startsWith('|') || value.startsWith('>-') || value.startsWith('>') || value.startsWith('|-')) {
                resultLines.push(line);
                i++;
            } else {
                let valueLines = [];
                if (value !== '') {
                    valueLines.push(value);
                }
                i++;
                while (i < lines.length) {
                    let nextLine = lines[i];
                    if (nextLine.match(/^\s+.+$/) || nextLine.trim() === '') {
                        valueLines.push(nextLine.trim());
                        i++;
                    } else {
                        break;
                    }
                }
                resultLines.push(`${indent}${key}: |-`);
                for (let vline of valueLines) {
                    resultLines.push(`${indent}  ${vline}`);
                }
            }
        } else {
            resultLines.push(line);
            i++;
        }
    }

    return resultLines.join('\n');
}
```

