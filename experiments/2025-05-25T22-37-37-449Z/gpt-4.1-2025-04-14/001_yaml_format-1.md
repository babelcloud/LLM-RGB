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
  function needsBlockStyle(value: string): boolean {
    return value.includes('\n') || value.includes(':') || value.includes('|') || value.includes('>');
  }

  // Handles only top-level key: value pairs
  return yamlString.replace(
    /^([ \t]*)(thought|selfCriticism):([ \t]*)(.*)$/gm,
    (match, indent, key, sep, value) => {
      const trimmed = value.trim();
      if (
        trimmed.startsWith('|') ||
        trimmed.startsWith('>') ||
        trimmed === ''
      ) {
        return match; // already block or empty
      }
      if (needsBlockStyle(trimmed)) {
        // Already likely invalid yaml, but forcibly convert
        const blockValue =
          '\n' +
          trimmed
            .split(/\r?\n/)
            .map(line => `${indent}  ${line}`)
            .join('\n');
        return `${indent}${key}: |${blockValue}`;
      } else {
        // Single line, but we want block style
        return `${indent}${key}: |\n${indent}  ${trimmed}`;
      }
    }
  );
}
```

