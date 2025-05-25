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
  const blockKeys = new Set(['thought', 'selfCriticism']);
  return yamlString.split('\n').map(line => {
    const keyMatch = /^(\s*)(thought|selfCriticism): (.*)$/g.exec(line);
    if (keyMatch && blockKeys.has(keyMatch[2])) {
      const indent = keyMatch[1];
      let value = keyMatch[3];
      // Plain values only, not already block style
      if (value.trim() === '|-' || value.trim() === '|') return line;
      // Already block - skip
      if (value.trim().startsWith('|')) return line;
      if (value.trim() === '|') return line;
      // Remove quotes for simple cases
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      if (value.trim() === '') {
        return `${indent}${keyMatch[2]}: |`;
      }
      // Indent block style value
      return `${indent}${keyMatch[2]}: |\n${indent}  ${value}`;
    }
    return line;
  }).join('\n');
}
```

