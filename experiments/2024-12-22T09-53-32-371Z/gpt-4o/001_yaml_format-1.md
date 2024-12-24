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
import * as fs from 'fs';
import * as yaml from 'js-yaml';

function convertYaml(input: string): string {
  try {
    const data = yaml.load(input);

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid YAML content');
    }

    if (data['thought'] && !data['thought'].includes('\n')) {
      data['thought'] = '|-\n  ' + data['thought'];
    }

    if (data['selfCriticism'] && !data['selfCriticism'].includes('\n')) {
      data['selfCriticism'] = '|-\n  ' + data['selfCriticism'];
    }

    return yaml.dump(data, { lineWidth: -1 });
  } catch (e) {
    throw new Error('Error processing YAML: ' + e.message);
  }
}

const yamlContent = fs.readFileSync('input.yml', 'utf8');
const convertedYaml = convertYaml(yamlContent);
fs.writeFileSync('output.yml', convertedYaml);
```

