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

function convertToBlockStyle(doc: yaml.YamlMap) {
  for (const key of doc.keys()) {
    const value = doc.get(key);
    if (value instanceof yaml.YamlScalar) {
      doc.set(key, value.value);
    }
  }
}

function convertYamlFormat(inputYaml: string) {
  try {
    const doc = yaml.load(inputYaml);
    if (doc instanceof yaml.YamlMap) {
      convertToBlockStyle(doc);
      return yaml.dump(doc);
    }
    return inputYaml;
  } catch (error) {
    // Attempt to convert to block style to make it valid YAML
    const fixedYaml = inputYaml.replace(/(?<=^[^:]+: ).+/gm, (match) => {
      return `|\n${match.replace(/\n/g, '\n  ')}`;
    });
    try {
      const doc = yaml.load(fixedYaml);
      if (doc instanceof yaml.YamlMap) {
        convertToBlockStyle(doc);
        return yaml.dump(doc);
      }
      return fixedYaml;
    } catch (error) {
      return fixedYaml;
    }
  }
}

const inputYaml = `
thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |-
      import sys
      !\{sys.executable} -m pip install langchain openai langchain_community
    requirements: |-
      langchain
      openai
      langchain_community
`;

const outputYaml = convertYamlFormat(inputYaml);
console.log(outputYaml);
```

