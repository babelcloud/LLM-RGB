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
import * as YAML from 'yaml';

function convertToBlockStyle(yamlString: string): string {
    const doc = YAML.parseDocument(yamlString);

    if (doc.contents && doc.contents.type === 'MAP') {
        const map = doc.contents;
        map.items.forEach(item => {
            if (item.type === 'PAIR' && item.key && item.value) {
                const key = item.key.toJSON();
                if (['thought', 'selfCriticism'].includes(key)) {
                    item.value.type = 'BLOCK_FOLDED';
                }
            }
        });
    }

    return doc.toString();
}

function isInBlockStyle(yamlString: string): boolean {
    const doc = YAML.parseDocument(yamlString);
    if (doc.contents && doc.contents.type === 'MAP') {
        return doc.contents.items.some(item => 
            item.type === 'PAIR' && 
            ['thought', 'selfCriticism'].includes(item.key?.toJSON()) &&
            item.value?.type === 'BLOCK_FOLDED'
        );
    }
    return false;
}

function processYAML(yamlString: string): string {
    return isInBlockStyle(yamlString) ? yamlString : convertToBlockStyle(yamlString);
}

// Example usage:
const yamlInput = `
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
      openai
      langchain_community
`;

console.log(processYAML(yamlInput));
```

