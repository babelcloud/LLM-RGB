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
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes('\n')) {
          obj[key] = `|\n  ${obj[key].replace(/\n/g, '\n  ')}`;
        }
      }
      return yaml.dump(obj, { quotingType: '"' });
    } else {
      return yamlString;
    }
  } catch (e) {
    const lines = yamlString.split('\n');
    const newLines = lines.map(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        if (value && !value.startsWith(' ') && !value.startsWith('|') && !value.startsWith('>')) {
           if(value.includes('\n')){
               return `${key}: |\n  ${value.trim().replace(/\n/g, '\n  ')}`;
           } else if (lines.slice(lines.indexOf(line) + 1).some(l => l.startsWith(' ') && !l.startsWith('  '))) {
                return `${key}: |\n  ${value.trim()}${lines.slice(lines.indexOf(line) + 1).filter(l => l.startsWith(' ') && !l.startsWith('  ')).map(l => `\n  ${l.trim()}`).join('')}`;
           }
        }
      }
      return line;
    });

    
    try {
       const obj = yaml.load(newLines.join('\n'));
        if (typeof obj === 'object' && obj !== null) {
           for (const key in obj) {
             if (typeof obj[key] === 'string' && obj[key].includes('\n')) {
                obj[key] = `|\n  ${obj[key].replace(/\n/g, '\n  ')}`;
             }
           }
        return yaml.dump(obj, {quotingType: '"'});
       }
    } catch(e) {}

    return newLines.join('\n');
  }
}
```

