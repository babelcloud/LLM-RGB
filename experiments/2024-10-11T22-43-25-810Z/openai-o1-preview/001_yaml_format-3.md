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
import { parseDocument, Scalar, YAMLMap } from 'yaml';

// Read input YAML string (you can replace 'input.yaml' with your input source)
const inputYaml = fs.readFileSync('input.yaml', 'utf8');

// Parse the YAML document
const doc = parseDocument(inputYaml);

// Function to set block style for specific keys in a map
function setBlockStyle(node: any, keys: string[]) {
  if (node instanceof YAMLMap) {
    for (const item of node.items) {
      if (keys.includes(item.key.value) && item.value instanceof Scalar) {
        item.value.style = '|';
      } else {
        setBlockStyle(item.value, keys);
      }
    }
  } else if (Array.isArray(node.items)) {
    for (const item of node.items) {
      setBlockStyle(item, keys);
    }
  }
}

// Set block style for "thought" and "selfCriticism"
setBlockStyle(doc.contents, ['thought', 'selfCriticism']);

// Convert the document back to YAML string
const outputYaml = doc.toString();

console.log(outputYaml);
```

