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

import YAML from 'yaml';

function ensureBlockStyle(input: string): string {
  let doc = null;
  try {
    doc = YAML.parseDocument(input);
  } catch {
    // If parsing fails, create a new empty document
    doc = new YAML.Document();
  }
  // Ensure "thought" is block style
  const thoughtVal = doc.get('thought');
  if (typeof thoughtVal === 'string') {
    doc.set('thought', doc.createNode(thoughtVal, { type: 'BLOCK_LITERAL' }));
  }
  // Ensure "selfCriticism" is block style
  const selfCritVal = doc.get('selfCriticism');
  if (typeof selfCritVal === 'string') {
    doc.set('selfCriticism', doc.createNode(selfCritVal, { type: 'BLOCK_LITERAL' }));
  }
  return doc.toString();
}

// Example usage:
// console.log(ensureBlockStyle(yourYamlString));

