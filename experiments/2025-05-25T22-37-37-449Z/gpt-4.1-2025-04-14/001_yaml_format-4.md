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
  // Block style fields to convert
  const fieldsToConvert = ['thought', 'selfCriticism'];

  // Split input into lines
  const lines = yamlString.split('\n');
  const output: string[] = [];
  let i = 0;
  while (i < lines.length) {
    let line = lines[i];
    if (fieldsToConvert.some(field => line.trim().startsWith(field + ':'))) {
      const key = fieldsToConvert.find(field => line.trim().startsWith(field + ':'))!;
      const prefix = line.match(/^\s*/)?.[0] || '';
      // Extract the value
      const colonIdx = line.indexOf(':');
      const value = line.slice(colonIdx + 1).trim();
      output.push(prefix + key + ': |');
      if (value !== '') {
        output.push(prefix + '  ' + value);
      }
      // Handle multi-line value indented greater than the key
      let j = i + 1;
      while (
        j < lines.length &&
        (lines[j].trim() === '' || (lines[j].startsWith(prefix + ' ') || lines[j].startsWith(prefix + '\t')))
      ) {
        output.push((lines[j] ? prefix + '  ' + lines[j].trim() : ''));
        j++;
      }
      i = j;
    } else {
      output.push(line);
      i++;
    }
  }
  return output.join('\n');
}
```

