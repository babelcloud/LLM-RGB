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
  // Keys to convert to block style
  const keysToConvert = ['thought', 'selfCriticism'];
  
  // Process the YAML line by line
  const lines = yamlString.split('\n');
  const result: string[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const keyMatch = line.match(/^(\s*)(\w+):\s*(.*)/);
    
    if (keyMatch && keysToConvert.includes(keyMatch[2])) {
      const [, indent, key, value] = keyMatch;
      
      // If not already in block style
      if (!value.trim().startsWith('|')) {
        // Add the key with block style marker
        result.push(`${indent}${key}: |`);
        
        // Add the value with proper indentation
        if (value.trim()) {
          result.push(`${indent}  ${value.trim()}`);
        }
        
        // Look ahead for any continuation lines (properly indented)
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j];
          // Stop if we hit another key
          if (nextLine.match(/^\s*\w+:/)) break;
          // Stop if indentation is less than or equal to current key
          if (nextLine.trim() && !nextLine.match(new RegExp(`^${indent}\\s+`))) break;
          
          if (nextLine.trim()) {
            result.push(`${indent}  ${nextLine.trim()}`);
          } else {
            result.push('');
          }
          j++;
        }
        i = j;
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

