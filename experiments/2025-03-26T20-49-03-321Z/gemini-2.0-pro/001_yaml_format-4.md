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
 * Converts specific keys ('thought', 'selfCriticism') in a YAML string to use the block scalar style ('|').
 * Attempts to parse potentially invalid YAML and format the target keys.
 *
 * @param yamlString The input YAML string.
 * @returns The YAML string with specified keys converted to block style, or the original string if parsing fails severely.
 */
function convertToBlockStyleYaml(yamlString: string): string {
    try {
        // Parse the document. This is more robust for preserving structure and comments
        // and allows modifying node styles directly.
        const doc = YAML.parseDocument(yamlString, {
             // Enable options that might help parse slightly malformed yaml if necessary,
             // although default is usually quite tolerant.
             // schema: 'failsafe' // or 'core' or 'json' or 'yaml-1.1' - default is 'yaml-1.2'
        });

        // Check for major parsing errors, though we attempt to proceed
        if (doc.errors.length > 0) {
            // Log errors but try to continue if doc.contents exists
            // console.warn("YAML parsing encountered errors:", doc.errors);
        }

        // Ensure the root is a Map (object) to access keys
        if (doc.contents && YAML.isMap(doc.contents)) {
            const map = doc.contents;
            const keysToConvert = ['thought', 'selfCriticism'];

            keysToConvert.forEach(key => {
                // Check if the key exists
                if (map.has(key)) {
                    const node = map.get(key, true); // Get the node itself

                    // Check if it's a scalar node (string, number, boolean, null)
                    if (YAML.isScalar(node)) {
                        // Only convert if the value is currently a string
                        if (typeof node.value === 'string') {
                             // Set the node's style to block literal ('|')
                             // This preserves newlines and indentation relative to the block start.
                             node.style = YAML.Scalar.BLOCK_LITERAL;
                        }
                        // If it's a scalar but not a string (e.g., number, boolean, null), leave it alone.
                    } else {
                        // If the value associated with the key exists but isn't a scalar node
                        // (e.g., it's a sequence or map, or perhaps invalid),
                        // we could try to force it if it represents a string somehow,
                        // but it's safer to leave non-scalar structures as they are.
                        // Let's handle the case where it might have been parsed as a plain string
                        // without being explicitly typed as a scalar node in some edge cases.
                        const plainValue = map.get(key);
                        if (typeof plainValue === 'string') {
                             // Create a new scalar node with the desired style and replace the old value/node
                             const newNode = doc.createNode(plainValue);
                             newNode.style = YAML.Scalar.BLOCK_LITERAL;
                             map.set(key, newNode);
                        }
                    }
                }
            });
        }
        // else: Input YAML was not a map/object at the root, do nothing.

        // Stringify the document back to YAML, preserving the style changes.
        return doc.toString({
             // You can add options here if needed, e.g.:
             // indent: 2,
             // blockQuote: 'literal', // Explicitly prefer '|' but setting node.style is better
        });

    } catch (e) {
        // If YAML.parseDocument throws an unrecoverable error, return the original string.
        // This fulfills the requirement to attempt conversion even on potentially invalid input,
        // falling back gracefully if the input is too broken to parse.
        // console.error("Failed to parse or convert YAML:", e);
        return yamlString;
    }
}

// Example Usage (can be removed or commented out)
/*
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
thought: |
  I need to resolve the \`ModuleNotFoundError: No module named 'langchain_community'\` error by ensuring that all necessary dependencies are correctly installed.
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
`;

const yamlInput3 = `
# Another example
thought: Single line thought.
selfCriticism: Another single line.
otherKey: value
nested:
  thought: This should not be converted by current logic.
`;

const yamlInputInvalid = `
thought: Invalid YAML structure maybe
selfCriticism Missing colon
command: { name: test }
`;

console.log(" Input 1 ---");
console.log(yamlInput1);
console.log("--- Output 1 ---");
console.log(convertToBlockStyleYaml(yamlInput1));

console.log("--- Input 2 (Already Block Style) ---");
console.log(yamlInput2);
console.log("--- Output 2 ---");
console.log(convertToBlockStyleYaml(yamlInput2)); // Should remain largely the same

console.log("--- Input 3 (Single Line) ---");
console.log(yamlInput3);
console.log("--- Output 3 ---");
console.log(convertToBlockStyleYaml(yamlInput3)); // Should convert single lines too

console.log("--- Input 4 (Invalid) ---");
console.log(yamlInputInvalid);
console.log("--- Output 4 ---");
console.log(convertToBlockStyleYaml(yamlInputInvalid)); // Should likely return original due to parsing error
*/
```

