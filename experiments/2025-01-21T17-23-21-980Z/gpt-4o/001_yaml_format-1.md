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
import * as fs from "fs";
import * as yaml from "js-yaml";

function convertYamlToBlockStyle(input: string): string {
    const doc = yaml.load(input, { schema: yaml.JSON_SCHEMA }) as any;

    function convert(value: any): any {
        if (typeof value === "object" && value !== null) {
            for (const key in value) {
                if (
                    key === "thought" ||
                    key === "selfCriticism"
                ) {
                    value[key] = convertToBlockStyle(value[key]);
                }
                value[key] = convert(value[key]);
            }
        }
        return value;
    }

    function convertToBlockStyle(text: string): string {
        const lines = text.split('\n');
        if (lines.length > 1 || (lines.length === 1 && lines[0].length > 0)) {
            return `|\n${lines.map(line => `  ${line}`).join('\n')}`;
        }
        return text;
    }
    
    const converted = convert(doc);
    return yaml.dump(converted);
}

const inputYaml = fs.readFileSync("input.yaml", "utf8");
const convertedYaml = convertYamlToBlockStyle(inputYaml);
fs.writeFileSync("output.yaml", convertedYaml);
```

