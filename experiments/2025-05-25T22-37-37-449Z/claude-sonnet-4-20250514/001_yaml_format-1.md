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
    const trimmed = line.trim();
    
    if (trimmed === '') {
      result.push(line);
      i++;
      continue;
    }
    
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (match) {
      const [, indent, key, value] = match;
      
      if (value === '' || (key === 'thought' || key === 'selfCriticism')) {
        // Start collecting multi-line content
        result.push(`${indent}${key}: |`);
        i++;
        
        // Get the base indentation level
        const baseIndent = indent + '  ';
        
        // Collect content until next key at same or higher level
        while (i < lines.length) {
          const nextLine = lines[i];
          const nextTrimmed = nextLine.trim();
          
          if (nextTrimmed === '') {
            result.push(nextLine);
            i++;
            continue;
          }
          
          // Check if this is a new key at the same or higher level
          const nextMatch = nextLine.match(/^(\s*)([^:]+):\s*(.*)$/);
          if (nextMatch && nextMatch[1].length <= indent.length) {
            break;
          }
          
          // Add content with proper indentation
          if (nextLine.startsWith(indent)) {
            result.push(baseIndent + nextLine.substring(indent.length));
          } else {
            result.push(baseIndent + nextTrimmed);
          }
          i++;
        }
      } else {
        result.push(line);
        i++;
      }
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}
```

