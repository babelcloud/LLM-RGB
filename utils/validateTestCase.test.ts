import { describe, it, expect } from 'vitest';
import { validateTestCase, validateTestCaseOrThrow } from './validateTestCase';
import { TestConfig } from './types';

describe('validateTestCase', () => {
  it('should return no errors for a valid test case', () => {
    const validConfig: TestConfig = {
      description: 'A valid test case',
      threshold: 0.5,
      vars: {
        name: 'Test Case 1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 2,
        },
        prompt: 'What is the capital of France?',
      },
      assert: [
        { type: 'equals', value: 'Paris', weight: 1 },
      ],
    };

    const errors = validateTestCase(validConfig);
    expect(errors).toEqual([]);
  });

  it('should return errors for invalid difficulties', () => {
    const invalidConfig: TestConfig = {
      description: 'Invalid difficulties',
      threshold: 0.5,
      vars: {
        name: 'Test Case 2',
        difficulties: {
          'context-length': 0,
          'reasoning-depth': 5,
          'instruction-compliance': 4,
        },
        prompt: 'What is the capital of France?',
      },
      assert: [
        { type: 'equals', value: 'Paris', weight: 1 },
      ],
    };

    const errors = validateTestCase(invalidConfig);
    expect(errors).toContain('Context length difficulty must be between 1 and 3');
    expect(errors).toContain('Reasoning depth difficulty must be between 1 and 4');
    expect(errors).toContain('Instruction compliance difficulty must be between 1 and 3');
  });

  it('should return errors for missing required fields', () => {
    const invalidConfig: TestConfig = {
      description: '',
      threshold: 0.5,
      vars: {
        name: '',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 2,
        },
        prompt: '',
      },
      assert: [
        { type: 'equals', value: 'Paris', weight: 1 },
      ],
    };

    const errors = validateTestCase(invalidConfig);
    expect(errors).toContain('Test case must have a description');
    expect(errors).toContain('Test case must have a name');
    expect(errors).toContain('Test case must have a prompt');
  });

  it('should return errors for invalid threshold', () => {
    const invalidConfig: TestConfig = {
      description: 'Invalid threshold',
      threshold: 1.5,
      vars: {
        name: 'Test Case 4',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 2,
        },
        prompt: 'What is the capital of France?',
      },
      assert: [
        { type: 'equals', value: 'Paris', weight: 1 },
      ],
    };

    const errors = validateTestCase(invalidConfig);
    expect(errors).toContain('Threshold must be a number between 0 and 1');
  });

  it('should return errors for invalid assertions', () => {
    const invalidConfig: TestConfig = {
      description: 'Invalid assertions',
      threshold: 0.5,
      vars: {
        name: 'Test Case 5',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 2,
        },
        prompt: 'What is the capital of France?',
      },
      assert: [
        { type: '', value: '', weight: -1 },
      ],
    };

    const errors = validateTestCase(invalidConfig);
    expect(errors).toContain('Assertion 1 must have a type');
    expect(errors).toContain('Assertion 1 must have a value');
    expect(errors).toContain('Assertion 1 must have a positive weight');
  });
});

describe('validateTestCaseOrThrow', () => {
  it('should not throw an error for a valid test case', () => {
    const validConfig: TestConfig = {
      description: 'A valid test case',
      threshold: 0.5,
      vars: {
        name: 'Test Case 1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 2,
        },
        prompt: 'What is the capital of France?',
      },
      assert: [
        { type: 'equals', value: 'Paris', weight: 1 },
      ],
    };

    expect(() => validateTestCaseOrThrow(validConfig)).not.toThrow();
  });

  it('should throw an error for an invalid test case', () => {
    const invalidConfig: TestConfig = {
      description: '',
      threshold: 1.5,
      vars: {
        name: '',
        difficulties: {
          'context-length': 0,
          'reasoning-depth': 5,
          'instruction-compliance': 4,
        },
        prompt: '',
      },
      assert: [
        { type: '', value: '', weight: -1 },
      ],
    };

    expect(() => validateTestCaseOrThrow(invalidConfig)).toThrowError(/Test case validation failed:/);
  });
});
