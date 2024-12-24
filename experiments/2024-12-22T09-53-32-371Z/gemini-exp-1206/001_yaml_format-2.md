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
  try {
    const obj = yaml.load(yamlString);
    if (typeof obj === 'object' && obj !== null) {
      if (typeof obj.thought === 'string' && !obj.thought.includes('\n')) {
        obj.thought = `|\n  ${obj.thought.replace(/\n/g, '\n  ')}`;
      }
      if (typeof obj.selfCriticism === 'string' && !obj.selfCriticism.includes('\n')) {
        obj.selfCriticism = `|\n  ${obj.selfCriticism.replace(/\n/g, '\n  ')}`;
      }
    }

    return yaml.dump(obj);
  }
  catch (error) {
    const lines = yamlString.split('\n');
    let newYamlString = '';
    let inThought = false;
    let inSelfCriticism = false;
    for (let line of lines) {
      if (line.startsWith('thought:')) {
        inThought = true;
        if (!line.includes('|')) {
          newYamlString += 'thought: |\n';
          newYamlString += `  ${line.substring('thought:'.length).trim()}\n`;
        } else {
          newYamlString += line + '\n';
        }
      } else if (line.startsWith('selfCriticism:')) {
        inSelfCriticism = true;
        if (!line.includes('|')) {
          newYamlString += 'selfCriticism: |\n';
          newYamlString += `  ${line.substring('selfCriticism:'.length).trim()}\n`;
        } else {
          newYamlString += line + '\n';
        }
      } else if (inThought) {
        if (line.trim() === '' || line.startsWith(' ') && !line.startsWith('  ')) {
           newYamlString += `  ${line.trim()}\n`;
        } else {
          inThought = false;
          newYamlString += line + '\n';
        }
      }
      else if (inSelfCriticism) {
        if (line.trim() === '' || line.startsWith(' ') && !line.startsWith('  ')) {
           newYamlString += `  ${line.trim()}\n`;
        } else {
          inSelfCriticism = false;
          newYamlString += line + '\n';
        }
      }
       else {
        newYamlString += line + '\n';
      }
    }
    return newYamlString;
  }
}
```

