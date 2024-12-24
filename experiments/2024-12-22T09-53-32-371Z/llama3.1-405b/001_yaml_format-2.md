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
import * as jsYaml from 'js-yaml';

function convertYamlToBlockStyle(yamlString: string): string {
  try {
    const yamlObject = jsYaml.safeLoad(yamlString);
    if (!yamlObject) return yamlString;

    const convertedYamlObject: any = {};
    for (const key in yamlObject) {
      if (typeof yamlObject[key] === 'string' && yamlObject[key].includes('\n')) {
        convertedYamlObject[key] = `|\n  ${yamlObject[key].replace(/\n/g, '\n  ')}`;
      } else {
        convertedYamlObject[key] = yamlObject[key];
      }
    }

    return jsYaml.safeDump(convertedYamlObject, { noArrayIndent: true });
  } catch (error) {
    // If the input yaml is not valid, try to fix it
    const fixedYamlString = yamlString.replace(/:\s*([^\n]+)/g, ': |-\n  $1');
    return fixedYamlString;
  }
}

// Example usage:
const yamlString = `
thought: I need to resolve the 'ModuleNotFoundError: No module named 'langchain_community'' error by ensuring that all necessary dependencies are correctly installed.
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

const convertedYaml = convertYamlToBlockStyle(yamlString);
console.log(convertedYaml);
```

