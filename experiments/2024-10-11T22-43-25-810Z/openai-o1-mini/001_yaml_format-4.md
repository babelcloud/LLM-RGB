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

interface CommandArgs {
  code: string;
  requirements: string;
}

interface YamlContent {
  thought?: string;
  selfCriticism?: string;
  command?: {
    name: string;
    args: CommandArgs;
  };
}

function convertToBlockStyle(yamlStr: string): string {
  try {
    const data: YamlContent = yaml.load(yamlStr) as YamlContent;

    const output: any = { ...data };

    if (data.thought && !data.thought.startsWith('|')) {
      output.thought = { '|' : data.thought };
    }

    if (data.selfCriticism && !data.selfCriticism.startsWith('|')) {
      output.selfCriticism = { '|' : data.selfCriticism };
    }

    return yaml.dump(output, { lineWidth: -1 });
  } catch (e) {
    // Fallback: manually replace thought and selfCriticism to block style
    let updated = yamlStr;

    updated = updated.replace(/thought:\s*(?!\|)(.+)/s, 'thought: |\n  $1');
    updated = updated.replace(/selfCriticism:\s*(?!\|)(.+)/s, 'selfCriticism: |\n  $1');

    return updated;
  }
}

const input = fs.readFileSync(0, 'utf-8');
const output = convertToBlockStyle(input);
console.log(output);
```

