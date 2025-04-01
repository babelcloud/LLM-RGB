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
  // Split the YAML into lines
  const lines = yamlString.split('\n');
  const result: string[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimLeft().length;
    
    // Check if this is a field we need to convert
    if (trimmed.startsWith('thought:') || trimmed.startsWith('selfCriticism:')) {
      const colonPos = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonPos + 1);
      let value = trimmed.substring(colonPos + 1).trim();
      
      // Add the key with block indicator
      result.push(`${' '.repeat(indent)}${key} |`);
      
      // If there's a value on the same line
      if (value) {
        result.push(`${' '.repeat(indent + 2)}${value}`);
      }
      
      // Look for multi-line content
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();
        const nextIndent = nextLine.length - nextLine.trimLeft().length;
        
        // If next line starts a new field or has less indentation, stop
        if (nextTrimmed.match(/^\w+:/) && nextIndent <= indent) {
          break;
        }
        
        result.push(nextLine);
        j++;
      }
      
      i = j;
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}
```

