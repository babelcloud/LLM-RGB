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

Here's the TypeScript function to convert YAML to block style:

```typescript
import yaml from 'js-yaml';
import { dump } from 'js-yaml';

function convertToBlockStyleYaml(yamlString: string): string {
  try {
    const parsed = yaml.load(yamlString);
    
    if (typeof parsed.thought === 'string') {
      parsed.thought = { [yaml.DEFAULT_SCHEMA.symbols.str.tag]: parsed.thought };
    }
    
    if (typeof parsed.selfCriticism === 'string') {
      parsed.selfCriticism = { [yaml.DEFAULT_SCHEMA.symbols.str.tag]: parsed.selfCriticism };
    }

    return dump(parsed, {
      styles: {
        '!!str': '|'
      },
      noRefs: true,
      lineWidth: -1
    });
  } catch (e) {
    return yamlString;
  }
}
```

