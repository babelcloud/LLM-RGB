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
    const doc = yaml.load(inputYaml);
    if (typeof doc === 'object' && doc !== null) {
      if (doc.hasOwnProperty('thought') && typeof doc.thought === 'string' && !doc.thought.includes('\n')) {
        doc.thought = `|\n  ${doc.thought.replace(/\n/g, '\n  ')}`;
      }
      if (doc.hasOwnProperty('selfCriticism') && typeof doc.selfCriticism === 'string' && !doc.selfCriticism.includes('\n')) {
        doc.selfCriticism = `|\n  ${doc.selfCriticism.replace(/\n/g, '\n  ')}`;
      }
    }
    return yaml.dump(doc, { styles: { '!!str': 'block' } });
  } catch (error) {
    const lines = inputYaml.split('\n');
    const newLines = lines.map(line => {
      if (line.startsWith('thought:')) {
        const value = line.substring('thought:'.length).trim();
        if (!value.startsWith('|')) {
          return `thought: |\n  ${value.replace(/\n/g, '\n  ')}`;
        }
      } else if (line.startsWith('selfCriticism:')) {
        const value = line.substring('selfCriticism:'.length).trim();
        if (!value.startsWith('|'))
          return `selfCriticism: |\n  ${value.replace(/\n/g, '\n  ')}`;
      }
      return line;

    });

    return newLines.join('\n');
  }
}
```

