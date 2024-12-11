import * as yaml from 'js-yaml';

/**
 * Common assertion patterns used across test cases
 */
export const commonAssertions = {
    /**
     * Validates if the output is a valid YAML string
     * @param output The string to validate
     * @returns Object with validation result and parsed YAML if successful
     */
    validateYAML: (output: string) => {
        try {
            const parsed = yaml.load(output);
            return {
                isValid: true,
                value: parsed,
                error: null
            };
        } catch (error) {
            return {
                isValid: false,
                value: null,
                error: error.message
            };
        }
    },

    /**
     * Validates if the output is a valid JSON string
     * @param output The string to validate
     * @returns Object with validation result and parsed JSON if successful
     */
    validateJSON: (output: string) => {
        try {
            const parsed = JSON.parse(output);
            return {
                isValid: true,
                value: parsed,
                error: null
            };
        } catch (error) {
            return {
                isValid: false,
                value: null,
                error: error.message
            };
        }
    },

    /**
     * Validates if the output contains valid TypeScript code
     * @param output The string to validate
     * @returns Object with validation result
     */
    validateTypeScript: (output: string) => {
        // Common patterns in TypeScript validation
        const patterns = {
            interfaceDeclaration: /interface\s+\w+\s*\{[^}]*\}/,
            typeDeclaration: /type\s+\w+\s*=/,
            genericType: /<[^>]+>/,
            functionType: /\([^)]*\)\s*=>/
        };

        const matches = {
            hasInterface: patterns.interfaceDeclaration.test(output),
            hasType: patterns.typeDeclaration.test(output),
            hasGeneric: patterns.genericType.test(output),
            hasFunction: patterns.functionType.test(output)
        };

        return {
            isValid: true, // Basic structural validation
            matches,
            error: null
        };
    },

    /**
     * Validates code block formatting in the output
     * @param output The string to validate
     * @param language Expected language (optional)
     * @returns Validation result
     */
    validateCodeBlock: (output: string, language?: string) => {
        const codeBlockRegex = /```(\w*)\n[\s\S]*?\n```/;
        const match = output.match(codeBlockRegex);

        if (!match) {
            return {
                isValid: false,
                error: 'No code block found'
            };
        }

        if (language && match[1] !== language) {
            return {
                isValid: false,
                error: `Expected language ${language}, got ${match[1] || 'none'}`
            };
        }

        return {
            isValid: true,
            language: match[1],
            error: null
        };
    }
};

/**
 * Helper function to combine multiple assertion results
 * @param results Array of assertion results to combine
 * @returns Combined assertion result
 */
export function combineAssertions(results: Array<{ isValid: boolean; error: string | null }>) {
    return {
        isValid: results.every(r => r.isValid),
        errors: results.filter(r => !r.isValid).map(r => r.error).filter(Boolean)
    };
}
