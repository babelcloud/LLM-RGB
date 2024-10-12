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

function convertToBlockStyle(inputYaml: string): string {
    try {
        const parsedYaml = yaml.load(inputYaml);
        if (parsedYaml && parsedYaml.thought && parsedYaml.selfCriticism) {
            parsedYaml.thought = parsedYaml.thought.replace(/\n/g, '\n  ');
            parsedYaml.selfCriticism = parsedYaml.selfCriticism.replace(/\n/g, '\n  ');
        }
        return yaml.dump(parsedYaml, { lineWidth: -1 });
    } catch (e) {
        // If the input is not a valid YAML, try to convert it to the desired format
        const lines = inputYaml.split('\n');
        let newYaml = '';
        let inThought = false;
        let inSelfCriticism = false;

        for (const line of lines) {
            if (line.trim().startsWith('thought:')) {
                inThought = true;
                newYaml += 'thought: |\n';
            } else if (line.trim().startsWith('selfCriticism:')) {
                inSelfCriticism = true;
                newYaml += 'selfCriticism: |\n';
            } else if (inThought || inSelfCriticism) {
                newYaml += `  ${line}\n`;
            } else {
                newYaml += `${line}\n`;
            }

            if (inThought && line.trim() === '') {
                inThought = false;
            }
            if (inSelfCriticism && line.trim() === '') {
                inSelfCriticism = false;
            }
        }

        return newYaml;
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

console.log(convertToBlockStyle(inputYaml));
```

