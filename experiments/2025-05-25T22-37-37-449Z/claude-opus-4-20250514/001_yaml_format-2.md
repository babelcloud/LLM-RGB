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
  const lines = yamlString.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)(thought|selfCriticism):\s*(.*)$/);
    
    if (match) {
      const [, indent, key, value] = match;
      
      if (value.trim()) {
        // Single line value - convert to block style
        result.push(`${indent}${key}: |`);
        result.push(`${indent}  ${value.trim()}`);
      } else {
        // Already in block style or empty
        result.push(line);
      }
    } else {
      result.push(line);
    }
    
    i++;
  }
  
  return result.join('\n');
}
```

