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
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const yamlContent = `
thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |-
      import sys
      !{sys.executable} -m pip install langchain openai langchain_community
    requirements: |-
      langchain
      openAI
      langchain_community
`;

const yamlObj = yaml.load(yamlContent) as any;

if (typeof yamlObj !== 'object') {
  console.error('Invalid YAML content');
  process.exit(1);
}

const desiredKeys = ['thought', 'selfCriticism', 'command'];
const content = yamlObj;

for (const key in content) {
  if (!desiredKeys.includes(key)) {
    delete content[key];
  }
}

let newContent = '';
let insideBlock = false;
let currentBlock = '';

const lines = yaml.dump(content).split('\n');

for (const line of lines) {
  const trimmed = line.trim();

  if (trimmed.startsWith('|')) {
    if (insideBlock) {
      newContent += '\n';
    }
    insideBlock = true;
    currentBlock = trimmed;
  } else if (trimmed && insideBlock) {
    currentBlock += ' ' + trimmed;
  } else if (insideBlock) {
    newContent += currentBlock + '\n';
    insideBlock = false;
  } else {
    newContent += line + '\n';
  }
}

fs.writeFileSync('newContent.yaml', newContent);
```

