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
import yaml from 'js-yaml';

function convertYamlToBlockStyle(yamlContent: string): string {
  let parsedYaml: any;
  try {
    parsedYaml = yaml.load(yamlContent);
  } catch(e) {
    return 'Invalid YAML input';
  }

  const convertToBlockStyle = (value: any): any => {
    if (typeof value === 'string' && value.includes('\n')) {
      return '|-\n  ' + value.split('\n').map(line => line.trim()).join('\n  ');
    }
    return value;
  };

  const convertObjectToBlockStyle = (obj: any) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        convertObjectToBlockStyle(value);
      } else {
        obj[key] = convertToBlockStyle(value);
      }
    }
  };

  convertObjectToBlockStyle(parsedYaml);

  try {
    return yaml.dump(parsedYaml, { lineWidth: -1 });
  } catch(e) {
    return 'Error converting to YAML format';
  }
}

// Example usage
const yamlInput = `...`; // Insert the first YAML text here
console.log(convertYamlToBlockStyle(yamlInput));
```

