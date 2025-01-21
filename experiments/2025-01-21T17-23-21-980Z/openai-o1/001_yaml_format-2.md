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

import * as YAML from 'yaml';

function convertToBlock(value: any) {
  if (value == null) return '';
  const str = String(value).trimEnd();
  return str.includes('\n') ? `|\n  ${str.replace(/\n/g, '\n  ')}` : `|\n  ${str}`;
}

export function ensureBlockStyle(input: string): string {
  let doc: YAML.Document.Parsed;
  try {
    doc = YAML.parseDocument(input);
  } catch {
    const lines = input.split('\n');
    const fixed = lines.map(line => {
      if (/^thought:\s*(.*)/.test(line)) {
        const match = line.match(/^thought:\s*(.*)/);
        return match ? `thought: |\n  ${match[1]}` : line;
      }
      if (/^selfCriticism:\s*(.*)/.test(line)) {
        const match = line.match(/^selfCriticism:\s*(.*)/);
        return match ? `selfCriticism: |\n  ${match[1]}` : line;
      }
      return line;
    }).join('\n');
    return fixed;
  }
  const obj = doc.toJS();

  ['thought','selfCriticism'].forEach(k => {
    if (typeof obj?.[k] === 'string') {
      doc.set(k, convertToBlock(obj[k]));
    }
  });

  return doc.toString();
}

// Example usage:
// const inputYaml = "thought: I need to do something\nselfCriticism: I should have checked\ncommand:\n  name: runPython\n  args:\n    code: |-\n      print('Hello')";
// console.log(ensureBlockStyle(inputYaml));

