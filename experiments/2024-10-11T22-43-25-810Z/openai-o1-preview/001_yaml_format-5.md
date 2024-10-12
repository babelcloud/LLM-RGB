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
function convertYaml(inputYaml: string): string {
  const lines = inputYaml.split('\n');
  const outputLines: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const match = trimmedLine.match(/^(\w+):(.*)$/);
    if (match) {
      const key = match[1];
      const keysToConvert = ['thought', 'selfCriticism'];
      if (keysToConvert.includes(key)) {
        const rest = match[2].trim();
        if (rest.startsWith('|') || rest.startsWith('>-') || rest.startsWith('|-')) {
          outputLines.push(line);
          i++;
        } else {
          const indentMatch = line.match(/^(\s*)/);
          const indent = indentMatch ? indentMatch[1] : '';
          let valueLines: string[] = [];
          if (rest.length > 0) {
            valueLines.push(rest);
          }
          i++;
          while (i < lines.length) {
            const nextLine = lines[i];
            const nextIndentMatch = nextLine.match(/^(\s*)/);
            const nextIndent = nextIndentMatch ? nextIndentMatch[1] : '';
            if (nextIndent.length > indent.length) {
              valueLines.push(nextLine.substring(indent.length));
              i++;
            } else {
              break;
            }
          }
          outputLines.push(`${indent}${key}: |`);
          const valueIndented = valueLines.map(vLine => `${indent}  ${vLine}`).join('\n');
          outputLines.push(valueIndented);
        }
      } else {
        outputLines.push(line);
        i++;
      }
    } else {
      outputLines.push(line);
      i++;
    }
  }
  return outputLines.join('\n');
}
```

