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

function convertToBlockStyle(yamlString: string): string {
  let obj;
  try {
    obj = yaml.load(yamlString);
  } catch (e) {
    const lines = yamlString.split('\n');
    let newYamlString = '';
    for (const line of lines) {
      const match = line.match(/^(thought|selfCriticism):\s?(.*)/);
      if (match) {
        const key = match[1];
        const value = match[2] ? match[2].trim() : "";

        if (value && !value.startsWith('|')) {
            if (value.includes('\n')) {
                newYamlString += `${key}: |\n`;
                value.split('\n').forEach(v => {
                  newYamlString += `  ${v}\n`
                })

            } else {
              newYamlString += `${key}: |\n  ${value}\n`;
            }
        } else {
            newYamlString += `${line}\n`;
        }
      } else {
        newYamlString += `${line}\n`;
      }
    }
    
    try {
      obj = yaml.load(newYamlString)
    } catch(err) {
      return yamlString
    }
  }

  if (typeof obj === 'object') {
    if (obj.thought && typeof obj.thought === 'string' && !obj.thought.startsWith('|')) {
      obj.thought = `|\n  ${obj.thought.replace(/\n/g, '\n  ')}`;
    }
    if (obj.selfCriticism && typeof obj.selfCriticism === 'string' && !obj.selfCriticism.startsWith('|')) {
      obj.selfCriticism = `|\n  ${obj.selfCriticism.replace(/\n/g, '\n  ')}`;
    }
  }

  return yaml.dump(obj, {
    styles: {
      '!!null': 'empty',
    },
    lineWidth: -1
  });
}
```

