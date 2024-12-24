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
function convertToBlockStyle(yamlContent: string): string {
  const lines = yamlContent.split('\n');
  const output: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('thought:') || line.startsWith('selfCriticism:')) {
      const key = line.split(':')[0];
      const value = line.split(':').slice(1).join(':').trim();
      
      if (!value.startsWith('|')) {
        output.push(`${key}: |`);
        output.push(`${value}`);
      } else {
        output.push(line);
      }
    } else {
      output.push(line);
    }
  }
  
  return output.join('\n');
}

function isBlockStyle(yamlContent: string): boolean {
  const lines = yamlContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('thought:') || line.startsWith('selfCriticism:')) {
      if (!line.includes('|')) {
        return false;
      }
    }
  }
  
  return true;
}
```

