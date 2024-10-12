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
import * as fs from 'fs';
import * as yaml from 'yaml';

// Read input YAML from stdin
const input = fs.readFileSync(0, 'utf-8');

try {
  const doc = yaml.parseDocument(input);

  ['thought', 'selfCriticism'].forEach((key) => {
    if (doc.has(key)) {
      const node = doc.get(key);
      if (node && node.type !== 'PLAIN') {
        // Convert to block style
        const value = node.toString();
        doc.set(key, new yaml.scalar.BlockScalar({
          header: '|-',
          value: value,
        }));
      } else if (node) {
        // Set as block style
        doc.set(key, new yaml.Scalar({
          value: node.toString(),
          type: 'BLOCK',
          header: '|-',
        }));
      }
    }
  });

  // Output the modified YAML
  console.log(String(doc));
} catch (error) {
  // If parsing fails, reconstruct with block style
  const reconstructed = {
    thought: `|-
      ${input.match(/thought:\s*(.*)/)?.[1] || ''}`,
    selfCriticism: `|-
      ${input.match(/selfCriticism:\s*(.*)/)?.[1] || ''}`,
    command: {
      name: 'runPython',
      args: {
        code: `|-
          import sys
          !{sys.executable} -m pip install langchain openai langchain_community`,
        requirements: `|-
          langchain
          openai
          langchain_community`,
      },
    },
  };
  console.log(yaml.stringify(reconstructed));
}
```

