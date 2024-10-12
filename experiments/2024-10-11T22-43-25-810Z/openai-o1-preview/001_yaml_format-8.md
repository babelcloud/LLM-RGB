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

// Read input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { input += chunk; });
process.stdin.on('end', function() {
    try {
        const doc = yaml.parseDocument(input);

        ['thought', 'selfCriticism'].forEach(key => {
            const node = doc.get(key, true);
            if (node && yaml.isScalar(node)) {
                node.type = yaml.Scalar.BLOCK_LITERAL;
            }
        });

        const output = yaml.stringify(doc);
        console.log(output);
    } catch (e) {
        // If parsing fails, attempt to fix the input by converting the fields manually
        const fixedInput = input.replace(/^(thought|selfCriticism):\s*(.*)/gm, (_, key, value) => {
            return `${key}: |\n  ${value}`;
        });
        console.log(fixedInput);
    }
});
```

