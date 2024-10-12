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
import YAML from 'yaml';

function convertYaml(inputYaml: string): string {
    const doc = YAML.parseDocument(inputYaml);

    function setBlockStyle(node: YAML.Node) {
        if (YAML.isMap(node)) {
            for (const [key, value] of node.items) {
                if (YAML.isScalar(key) && (key.value === 'thought' || key.value === 'selfCriticism')) {
                    if (YAML.isScalar(value)) {
                        value.style = '|' // set block scalar style
                    }
                } else {
                    setBlockStyle(value as YAML.Node);
                }
            }
        } else if (YAML.isSeq(node)) {
            for (const item of node.items) {
                setBlockStyle(item as YAML.Node);
            }
        }
    }

    setBlockStyle(doc.contents as YAML.Node);

    const outputYaml = doc.toString();
    return outputYaml;
}
```

