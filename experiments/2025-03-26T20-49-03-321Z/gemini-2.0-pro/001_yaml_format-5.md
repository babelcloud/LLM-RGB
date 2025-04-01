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
import * as yaml from 'js-yaml'; // Import js-yaml, although direct parsing isn't used to handle potentially invalid input

/**
 * Converts specific keys ('thought', 'selfCriticism') in a YAML string
 * to use the block scalar style ('|'), only if they are currently single-line values
 * and not already using block/folded style.
 * Uses regular expressions to find and replace, preserving indentation.
 * This approach is chosen to be resilient to potentially invalid overall YAML structure,
 * focusing only on the target lines.
 *
 * @param yamlString The input YAML string (potentially invalid).
 * @returns The YAML string with specified fields converted to block style where applicable.
 */
function convertToBlockStyleYaml(yamlString: string): string {
    // Regex explanation:
    // ^                  - Start of line
    // ( *)              - Capture group 1: Leading indentation (zero or more spaces)
    // (thought|selfCriticism) - Capture group 2: The specific key name 'thought' or 'selfCriticism'
    // :                  - The literal colon separator
    // (?! \|)(?! >)      - Negative lookaheads: Ensure the character(s) immediately following the colon are NOT ' |' or ' >'.
    //                    - This prevents matching lines that already explicitly start a block ('|') or folded ('>') scalar.
    // [ ]                - A literal space MUST follow the colon (conforming to standard YAML style and the examples).
    // (.*)               - Capture group 3: The rest of the line (the value). Captures everything until the end of the line.
    // $                  - End of line
    // gm flags: g = global (replace all occurrences), m = multiline (^ and $ match line start/end, not just string start/end)
    const regex = /^( *)(thought|selfCriticism):(?! \|)(?! >) (.*)$/gm;

    const result = yamlString.replace(regex, (match, indent, key, value) => {
        // The value captured by (.*) might have trailing whitespace; remove it for clean formatting.
        const trimmedValue = value.trimEnd();

        // If the original value (after potential trimming) was effectively empty,
        // represent it as an empty block scalar (`key: |\n  `).
        if (trimmedValue === '') {
             // Output `key: |` followed by an indented empty line.
             return `${indent}${key}: |\n${indent}  `;
        }

        // Format the original single-line value as a block scalar.
        // - Preserve the original indentation for the key line (`indent`).
        // - Append ': |' to the key.
        // - Start a new line (`\n`).
        // - Add the original indentation plus two spaces (`indent + '  '`) for the value line's indentation.
        // - Add the trimmed original value (`trimmedValue`).
        return `${indent}${key}: |\n${indent}  ${trimmedValue}`;
    });

    return result;
}
```

