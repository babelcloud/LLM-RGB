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
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('thought:') || trimmedLine.startsWith('selfCriticism:')) {
          if (trimmedLine.endsWith(':')) {
              newYamlString += line + '\n';
          }
          else {
              const value = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
              newYamlString += line.substring(0, line.indexOf(':') + 1) + ' |\n';
              if (value) {
                newYamlString += '  ' + value + '\n';
              }
          }
      } else {
        newYamlString += line + '\n';
      }
    }
    
    try {
        obj = yaml.load(newYamlString);
    }
    catch(e2){
        return yamlString;
    }
    
    
  }

  if (typeof obj === 'object' && obj !== null) {
    if ('thought' in obj && typeof obj.thought === 'string' && !obj.thought.includes('\n')) {
      obj.thought = obj.thought;
    }
    if ('selfCriticism' in obj && typeof obj.selfCriticism === 'string' && !obj.selfCriticism.includes('\n')) {
      obj.selfCriticism = obj.selfCriticism;
    }
  }
    
  const newYamlString = yaml.dump(obj, {
      styles: {
          '!!str': 'folded'
      },
      flowLevel: -1
  });
    
  const lines = newYamlString.split('\n');
  let finalYamlString = '';
  for(const line of lines){
      if (line.trim().startsWith('thought:') || line.trim().startsWith('selfCriticism:')) {
        finalYamlString += line.replace(">", "|") + '\n';
      }
      else{
          finalYamlString += line + '\n';
      }
  }

  return finalYamlString;
}
```

