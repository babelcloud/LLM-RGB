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

I need a typescript function "function convertToBlockStyleYaml(yamlString: string): string" to convert the yaml to the second style and return the converted yaml string.

Code Only, no explanation.

Hint: The input yaml may not be a valid yaml, but you should convert it to the new format to make it valid.

## Response

```typescript
import yaml from 'js-yaml';

function convertToBlockStyleYaml(yamlString: string): string {
  const parseYamlGlobally = (yamlStr: string) => {
    const yamlLines = yamlStr.split('\n');
    let inBlock = false;
    return yamlLines.map(line => {
      if (!inBlock && line.includes(': |-')) {
        inBlock = true;
        return line;
      } else if (inBlock && !line.startsWith(' ')) {
        inBlock = false;
      }
      return inBlock && !line.startsWith(' ') ? '  ' + line : line;
    }).join('\n');
  };

  let yamlData;
  try {
    yamlData = yaml.load(yamlString);
  } catch (e) {
    yamlString = parseYamlGlobally(yamlString);
    yamlData = yaml.load(yamlString);
  }

  const convertToBlockNode = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('\n')) {
        obj[key] = `|\n  ${obj[key].split('\n').join('\n  ')}`;
      } else if (typeof obj[key] === 'object') {
        convertToBlockNode(obj[key]);
      }
    }
  };

  convertToBlockNode(yamlData);
  return yaml.dump(yamlData);
}
```

