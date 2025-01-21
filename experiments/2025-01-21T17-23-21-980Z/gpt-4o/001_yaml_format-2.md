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

function convertYamlToBlockStyle(yamlStr: string): string {
    // Load yaml and parse it
    let data;
    try {
        data = yaml.load(yamlStr);
    } catch (e) {
        console.error('Invalid YAML', e);
        return '';
    }

    // Convert specific keys to block style
    const convertToBlockStyle = (obj: any, keys: string[]) => {
        keys.forEach((key) => {
            if (typeof obj[key] === 'string' && !obj[key].includes('\n')) {
                obj[key] = obj[key].replace(/(.{80})/g, "$1\n");
            }
        });
    };

    // Convert 'thought' and 'selfCriticism' fields
    convertToBlockStyle(data, ['thought', 'selfCriticism']);

    // Dump the yaml with block style
    return yaml.dump(data, {
        lineWidth: -1, // Set to never fold lines to maintain block style
        noCompatMode: true
    });
}

// Example usage:
const yamlStr = `thought: I need to resolve the 'ModuleNotFoundError: No module named 'langchain_community'' error by ensuring that all necessary dependencies are correctly installed.
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
      langchain_community`;

console.log(convertYamlToBlockStyle(yamlStr));
```

