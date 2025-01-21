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

import * as yaml from 'js-yaml';

function convertToBlockStyle(input: string): string {
  let doc: any;
  try {
    doc = yaml.load(input);
  } catch {
    doc = {};
  }
  if (!doc || typeof doc !== 'object') doc = {};

  // Ensure thought and selfCriticism are strings
  if (typeof doc.thought !== 'string') doc.thought = doc.thought ? String(doc.thought) : '';
  if (typeof doc.selfCriticism !== 'string') doc.selfCriticism = doc.selfCriticism ? String(doc.selfCriticism) : '';

  // First dump normally
  let out = yaml.dump(doc);

  // Replace thought
  out = out.replace(/^thought:\s*(["'].*?["']|'.*?'|[^\n]*)/m, () => {
    const lines = doc.thought.split('\n');
    return 'thought: |\n' + lines.map(l => '  ' + l).join('\n');
  });

  // Replace selfCriticism
  out = out.replace(/^selfCriticism:\s*(["'].*?["']|'.*?'|[^\n]*)/m, () => {
    const lines = doc.selfCriticism.split('\n');
    return 'selfCriticism: |\n' + lines.map(l => '  ' + l).join('\n');
  });

  return out;
}

export function checkAndConvert(input: string): string {
  if (/^thought:\s*\|/m.test(input) && /^selfCriticism:\s*\|/m.test(input)) {
    return input;
  }
  return convertToBlockStyle(input);
}

