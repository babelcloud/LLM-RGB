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

function convertYamlToBlockStyle(inputYaml: string): string {
  try {
    const data = yaml.load(inputYaml);
    
    if (typeof data !== 'object' || data === null) {
      throw new Error("Invalid YAML content");
    }
    
    const convertToBlockStyle = (key: string) => {
      if (typeof data[key] === 'string' && !data[key].includes('\n')) {
        data[key] = data[key].replace(/"/g, '\\"'); // Escape double quotes in strings
        return `|\n  ${data[key].split('\n').join('\n  ')}`;
      }
      return data[key];
    };

    data['thought'] = convertToBlockStyle('thought');
    data['selfCriticism'] = convertToBlockStyle('selfCriticism');

    return yaml.dump(data, { lineWidth: -1, noCompatMode: true });
  } catch (e) {
    console.error("Error parsing YAML:", e);
    return inputYaml;
  }
}

const inputYaml = fs.readFileSync('input.yaml', 'utf8');
const blockStyleYaml = convertYamlToBlockStyle(inputYaml);
fs.writeFileSync('output.yaml', blockStyleYaml);
```

