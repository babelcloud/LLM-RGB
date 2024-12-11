import { TestConfig } from './types';

/**
 * Validates a test case configuration against defined rules and constraints
 * @param config The test case configuration to validate
 * @returns Array of validation error messages, empty if validation passes
 */
export function validateTestCase(config: TestConfig): string[] {
    const errors: string[] = [];

    // Validate difficulty ranges
    const difficulties = config.vars.difficulties;

    if (difficulties['context-length'] < 1 || difficulties['context-length'] > 3) {
        errors.push('Context length difficulty must be between 1 and 3');
    }

    if (difficulties['reasoning-depth'] < 1 || difficulties['reasoning-depth'] > 4) {
        errors.push('Reasoning depth difficulty must be between 1 and 4');
    }

    if (difficulties['instruction-compliance'] < 1 || difficulties['instruction-compliance'] > 3) {
        errors.push('Instruction compliance difficulty must be between 1 and 3');
    }

    // Validate required fields
    if (!config.description) {
        errors.push('Test case must have a description');
    }

    if (!config.vars.name) {
        errors.push('Test case must have a name');
    }

    if (!config.vars.prompt) {
        errors.push('Test case must have a prompt');
    }

    // Validate threshold
    if (typeof config.threshold !== 'number' || config.threshold < 0 || config.threshold > 1) {
        errors.push('Threshold must be a number between 0 and 1');
    }

    // Validate assertions
    if (!Array.isArray(config.assert) || config.assert.length === 0) {
        errors.push('Test case must have at least one assertion');
    } else {
        config.assert.forEach((assertion, index) => {
            if (!assertion.type) {
                errors.push(`Assertion ${index + 1} must have a type`);
            }
            if (!assertion.value) {
                errors.push(`Assertion ${index + 1} must have a value`);
            }
            if (typeof assertion.weight !== 'number' || assertion.weight <= 0) {
                errors.push(`Assertion ${index + 1} must have a positive weight`);
            }
        });
    }

    return errors;
}

/**
 * Helper function to validate a test case and throw an error if validation fails
 * @param config The test case configuration to validate
 * @throws Error if validation fails
 */
export function validateTestCaseOrThrow(config: TestConfig): void {
    const errors = validateTestCase(config);
    if (errors.length > 0) {
        throw new Error(`Test case validation failed:\n${errors.join('\n')}`);
    }
}
