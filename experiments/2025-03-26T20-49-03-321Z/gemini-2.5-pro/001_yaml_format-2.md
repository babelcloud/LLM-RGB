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
 * Converts specific keys ('thought', 'selfCriticism') in a YAML string
 * to use the block scalar style ('|').
 * Attempts to parse the input string and returns the modified YAML string.
 * If parsing fails, it returns the original string.
 *
 * @param yamlString The input YAML string (may not be strictly valid).
 * @returns The YAML string with specified keys converted to block style, or the original string on error.
 */
function convertToBlockStyleYaml(yamlString: string): string {
    try {
        // Parse the YAML string into a document object model.
        // The `yaml` library is generally tolerant of minor syntax issues.
        const doc = YAML.parseDocument(yamlString);

        // Check if the document content is a Map (YAML object)
        if (doc.contents instanceof YAML.YAMLMap) {
            const keysToConvert = ['thought', 'selfCriticism'];

            for (const key of keysToConvert) {
                // Check if the key exists in the map
                if (doc.has(key)) {
                    // Get the node associated with the key
                    const node = doc.get(key, true); // `true` returns the Node object

                    // Only modify if the node is a Scalar (string, number, boolean, null)
                    // We specifically want to format string-like content.
                    if (node instanceof YAML.Scalar) {
                         // Ensure we work with the string representation of the value
                         const valueAsString = String(node.value ?? '');

                        // Set the scalar style to literal block style ('|')
                        // Note: This might convert numbers/booleans to block strings as well,
                        // which is consistent with the example showing string conversion.
                        node.type = YAML.Scalar.BLOCK_LITERAL;

                        // Re-assign the string value to ensure correct representation,
                        // especially if the original was null or non-string.
                        // Though often just setting the type is enough if value was already string.
                        // Let's keep the original value but force the type.
                        // If node.value was null, setting type might implicitly make it an empty block.
                         if (node.value === null || node.value === undefined) {
                             node.value = ''; // Ensure null becomes empty block string
                         } else {
                             // Ensure the value is represented as it was, but type forces block
                             node.value = node.value;
                         }

                    } else if (node === null || node === undefined ) {
                        // Handle cases where the key exists but value is explicitly null
                        // or implicitly undefined (e.g., `key:` with nothing after)
                        // Create an empty block scalar node.
                        const newNode = doc.createNode('');
                        newNode.type = YAML.Scalar.BLOCK_LITERAL;
                        doc.set(key, newNode);
                    }
                    // If the node is a Map or Sequence, we don't modify it.
                }
            }
        }
        // Else: If the root is not a map or parsing resulted in non-map content,
        // we don't perform modifications based on keys.

        // Serialize the document back to a YAML string, preserving formatting changes.
        return doc.toString({
            // Options to potentially fine-tune output, defaults are usually good.
             blockQuote: 'literal', // Reinforce literal style preference
             lineWidth: 0 // Avoid automatic line wrapping within blocks
        });

    } catch (e) {
        // If parsing or modification fails, return the original string.
        // This handles the "input may not be a valid yaml" requirement partially.
        // console.error("Failed to parse or convert YAML:", e); // Optional: log error
        return yamlString;
    }
}

// Example Usage (requires 'yaml' package: npm install yaml)

/*
// Example 1: Input matches the first example from the prompt
const inputYaml1 = `
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

const outputYaml1 = convertToBlockStyleYaml(inputYaml1);
console.log(" Output 1 ---");
console.log(outputYaml1);

// Example 2: Input matches the second example (already block style)
const inputYaml2 = `
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

const outputYaml2 = convertToBlockStyleYaml(inputYaml2);
console.log("--- Output 2 ---");
console.log(outputYaml2); // Should ideally be identical or very close to inputYaml2

// Example 3: Input with missing key
const inputYaml3 = `
thought: This is a simple thought.
command:
  name: doSomething
`;
const outputYaml3 = convertToBlockStyleYaml(inputYaml3);
console.log("--- Output 3 ---");
console.log(outputYaml3); // 'thought' should be block, 'selfCriticism' remains absent

// Example 4: Potentially invalid YAML fragment (missing value)
const inputYaml4 = `
thought:
selfCriticism: This needs fixing.
`;
const outputYaml4 = convertToBlockStyleYaml(inputYaml4);
console.log("--- Output 4 ---");
console.log(outputYaml4); // 'thought' might become empty block, 'selfCriticism' becomes block

// Example 5: Slightly broken YAML (indentation maybe) - library might fix or fail
const inputYaml5 = `
 thought:  Bad indent thought.
selfCriticism: Correct line.
`;
const outputYaml5 = convertToBlockStyleYaml(inputYaml5);
console.log("--- Output 5 ---");
console.log(outputYaml5); // Output depends on yaml library's tolerance

*/
```

