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

function convertYaml(inputYaml: string): string {
    let parsedYaml;
    try {
        parsedYaml = yaml.load(inputYaml);
    } catch (e) {
        // If the input is not valid YAML, try to fix it by converting to the desired format
        parsedYaml = {
            thought: inputYaml.match(/thought: (.*)/)?.[1] || '',
            selfCriticism: inputYaml.match(/selfCriticism: (.*)/)?.[1] || '',
            command: {
                name: 'runPython',
                args: {
                    code: inputYaml.match(/code: \|-\n(.*)/)?.[1] || '',
                    requirements: inputYaml.match(/requirements: \|-\n(.*)/)?.[1] || ''
                }
            }
        };
    }

    // Convert to the desired format
    const formattedYaml = {
        thought: parsedYaml.thought.replace(/\n/g, '\n  '),
        selfCriticism: parsedYaml.selfCriticism.replace(/\n/g, '\n  '),
        command: {
            name: parsedYaml.command.name,
            args: {
                code: parsedYaml.command.args.code.replace(/\n/g, '\n      '),
                requirements: parsedYaml.command.args.requirements.replace(/\n/g, '\n      ')
            }
        }
    };

    return yaml.dump(formattedYaml, { lineWidth: -1 });
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

const outputYaml = convertYaml(inputYaml);
console.log(outputYaml);
```

