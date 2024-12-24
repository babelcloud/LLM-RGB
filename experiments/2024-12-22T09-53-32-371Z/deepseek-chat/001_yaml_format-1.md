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
import yaml from 'js-yaml';

function convertToBlockStyle(inputYaml: string): string {
  try {
    const parsed = yaml.load(inputYaml);

    if (typeof parsed === 'object' && parsed !== null) {
      const updated = {
        ...parsed,
        thought: parsed.thought ? `|-\n${parsed.thought.replace(/\n/g, '\n  ')}` : null,
        selfCriticism: parsed.selfCriticism ? `|-\n${parsed.selfCriticism.replace(/\n/g, '\n  ')}` : null,
      };

      return yaml.dump(updated, { blockQuote: true, lineWidth: -1 });
    }
  } catch (e) {
    // If the input is not valid YAML, attempt to convert it anyway
    const lines = inputYaml.split('\n');
    const updatedLines = lines.map(line => {
      if (line.trim().startsWith('thought:') || line.trim().startsWith('selfCriticism:')) {
        return `${line.trim()}\n  |-\n    `;
      }
      return line;
    });

    return updatedLines.join('\n');
  }

  return inputYaml;
}

// Example usage:
const inputYaml = `
thought: I need to resolve the 'ModuleNotFoundError: No module named 'langchain_community'' error by ensuring that all necessary dependencies are correctly installed.
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
`;

const convertedYaml = convertToBlockStyle(inputYaml);
console.log(convertedYaml);
```

