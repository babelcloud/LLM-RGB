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

function convertYaml(input: string): string {
    let data: any = {};
    try {
        data = yaml.load(input) || {};
    } catch (e) {
        // If invalid YAML, try to extract key-value pairs manually
        const lines = input.split('\n');
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                const value = match[2];
                data[key] = value;
            }
        }
    }

    ['thought', 'selfCriticism'].forEach(key => {
        if (data.hasOwnProperty(key) && typeof data[key] === 'string' && !data[key].includes('\n')) {
            data[key] = {
                '!!python/str': data[key]
            };
        }
    });

    const options: yaml.DumpOptions = {
        lineWidth: -1,
        noArrayIndent: true,
        styles: {
            '!!str': 'block'
        }
    };
    return yaml.dump(data, options);
}

// Example usage:
const inputYaml = `
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

const outputYaml = convertYaml(inputYaml);
console.log(outputYaml);
```

