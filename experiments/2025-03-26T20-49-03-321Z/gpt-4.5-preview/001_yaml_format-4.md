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
  const keysToConvert = ['thought:', 'selfCriticism:'];
  const convertedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trimStart();
    const indent = line.slice(0, line.length - trimmedLine.length);
    
    const matchingKey = keysToConvert.find(key => trimmedLine.startsWith(key));

    if (matchingKey) {
      let value = trimmedLine.substring(matchingKey.length).trim();
      convertedLines.push(`${indent}${matchingKey} |`);
      
      if (value) {
        convertedLines.push(`${indent}  ${value}`);
      }

      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^\s*\w+:/)) {
        convertedLines.push(lines[i]);
        i++;
      }
      i--;
    } else {
      convertedLines.push(line);
    }
  }

  return convertedLines.join('\n');
}
```

