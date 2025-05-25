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

I need a typescript function "function convertToBlockStyleYaml(yamlString: string): string" to convert the yaml to the second style and return the converted yaml string.

Code Only, no explanation.

Hint: The input yaml may not be a valid yaml, but you should convert it to the new format to make it valid.

## Response

```typescript
function convertToBlockStyleYaml(yamlString: string): string {
  // Only top-level keys are handled for block style
  const blockKeys = new Set(['thought', 'selfCriticism']);
  const lines = yamlString.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    let line = lines[i];
    const match = line.match(/^([a-zA-Z_][\w\-]*):\s*(.*)$/);
    if (match && blockKeys.has(match[1])) {
      let key = match[1];
      let value = match[2];
      // Add the block style indicator
      out.push(`${key}: |`);
      // Collect lines belonging to the value
      let blockLines: string[] = [];
      if (value.length > 0) {
        blockLines.push(value);
      }
      i++;
      // Capture indented lines as part of the value
      while (i < lines.length && (/^\s+/.test(lines[i]) || lines[i].trim() === '')) {
        blockLines.push(lines[i]);
        i++;
      }
      // Indent all value lines by 2 spaces
      for (let l of blockLines) {
        out.push('  ' + l);
      }
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}
```

