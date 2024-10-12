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
import * as yaml from 'yaml';

function convertYaml(inputYaml: string): string {
  const doc = yaml.parseDocument(inputYaml);

  function setBlockStyle(node: any, key: string) {
    if (node && node.has(key)) {
      const valueNode = node.get(key, true);
      if (yaml.isScalar(valueNode)) {
        valueNode.type = 'BLOCK_LITERAL';
      }
    }
  }

  if (doc.contents) {
    const root = doc.contents;
    setBlockStyle(root, 'thought');
    setBlockStyle(root, 'selfCriticism');
  }

  return String(doc);
}
```

