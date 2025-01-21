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

import * as fs from 'fs';
import * as YAML from 'yaml';

function convertYaml(input: string): string {
  try {
    const doc = YAML.parseDocument(input);
    function fixKeyStyle(key: string) {
      const node = doc.get(key, true);
      if (node && typeof node.value === 'string') {
        node.type = YAML.Scalar.BLOCK_LITERAL;
      }
    }
    fixKeyStyle('thought');
    fixKeyStyle('selfCriticism');
    return doc.toString();
  } catch {
    // Fallback for invalid YAML: naive block-style conversion
    let output = input;
    const fixKey = (text: string, key: string) => {
      const lines = text.split('\n');
      const re = new RegExp(`^(\\s*)${key}\\s*:(.*)$`);
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(re);
        if (match) {
          const indent = match[1] || '';
          const rest = match[2].trim();
          if (!/^(\|[\-|>]*|>[\-|>]*)/.test(rest)) {
            lines[i] = `${indent}${key}: |`;
            lines.splice(i + 1, 0, `${indent}  ${rest}`);
          }
        }
      }
      return lines.join('\n');
    };
    output = fixKey(output, 'thought');
    output = fixKey(output, 'selfCriticism');
    return output;
  }
}

const input = fs.readFileSync('/dev/stdin', 'utf8');
process.stdout.write(convertYaml(input));

