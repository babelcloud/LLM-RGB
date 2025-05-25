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
  const BLOCK_KEYS = ['thought', 'selfCriticism'];
  // Regex to match a key at the beginning of a line (optionally indented), followed by colon
  const keyRegex = (key: string) => new RegExp(
    `^([ \\t]*)${key}:(?![|>])(?:[ \\t]*)(.*)$`, 'mg'
  );

  let result = yamlString;

  for (const key of BLOCK_KEYS) {
    result = result.replace(keyRegex(key), (_match, indent, val) => {
      let newVal = val.trim();
      if (newVal === "") {
        return `${indent}${key}: |`;
      } else {
        // Escape a trailing comment (e.g. "foo # bar") by quoting, or will parse as comment
        return `${indent}${key}: |\n${indent}  ${newVal}`;
      }
    });
  }

  // For lines immediately following a block key, insert proper indent if missing
  const lines = result.split('\n');
  for (let i = 0; i < lines.length; ++i) {
    for (const key of BLOCK_KEYS) {
      const blockLine = lines[i].match(new RegExp(`^([ \\t]*)${key}: \\|$`));
      if (blockLine) {
        let indent = blockLine[1] || '';
        let j = i + 1;
        // Indent lines that belong to the block literal until a new top-level key is found
        while (
          j < lines.length &&
          (lines[j].trim() === '' || /^[ \t]+/.test(lines[j]) || !/^[\w\-]+:/.test(lines[j].trim()))
        ) {
          if (lines[j].trim() !== '') {
            lines[j] = `${indent}  ${lines[j].replace(/^\s*/, '')}`;
          }
          j++;
        }
      }
    }
  }

  return lines.join('\n');
}
```

