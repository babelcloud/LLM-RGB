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

function convertYamlToBlockStyle(inputYaml: string): string {
    try {
        const parsedYaml = yaml.load(inputYaml);
        if (parsedYaml && typeof parsedYaml === 'object') {
            if (parsedYaml.thought && typeof parsedYaml.thought === 'string') {
                parsedYaml.thought = parsedYaml.thought.replace(/\n/g, '\n  ');
            }
            if (parsedYaml.selfCriticism && typeof parsedYaml.selfCriticism === 'string') {
                parsedYaml.selfCriticism = parsedYaml.selfCriticism.replace(/\n/g, '\n  ');
            }
        }
        return yaml.dump(parsedYaml, { lineWidth: -1 });
    } catch (e) {
        console.error('Invalid YAML input:', e);
        return inputYaml;
    }
}

// Example usage
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

const convertedYaml = convertYamlToBlockStyle(inputYaml);
console.log(convertedYaml);
```

