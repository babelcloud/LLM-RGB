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
import * as yaml from 'js-yaml';

/**
 * Converts the 'thought' and 'selfCriticism' fields in a YAML string
 * to use the block scalar style ('|').
 * It attempts to parse the YAML and re-dump it, then applies regex
 * to ensure the specific fields use block style.
 * If parsing fails, it returns the original string.
 *
 * @param yamlString The input YAML string.
 * @returns The YAML string with specified fields converted to block style,
 *          or the original string if parsing fails.
 */
export function convertToBlockStyleYaml(yamlString: string): string {
  let doc: any;
  try {
    // Attempt to load the YAML. This handles basic structure, comments, etc.
    // LoadAll can handle multiple documents, but we'll process the first one found or assume single doc.
    const docs = yaml.loadAll(yamlString);
     if (docs.length === 0) {
        // Handle empty input
        return yamlString;
     }
     // We primarily care about the first document for this transformation.
     // If there are multiple documents, this logic only modifies the first.
     doc = docs[0];

     if (typeof doc !== 'object' || doc === null) {
         // If parsing resulted in a non-object (e.g., just a scalar),
         // it's unlikely to have the keys we need. Return original.
         // Or, try the regex approach directly on the string?
         // Let's stick to modifying only if structure is somewhat expected.
         // Fallback: Try regex replacement directly on the original string
         // This might be less safe but fulfills the "try to convert" aspect
          return applyBlockStyleRegex(yamlString);
     }

  } catch (e) {
    // If parsing fails, fall back to direct regex replacement on the original string.
    // This is less robust but attempts to meet the requirement even for invalid input.
    // console.warn("YAML parsing failed, attempting direct regex replacement:", e);
    return applyBlockStyleRegex(yamlString);
  }

  // Ensure the target fields are strings if they exist
  if (doc && typeof doc.thought === 'string') {
    // No actual change needed to the JS value here, dump will handle multiline
  }
  if (doc && typeof doc.selfCriticism === 'string') {
    // No actual change needed to the JS value here, dump will handle multiline
  }

  try {
      // Dump the object back to YAML.
      // js-yaml might automatically use block style for multiline strings.
      // lineWidth: -1 prevents auto-wrapping.
      const dumpedYaml = yaml.dump(doc, { lineWidth: -1, noRefs: true });

      // Post-process the dumped YAML to ensure block style for the target keys,
      // even if the content was single-line.
      return applyBlockStyleRegex(dumpedYaml);

  } catch(dumpError) {
      // If dumping fails for some reason (highly unlikely with valid JS object)
      // fallback to regex on original string
       // console.warn("YAML dumping failed, attempting direct regex replacement:", dumpError);
      return applyBlockStyleRegex(yamlString);
  }
}

/**
 * Applies regex replacements to ensure 'thought' and 'selfCriticism' fields
 * use block scalar style ('|'). This function operates directly on the string.
 *
 * @param text The YAML string (or fragment) to process.
 * @returns The processed string.
 */
function applyBlockStyleRegex(text: string): string {
     // Regex to find 'thought' or 'selfCriticism' keys followed by a plain or quoted scalar value
     // on the same line, ensuring it's not already block or folded style.
     // - ^(\s*): Capture leading indentation (group 1)
     // - (thought|selfCriticism): Capture the key (group 2)
     // - : Space*: Match the colon and optional spaces
     // - (?!\s*[|>]): Negative lookahead: ensure the value doesn't start with | or >
     // - (?: ... ): Non-capturing group for the value part
     // - (['"])(.*?)\3: Match quoted value: quote (group 3), content (group 4), closing quote
     // - |: OR
     // - (.*?): Match unquoted value (non-greedy) (group 5)
     // - \s*$: Match optional trailing whitespace until the end of the line
     // - gm: Global (all matches), Multiline (^/$ match line start/end)
    const regex = /^(\s*)(thought|selfCriticism):(?!\s*[|>])(?:\s*(?:(['"])(.*?)\3|(.*?))\s*)?$/gm;

    return text.replace(regex, (match, indent, key, quote, quotedValue, plainValue) => {
        // Determine the actual value, preferring quoted content if present
        let value = (quotedValue !== undefined ? quotedValue : (plainValue !== undefined ? plainValue : '')).trim();

        // Unescape potentially escaped characters from quoted strings if needed (basic cases)
        if (quote) {
            value = value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        // Construct the block style format
        // Handle empty value case correctly
        if (value === '') {
             return `${indent}${key}: |`; // Empty block scalar
        } else {
             // Indent every line of the value if it happens to be multiline already
             // (e.g. if loaded from a previously block-styled yaml)
             const valueLines = value.split('\n');
             const indentedValue = valueLines.map(line => `${indent}  ${line}`).join('\n');
             return `${indent}${key}: |\n${indentedValue}`;
        }
    });
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
thought: "A simple thought."
selfCriticism: 'Another simple one.'
other: value
`;

const yamlInput4 = `
# Comment line
thought: A thought.
selfCriticism: >
  This criticism
  is folded.
command: test
`;

const yamlInput5 = `
invalid yaml structure
thought: This might not parse correctly.
selfCriticism: Need to handle this.
`;

const yamlInput6 = `
thought:
selfCriticism: ""
command: test
`;


console.log(" Input 1 ---");
console.log(yamlInput1);
console.log("--- Output 1 ---");
console.log(convertToBlockStyleYaml(yamlInput1));

console.log("--- Input 2 (already block) ---");
console.log(yamlInput2);
console.log("--- Output 2 ---");
console.log(convertToBlockStyleYaml(yamlInput2));

console.log("--- Input 3 (quoted) ---");
console.log(yamlInput3);
console.log("--- Output 3 ---");
console.log(convertToBlockStyleYaml(yamlInput3));

console.log("--- Input 4 (mixed) ---");
console.log(yamlInput4);
console.log("--- Output 4 ---");
console.log(convertToBlockStyleYaml(yamlInput4));

console.log("--- Input 5 (invalid) ---");
console.log(yamlInput5);
console.log("--- Output 5 ---");
console.log(convertToBlockStyleYaml(yamlInput5)); // Should likely use regex fallback

console.log("--- Input 6 (empty values) ---");
console.log(yamlInput6);
console.log("--- Output 6 ---");
console.log(convertToBlockStyleYaml(yamlInput6));
*/
```

