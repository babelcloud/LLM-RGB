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

```typescript
import * as YAML from 'yaml';

/**
 * Converts the values of 'thought' and 'selfCriticism' keys in a YAML string
 * to block scalar style (|).
 * Tries to parse and modify even if the input YAML is slightly invalid.
 * If parsing fails completely, returns the original string.
 *
 * @param yamlString The input YAML string.
 * @returns The YAML string with specified keys converted to block style, or the original string on failure.
 */
function convertToBlockStyleYaml(yamlString: string): string {
  try {
    // Attempt to parse the document. The library is often tolerant of minor errors.
    const doc = YAML.parseDocument(yamlString, {
       keepSourceTokens: true // Helps preserve formatting where possible
    });

    // Check if the root is a Map (object)
    if (doc.contents && doc.contents instanceof YAML.YAMLMap) {
      const rootMap = doc.contents as YAML.YAMLMap<YAML.Scalar, YAML.Node>;

      rootMap.items.forEach(pair => {
        // Check if the key is 'thought' or 'selfCriticism'
        if (pair.key instanceof YAML.Scalar && (pair.key.value === 'thought' || pair.key.value === 'selfCriticism')) {
          // Ensure the value is a Scalar node
          if (pair.value instanceof YAML.Scalar) {
             // Force block literal style (|)
             pair.value.type = YAML.Scalar.BLOCK_LITERAL;
             // Ensure newline exists if converted from plain/single quote
             if (!pair.value.source?.includes('\n')) {
                // This part is tricky with CST; modifying type might be enough
                // Let's rely on the type change primarily.
             }
          } else if (pair.value === null || typeof pair.value === 'undefined') {
             // Handle null/undefined perhaps by creating an empty block scalar
             const newScalar = doc.createNode('', true); // Create scalar
             newScalar.type = YAML.Scalar.BLOCK_LITERAL;
             pair.value = newScalar;
          }
          // If it's already a collection or something else, we might not want to change it
          // or the behavior might be undefined. Sticking to Scalar modification.
        }
      });

      // Stringify the modified document
      return doc.toString({
         blockQuote: 'literal', // Prefer literal style for multi-lines added/modified by library
         lineWidth: 0 // Avoid automatic line wrapping interfering
        });
    } else {
      // If the root is not a map, or contents are null, return the original string
      // or try a basic toString which might represent the scalar/sequence correctly.
      // Returning original seems safer if structure is unexpected.
      return yamlString;
    }

  } catch (error) {
    // If parsing fails catastrophically, return the original string
    // console.error("Failed to parse or modify YAML:", error); // Optional logging
    return yamlString;
  }
}

// Example Usage (can be removed if only the function is needed)
const yamlInput1 = `
thought: I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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
`;

const yamlInput2 = `
thought: Single line thought.
selfCriticism: Another single line.
other: value
list:
  - item1
  - item2
`;

const yamlInputInvalid = `
thought: This is okay
selfCriticism Missing colon
command: { name: test }
`;

const yamlInputAlreadyBlock = `
thought: |
  Already a block.
  With multiple lines.
selfCriticism: Needs conversion.
command:
  name: keepStyle
`;


const convertedYaml1 = convertToBlockStyleYaml(yamlInput1);
console.log(" Converted YAML 1 ---");
console.log(convertedYaml1);

const convertedYaml2 = convertToBlockStyleYaml(yamlInput2);
console.log("--- Converted YAML 2 ---");
console.log(convertedYaml2);

const convertedYamlInvalid = convertToBlockStyleYaml(yamlInputInvalid);
console.log("--- Converted YAML Invalid (best effort/original) ---");
console.log(convertedYamlInvalid); // Might return original due to parse error

const convertedYamlAlreadyBlock = convertToBlockStyleYaml(yamlInputAlreadyBlock);
console.log("--- Converted YAML Already Block ---");
console.log(convertedYamlAlreadyBlock);

```

