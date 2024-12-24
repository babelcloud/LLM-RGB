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

function convertYamlToBlockStyle(input: string): string {
  let data: any;
  try {
    data = yaml.load(input);
  } catch (e) {
    // Handle potential parse errors for invalid YAML
    console.error('Error parsing YAML:', e);
    return '';
  }

  const convertToBlockStyle = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.includes('\n') ? obj : obj.replace(/(?<!\n)$/m, '\n');
    } else if (Array.isArray(obj)) {
      return obj.map(convertToBlockStyle);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = convertToBlockStyle(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const convertedData = convertToBlockStyle(data);
  
  try {
    return yaml.dump(convertedData, { lineWidth: -1 });
  } catch (e) {
    console.error('Error dumping YAML:', e);
    return '';
  }
}

// Example usage
const inputYaml = `thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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

console.log(convertYamlToBlockStyle(inputYaml));
```

